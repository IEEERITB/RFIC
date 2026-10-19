"use client";

import React, { useEffect, useRef } from "react";
import "locomotive-scroll/dist/locomotive-scroll.css";

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let scroller: any = null;
    let triggers: any[] = [];
    let isCleanedUp = false;

    const init = async () => {
      try {
        const { default: LocomotiveScroll } = await import("locomotive-scroll");
        const { gsap } = await import("gsap");
        const { ScrollTrigger } = await import("gsap/ScrollTrigger");

        if (isCleanedUp) return;

        gsap.registerPlugin(ScrollTrigger);

        // Initialize modern Locomotive Scroll (Lenis smooth scroll under the hood)
        scroller = new LocomotiveScroll({
          autoStart: true,
          scrollCallback: () => {
            ScrollTrigger.update();
          },
        });

        // Sync with underlying Lenis scroll updates if available
        if (scroller && scroller.lenisInstance) {
          scroller.lenisInstance.on("scroll", () => {
            ScrollTrigger.update();
          });
        }

        // Give DOM a frame to settle, then initialize color triggers
        requestAnimationFrame(() => {
          if (isCleanedUp) return;

          ScrollTrigger.refresh();

          const scrollColorElems = document.querySelectorAll<HTMLElement>("[data-bgcolor]");
          if (scrollColorElems.length === 0) return;

          scrollColorElems.forEach((colorSection, i) => {
            const currentBg = colorSection.dataset.bgcolor || "";
            const currentText = colorSection.dataset.textcolor || "";
            const prevBg = i === 0 ? currentBg : (scrollColorElems[i - 1].dataset.bgcolor || currentBg);
            const prevText = i === 0 ? currentText : (scrollColorElems[i - 1].dataset.textcolor || currentText);

            const trigger = ScrollTrigger.create({
              trigger: colorSection,
              start: "top 50%",
              onEnter: () => {
                gsap.to("body", {
                  backgroundColor: currentBg,
                  color: currentText,
                  duration: 0.8,
                  ease: "power2.out",
                  overwrite: "auto",
                });
              },
              onEnterBack: () => {
                gsap.to("body", {
                  backgroundColor: currentBg,
                  color: currentText,
                  duration: 0.8,
                  ease: "power2.out",
                  overwrite: "auto",
                });
              },
              onLeaveBack: () => {
                gsap.to("body", {
                  backgroundColor: prevBg,
                  color: prevText,
                  duration: 0.8,
                  ease: "power2.out",
                  overwrite: "auto",
                });
              },
            });

            triggers.push(trigger);
          });

          ScrollTrigger.refresh();
        });
      } catch (err) {
        console.warn("SmoothScroll / ScrollTrigger initialization note:", err);
      }
    };

    init();

    return () => {
      isCleanedUp = true;
      triggers.forEach((t) => t.kill());
      triggers = [];
      if (scroller && typeof scroller.destroy === "function") {
        scroller.destroy();
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="container-scroller w-full min-h-screen">
      {children}
    </div>
  );
}
