import { UTMParameters, META_PIXEL_ID } from '../types';

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: any;
  }
}

/**
 * Initialize Meta Pixel
 */
if (
  typeof window !== 'undefined' &&
  META_PIXEL_ID &&
  META_PIXEL_ID !== 'REPLACE_WITH_REAL_META_PIXEL_ID'
) {
  if (typeof window.fbq !== 'function') {
    (function (f: any, b: Document, e: string, v: string) {
      if (f.fbq) return;

      const n: any = function (...args: any[]) {
        if (n.callMethod) {
          n.callMethod.apply(n, args);
        } else {
          n.queue.push(args);
        }
      };

      if (!f._fbq) {
        f._fbq = n;
      }

      n.push = n;
      n.loaded = true;
      n.version = '2.0';
      n.queue = [];

      const t = b.createElement(e);
      t.async = true;
      t.src = v;

      const s = b.getElementsByTagName(e)[0];

      if (s && s.parentNode) {
        s.parentNode.insertBefore(t, s);
      } else {
        b.head.appendChild(t);
      }

      f.fbq = n;
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

    window.fbq('init', META_PIXEL_ID);
    window.fbq('track', 'PageView');

    console.log('[Meta Pixel] Initialized:', META_PIXEL_ID);
  }
}

/**
 * Extract UTM parameters and referral information from current URL
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
 * Fires Meta Ads Lead conversion event
 *
 * Call this ONLY after the website has successfully submitted
 * the user's inquiry.
 */
export function trackLeadConversion(): void {
  if (
    typeof window !== 'undefined' &&
    typeof window.fbq === 'function'
  ) {
    try {
      window.fbq('track', 'Lead');

      console.log('[Meta Pixel] Lead event sent successfully');
    } catch (err) {
      console.warn('[Meta Pixel] Error tracking Lead event:', err);
    }
  } else {
    console.warn(
      '[Meta Pixel] Lead event could not be sent because fbq is not available.'
    );
  }
}