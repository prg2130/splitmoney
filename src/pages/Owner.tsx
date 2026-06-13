import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Lock, TrendingUp, Receipt } from "lucide-react";

type Row = {
  currency: string;
  total_value: number;
  total_value_7d: number;
  total_value_30d: number;
  scan_count: number;
  scan_count_7d: number;
  scan_count_30d: number;
};

const fmt = (n: number) =>
  Number(n).toLocaleString(undefined, { maximumFractionDigits: 2 });

const Owner = () => {
  const [passcode, setPasscode] = useState("");
  const [rows, setRows] = useState<Row[] | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("owner-analytics", {
        body: { passcode },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setRows(data.totals as Row[]);
    } catch (e: any) {
      toast({
        title: "Access denied",
        description: e.message || "Wrong passcode.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-bold mb-2">Owner Analytics</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Total value of bills scanned and split through the app.
        </p>

        {!rows && (
          <Card className="p-5 space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Lock className="h-4 w-4" /> Enter owner passcode
            </div>
            <Input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && load()}
              placeholder="Passcode"
              aria-label="Owner passcode"
            />
            <Button onClick={load} disabled={loading || !passcode} className="w-full">
              {loading ? "Loading…" : "Unlock"}
            </Button>
          </Card>
        )}

        {rows && (
          <div className="space-y-4">
            {rows.length === 0 && (
              <Card className="p-5 text-sm text-muted-foreground">
                No scans with totals yet. Totals will start appearing as new bills are
                scanned.
              </Card>
            )}
            {rows.map((r) => (
              <Card key={r.currency} className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-lg font-semibold">{r.currency}</div>
                  <div className="text-xs text-muted-foreground">
                    {r.scan_count} scans total
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <Stat label="All time" value={`${r.currency}${fmt(r.total_value)}`} count={r.scan_count} />
                  <Stat label="Last 30d" value={`${r.currency}${fmt(r.total_value_30d)}`} count={r.scan_count_30d} />
                  <Stat label="Last 7d" value={`${r.currency}${fmt(r.total_value_7d)}`} count={r.scan_count_7d} />
                </div>
              </Card>
            ))}
            <Button variant="outline" onClick={load} disabled={loading} className="w-full">
              <TrendingUp className="h-4 w-4 mr-2" />
              {loading ? "Refreshing…" : "Refresh"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

const Stat = ({ label, value, count }: { label: string; value: string; count: number }) => (
  <div className="rounded-lg border p-3">
    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
    <div className="text-base font-bold mt-1 tabular-nums">{value}</div>
    <div className="text-[11px] text-muted-foreground mt-0.5 flex items-center justify-center gap-1">
      <Receipt className="h-3 w-3" /> {count}
    </div>
  </div>
);

export default Owner;