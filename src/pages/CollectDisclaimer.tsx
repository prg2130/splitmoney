import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";

const CollectDisclaimer = () => {
  return (
    <>
      <Helmet>
        <title>Payment Collection Disclaimer | PayUrShare</title>
        <meta
          name="description"
          content="PayUrShare is not a payment processor. We only generate links to Venmo and other third-party apps; you are responsible for the transactions."
        />
        <link rel="canonical" href="https://www.payurshare.com/collect-disclaimer" />
        <meta property="og:title" content="Payment Collection Disclaimer | PayUrShare" />
        <meta
          property="og:description"
          content="PayUrShare does not process payments. We only generate links to Venmo and other third-party apps."
        />
        <meta property="og:url" content="https://www.payurshare.com/collect-disclaimer" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Payment Collection Disclaimer",
            description:
              "PayUrShare is not a payment processor and does not guarantee transactions handled by Venmo or other third-party apps.",
            url: "https://www.payurshare.com/collect-disclaimer",
          })}
        </script>
      </Helmet>

      <div className="relative min-h-screen overflow-hidden bg-background">
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
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-sm text-muted-foreground">
              <li>
                <Link to="/" className="hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden>&rsaquo;</li>
              <li className="text-foreground">Payments</li>
            </ol>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight gradient-text">
              Payment Collection Disclaimer
            </h1>
            <p className="mt-3 text-lg text-muted-foreground max-w-xl">
              Important information about the “Collect from group” feature.
            </p>
          </motion.div>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-5 sm:p-6 space-y-6"
          >
            <section>
              <h2 className="text-lg font-bold text-foreground">We Do Not Process Payments</h2>
              <p className="text-sm text-muted-foreground mt-1.5">
                PayUrShare is not a bank, money transmitter, payment processor, or escrow
                service. We do not touch, hold, or move any money. The “Collect from group”
                feature only creates links that point to third-party payment apps such as
                Venmo.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground">Transactions Happen Between You and Your Friends</h2>
              <p className="text-sm text-muted-foreground mt-1.5">
                When someone taps a link, they leave PayUrShare and complete the payment on the
                third-party app. Any agreement, dispute, or problem related to the payment is
                between you and the sender.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground">For Personal Use Only</h2>
              <p className="text-sm text-muted-foreground mt-1.5">
                Payment links are intended for personal, peer-to-peer reimbursements—like
                paying back a friend for dinner. They must not be used for business,
                commercial, or illegal transactions.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground">Check the Details Before Sending</h2>
              <p className="text-sm text-muted-foreground mt-1.5">
                You are responsible for making sure the Venmo username, amount, and note are
                correct before sharing a link. PayUrShare cannot reverse or recover a payment
                sent to the wrong person or for the wrong amount.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground">Third-Party Terms Apply</h2>
              <p className="text-sm text-muted-foreground mt-1.5">
                Use of Venmo or any other payment service is governed by that service&apos;s own
                terms, fees, and privacy policy. Venmo is a trademark of PayPal, Inc. and is
                not affiliated with PayUrShare.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground">No Guarantees</h2>
              <p className="text-sm text-muted-foreground mt-1.5">
                We do not guarantee that a link will open the correct app, that a payment will
                go through, or that funds will be received. Payment success depends on the
                third-party app and the devices being used.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground">Read Our Full Terms</h2>
              <p className="text-sm text-muted-foreground mt-1.5">
                This disclaimer is part of, and supplemented by, our{" "}
                <Link to="/terms" className="underline hover:text-foreground transition-colors">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="underline hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
                .
              </p>
            </section>
          </motion.section>

          <Footer />
        </div>
      </div>
    </>
  );
};

export default CollectDisclaimer;
