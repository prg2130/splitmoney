import { useState, useRef } from "react";
import { Camera, Upload, Sparkles, ScanLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface BillUploadProps {
  onImageCaptured: (base64: string) => void;
  isScanning: boolean;
}

const BillUpload = ({ onImageCaptured, isScanning }: BillUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    let processed: Blob = file;
    const isHeic =
      /\.(heic|heif)$/i.test(file.name) ||
      file.type === "image/heic" ||
      file.type === "image/heif";

    if (isHeic) {
      try {
        const heic2any = (await import("heic2any")).default;
        const result = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.9 });
        processed = Array.isArray(result) ? result[0] : result;
      } catch (err) {
        console.error("HEIC conversion failed:", err);
      }
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setPreview(base64);
      onImageCaptured(base64);
    };
    reader.readAsDataURL(processed);
  };

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
          <img src={preview} alt="Bill preview" className="w-full max-h-80 object-contain bg-muted/30" />
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
