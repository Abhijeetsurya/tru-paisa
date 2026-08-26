import { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import LeadForm from './components/LeadForm';
import ServicesSection from './components/ServicesSection';
import WhyTruPaisa from './components/WhyTruPaisa';
import ContactCTA from './components/ContactCTA';
import RegulatoryDisclosure from './components/RegulatoryDisclosure';
import Footer from './components/Footer';
import StickyMobileCTA from './components/StickyMobileCTA';
import LeadPopup from './components/LeadPopup';
import LegalModal, { LegalModalType } from './components/LegalModals';
import { UTMParameters, ResearchServiceType } from './types';
import { getUtmParamsFromUrl } from './utils/analytics';

export default function App() {
  const [utmParams, setUtmParams] = useState<UTMParameters>({});
  const [preselectedService, setPreselectedService] = useState<ResearchServiceType | ''>('');
  const [activeLegalModal, setActiveLegalModal] = useState<LegalModalType>(null);
  
  // Lead Popup State
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [popupPreselectedService, setPopupPreselectedService] = useState<ResearchServiceType | ''>('');

  // Capture UTM parameters from URL upon initial page load
  useEffect(() => {
    const params = getUtmParamsFromUrl();
    setUtmParams(params);
  }, []);

  const scrollToContact = useCallback(() => {
    const contactElement = document.getElementById('contact-cta-section');
    if (contactElement) {
      contactElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  // Opens popup with optional service pre-selection (used by buttons and auto-trigger)
  const handleOpenPopup = useCallback((service: ResearchServiceType | '' = '') => {
    setPopupPreselectedService(service);
    setIsPopupOpen(true);
  }, []);

  const handleClosePopup = useCallback(() => {
    setIsPopupOpen(false);
  }, []);

  // Automatic Lead Generation Popup Trigger:
  // After component mounts, wait exactly 1000 milliseconds and open the existing popup
  useEffect(() => {
    const timer = setTimeout(() => {
      handleOpenPopup('');
    }, 1000);

    return () => clearTimeout(timer);
  }, [handleOpenPopup]);

  // For the on-page form service selection if needed
  const handleSelectServiceForPageForm = (service: ResearchServiceType) => {
    setPreselectedService(service);
    handleOpenPopup(service);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-emerald-100 selection:text-emerald-900 pb-14 sm:pb-0">
      {/* 1. Header (CTA opens popup) */}
      <Header onOpenPopup={() => handleOpenPopup('')} />

      {/* Main Landing Sections */}
      <main className="flex-grow">
        {/* 2. Hero Section (CTA opens popup) */}
        <Hero onOpenPopup={() => handleOpenPopup('')} />

        {/* 3. Existing Lead Form Section (Maintained intact on the page) */}
        <LeadForm 
          utmParams={utmParams} 
          preselectedService={preselectedService} 
        />

        {/* 4. Services Section (5 Compact Cards - CTAs open popup with pre-selected service) */}
        <ServicesSection onSelectService={handleSelectServiceForPageForm} />

        {/* 5. Why Tru Paisa (3 Concise Points) */}
        <WhyTruPaisa />

        {/* 6. Contact CTA ("Have Questions?" -> CTA opens popup) */}
        <ContactCTA onOpenPopup={() => handleOpenPopup('')} />

        {/* 7. Regulatory / Statutory Disclosure */}
        <RegulatoryDisclosure />
      </main>

      {/* 8. Footer */}
      <Footer 
        onOpenLegalModal={setActiveLegalModal} 
        onScrollToContact={scrollToContact} 
      />

      {/* 9. Sticky Mobile CTA Button (CTA opens popup) */}
      <StickyMobileCTA onOpenPopup={() => handleOpenPopup('')} />

      {/* 10. Reusable Lead Popup Modal (Automatically triggers after ~1s on page visit and on CTA clicks) */}
      <LeadPopup 
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        preselectedService={popupPreselectedService}
        utmParams={utmParams}
      />

      {/* 11. Compliance / Legal Modal */}
      <LegalModal 
        type={activeLegalModal} 
        onClose={() => setActiveLegalModal(null)} 
      />
    </div>
  );
}
