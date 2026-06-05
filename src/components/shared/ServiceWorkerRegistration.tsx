"use client";
import { useEffect } from "react";

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      console.warn("⚠️ PWA: Service Worker not supported in this browser");
      return;
    }

    // Register service worker in BOTH dev and production
    // PWA testing requires service worker in development
    const registerSW = async () => {
      try {
        // First, check if a service worker is already registered
        const existingRegistration = await navigator.serviceWorker.getRegistration("/");
        
        if (existingRegistration) {
          console.log("ℹ️ PWA: Service Worker already registered");
          
          // Force update check
          await existingRegistration.update();
          console.log("✅ PWA: Service Worker update checked");
          
          // Wait for the service worker to be active
          if (existingRegistration.active) {
            console.log("✅ PWA: Service Worker is active");
          } else if (existingRegistration.installing || existingRegistration.waiting) {
            console.log("⏳ PWA: Service Worker is installing/waiting");
            
            const sw = existingRegistration.installing || existingRegistration.waiting;
            if (sw) {
              sw.addEventListener("statechange", () => {
                if (sw.state === "activated") {
                  console.log("✅ PWA: Service Worker activated!");
                }
              });
            }
          }
          
          return;
        }

        // Register new service worker
        console.log("ℹ️ PWA: Registering new Service Worker...");
        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
          updateViaCache: "none", // Always fetch fresh SW file
        });
        
        console.log("✅ PWA: Service Worker registered:", registration.scope);

        // Wait for SW to be active
        if (registration.installing) {
          console.log("⏳ PWA: Service Worker installing...");
          registration.installing.addEventListener("statechange", (e) => {
            const sw = e.target as ServiceWorker;
            console.log("ℹ️ PWA: SW State changed to:", sw.state);
            if (sw.state === "activated") {
              console.log("✅ PWA: Service Worker activated!");
              
              // Force a page reload to ensure SW is controlling the page
              if (!navigator.serviceWorker.controller) {
                console.log("ℹ️ PWA: Reloading to activate SW control");
                window.location.reload();
              }
            }
          });
        } else if (registration.active) {
          console.log("✅ PWA: Service Worker already active");
        } else if (registration.waiting) {
          console.log("⏳ PWA: Service Worker waiting to activate");
          // Skip waiting and activate immediately
          registration.waiting.postMessage({ type: "SKIP_WAITING" });
        }

        // Check for updates periodically (production only)
        if (process.env.NODE_ENV === "production") {
          const updateInterval = setInterval(() => {
            registration.update().catch(err => {
              console.error("❌ PWA: Update check failed:", err);
            });
          }, 60 * 60 * 1000); // Check every hour

          // Cleanup on unmount
          return () => clearInterval(updateInterval);
        }
      } catch (error) {
        console.error("❌ PWA: Service Worker registration failed:", error);
      }
    };

    // Small delay to ensure page is fully loaded
    const timeoutId = setTimeout(() => {
      registerSW();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, []);

  return null;
}
