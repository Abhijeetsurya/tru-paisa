import { ShieldAlert, ExternalLink, Building2, FileText, Info } from 'lucide-react';
import { VERIFIED_ANALYST_INFO } from '../types';

export default function RegulatoryDisclosure() {
  return (
    <section id="regulatory-disclosure-section" className="py-10 bg-slate-100/80 border-b border-slate-200 text-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Card Frame */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 sm:p-7 shadow-xs space-y-6">
          
          {/* Header */}
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
            <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0" />
            <h3 className="text-sm sm:text-base font-bold text-slate-900 uppercase tracking-wider">
              Regulatory Disclosure & Statutory Notice
            </h3>
          </div>

          {/* Research Analyst Identification */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
              <Info className="w-4 h-4 text-emerald-700" />
              <span>Research Analyst Identification</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs sm:text-sm text-slate-700 bg-slate-50 p-4 rounded-lg border border-slate-200/60">
              <div>
                <span className="text-slate-500 font-medium block text-xs">Research Analyst:</span>
                <span className="font-bold text-slate-900">{VERIFIED_ANALYST_INFO.analystName}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium block text-xs">Brand / Trade Name:</span>
                <span className="font-semibold text-slate-900">{VERIFIED_ANALYST_INFO.brandName}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium block text-xs">SEBI Registration No.:</span>
                <span className="font-bold text-emerald-800 font-mono">{VERIFIED_ANALYST_INFO.sebiRegNo}</span>
              </div>
            </div>
          </div>

          {/* Registered Office Address */}
          <div className="space-y-2 text-xs text-slate-600 bg-slate-50/60 p-4 rounded-lg border border-slate-200">
            <div className="font-semibold text-slate-800 mb-1 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-emerald-700" />
              <span>Registered Office Address</span>
            </div>
            <p className="text-slate-700 font-medium">
              {VERIFIED_ANALYST_INFO.address}
            </p>
          </div>

          {/* Risk & Regulatory Disclosure */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-amber-700" />
              <span>Risk & Regulatory Disclosure</span>
            </div>
            <div className="bg-amber-50/80 border-l-4 border-amber-500 p-3.5 rounded-r-md text-amber-950 font-medium text-xs sm:text-sm leading-relaxed">
              &ldquo;{VERIFIED_ANALYST_INFO.officialDisclaimer}&rdquo;
            </div>
          </div>

          {/* Verification Link */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-slate-500">Official Portal:</span>
            <a
              href={VERIFIED_ANALYST_INFO.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-emerald-800 hover:text-emerald-950 hover:underline"
            >
              <span>{VERIFIED_ANALYST_INFO.websiteUrl}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}
