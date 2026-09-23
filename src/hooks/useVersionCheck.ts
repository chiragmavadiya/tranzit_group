import { useEffect } from "react";

export default function useVersionCheck() {
    useEffect(() => {
        const checkVersion = async () => {
            try {
                const res = await fetch(`/version.json?t=${Date.now()}`);
                const latest = await res.json();

                const current = localStorage.getItem("app-version");

                if (!current) {
                    localStorage.setItem("app-version", latest.version);
                    return;
                }

                if (current !== latest.version) {
                    localStorage.setItem("app-version", latest.version);
                    window.location.reload();
                }
            } catch (e) {
                console.log(e);
            }
        };

        checkVersion();

        const interval = setInterval(checkVersion, 60000 * 5); // 5 minutes

        return () => clearInterval(interval);
    }, []);
}