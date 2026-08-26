interface HeaderProps {
  onOpenPopup: () => void;
}

export default function Header({ onOpenPopup }: HeaderProps) {
  return (
    <header id="header" className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-shadow duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Official Brand Logo */}
        <a 
          href="/" 
          id="brand-logo-link"
          className="flex items-center group focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-lg p-1"
          aria-label="Tru Paisa Home"
        >
          <img 
            src="/tru-paisa-logo.svg" 
            alt="Tru Paisa - SEBI Registered Research Analyst" 
            className="w-[140px] sm:w-[185px] h-auto object-contain"
          />
        </a>

        {/* CTA Button */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            id="header-cta-btn"
            onClick={onOpenPopup}
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 touch-manipulation cursor-pointer"
          >
            Get Started
          </button>
        </div>
      </div>
    </header>
  );
}
