"use client";
import { useCallback, useEffect, useRef, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

type UsePwaInstallReturn = {
  isInstallable: boolean;
  isInstalled: boolean;
  isInstalling: boolean;
  install: () => Promise<boolean>;
  error: string | null;
  debugInfo: {
    hasServiceWorker: boolean;
    promptEventCaptured: boolean;
    isStandaloneMode: boolean;
    manifestValid: boolean;
    isSecure: boolean;
  };
};

const DISPLAY_MODE_STANDALONE = "(display-mode: standalone)";
const DISPLAY_MODE_MINIMAL_UI = "(display-mode: minimal-ui)";

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia(DISPLAY_MODE_STANDALONE).matches ||
    window.matchMedia(DISPLAY_MODE_MINIMAL_UI).matches ||
    // @ts-expect-error - navigator.standalone is Safari-specific
    window.navigator.standalone === true
  );
}

function isSecureContext(): boolean {
  if (typeof window === "undefined") return false;
  return window.location.protocol === "https:" || 
         window.location.hostname === "localhost" ||
         window.location.hostname === "127.0.0.1";
}

export function usePwaInstall(): UsePwaInstallReturn {
  // Use ref to store the prompt event to avoid React state timing issues
  const promptEventRef = useRef<BeforeInstallPromptEvent | null>(null);
  const [promptEventState, setPromptEventState] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasServiceWorker, setHasServiceWorker] = useState(false);
  const [manifestValid, setManifestValid] = useState(false);
  const [isSecure, setIsSecure] = useState(false);

  // Check initial state immediately
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check security context
    const secure = isSecureContext();
    setIsSecure(secure);
    if (!secure) {
      console.warn("⚠️ PWA: App must be served over HTTPS or localhost");
    }

    // Check if already installed
    const standalone = isStandalone();
    if (standalone) {
      console.log("✅ PWA: Already running in standalone mode");
      setIsInstalled(true);
    } else {
      console.log("ℹ️ PWA: Running in browser mode");
    }

    // Validate manifest
    fetch("/manifest.json")
      .then(res => res.json())
      .then(manifest => {
        const hasName = !!(manifest.name || manifest.short_name);
        const hasIcons = manifest.icons && manifest.icons.length > 0;
        const hasStartUrl = !!manifest.start_url;
        const hasDisplay = !!manifest.display;
        
        const valid = hasName && hasIcons && hasStartUrl && hasDisplay;
        setManifestValid(valid);
        
        if (valid) {
          console.log("✅ PWA: Manifest is valid");
        } else {
          console.error("❌ PWA: Manifest validation failed", {
            hasName,
            hasIcons,
            hasStartUrl,
            hasDisplay,
          });
        }
      })
      .catch(err => {
        console.error("❌ PWA: Failed to fetch manifest", err);
        setManifestValid(false);
      });
  }, []);

  // Set up event listeners immediately when component mounts
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (!("serviceWorker" in navigator)) {
      console.error("❌ PWA: Service Worker not supported in this browser");
      return;
    }

    console.log("✅ PWA: Service Worker API available");

    // Check if service worker is registered
    navigator.serviceWorker.ready
      .then((registration) => {
        console.log("✅ PWA: Service Worker is active:", registration.scope);
        setHasServiceWorker(true);
      })
      .catch((err) => {
        console.error("❌ PWA: Service Worker not ready:", err);
      });

    // Set up beforeinstallprompt listener BEFORE any other code runs
    const onBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      console.log("🎉 PWA: beforeinstallprompt event fired!");
      console.log("ℹ️ PWA: App is installable");
      
      const promptEvent = e as BeforeInstallPromptEvent;
      // Store in both ref (for immediate access) and state (for React rendering)
      promptEventRef.current = promptEvent;
      setPromptEventState(promptEvent);
      setError(null);
    };

    const onAppInstalled = () => {
      console.log("✅ PWA: App installed successfully!");
      setIsInstalled(true);
      promptEventRef.current = null;
      setPromptEventState(null);
      setError(null);
    };

    const onMediaQueryChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        console.log("✅ PWA: Detected standalone mode activation");
        setIsInstalled(true);
      }
    };

    // Add listeners immediately
    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onAppInstalled);

    const mql = window.matchMedia(DISPLAY_MODE_STANDALONE);
    mql.addEventListener("change", onMediaQueryChange);

    // Diagnostic logging after a delay
    const diagnosticTimeout = setTimeout(() => {
      if (!promptEventRef.current && !isStandalone()) {
        console.warn("⚠️ PWA: beforeinstallprompt has not fired");
        console.log("ℹ️ PWA: Installability checklist:");
        console.log(`  ✓ Service Worker: ${hasServiceWorker ? "Active" : "Not Active"}`);
        console.log(`  ✓ Manifest: ${manifestValid ? "Valid" : "Invalid"}`);
        console.log(`  ✓ Secure Context: ${isSecure ? "Yes (HTTPS/localhost)" : "No"}`);
        console.log(`  ✓ Icons: Check manifest.json has valid icon entries`);
        console.log(`  ✓ Already Installed: ${isStandalone() ? "Yes" : "No"}`);
        console.log("\nℹ️ PWA: If all criteria are met but event hasn't fired:");
        console.log("  1. Try hard refresh (Ctrl+Shift+R)");
        console.log("  2. Check Chrome://flags for PWA settings");
        console.log("  3. Uninstall app if already installed");
        console.log("  4. Wait ~30 seconds for Chrome to evaluate criteria");
      }
    }, 5000);

    return () => {
      clearTimeout(diagnosticTimeout);
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
      mql.removeEventListener("change", onMediaQueryChange);
    };
  }, []); // Only run once on mount

  const install = useCallback(async (): Promise<boolean> => {
    try {
      // Use ref for most up-to-date value
      const event = promptEventRef.current || promptEventState;
      
      if (!event) {
        const errorMsg = "Install prompt not available";
        console.error("❌ PWA:", errorMsg);
        console.log("ℹ️ PWA: Troubleshooting:");
        console.log(`  - Service Worker: ${hasServiceWorker ? "✓" : "✗"}`);
        console.log(`  - Manifest: ${manifestValid ? "✓" : "✗"}`);
        console.log(`  - Secure: ${isSecure ? "✓" : "✗"}`);
        console.log(`  - Installed: ${isStandalone() ? "Yes (uninstall first)" : "No"}`);
        
        // Don't set error state for normal "not available" cases
        // This is expected behavior in many situations
        return false;
      }

      console.log("🚀 PWA: Triggering install prompt...");
      setIsInstalling(true);
      setError(null);
      
      await event.prompt();
      console.log("ℹ️ PWA: Waiting for user choice...");
      
      const result = await event.userChoice;
      
      setIsInstalling(false);
      promptEventRef.current = null;
      setPromptEventState(null);

      if (result.outcome === "accepted") {
        console.log("✅ PWA: User accepted installation");
        setIsInstalled(true);
        return true;
      } else {
        console.log("ℹ️ PWA: User declined installation");
        // Don't set this as an error - user choice is not an error
        return false;
      }
    } catch (err) {
      setIsInstalling(false);
      const errorMessage = err instanceof Error ? err.message : "Installation failed";
      setError(errorMessage);
      console.error("❌ PWA: Installation error:", err);
      return false;
    }
  }, [promptEventState, hasServiceWorker, manifestValid, isSecure]);

  return {
    isInstallable: (promptEventRef.current !== null || promptEventState !== null) && !isInstalled,
    isInstalled,
    isInstalling,
    install,
    error,
    debugInfo: {
      hasServiceWorker,
      promptEventCaptured: promptEventRef.current !== null || promptEventState !== null,
      isStandaloneMode: isStandalone(),
      manifestValid,
      isSecure,
    },
  };
}
