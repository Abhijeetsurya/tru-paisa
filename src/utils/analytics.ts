import { UTMParameters, META_PIXEL_ID } from '../types';

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: any;
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

// ==========================================
// GOOGLE ADS CONVERSION CONFIGURATION
// To enable direct Google Ads conversion tracking:
// 1. Enter your Google Ads Conversion ID (e.g. 'AW-123456789')
// 2. Enter your Conversion Label (e.g. 'AbCdEfGhIjK')
// Leave empty to use GA4 imported conversions (Recommended).
// ==========================================
export const GOOGLE_ADS_CONVERSION_ID: string = ""; // e.g., 'AW-XXXXXXXXX'
export const GOOGLE_ADS_CONVERSION_LABEL: string = ""; // e.g., 'XXXXXXXXXXXX'

/**
 * Deduplication registry to guarantee conversion events fire exactly once per submission.
 * Prevents duplicate firing across React re-renders, double clicks, or multiple modals.
 */
const processedConversionIds = new Set<string>();

/**
 * Initialize Meta Pixel safely
 */
if (
  typeof window !== 'undefined' &&
  META_PIXEL_ID &&
  META_PIXEL_ID !== ('REPLACE_WITH_REAL_META_PIXEL_ID' as string)
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

      const t = b.createElement(e) as HTMLScriptElement;
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

    if (window.fbq) {
      (window.fbq as any)('init', META_PIXEL_ID);
      (window.fbq as any)('track', 'PageView');
    }

    console.log('[Meta Pixel] Initialized:', META_PIXEL_ID);
  }
}

/**
 * Extract UTM parameters and Google Ads click identifiers (gclid, gbraid, wbraid)
 * from current URL and persist in sessionStorage so attribution is retained during navigation.
 */
export function getUtmParamsFromUrl(): UTMParameters {
  if (typeof window === 'undefined') return {};

  try {
    const params = new URLSearchParams(window.location.search);

    const currentParams: UTMParameters = {
      utm_source: params.get('utm_source') || undefined,
      utm_medium: params.get('utm_medium') || undefined,
      utm_campaign: params.get('utm_campaign') || undefined,
      utm_content: params.get('utm_content') || undefined,
      utm_term: params.get('utm_term') || undefined,
      gclid: params.get('gclid') || undefined,
      gbraid: params.get('gbraid') || undefined,
      wbraid: params.get('wbraid') || undefined,
      referrer: document.referrer || undefined,
      page_url: window.location.href,
    };

    // Store in sessionStorage to persist across page interactions
    const STORAGE_KEY = 'trupaisa_lead_attribution';
    try {
      const storedJson = sessionStorage.getItem(STORAGE_KEY);
      const stored: UTMParameters = storedJson ? JSON.parse(storedJson) : {};

      const merged: UTMParameters = {
        utm_source: currentParams.utm_source || stored.utm_source,
        utm_medium: currentParams.utm_medium || stored.utm_medium,
        utm_campaign: currentParams.utm_campaign || stored.utm_campaign,
        utm_content: currentParams.utm_content || stored.utm_content,
        utm_term: currentParams.utm_term || stored.utm_term,
        gclid: currentParams.gclid || stored.gclid,
        gbraid: currentParams.gbraid || stored.gbraid,
        wbraid: currentParams.wbraid || stored.wbraid,
        referrer: currentParams.referrer || stored.referrer,
        page_url: currentParams.page_url || stored.page_url,
      };

      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      return merged;
    } catch {
      return currentParams;
    }
  } catch {
    return {};
  }
}

export interface LeadConversionOptions {
  submissionId: string;
  service?: string;
  experience?: string;
  timeline?: string;
  plan?: string;
  formType?: 'inline' | 'popup';
  value?: number;
  currency?: string;
}

/**
 * Fires GA4, Google Ads (if configured), and Meta conversion events strictly
 * AFTER the lead is confirmed to have been saved to Google Sheets.
 *
 * Guarantees:
 * 1. Fires only once per submissionId (deduplication).
 * 2. Transmits ZERO Personally Identifiable Information (no name, phone, or email).
 * 3. Never throws; analytics blockers or gtag errors will not fail user submission.
 * 4. Does not assign arbitrary monetary values without business confirmation.
 */
