import { useState } from "react";
import { motion } from "framer-motion";
import { Receipt } from "lucide-react";
import { BillItem, Person, calculateSplit } from "@/lib/splitbill";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import BillUpload from "@/components/BillUpload";
import AddPeople from "@/components/AddPeople";
import AssignItems from "@/components/AssignItems";
import ResultsView from "@/components/ResultsView";

type Step = "upload" | "people" | "assign" | "results";

const Index = () => {
  const [step, setStep] = useState<Step>("upload");
  const [isScanning, setIsScanning] = useState(false);
  const [items, setItems] = useState<BillItem[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [currency, setCurrency] = useState("₹");
  const [billTotal, setBillTotal] = useState<number | null>(null);
  const { toast } = useToast();

  const handleImageCaptured = async (base64: string) => {
    setIsScanning(true);
    try {
      const { data, error } = await supabase.functions.invoke("scan-bill", {
        body: { imageBase64: base64 },
      });

      if (error) throw error;

      if (data?.error) {
        throw new Error(data.error);
      }

      const billItems: BillItem[] = (data.items || []).map((item: any) => ({
        id: crypto.randomUUID(),
        name: item.name,
        price: item.price,
        quantity: item.quantity || 1,
        isExtra: item.isExtra || false,
        assignedTo: [],
      }));

      setItems(billItems);
      setCurrency(data.currency || "₹");
      setBillTotal(data.billTotal || null);
      setStep("people");

      toast({
        title: "Bill scanned!",
        description: `Found ${billItems.filter((i) => !i.isExtra).length} items`,
      });
    } catch (err: any) {
      console.error("Scan error:", err);
      toast({
        title: "Scan failed",
        description: err.message || "Could not read the bill. Try a clearer photo.",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handleReset = () => {
    setStep("upload");
    setItems([]);
    setPeople([]);
  };

  const results = step === "results" ? calculateSplit(items, people) : [];

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-lg px-4 py-8 sm:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary">
            <Receipt className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">SplitBill</h1>
          <p className="mt-1 text-sm text-muted-foreground">Scan · Assign · Split</p>
        </motion.div>

        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {(["upload", "people", "assign", "results"] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`h-2.5 w-2.5 rounded-full transition-colors ${
                  s === step
                    ? "bg-primary scale-125"
                    : (["upload", "people", "assign", "results"].indexOf(step) > i)
                    ? "bg-success"
                    : "bg-muted-foreground/30"
                }`}
              />
              {i < 3 && <div className="w-8 h-px bg-border" />}
            </div>
          ))}
        </div>

        {/* Step content */}
        {step === "upload" && (
          <BillUpload onImageCaptured={handleImageCaptured} isScanning={isScanning} />
        )}

        {step === "people" && (
          <AddPeople
            people={people}
            onPeopleChange={setPeople}
            onContinue={() => setStep("assign")}
          />
        )}

        {step === "assign" && (
          <AssignItems
            items={items}
            people={people}
            onItemsChange={setItems}
            onContinue={() => setStep("results")}
            onBack={() => setStep("people")}
            currency={currency}
          />
        )}

        {step === "results" && (
          <ResultsView results={results} currency={currency} billTotal={billTotal} onReset={handleReset} />
        )}

        {/* Scanned items preview (during people step) */}
        {step === "people" && items.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 rounded-xl border bg-card p-4"
          >
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Scanned Items
            </h3>
            <div className="space-y-1.5">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className={item.isExtra ? "italic text-muted-foreground" : "text-foreground"}>
                    {item.name}
                    {item.quantity > 1 && ` ×${item.quantity}`}
                  </span>
                  <span className="font-medium">
                    {currency}{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="border-t pt-2 mt-2 flex justify-between font-bold text-sm">
                <span>Total</span>
                <span>
                  {currency}
                  {items.reduce((s, i) => s + i.price * i.quantity, 0).toFixed(2)}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Index;
