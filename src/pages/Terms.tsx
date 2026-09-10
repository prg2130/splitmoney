import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service | PayUrShare</title>
        <meta
          name="description"
          content="PayUrShare terms of service. Payment links are for personal use; PayUrShare is not responsible for payments sent or received through third-party apps."
        />
        <link rel="canonical" href="https://www.payurshare.com/terms" />
        <meta property="og:title" content="Terms of Service | PayUrShare" />
        <meta
          property="og:description"
          content="Payment links are for personal use. PayUrShare is not responsible for transactions handled by Venmo or other third-party apps."
        />
        <meta property="og:url" content="https://www.payurshare.com/terms" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Terms of Service",
            description:
              "PayUrShare terms of service. Payment links are for personal use and PayUrShare is not responsible for third-party payment transactions.",
            url: "https://www.payurshare.com/terms",
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
              <li className="text-foreground">Terms</li>
            </ol>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight gradient-text">
              Terms of Service
            </h1>
            <p className="mt-3 text-lg text-muted-foreground max-w-xl">
              Please read these terms carefully before using PayUrShare.
            </p>
          </motion.div>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-5 sm:p-6 space-y-6"
          >
            <section>
              <h2 className="text-lg font-bold text-foreground">1. Acceptance of Terms</h2>
              <p className="text-sm text-muted-foreground mt-1.5">
                By accessing or using PayUrShare, you agree to be bound by these Terms of
                Service. If you do not agree, please do not use the app.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground">2. What PayUrShare Does</h2>
              <p className="text-sm text-muted-foreground mt-1.5">
                PayUrShare helps you split restaurant bills by scanning receipts and
                assigning items to people. It can also generate shareable links to third-party
                payment services such as Venmo so friends can pay you back.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground">3. Venmo and Payment Links Are for Personal Use Only</h2>
              <p className="text-sm text-muted-foreground mt-1.5">
                The Venmo links and payment links created by PayUrShare are intended solely for
                personal, peer-to-peer use—such as reimbursing a friend for a share of dinner.
                They may not be used for commercial sales, fundraising, business transactions, or
                any other non-personal purpose.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground">4. We Do Not Process, Guarantee, or Refund Payments</h2>
              <p className="text-sm text-muted-foreground mt-1.5">
                PayUrShare does not process, transmit, hold, guarantee, or refund any payments.
                All money movement happens directly between you and the recipient through the
                third-party payment app you choose (such as Venmo). PayUrShare cannot guarantee
                that a payment will be sent, received, or returned, and we are not responsible if
                a payment fails, is sent to the wrong person, is disputed, or is never received.
                We cannot reverse or refund transactions that are completed through Venmo or any
                other payment service.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground">5. Third-Party Services</h2>
              <p className="text-sm text-muted-foreground mt-1.5">
                Venmo is a trademark of PayPal, Inc. and is not affiliated with PayUrShare. Use
                of Venmo or any other payment service is subject to that service&apos;s own terms,
                fees, privacy practices, and conditions. We do not control these services and we
                are not liable for their availability, security, or actions.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground">6. Accuracy</h2>
              <p className="text-sm text-muted-foreground mt-1.5">
                You are responsible for confirming that receipt scan results, item assignments,
                and payment amounts are correct before sharing them with others.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground">7. Disclaimer of Warranties</h2>
              <p className="text-sm text-muted-foreground mt-1.5">
                PayUrShare is provided “as is” without warranties of any kind. We do not
                guarantee that the app will always be available, error-free, or secure.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground">8. Limitation of Liability</h2>
              <p className="text-sm text-muted-foreground mt-1.5">
                To the fullest extent permitted by law, PayUrShare and its operators will not
                be liable for any damages arising from your use of the app, including but not
                limited to payment disputes, data loss, or service interruptions.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground">9. Changes to These Terms</h2>
              <p className="text-sm text-muted-foreground mt-1.5">
                We may update these Terms from time to time. Continued use of the app after
                changes means you accept the updated Terms.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground">10. Contact</h2>
              <p className="text-sm text-muted-foreground mt-1.5">
                For questions about these Terms, please reach out through the app or email the
                operator directly.
              </p>
            </section>
          </motion.section>

          <Footer />
        </div>
      </div>
    </>
  );
};

export default Terms;
