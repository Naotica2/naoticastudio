"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export function AOSProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        AOS.init({
            // Animation settings
            duration: 800,
            easing: "ease-out-cubic",
            once: false, // Animation happens every time you scroll
            mirror: true, // Animate out while scrolling past
            offset: 50, // Offset from the original trigger point
            delay: 0,
            anchorPlacement: "top-bottom",
        });

        // Refresh AOS when window resizes
        window.addEventListener("resize", () => {
            AOS.refresh();
        });

        return () => {
            window.removeEventListener("resize", () => {
                AOS.refresh();
            });
        };
    }, []);

    return <>{children}</>;
}
