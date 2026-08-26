import { X, ShieldCheck } from 'lucide-react';
import { VERIFIED_ANALYST_INFO } from '../types';

export type LegalModalType = 'privacy' | 'terms' | 'disclosure' | null;

interface LegalModalProps {
  type: LegalModalType;
  onClose: () => void;
}

export default function LegalModal({ type, onClose }: LegalModalProps) {
  if (!type) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            <h3 className="font-bold text-base sm:text-lg text-slate-900">
              {type === 'privacy' && 'Privacy Policy'}
              {type === 'terms' && 'Terms & Conditions'}
              {type === 'disclosure' && 'Regulatory Disclosure & Compliance'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
          {type === 'privacy' && (
            <>
              <p className="font-semibold text-slate-900">
                1. Data Collection & Purpose
              </p>
              <p>
                Tru Paisa and Sanskriti Samadhiya (SEBI Registered Research Analyst INH000026293) collect personal data including your name, contact number, email, and city solely to provide communication regarding subscribed or inquired research analyst services.
              </p>
              <p className="font-semibold text-slate-900">
                2. Data Protection & Confidentiality
              </p>
              <p>
                We maintain strict confidentiality standards. Your contact information is never sold, traded, or shared with unauthorized third-party commercial entities.
              </p>
              <p className="font-semibold text-slate-900">
                3. Consent & Communication
              </p>
              <p>
                By providing your details, you expressly consent to receive service communications, regulatory updates, and research alerts via phone call, SMS, or WhatsApp. You may opt out at any time by notifying our support desk.
              </p>
            </>
          )}

          {type === 'terms' && (
            <>
              <p className="font-semibold text-slate-900">
                1. Nature of Service
              </p>
              <p>
                All services offered are purely research analyst services pursuant to SEBI (Research Analysts) Regulations, 2014. We provide market analysis, research reports, and technical/fundamental observations.
              </p>
              <p className="font-semibold text-slate-900">
                2. No Guarantee of Returns
              </p>
              <p>
                Investment in securities market are subject to market risks. We do not provide guaranteed returns, fixed-profit schemes, sure-shot calls, or no-loss strategies under any circumstances.
              </p>
              <p className="font-semibold text-slate-900">
                3. Independent Decision Making
              </p>
              <p>
                Clients must evaluate their risk profile and consult their financial advisors before executing trades based on any research reports.
              </p>
            </>
          )}

          {type === 'disclosure' && (
            <>
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-950 text-xs space-y-1">
                <div className="font-bold mb-1">Intermediary Registration Details</div>
                <div>Research Analyst: {VERIFIED_ANALYST_INFO.analystName}</div>
                <div>Brand / Trade Name: {VERIFIED_ANALYST_INFO.brandName}</div>
                <div>SEBI Registration No.: {VERIFIED_ANALYST_INFO.sebiRegNo}</div>
              </div>
              <p className="font-semibold text-slate-900">
                Statutory Disclaimer:
              </p>
              <p className="italic">
                &ldquo;{VERIFIED_ANALYST_INFO.officialDisclaimer}&rdquo;
              </p>
              <p className="font-semibold text-slate-900">
                Conflict of Interest & Disclosures:
              </p>
              <p>
                The Research Analyst adheres strictly to the Code of Conduct mandated by SEBI. Disclosures regarding any financial interest or holdings in the covered securities are provided in individual research reports as required by regulation.
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
