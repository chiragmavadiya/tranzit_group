import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "./index";

export default function PageViewTracker() {
  const location = useLocation();

  useEffect(() => {
    console.log("GA::", location.pathname + location.search, document.title);
    trackPageView(location.pathname + location.search, document.title);
  }, [location]);

  return null;
}