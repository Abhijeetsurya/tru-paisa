import { ShieldCheck, ExternalLink } from 'lucide-react';
import { VERIFIED_ANALYST_INFO } from '../types';
import { LegalModalType } from './LegalModals';

interface FooterProps {
  onOpenLegalModal: (type: LegalModalType) => void;
  onScrollToContact: () => void;
}

export default function Footer({ onOpenLegalModal, onScrollToContact }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="main-footer" className="bg-slate-950 text-slate-400 text-xs pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Main Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800/80">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center">
              <img 
                src="/tru-paisa-logo-footer.svg" 
                alt="Tru Paisa - SEBI Registered Research Analyst" 
                className="w-[150px] sm:w-[175px] h-auto object-contain"
              />
            </div>

            <div className="space-y-1.5 text-slate-400 pt-1 text-xs">
              <p className="font-semibold text-slate-200 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>SEBI Registered Research Analyst</span>
              </p>
              <p>Brand / Trade Name: <span className="text-slate-200 font-semibold">{VERIFIED_ANALYST_INFO.brandName}</span></p>
              <p>Research Analyst: <span className="text-slate-200 font-semibold">{VERIFIED_ANALYST_INFO.analystName}</span></p>
              <p>SEBI Registration No.: <span className="text-white font-mono">{VERIFIED_ANALYST_INFO.sebiRegNo}</span></p>
              <p className="pt-1">Phone: <a href={VERIFIED_ANALYST_INFO.phoneLink} className="text-emerald-400 hover:text-emerald-300 font-medium">{VERIFIED_ANALYST_INFO.phone}</a></p>
              <p>Email: <a href={VERIFIED_ANALYST_INFO.emailLink} className="text-emerald-400 hover:text-emerald-300 font-medium">{VERIFIED_ANALYST_INFO.supportEmail}</a></p>
              <p className="pt-1 text-slate-300">Registered Office: {VERIFIED_ANALYST_INFO.address}</p>
            </div>
          </div>

          {/* Quick Legal Links */}
          <div>
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px] mb-3">
              Compliance & Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegalModal('privacy')}
                  className="hover:text-emerald-400 transition-colors text-left cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegalModal('terms')}
                  className="hover:text-emerald-400 transition-colors text-left cursor-pointer"
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegalModal('disclosure')}
                  className="hover:text-emerald-400 transition-colors text-left cursor-pointer"
                >
                  Regulatory Disclosures
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Official Portal */}
          <div>
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px] mb-3">
              Official Portal
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={onScrollToContact}
                  className="hover:text-emerald-400 transition-colors text-left cursor-pointer"
                >
                  Contact Support
                </button>
              </li>
              <li>
                <a
                  href={VERIFIED_ANALYST_INFO.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  <span>Visit trupaisa.com</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright & Disclaimer note */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400 text-center sm:text-left">
          <div>
            © {currentYear} {VERIFIED_ANALYST_INFO.brandName}. All rights reserved. SEBI Reg: {VERIFIED_ANALYST_INFO.sebiRegNo}.
          </div>
          <div className="text-slate-400 max-w-md">
            Securities investments are subject to market risks. Past performance does not guarantee future results.
          </div>
        </div>

      </div>
    </footer>
  );
}