export function trackLeadConversion(options: Partial<LeadConversionOptions> = {}): void {
  const { submissionId, service, experience, timeline, plan, formType, value, currency } = options;

  if (!submissionId) {
    console.warn('[Analytics] trackLeadConversion called without submissionId. Generating fallback ID.');
  }

  const effectiveId = submissionId || `lead_${Date.now()}`;

  // Deduplication check: prevent multiple triggers for the same successful lead
  if (processedConversionIds.has(effectiveId)) {
    console.log(`[Analytics] Conversion event already fired for submission ${effectiveId}. Skipping duplicate.`);
    return;
  }
  processedConversionIds.add(effectiveId);

  // 1. Google Analytics 4 (GA4) 'generate_lead' Event
  // Strictly non-PII parameters only; no arbitrary monetary value
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    try {
      const ga4Payload: Record<string, any> = {
        event_category: 'engagement',
        event_label: service || 'Paid Research Inquiry',
        service_type: service || 'Not specified',
        trading_experience: experience || 'Not specified',
        subscription_timeline: timeline || 'Not specified',
        preferred_plan: plan || 'Not specified',
        form_placement: formType || 'general',
        transaction_id: effectiveId,
      };

      // Only attach value if explicitly provided and validated by business
      if (typeof value === 'number' && !isNaN(value)) {
        ga4Payload.value = value;
        ga4Payload.currency = currency || 'INR';
      }

      window.gtag('event', 'generate_lead', ga4Payload);
      console.log('[GA4] generate_lead event fired successfully for ID:', effectiveId);
    } catch (err) {
      console.warn('[GA4] Error sending generate_lead event:', err);
    }
  } else {
    console.warn('[GA4] gtag is not available on window. Conversion event skipped.');
  }

  // 2. Google Ads Direct Conversion Event (if credentials configured)
  // Only fires when user supplies valid conversion ID and label
  const hasValidGoogleAdsConfig =
    Boolean(GOOGLE_ADS_CONVERSION_ID) &&
    GOOGLE_ADS_CONVERSION_ID.startsWith('AW-') &&
    Boolean(GOOGLE_ADS_CONVERSION_LABEL) &&
    GOOGLE_ADS_CONVERSION_LABEL !== 'XXXXXXXXXXXX';

  if (hasValidGoogleAdsConfig && typeof window !== 'undefined' && typeof window.gtag === 'function') {
    try {
      const adsPayload: Record<string, any> = {
        send_to: `${GOOGLE_ADS_CONVERSION_ID}/${GOOGLE_ADS_CONVERSION_LABEL}`,
        transaction_id: effectiveId,
      };
      if (typeof value === 'number' && !isNaN(value)) {
        adsPayload.value = value;
        adsPayload.currency = currency || 'INR';
      }

      window.gtag('event', 'conversion', adsPayload);
      console.log('[Google Ads] conversion event fired successfully for ID:', effectiveId);
    } catch (err) {
      console.warn('[Google Ads] Error sending conversion event:', err);
    }
  }

  // 3. Meta Pixel 'Lead' Event (non-PII, no arbitrary monetary value)
  const configuredPixelId: string = META_PIXEL_ID;
  if (
    typeof window !== 'undefined' &&
    typeof window.fbq === 'function' &&
    configuredPixelId &&
    configuredPixelId !== 'REPLACE_WITH_REAL_META_PIXEL_ID'
  ) {
    try {
      const metaPayload: Record<string, any> = {
        content_name: service || 'Paid Research',
        content_category: 'Market Research',
      };
      if (typeof value === 'number' && !isNaN(value)) {
        metaPayload.value = value;
        metaPayload.currency = currency || 'INR';
      }

      window.fbq(
        'track',
        'Lead',
        metaPayload,
        {
          eventID: effectiveId,
        }
      );
      console.log('[Meta Pixel] Lead event fired successfully for ID:', effectiveId);
    } catch (err) {
      console.warn('[Meta Pixel] Error sending Lead event:', err);
    }
  }
}