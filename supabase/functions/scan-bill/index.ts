import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Require a valid Supabase user JWT
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData?.user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = userData.user.id;

    // Rate limit: max 10 scans per hour per user
    const RATE_LIMIT = 10;
    const WINDOW_MS = 60 * 60 * 1000;
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const sinceIso = new Date(Date.now() - WINDOW_MS).toISOString();
    const { count: recentCount, error: countError } = await adminClient
      .from("scan_logs")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("created_at", sinceIso);

    if (countError) {
      console.error("Rate limit count error:", countError);
    } else if ((recentCount ?? 0) >= RATE_LIMIT) {
      return new Response(
        JSON.stringify({
          error: `Rate limit exceeded: max ${RATE_LIMIT} scans per hour. Please try again later.`,
        }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      return new Response(
        JSON.stringify({ error: "No image provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate MIME type (only allow jpeg, png, webp)
    const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];
    let mimeType: string | null = null;
    let base64Payload = imageBase64;

    if (typeof imageBase64 !== "string") {
      return new Response(
        JSON.stringify({ error: "Invalid image payload" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (imageBase64.startsWith("data:")) {
      const match = imageBase64.match(/^data:([^;]+);base64,(.+)$/);
      if (!match) {
        return new Response(
          JSON.stringify({ error: "Invalid data URL format" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      mimeType = match[1].toLowerCase();
      base64Payload = match[2];
    } else {
      // Raw base64 — assume jpeg (matches downstream default)
      mimeType = "image/jpeg";
    }

    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      return new Response(
        JSON.stringify({ error: `Unsupported media type: ${mimeType}. Allowed: ${ALLOWED_MIME_TYPES.join(", ")}` }),
        { status: 415, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate file size (max 5MB decoded)
    const MAX_SIZE_BYTES = 5 * 1024 * 1024;
    // base64 length * 3/4 ≈ decoded byte size (minus padding)
    const padding = (base64Payload.match(/=+$/) || [""])[0].length;
    const decodedSize = Math.floor((base64Payload.length * 3) / 4) - padding;

    if (decodedSize > MAX_SIZE_BYTES) {
      return new Response(
        JSON.stringify({ error: `File too large: ${(decodedSize / 1024 / 1024).toFixed(2)}MB. Maximum: 5MB` }),
        { status: 413, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are a restaurant bill parser. Extract all line items from the bill image.
For each item, extract the name and total price (per unit, NOT multiplied by quantity).
Also extract any tax, service charge, or tip if present as separate items marked as isExtra.
Extract the grand/payment total exactly as printed on the bill.
Output raw numbers without thousands separators. Use the tool provided.`,
          },
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: {
                  url: imageBase64.startsWith("data:")
                    ? imageBase64
                    : `data:image/jpeg;base64,${imageBase64}`,
                },
              },
              {
                type: "text",
                text: "Extract all items and prices from this restaurant bill. Include tax/service charges as separate items.",
              },
            ],
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "extract_bill_items",
              description: "Extract structured bill items from a restaurant bill image",
              parameters: {
                type: "object",
                properties: {
                  items: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string", description: "Item name" },
                        price: { type: "number", description: "Item price" },
                        quantity: { type: "number", description: "Quantity ordered, default 1" },
                        isExtra: {
                          type: "boolean",
                          description: "True if this is tax, tip, service charge, or other fee (not a food/drink item)",
                        },
                      },
                      required: ["name", "price"],
                    },
                  },
                  currency: { type: "string", description: "Currency symbol used in the bill" },
                  billTotal: { type: "number", description: "The grand total / payment total as printed on the bill" },
                  restaurantName: { type: "string", description: "Restaurant name if visible" },
                },
                required: ["items"],
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "extract_bill_items" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limited. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();

    // Check for truncated response
    const finishReason = data.choices?.[0]?.finish_reason;
    if (finishReason === "length" || finishReason === "max_tokens") {
      throw new Error("AI response was truncated. Please try with a clearer photo.");
    }

    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall) {
      throw new Error("No structured data returned from AI");
    }

    // Sanitize locale-specific number formatting and parse
    const rawArgs = toolCall.function.arguments
      .replace(/(\d)\s(\d)/g, "$1$2"); // remove space-separated thousands
    const parsed = JSON.parse(rawArgs);

    // Ensure all items have valid numeric prices and quantities
    if (parsed.items) {
      parsed.items = parsed.items
        .filter((item: any) => item.name && typeof item.price === "number" && item.price > 0)
        .map((item: any) => ({
          ...item,
          price: Math.round(item.price * 100) / 100,
          quantity: Math.max(1, Math.round(item.quantity || 1)),
        }));
    }


    // Log successful scan for rate limiting
    await adminClient.from("scan_logs").insert({ user_id: userId });

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("scan-bill unhandled error:", e);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
