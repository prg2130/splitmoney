import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";

const Privacy = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | PayUrShare</title>
        <meta
          name="description"
          content="PayUrShare privacy policy. We only store receipt images temporarily and keep payment handles on your device."
        />
        <link rel="canonical" href="https://www.payurshare.com/privacy" />
        <meta property="og:title" content="Privacy Policy | PayUrShare" />
        <meta
          property="og:description"
          content="Learn what data PayUrShare collects, how it is used, and how payment handles stay on your device."
        />
        <meta property="og:url" content="https://www.payurshare.com/privacy" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Privacy Policy",
            description:
              "PayUrShare privacy policy. Receipt images are stored temporarily and payment handles remain on the user's device.",
            url: "https://www.payurshare.com/privacy",
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
              <li className="text-foreground">Privacy</li>
            </ol>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight gradient-text">
              Privacy Policy
            </h1>
            <p className="mt-3 text-lg text-muted-foreground max-w-xl">
              We collect as little data as possible and never sell it.
            </p>
          </motion.div>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-5 sm:p-6 space-y-6"
          >
            <section>
              <h2 className="text-lg font-bold text-foreground">1. Information We Collect</h2>
              <p className="text-sm text-muted-foreground mt-1.5">
                When you scan a receipt, the image is sent to our backend for OCR processing
                and is not stored permanently. We also store anonymous session statistics
                such as the number of items, people, and bill total so we can improve the app.
                Optional star ratings you submit are stored anonymously.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground">2. Payment Handles Stay on Your Device</h2>
              <p className="text-sm text-muted-foreground mt-1.5">
                Your Venmo username and any other payment details you enter for the “Collect
                from group” feature are saved only in your browser or device. They are never
                sent to or stored on our servers.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground">3. Venmo Payments and Refunds Are Not Handled by PayUrShare</h2>
              <p className="text-sm text-muted-foreground mt-1.5">
                PayUrShare does not process, hold, guarantee, or refund any payments. When you
                or a friend use a Venmo link, the transaction takes place directly between you
                and the other person on Venmo. PayUrShare cannot see, guarantee, reverse, or
                refund any Venmo payment. Any dispute, failed payment, or refund request must be
                handled through Venmo or the relevant payment service.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground">4. How We Use Information</h2>
              <p className="text-sm text-muted-foreground mt-1.5">
                We use collected data solely to operate and improve PayUrShare, including
                improving receipt scanning accuracy and understanding usage patterns.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground">5. Cookies and Local Storage</h2>
              <p className="text-sm text-muted-foreground mt-1.5">
                The app uses browser local storage to remember your payment handles between
                visits. We do not use tracking cookies or third-party advertising trackers.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground">6. Data Sharing</h2>
              <p className="text-sm text-muted-foreground mt-1.5">
                We do not sell, rent, or share personal information with third parties, except
                as required to provide the service (for example, sending receipt images to our
                OCR provider) or as required by law.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground">7. Security</h2>
              <p className="text-sm text-muted-foreground mt-1.5">
                We use reasonable safeguards to protect data in transit and at rest. However,
                no internet service is completely secure, and you use the app at your own
                risk.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground">8. Your Rights</h2>
              <p className="text-sm text-muted-foreground mt-1.5">
                You can clear your browser storage at any time to remove locally saved payment
                handles. Because most data is anonymous, we may not be able to identify or
                delete specific sessions on request.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground">9. Changes to This Policy</h2>
              <p className="text-sm text-muted-foreground mt-1.5">
                We may update this Privacy Policy occasionally. The updated version will be
                posted on this page with a revised effective date.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground">10. Contact</h2>
              <p className="text-sm text-muted-foreground mt-1.5">
                If you have questions about this Privacy Policy or how your data is handled,
                please contact the app operator.
              </p>
            </section>
          </motion.section>

          <Footer />
        </div>
      </div>
    </>
  );
};

export default Privacy;
