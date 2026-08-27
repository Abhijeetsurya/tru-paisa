import { UTMParameters, META_PIXEL_ID } from '../types';

// Automatically initialize Meta Pixel globally if a real ID is provided
if (typeof window !== 'undefined' && META_PIXEL_ID !== "4539111476336869") {
  if (!window.fbq) {
    (function(f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
      if (f.fbq) return;
      n = f.fbq = function() {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

    window.fbq('init', META_PIXEL_ID);
    window.fbq('track', 'PageView');
  }
}

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * Extracts UTM parameters and referral information from current URL
 */
export function getUtmParamsFromUrl(): UTMParameters {
  if (typeof window === 'undefined') return {};

  try {
    const params = new URLSearchParams(window.location.search);
    return {
      utm_source: params.get('utm_source') || undefined,
      utm_medium: params.get('utm_medium') || undefined,
      utm_campaign: params.get('utm_campaign') || undefined,
      utm_content: params.get('utm_content') || undefined,
      utm_term: params.get('utm_term') || undefined,
      referrer: document.referrer || undefined,
      page_url: window.location.href,
    };
  } catch {
    return {};
  }
}

/**
 * Fires Meta Ads 'Lead' conversion event
 */
export function trackLeadConversion() {
  if (typeof window !== 'undefined' && META_PIXEL_ID !== "REPLACE_WITH_REAL_META_PIXEL_ID" && typeof window.fbq === 'function') {
    try {
      window.fbq('track', 'Lead');
    } catch (err) {
      console.warn('[Meta Pixel] Error tracking Lead event:', err);
    }
  } else {
    console.info('[Meta Ads Lead Conversion]', {
      note: 'Meta Pixel is inactive while META_PIXEL_ID placeholder is used.',
      event: 'Lead',
    });
  }
}
