import { ArrowUp, ShieldCheck } from 'lucide-react';
import { VERIFIED_ANALYST_INFO } from '../types';

interface StickyMobileCTAProps {
  onOpenPopup: () => void;
}

export default function StickyMobileCTA({ onOpenPopup }: StickyMobileCTAProps) {
  return (
    <div 
      id="sticky-mobile-cta"
      className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-4 py-2.5 shadow-lg transition-transform"
    >
      <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-900 leading-tight">
            Tru Paisa
          </span>
          <span className="text-[10px] font-medium text-slate-600 flex items-center gap-1">
            <ShieldCheck className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
            <span>SEBI Reg. {VERIFIED_ANALYST_INFO.sebiRegNo}</span>
          </span>
        </div>

        <button
          type="button"
          id="sticky-mobile-cta-btn"
          onClick={onOpenPopup}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 touch-manipulation cursor-pointer shrink-0"
        >
          <span>Get Research Details</span>
          <ArrowUp className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
