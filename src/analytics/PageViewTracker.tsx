import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "./index";

export default function PageViewTracker() {
  const location = useLocation();

  useEffect(() => {
<<<<<<< HEAD
=======
    console.log("GA::", location.pathname + location.search, document.title);
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
    trackPageView(location.pathname + location.search, document.title);
  }, [location]);

  return null;
}