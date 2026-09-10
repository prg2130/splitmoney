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
                Service. If you do not agree, please do not use the app. These Terms apply to all
                visitors and users, including anyone you share a payment link with.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground">2. What PayUrShare Does</h2>
              <p className="text-sm text-muted-foreground mt-1.5">
                PayUrShare helps you split restaurant bills by scanning receipts and
                assigning items to people. It can also generate shareable links to third-party
                payment services such as Venmo so friends can pay you back. We are a convenience
                tool only; we are not a party to any payment or agreement between you and your
                friends.
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
                Receipt scanning and split calculations are generated automatically and may
                contain errors. You are responsible for confirming that receipt scan results,
                item assignments, tax/tip amounts, and payment amounts are correct before
                sharing them with others or sending money.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground">7. Assumption of Risk</h2>
              <p className="text-sm text-muted-foreground mt-1.5">
                You use PayUrShare at your own risk. You are solely responsible for verifying
                the recipient, amount, and note on every payment link before sharing it. You
                assume full responsibility for any loss, dispute, overpayment, underpayment, or
                failed payment that results from using the app or any link it generates.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground">8. Disclaimer of Warranties</h2>
              <p className="text-sm text-muted-foreground mt-1.5">
                PayUrShare is provided on an “as is” and “as available” basis without warranties
                of any kind, whether express, implied, or statutory. We do not warrant that the
                app will be accurate, reliable, error-free, secure, uninterrupted, or free of
                harmful components. Your use of receipt scans, splits, and payment links is at
                your sole risk.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground">9. Limitation of Liability</h2>
              <p className="text-sm text-muted-foreground mt-1.5">
                To the fullest extent permitted by applicable law, PayUrShare and its operators,
                affiliates, officers, employees, and agents will not be liable for any indirect,
                incidental, special, consequential, or punitive damages, including lost profits,
                data loss, or reputational harm, arising out of or related to your use of the app,
                payment links, or third-party payment services. Our total liability for any claim
                will not exceed the greater of (a) the amount you paid to use PayUrShare in the
                twelve (12) months preceding the claim, or (b) zero dollars ($0). Some
                jurisdictions do not allow certain limitations, so these limits may not apply to
                you.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground">10. Indemnification</h2>
              <p className="text-sm text-muted-foreground mt-1.5">
                You agree to defend, indemnify, and hold harmless PayUrShare and its operators
                from any claim, liability, damage, or expense (including reasonable legal fees)
                arising out of your misuse of the app, your violation of these Terms, inaccurate
                information you share through a payment link, or a dispute between you and
                another user.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground">11. Governing Law and International Use</h2>
              <p className="text-sm text-muted-foreground mt-1.5">
                These Terms are governed by the laws of the jurisdiction where the operator of
                PayUrShare is established, without regard to conflict-of-law principles. If you
                access PayUrShare from outside the United States, you do so at your own risk and
                are responsible for complying with the laws of your country. Nothing in these
                Terms limits any mandatory consumer protection rights you may have under the law
                of your jurisdiction.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground">12. Changes to These Terms</h2>
              <p className="text-sm text-muted-foreground mt-1.5">
                We may update these Terms from time to time. Continued use of the app after
                changes means you accept the updated Terms. Material changes will be reflected
                with a revised effective date on this page.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground">13. Contact</h2>
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
