import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <>
    <Helmet>
      <title>Page not found | PayUrShare</title>
      <meta name="description" content="This PayUrShare page doesn't exist. Head back home to scan a receipt and split a bill." />
      <meta name="robots" content="noindex, follow" />
      <meta property="og:title" content="Page not found | PayUrShare" />
      <meta property="og:description" content="This PayUrShare page doesn't exist." />
    </Helmet>
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
        <a href="/" className="text-primary underline hover:text-primary/90">
          Return to Home
        </a>
      </div>
    </div>
    </>
  );
};

export default NotFound;
