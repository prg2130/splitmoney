import { useState, useRef } from "react";
import { Camera, Upload, Sparkles, ScanLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface BillUploadProps {
  onImageCaptured: (base64: string) => void;
  isScanning: boolean;
}

const BillUpload = ({ onImageCaptured, isScanning }: BillUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    const isHeic =
      /\.(heic|heif)$/i.test(file.name) ||
      file.type === "image/heic" ||
      file.type === "image/heif";

    const MAX_BYTES = 5 * 1024 * 1024;
    let processed: Blob | null = null;
    let rawHeicFallback = false;

    // 1) Try native browser decode (Safari handles HEIC natively).
    //    This also downscales large photos so we stay under the edge function payload cap.
    try {
      processed = await downscaleToJpeg(file, 1600, 0.85);
    } catch (err) {
      // 2) For HEIC, fall back to WASM conversion (works on Chrome/Firefox).
      if (isHeic) {
        try {
          const heic2any = (await import("heic2any")).default;
          const converted = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.9 });
          const jpegBlob = (Array.isArray(converted) ? converted[0] : converted) as Blob;
          processed = await downscaleToJpeg(jpegBlob, 1600, 0.85);
        } catch (heicErr) {
          console.error("HEIC conversion failed, falling back to server-side decode:", heicErr);
          // 3) Last resort: send the raw HEIC to the AI (it decodes HEIC natively),
          //    as long as it fits under the upload cap.
          if (file.size <= MAX_BYTES) {
            processed = file;
            rawHeicFallback = true;
          } else {
            toast({
              title: "HEIC photo too large",
              description: `This photo is ${(file.size / 1024 / 1024).toFixed(1)} MB and the browser can't compress it. Tip: on iPhone, Settings → Camera → Formats → 'Most Compatible', or re-save it as JPG.`,
              variant: "destructive",
            });
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
          }
        }
      } else {
        console.error("Image decode failed:", err);
        toast({
          title: "Couldn't read this image",
          description: "Please try a different photo (JPG or PNG).",
          variant: "destructive",
        });
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
    }

    if (!processed) return;

    // Safety cap (downscale should keep us well under this).
    if (processed.size > MAX_BYTES) {
      toast({
        title: "Image too large",
        description: `This image is ${(processed.size / 1024 / 1024).toFixed(1)} MB after processing. Please use a smaller photo.`,
        variant: "destructive",
      });
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      let base64 = e.target?.result as string;
      if (rawHeicFallback) {
        // Force the correct mime type (browsers often report octet-stream for HEIC)
        base64 = base64.replace(/^data:[^;]*;base64,/, "data:image/heic;base64,");
        // Browser can't render HEIC — show a neutral placeholder instead of a broken image
        setPreview("heic");
      } else {
        setPreview(base64);
      }
      onImageCaptured(base64);

      // Persist the image to storage (fire-and-forget; does not block scan).
      const ext = rawHeicFallback ? "heic" : "jpg";
      const contentType = rawHeicFallback ? "image/heic" : "image/jpeg";
      const path = `${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${ext}`;
      supabase.storage
        .from("bill-uploads")
        .upload(path, processed!, { contentType, upsert: false })
        .then(({ error }) => {
          if (error) console.warn("Bill image upload failed:", error.message);
        });
    };
    reader.readAsDataURL(processed);
  };

  /** Decode an image via the browser and re-encode as a downscaled JPEG. */
  const downscaleToJpeg = (blob: Blob, maxDim: number, quality: number): Promise<Blob> =>
    new Promise((resolve, reject) => {
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        try {
          const { width, height } = img;
          const scale = Math.min(1, maxDim / Math.max(width, height));
          const w = Math.max(1, Math.round(width * scale));
          const h = Math.max(1, Math.round(height * scale));
          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            URL.revokeObjectURL(url);
            reject(new Error("Canvas 2D context unavailable"));
            return;
          }
          ctx.drawImage(img, 0, 0, w, h);
          canvas.toBlob(
            (out) => {
              URL.revokeObjectURL(url);
              if (!out) {
                reject(new Error("Canvas encoding failed"));
                return;
              }
              resolve(out);
            },
            "image/jpeg",
            quality
          );
        } catch (e) {
          URL.revokeObjectURL(url);
          reject(e as Error);
        }
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Image decode failed"));
      };
      img.src = url;
    });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold text-foreground">Scan Your Bill</h2>
        <p className="text-sm text-muted-foreground">
          Take a photo or upload an image of your restaurant bill
        </p>
      </div>

      {preview ? (
        <div className="relative rounded-2xl overflow-hidden border-2 border-primary/20 shadow-lg">
          {preview === "heic" ? (
            <div className="flex h-48 w-full flex-col items-center justify-center gap-2 bg-muted/30">
              <Camera className="h-8 w-8 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">HEIC photo ready (preview not supported)</p>
            </div>
          ) : (
            <img src={preview} alt="Bill preview" className="w-full max-h-80 object-contain bg-muted/30" />
          )}
          {isScanning && (
            <>
              <div className="absolute inset-0 bg-foreground/30 backdrop-blur-[2px]" />
              {/* Scan line */}
              <div className="absolute inset-x-0 top-0 h-full pointer-events-none overflow-hidden">
                <div className="absolute inset-x-0 h-12 animate-scan-line bg-gradient-to-b from-transparent via-primary/70 to-transparent shadow-[0_0_20px_hsl(var(--primary)/0.8)]" />
              </div>
              <div className="absolute inset-0 flex items-end justify-center p-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-card/90 px-4 py-2 text-xs font-medium text-foreground shadow-glow backdrop-blur">
                  <ScanLine className="h-4 w-4 text-primary animate-pulse" />
                  Reading your bill…
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="group relative overflow-hidden rounded-2xl border-2 border-dashed border-border bg-card/40 p-12 text-center cursor-pointer hover:border-primary/50 hover:bg-accent/40 transition-all"
        >
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary shadow-glow animate-float">
            <Sparkles className="h-6 w-6 text-primary-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground">Tap to upload or take a photo</p>
          <p className="mt-1 text-xs text-muted-foreground">JPG, PNG, HEIC · We'll detect items automatically</p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleInputChange}
        className="hidden"
      />

      {!preview && (
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => {
              if (fileInputRef.current) {
                fileInputRef.current.removeAttribute("capture");
                fileInputRef.current.click();
              }
            }}
          >
            <Upload className="h-4 w-4" />
            Upload
          </Button>
          <Button
            variant="gradient"
            className="gap-2"
            onClick={() => {
              if (fileInputRef.current) {
                fileInputRef.current.setAttribute("capture", "environment");
                fileInputRef.current.click();
              }
            }}
          >
            <Camera className="h-4 w-4" />
            Camera
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export default BillUpload;
