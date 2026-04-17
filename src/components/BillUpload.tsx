import { useState, useRef } from "react";
import { Camera, Upload, Loader2 } from "lucide-react";
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
        <div className="relative rounded-xl overflow-hidden border-2 border-primary/20">
          <img src={preview} alt="Bill preview" className="w-full max-h-80 object-contain bg-muted/30" />
          {isScanning && (
            <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center">
              <div className="flex flex-col items-center gap-2 text-primary-foreground">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="text-sm font-medium">Scanning bill...</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-border rounded-xl p-12 text-center cursor-pointer hover:border-primary/40 hover:bg-accent/30 transition-colors"
        >
          <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground">Tap to upload or take a photo</p>
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
