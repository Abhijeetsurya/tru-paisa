<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Tru Paisa - SEBI Registered Research Analyst Landing Page

Production landing page for Tru Paisa with verified lead recording, Google Sheets integration, and Google Ads/GA4/Meta conversion tracking.

## Architecture & Production Deployment Options

Lead inquiry verification requires reading the response from the Google Apps Script backend. Because web browsers enforce CORS restrictions when following 302 redirects from Google Apps Script, a backend route (`/api/leads`) is provided to proxy the request, verify the write to Google Sheets, and return confirmed success to the frontend before conversion events fire.

### Option A: Node.js / Full-Stack Express (Docker, Cloud Run, Render, VPS) - Recommended
The repository includes a unified Express + Vite production server in `server.ts`.
1. Build the frontend:
   ```bash
   npm run build
   ```
2. Start the production server:
   ```bash
   npm start
   ```
   The server serves the compiled static files from `dist/` and mounts `/api/leads` and `/api/health`.

### Option B: Serverless Deployment (Vercel)
A serverless function is included at `api/leads.ts`.
When deploying to Vercel:
- Framework preset: Vite
- Root directory: `./`
- Build command: `npm run build`
- Output directory: `dist`
- The `api/leads.ts` and `api/health.ts` endpoints will be automatically deployed as serverless functions.

### Important: Pure Static Hosting (Without /api/leads)
If deployed to a static-only CDN (e.g. basic GitHub Pages, S3 without Lambda) where `/api/leads` returns a 404:
- The form will attempt direct submission to Google Apps Script.
- If browser security blocks or truncates the response, the system will **NOT** report false success or fire conversion events. Instead, it will inform the visitor that the backend endpoint is required.

## Tracking & Conversion Configuration

### 1. Google Analytics 4 (GA4)
- Configured in `index.html` with Measurement ID: `G-KGPTMRR50M`.
- Automatically fires `generate_lead` when a lead is confirmed saved.
- Import the `generate_lead` conversion into Google Ads (recommended approach).

### 2. Google Ads Direct Conversion Tracking (Optional)
Direct tracking is disabled by default to prevent firing invalid conversion events.
To enable direct Google Ads conversions:
1. Provide your Google Ads Conversion ID (e.g. `AW-123456789`) and Conversion Label in `src/utils/analytics.ts` or via environment variables:
   - `VITE_GOOGLE_ADS_CONVERSION_ID`
   - `VITE_GOOGLE_ADS_CONVERSION_LABEL`

### 3. Meta Pixel
- Configured with Pixel ID: `4539111476336869` in `src/types.ts`.
- Fires standard `Lead` event strictly upon confirmed backend save.

### Privacy & Data Protection Guarantee
- **Zero Personally Identifiable Information (PII)** is sent to analytics or advertising platforms (no names, phone numbers, or email addresses).
- Only non-PII transaction IDs and research interest categories are sent with conversion events.

## Automated Reliability Verification
Run the 6-point reliability test suite:
```bash
npx tsx scripts/test-lead-reliability.ts
```

