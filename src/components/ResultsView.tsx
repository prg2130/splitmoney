import { useEffect, useRef, useState } from "react";
import { PersonTotal, ExtraSplitMethod, BillItem, Person } from "@/lib/splitbill";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RotateCcw, Share2, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ResultsViewProps {
  results: PersonTotal[];
  items: BillItem[];
  people: Person[];
  currency: string;
  billTotal: number | null;
  extraSplitMethod: ExtraSplitMethod;
  onReset: () => void;
}

const ResultsView = ({ results, items, people, currency, billTotal, extraSplitMethod, onReset }: ResultsViewProps) => {
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const sessionIdRef = useRef<string | null>(null);
  const splitTotal = results.reduce((s, r) => s + r.total, 0);

  const grandTotal = billTotal ?? splitTotal;
  // Scale each person's total so splits add up to the actual bill total
  const scaleFactor = splitTotal > 0 ? grandTotal / splitTotal : 1;
  const adjustedResults = results.map((r) => ({
    ...r,
    total: Math.round(r.total * scaleFactor * 100) / 100,
  }));

  // Log the full split session once when results are shown (fire-and-forget)
  const loggedRef = useRef(false);
  useEffect(() => {
    if (loggedRef.current) return;
    loggedRef.current = true;

    const idToName = new Map(people.map((p) => [p.id, p.name]));
    const foodItems = items.filter((it) => !it.isExtra);
    const extras = items.filter((it) => it.isExtra);
    const subtotal = foodItems.reduce((s, it) => s + it.price * it.quantity, 0);
    const sumExtras = (re: RegExp) =>
      extras
        .filter((it) => re.test(it.name))
        .reduce((s, it) => s + it.price * it.quantity, 0);
    const tax_total = sumExtras(/tax|vat|gst/i);
    const tip_total = sumExtras(/tip|gratuity/i);
    const service_total = sumExtras(/service/i);

    (async () => {
      try {
        const { data: session, error } = await supabase
          .from("split_sessions")
          .insert({
            bill_total: grandTotal,
            currency,
            subtotal,
            tax_total: tax_total || null,
            tip_total: tip_total || null,
            service_total: service_total || null,
            people_count: people.length,
            items_count: foodItems.length,
            split_mode: extraSplitMethod,
          })
          .select("id")
          .single();
        if (error || !session) return;
        sessionIdRef.current = session.id;

        void supabase.from("split_participants").insert(
          adjustedResults.map((r) => ({
            session_id: session.id,
            name: r.person.name,
            amount_owed: r.total,
            items_assigned_count: r.items.length,
          }))
        );
        void supabase.from("split_items").insert(
          items.map((it) => ({
            session_id: session.id,
            name: it.name,
            price: it.price,
            quantity: it.quantity,
            assigned_to: it.assignedTo.map((id) => idToName.get(id) ?? id),
            assignee_count: it.assignedTo.length,
          }))
        );
      } catch (e) {
        console.warn("split logging failed", e);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleShare = () => {
    const text = adjustedResults
      .map((r) => `${r.person.name}: ${currency}${r.total.toFixed(2)}`)
      .join("\n");
    const full = `🧾 Bill Split\n\n${text}\n\nTotal: ${currency}${grandTotal.toFixed(2)}`;

    if (navigator.share) {
      navigator.share({ text: full });
    } else {
      navigator.clipboard.writeText(full);
      toast({ title: "Copied to clipboard!", description: "Share it with your friends" });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold text-foreground">Each Person Owes</h2>
        <p className="text-sm text-muted-foreground">
          Tax & charges split {extraSplitMethod === "equal" ? "equally" : "by order cost"}
        </p>
      </div>

      <div className="space-y-3">
        {adjustedResults.map((r, i) => (
          <motion.div
            key={r.person.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-2xl border border-border/60 bg-card/80 backdrop-blur overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <span
                  className="h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold text-primary-foreground shadow-md"
                  style={{ backgroundColor: r.person.color }}
                >
                  {r.person.name.charAt(0)}
                </span>
                <span className="font-semibold text-foreground">{r.person.name}</span>
              </div>
              <span className="text-xl font-extrabold gradient-text tabular">
                {currency}{r.total.toFixed(2)}
              </span>
            </div>

            {/* Breakdown */}
            <div className="px-4 pb-3 space-y-1">
              {r.items.map((item, j) => (
                <div key={j} className="flex justify-between text-xs text-muted-foreground tabular">
                  <span>{item.name}</span>
                  <span>{currency}{item.share.toFixed(2)}</span>
                </div>
              ))}
              {r.extrasShare > 0 && (
                <div className="flex justify-between text-xs text-muted-foreground italic border-t border-border pt-1 mt-1 tabular">
                  <span>Tax & charges</span>
                  <span>{currency}{r.extrasShare.toFixed(2)}</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Grand total */}
      <div className="relative overflow-hidden rounded-2xl gradient-primary px-5 py-5 text-primary-foreground text-center shadow-glow">
        <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <p className="relative text-xs uppercase tracking-[0.2em] opacity-80">Grand Total</p>
        <p className="relative text-4xl font-extrabold tabular mt-1">{currency}{grandTotal.toFixed(2)}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" onClick={onReset} className="gap-2">
          <RotateCcw className="h-4 w-4" />
          New Bill
        </Button>
        <Button variant="gradient" onClick={handleShare} className="gap-2">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </div>

      {/* Star Rating Survey */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-xl border bg-card p-4 text-center space-y-3"
      >
        {ratingSubmitted ? (
          <p className="text-sm text-muted-foreground">Thanks for your feedback! ⭐</p>
        ) : (
          <>
            <p className="text-sm font-medium text-foreground">How was your experience?</p>
            <div className="flex justify-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  aria-label={`Rate ${star} stars`}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  onClick={() => {
                    setRating(star);
                    setRatingSubmitted(true);
                    toast({ title: "Thank you!", description: `You rated us ${star}/5 stars` });
                    void supabase.from("feedback").insert({
                      rating: star,
                      bill_total: billTotal,
                      currency,
                      people_count: results.length,
                      session_id: sessionIdRef.current,
                    });
                  }}
                  className="p-1 transition-transform hover:scale-110"
                  disabled={ratingSubmitted}
                >
                  <Star
                    className={`h-7 w-7 transition-colors ${
                      star <= (hoveredStar || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground/40"
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">Tap a star to rate</p>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ResultsView;
