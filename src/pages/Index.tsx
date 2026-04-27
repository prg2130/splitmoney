import { useState } from "react";
import { motion } from "framer-motion";
import { Receipt } from "lucide-react";
import { BillItem, Person, ExtraSplitMethod, calculateSplit } from "@/lib/splitbill";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import BillUpload from "@/components/BillUpload";
import AddPeople from "@/components/AddPeople";
import AssignItems from "@/components/AssignItems";
import ResultsView from "@/components/ResultsView";
import StepProgress from "@/components/StepProgress";

type Step = "upload" | "people" | "assign" | "results";

const Index = () => {
  const [step, setStep] = useState<Step>("upload");
  const [isScanning, setIsScanning] = useState(false);
  const [items, setItems] = useState<BillItem[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [currency, setCurrency] = useState("₹");
  const [billTotal, setBillTotal] = useState<number | null>(null);
  const [extraSplitMethod, setExtraSplitMethod] = useState<ExtraSplitMethod>("proportional");
  const { toast } = useToast();

  const handleImageCaptured = async (base64: string) => {
    setIsScanning(true);
    try {
      // Ensure we have a session (anonymous is fine) so the edge function accepts the call
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        const { error: anonError } = await supabase.auth.signInAnonymously();
        if (anonError) throw anonError;
      }

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

  const results = step === "results" ? calculateSplit(items, people, extraSplitMethod) : [];

  const stepOrder: Step[] = ["upload", "people", "assign", "results"];
  const currentIndex = stepOrder.indexOf(step);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Ambient blurred blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -left-24 h-80 w-80 rounded-full bg-primary/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-40 -right-24 h-96 w-96 rounded-full bg-success/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-accent/40 blur-3xl"
      />

      <div className="relative mx-auto max-w-lg px-4 py-8 sm:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <motion.div
            whileHover={{ rotate: -6, scale: 1.05 }}
            className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow"
          >
            <Receipt className="h-8 w-8 text-primary-foreground" />
          </motion.div>
          <h1 className="text-3xl font-extrabold tracking-tight gradient-text">SplitBill</h1>
          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/60 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground backdrop-blur">
            Scan · Assign · Split
          </div>
        </motion.div>

        {/* Steps indicator */}
        <div className="mb-8">
          <StepProgress
            steps={[
              { key: "upload", label: "Scan" },
              { key: "people", label: "People" },
              { key: "assign", label: "Assign" },
              { key: "results", label: "Split" },
            ]}
            currentIndex={currentIndex}
          />
        </div>

        <div className="glass-card p-5 sm:p-6">

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
            extraSplitMethod={extraSplitMethod}
            onExtraSplitMethodChange={setExtraSplitMethod}
          />
        )}

        {step === "results" && (
          <ResultsView results={results} currency={currency} billTotal={billTotal} extraSplitMethod={extraSplitMethod} onReset={handleReset} />
        )}
        </div>

        {/* Scanned items preview (during people step) */}
        {step === "people" && items.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 glass-card p-4"
          >
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Scanned Items
            </h3>
            <div className="space-y-1.5">
              {items.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex justify-between text-sm"
                >
                  <span className={item.isExtra ? "italic text-muted-foreground" : "text-foreground"}>
                    {item.name}
                    {item.quantity > 1 && ` ×${item.quantity}`}
                  </span>
                  <span className="font-medium tabular">
                    {currency}{(item.price * item.quantity).toFixed(2)}
                  </span>
                </motion.div>
              ))}
              <div className="border-t pt-2 mt-2 flex justify-between font-bold text-sm tabular">
                <span>Total</span>
                <span>
                  {currency}
                  {billTotal
                    ? billTotal.toFixed(2)
                    : items.reduce((s, i) => s + i.price * i.quantity, 0).toFixed(2)}
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
