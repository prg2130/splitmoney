import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border bg-background py-8">
    <div className="mx-auto max-w-3xl px-4 text-center">
      <nav
        aria-label="Legal and navigation links"
        className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground"
      >
        <Link to="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <Link to="/compare/splitwise" className="hover:text-foreground transition-colors">
          Compare
        </Link>
        <Link to="/terms" className="hover:text-foreground transition-colors">
          Terms
        </Link>
        <Link to="/privacy" className="hover:text-foreground transition-colors">
          Privacy
        </Link>
        <Link to="/collect-disclaimer" className="hover:text-foreground transition-colors">
          Payments
        </Link>
      </nav>
      <p className="mt-4 text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} PayUrShare. All rights reserved.
      </p>
    </div>
  </footer>
);

export default Footer;
