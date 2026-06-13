import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Camera,
  Users,
  Receipt,
  Zap,
  ArrowRight,
  Check,
  X,
  Split,
  Sparkles,
} from "lucide-react";

const FEATURES = [
  {
    label: "Receipt OCR scanning",
    splitbill: true,
    splitwise: false,
    highlight: true,
    description: "Snap a photo and items appear automatically — no typing.",
  },
  {
    label: "Item-by-item splitting",
    splitbill: true,
    splitwise: false,
    highlight: false,
    description: "Each person pays only for what they ate.",
  },
  {
    label: "Tax & tip auto-split",
    splitbill: true,
    splitwise: false,
    highlight: false,
    description: "Proportional or equal — you choose.",
  },
  {
    label: "No signup required",
    splitbill: true,
    splitwise: false,
    highlight: false,
    description: "Open the app, scan, and split in seconds.",
  },
  {
    label: "Works offline",
    splitbill: true,
    splitwise: false,
    highlight: false,
    description: "Scan now, settle up later.",
  },
  {
    label: "Track ongoing group expenses",
    splitbill: false,
    splitwise: true,
    highlight: false,
    description: "Splitwise excels at month-to-month IOUs.",
  },
  {
    label: "Multi-currency support",
    splitbill: true,
    splitwise: true,
    highlight: false,
    description: "Both apps handle international dinners.",
  },
  {
    label: "Share via link / text",
    splitbill: true,
    splitwise: true,
    highlight: false,
    description: "Easy one-tap sharing for everyone.",
  },
];

const SCENARIOS = [
  {
    icon: Camera,
    title: "One-off restaurant dinners",
    body: "SplitBill wins — scan the receipt, assign dishes, and everyone sees their share in under a minute.",
  },
  {
    icon: Users,
    title: "Roommate expense tracking",
    body: "Splitwise wins — ongoing rent, utilities, and groceries need a ledger, not a scanner.",
  },
  {
    icon: Receipt,
    title: "Group trips with mixed bills",
    body: "Both work, but SplitBill's OCR removes the headache of typing 30 line items after a big dinner.",
  },
];

