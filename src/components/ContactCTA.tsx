import { HelpCircle, ArrowUp } from 'lucide-react';

interface ContactCTAProps {
  onOpenPopup: () => void;
}

export default function ContactCTA({ onOpenPopup }: ContactCTAProps) {
  return (
    <section id="contact-cta-section" className="py-10 sm:py-14 bg-slate-900 text-white relative overflow-hidden">
      {/* Background soft glow */}
      <div className="absolute -right-20 -top-20 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto mb-3 text-emerald-400">
          <HelpCircle className="w-5 h-5" />
        </div>

        <h2 
          id="contact-cta-heading"
          className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mb-2"
        >
          Have Questions?
        </h2>

        <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed mb-6">
          Our team can help you understand the available research services.
        </p>

        <div className="flex items-center justify-center">
          <button
            type="button"
            id="contact-get-details-btn"
            onClick={onOpenPopup}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold text-slate-900 bg-emerald-400 hover:bg-emerald-300 active:bg-emerald-500 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-slate-900 touch-manipulation cursor-pointer"
          >
            <span>Get Research Details</span>
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
