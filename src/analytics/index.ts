import ReactGA from "react-ga4";

const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

export const initializeAnalytics = () => {
    if (!measurementId) {
        console.warn("Google Analytics Measurement ID is missing.");
        return;
    }

    ReactGA.initialize(measurementId);
};