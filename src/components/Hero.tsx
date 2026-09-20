import { ArrowDown, CheckCircle2, Shield, Tag, FileText } from 'lucide-react';
import { VERIFIED_ANALYST_INFO } from '../types';

interface HeroProps {
  onOpenPopup: () => void;
}

export default function Hero({ onOpenPopup }: HeroProps) {
  const scrollToServices = () => {
    const el = document.getElementById('services-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="hero-section" className="relative pt-8 pb-10 sm:pt-12 sm:pb-14 bg-white border-b border-slate-200/60 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-emerald-50/60 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Verified Trust Badge & Paid Services Badge */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
          <div 
            id="hero-trust-badge"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100/90 border border-slate-200/80 text-xs sm:text-sm font-medium text-slate-800 shadow-xs"
          >
            <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>SEBI Registered Research Analyst</span>
            <span className="text-slate-300">•</span>
            <span className="font-semibold text-slate-900">{VERIFIED_ANALYST_INFO.sebiRegNo}</span>
          </div>

          <div 
            id="hero-paid-badge"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs sm:text-sm font-bold text-emerald-900 shadow-xs"
          >
            <Tag className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>PAID RESEARCH SERVICES</span>
          </div>
        </div>

        {/* Primary Headline */}
        <h1 
          id="hero-main-heading"
          className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15] mb-3"
        >
          Professional Market Research <br className="hidden sm:inline" />
          <span className="text-emerald-700">for Investors & Traders</span>
        </h1>

        {/* Supporting Text */}
        <p 
          id="hero-subheadline"
          className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed mb-5"
        >
          Research services across Equity and Commodity markets with transparent plans and pricing.
        </p>

        {/* Highly Visible Pricing Highlight */}
        <div className="max-w-xl mx-auto mb-6 p-4 bg-emerald-50/80 border border-emerald-200/90 rounded-2xl shadow-xs">
          <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-800 mb-0.5">
            Transparent Pricing
          </div>
          <div className="text-lg sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Plans Starting From ₹5,999 + 18% GST
          </div>
          <div className="text-xs text-slate-600 mt-1 font-medium">
            Paid research service • Not free tips
          </div>
        </div>

        {/* Hero CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
          <button
            type="button"
            id="hero-view-plans-btn"
            onClick={scrollToServices}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm sm:text-base font-bold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 touch-manipulation cursor-pointer"
          >
            <FileText className="w-4 h-4 text-emerald-700" />
            <span>View Plans & Pricing</span>
          </button>

          <button
            type="button"
            id="hero-primary-cta-btn"
            onClick={onOpenPopup}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm sm:text-base font-bold text-white bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 rounded-xl transition-all shadow-md shadow-emerald-900/10 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 touch-manipulation cursor-pointer"
          >
            <span>Get Research Details</span>
            <ArrowDown className="w-4 h-4" />
          </button>
        </div>

        {/* Trust Highlights Grid with Registered Research Analyst */}
        <div 
          id="hero-features-list"
          className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto text-left pt-5 border-t border-slate-100"
        >
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50/90 border border-slate-200/70">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-700 font-medium leading-normal">
              <span className="font-semibold text-slate-900 block mb-0.5">Research Services</span>
              Equity, Intraday, Positional & Derivatives
            </div>
          </div>
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50/90 border border-slate-200/70">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-700 font-medium leading-normal">
              <span className="font-semibold text-slate-900 block mb-0.5">Structured Analysis</span>
              Technical and fundamental evaluation framework
            </div>
          </div>
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50/90 border border-slate-200/70">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-700 font-medium leading-normal">
              <span className="font-semibold text-slate-900 block mb-0.5">Registered Research Analyst</span>
              {VERIFIED_ANALYST_INFO.analystName} • SEBI Reg. {VERIFIED_ANALYST_INFO.sebiRegNo}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