const CompareSplitwise = () => {
  return (
    <>
      <Helmet>
        <title>SplitBill vs Splitwise — Best Splitwise Alternative for Restaurant Bills</title>
        <meta
          name="description"
          content="SplitBill is the fastest Splitwise alternative for restaurant bills. Snap a receipt photo, auto-detect items, and split by dish in seconds — no manual entry needed."
        />
        <link rel="canonical" href="https://www.payurshare.com/compare/splitwise" />
        <meta property="og:title" content="SplitBill vs Splitwise — Best Splitwise Alternative for Restaurant Bills" />
        <meta property="og:description" content="Snap a receipt photo, auto-detect items, and split by dish in seconds. No manual entry." />
        <meta property="og:url" content="https://www.payurshare.com/compare/splitwise" />
        <meta property="og:type" content="article" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "SplitBill vs Splitwise — Best Splitwise Alternative for Restaurant Bills",
            description: "Compare SplitBill and Splitwise for restaurant bill splitting. SplitBill uses OCR to scan receipts automatically, making it the fastest choice for group dinners.",
            author: { "@type": "Organization", name: "PayUrShare" },
            publisher: { "@type": "Organization", name: "PayUrShare", url: "https://www.payurshare.com" },
            mainEntityOfPage: { "@type": "WebPage", "@id": "https://www.payurshare.com/compare/splitwise" },
          })}
        </script>
      </Helmet>

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

        <div className="relative mx-auto max-w-3xl px-4 py-8 sm:py-12">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-sm text-muted-foreground">
              <li>
                <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
              </li>
              <li aria-hidden>&rsaquo;</li>
              <li className="text-foreground">Compare</li>
            </ol>
          </nav>

          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 text-center"
          >
            <div className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/60 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground backdrop-blur mb-4">
              Splitwise Alternative
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight gradient-text">
              SplitBill vs Splitwise
            </h1>
            <p className="mt-3 text-lg text-muted-foreground max-w-xl mx-auto">
              The best way to split restaurant bills with friends. No signup, no manual entry — just snap a receipt and split by dish.
            </p>
          </motion.div>

          {/* Quick CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex justify-center mb-12"
          >
            <Button asChild variant="gradient" size="lg" className="gap-2 shadow-glow">
              <Link to="/">
                <Zap className="h-4 w-4" />
                Try SplitBill Free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

          {/* Feature comparison table */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-5 sm:p-6 mb-10"
          >
            <h2 className="text-xl font-bold text-foreground mb-1">Feature Comparison</h2>
            <p className="text-sm text-muted-foreground mb-5">
              See how SplitBill and Splitwise stack up for restaurant bill splitting.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 pr-4 font-semibold text-foreground">Feature</th>
                    <th className="text-center py-3 px-3 font-semibold text-foreground w-24">SplitBill</th>
                    <th className="text-center py-3 pl-3 font-semibold text-foreground w-24">Splitwise</th>
                  </tr>
                </thead>
                <tbody>
                  {FEATURES.map((f, i) => (
                    <tr
                      key={i}
                      className={`border-b border-border/60 ${f.highlight ? "bg-accent/30" : ""}`}
                    >
                      <td className="py-3 pr-4">
                        <span className="font-medium text-foreground">{f.label}</span>
                        <p className="text-xs text-muted-foreground mt-0.5">{f.description}</p>
                      </td>
                      <td className="text-center py-3 px-3">
                        {f.splitbill ? (
                          <Check className="h-5 w-5 text-success mx-auto" aria-label="Yes" />
                        ) : (
                          <X className="h-5 w-5 text-muted-foreground/40 mx-auto" aria-label="No" />
                        )}
                      </td>
                      <td className="text-center py-3 pl-3">
                        {f.splitwise ? (
                          <Check className="h-5 w-5 text-success mx-auto" aria-label="Yes" />
                        ) : (
                          <X className="h-5 w-5 text-muted-foreground/40 mx-auto" aria-label="No" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.section>

          {/* Why SplitBill section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-5 sm:p-6 mb-10"
          >
            <h2 className="text-xl font-bold text-foreground mb-4">
              Why SplitBill is the Best Splitwise Alternative for Restaurants
            </h2>
            <div className="space-y-5">
              <div className="flex gap-3">
                <div className="mt-0.5 shrink-0 flex h-8 w-8 items-center justify-center rounded-lg gradient-primary shadow-glow">
                  <Camera className="h-4 w-4 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">OCR Receipt Scanning</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Point your camera at any restaurant receipt and SplitBill instantly reads every item, price, and tax line. No typing, no typos, no tedious manual entry. Splitwise forces you to enter each item by hand — a chore with large group orders.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="mt-0.5 shrink-0 flex h-8 w-8 items-center justify-center rounded-lg gradient-primary shadow-glow">
                  <Split className="h-4 w-4 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Split by Dish, Not Just Total</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Alice had the salad, Bob had the steak. SplitBill lets you assign each item to the person who ate it, then splits taxes and tips proportionally or equally. Splitwise only splits the final total — fine for simple bills, unfair for mixed orders.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="mt-0.5 shrink-0 flex h-8 w-8 items-center justify-center rounded-lg gradient-primary shadow-glow">
                  <Sparkles className="h-4 w-4 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Zero Friction</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    No accounts, no email verification, no friend requests. Open the link, scan, assign, and share the results. Perfect for one-off dinners where you just want to settle up and move on.
                  </p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Scenario cards */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-10"
          >
            <h2 className="text-xl font-bold text-foreground mb-4 text-center">
              When to Use Which
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {SCENARIOS.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.08 }}
                  className="glass-card p-4 text-center"
                >
                  <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-glow">
                    <s.icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{s.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{s.body}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* FAQ for SEO */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card p-5 sm:p-6 mb-10"
          >
            <h2 className="text-xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <details className="group">
                <summary className="flex cursor-pointer items-center justify-between font-medium text-foreground list-none">
                  Is SplitBill a free Splitwise alternative?
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-90" />
                </summary>
                <p className="mt-2 text-sm text-muted-foreground">
                  Yes — SplitBill is completely free to use for scanning and splitting restaurant bills. There are no subscriptions, ads, or hidden fees.
                </p>
              </details>
              <div className="border-t border-border/60" />
              <details className="group">
                <summary className="flex cursor-pointer items-center justify-between font-medium text-foreground list-none">
                  Can I use SplitBill instead of Splitwise for everything?
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-90" />
                </summary>
                <p className="mt-2 text-sm text-muted-foreground">
                  SplitBill is optimized for one-time restaurant bill splitting. For ongoing expense tracking like rent, utilities, or group trip ledgers, Splitwise remains the better choice. Use the right tool for the job.
                </p>
              </details>
              <div className="border-t border-border/60" />
              <details className="group">
                <summary className="flex cursor-pointer items-center justify-between font-medium text-foreground list-none">
                  Does SplitBill work with any receipt?
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-90" />
                </summary>
                <p className="mt-2 text-sm text-muted-foreground">
                  SplitBill's OCR works with most printed restaurant receipts worldwide. Handwritten bills and some non-Latin scripts may be less accurate. If scanning fails, you can always enter items manually.
                </p>
              </details>
            </div>
          </motion.section>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="relative overflow-hidden rounded-2xl gradient-primary px-6 py-8 text-primary-foreground text-center shadow-glow"
          >
            <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
            <h2 className="relative text-2xl font-extrabold mb-2">Ready to ditch manual entry?</h2>
            <p className="relative text-sm opacity-90 mb-5 max-w-md mx-auto">
              Join thousands who use SplitBill to scan, assign, and split restaurant bills in seconds.
            </p>
            <Button asChild variant="secondary" size="lg" className="relative gap-2">
              <Link to="/">
                <Camera className="h-4 w-4" />
                Scan Your First Receipt
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

          {/* Footer link */}
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors underline underline-offset-2">
              Back to SplitBill
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default CompareSplitwise;
