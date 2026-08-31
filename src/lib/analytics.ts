// Lightweight typed wrapper around the gtag.js instance loaded in index.html.
// All helpers are no-ops when gtag is unavailable (e.g. ad blockers, local dev).

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

type EventParams = Record<string, string | number | boolean | undefined>;

export const trackEvent = (eventName: string, params: EventParams = {}) => {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  }
};

/** SPA route-change page view (initial load is tracked by gtag config). */
export const trackPageView = (path: string, title: string) => {
  trackEvent("page_view", {
    page_path: path,
    page_title: title,
  });
};

/** Conversion: rental request form submitted successfully. */
export const trackGenerateLead = () => {
  trackEvent("generate_lead", {
    event_category: "form",
    event_label: "rental_request",
  });
};

/** Rental request form submission failed. */
export const trackFormError = () => {
  trackEvent("form_submit_error", {
    event_category: "form",
    event_label: "rental_request",
  });
};

/** CTA click tracking for funnel analysis. */
export const trackCtaClick = (ctaName: string, destination: string) => {
  trackEvent("select_content", {
    content_type: "cta",
    item_id: ctaName,
    destination,
  });
};
