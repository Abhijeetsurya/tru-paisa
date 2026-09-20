import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  CheckCircle, 
  Send, 
  User, 
  Phone, 
  Mail, 
  Award, 
  Briefcase, 
  Lock, 
  AlertCircle,
  Shield
} from 'lucide-react';
import { 
  LeadFormData, 
  ResearchServiceType, 
  UTMParameters,
  VERIFIED_ANALYST_INFO
} from '../types';
import { trackLeadConversion } from '../utils/analytics';

interface LeadPopupProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedService?: ResearchServiceType | '';
  utmParams: UTMParameters;
}

export default function LeadPopup({
  isOpen,
  onClose,
  preselectedService = '',
  utmParams,
}: LeadPopupProps) {
  const [formData, setFormData] = useState<LeadFormData>({
    fullName: '',
    mobileNumber: '',
    email: '',
    city: '',
    tradingExperience: '',
    interestedService: preselectedService || '',
    consentAgreed: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof LeadFormData, string>>>({});
  const [submissionError, setSubmissionError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  
  const modalRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Sync preselectedService and reset states whenever popup opens
  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({
        ...prev,
        interestedService: preselectedService || prev.interestedService || '',
        consentAgreed: false,
      }));
      setErrors({});
      setIsSuccess(false);

      // Prevent background page scrolling while modal is open
      document.body.style.overflow = 'hidden';

      // Focus first input field after animation mounts
      const timer = setTimeout(() => {
        nameInputRef.current?.focus();
      }, 150);

      return () => {
        clearTimeout(timer);
        document.body.style.overflow = '';
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen, preselectedService]);

  // Handle Escape keyboard shortcut to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validateField = (name: keyof LeadFormData, value: unknown): string => {
    switch (name) {
      case 'fullName':
        if (!value || typeof value !== 'string' || value.trim().length < 2) {
          return 'Please enter your full name (minimum 2 characters).';
        }
        return '';
      case 'mobileNumber': {
        if (!value || typeof value !== 'string') {
          return 'Mobile number is required.';
        }
        const cleaned = value.replace(/\D/g, '');
        if (cleaned.length !== 10) {
          return 'Please enter a valid 10-digit mobile number.';
        }
        if (!/^[6-9]\d{9}$/.test(cleaned)) {
          return 'Please enter a valid Indian mobile number starting with 6, 7, 8, or 9.';
        }
        return '';
      }
      case 'interestedService':
        if (!value || typeof value !== 'string' || value.trim() === '') {
          return 'Please select an interested research service.';
        }
        return '';
      case 'email':
        if (value && typeof value === 'string' && value.trim() !== '') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value.trim())) {
            return 'Please enter a valid email address.';
          }
        }
        return '';
      case 'consentAgreed':
        if (!value) {
          return 'Please check the consent box to proceed.';
        }
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name as keyof LeadFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleMobileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
    setFormData(prev => ({ ...prev, mobileNumber: digitsOnly }));
    if (errors.mobileNumber) {
      setErrors(prev => ({ ...prev, mobileNumber: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nameError = validateField('fullName', formData.fullName);
    const mobileError = validateField('mobileNumber', formData.mobileNumber);
    const serviceError = validateField('interestedService', formData.interestedService);
    const emailError = validateField('email', formData.email);
    const consentError = validateField('consentAgreed', formData.consentAgreed);

    if (nameError || mobileError || serviceError || emailError || consentError) {
      setErrors({
        fullName: nameError,
        mobileNumber: mobileError,
        interestedService: serviceError,
        email: emailError,
        consentAgreed: consentError,
      });
      return;
    }

    setIsSubmitting(true);
    setSubmissionError('');

    try {
      // Send to Google Apps Script Web App with timeout protection
      const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx9jj5AsS0f50Fi0VkCf3n8krt6THC75VMz34Cqq5OLkziaQ7nojY7CUF1fCefG4mHbug/exec';
      
      const submitData = new URLSearchParams();
      submitData.append("name", formData.fullName);
      submitData.append("mobile", formData.mobileNumber);
      submitData.append("email", formData.email || "");
      submitData.append("city", formData.city || "");
      submitData.append("service", formData.interestedService);
      submitData.append("experience", formData.tradingExperience || "");

      submitData.append("utm_source", utmParams.utm_source || "");
      submitData.append("utm_medium", utmParams.utm_medium || "");
      submitData.append("utm_campaign", utmParams.utm_campaign || "");
      submitData.append("utm_content", utmParams.utm_content || "");
      submitData.append("utm_term", utmParams.utm_term || "");

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      await fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: 'POST',
        body: submitData,
        mode: 'no-cors',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Successful backend acceptance -> Trigger Meta Pixel conversion -> Success State
      trackLeadConversion();
      setIsSuccess(true);
    } catch (err) {
      console.error('Lead submission error:', err);
      setSubmissionError('Unable to submit your inquiry right now. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setErrors({});
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto motion-safe:transition-opacity duration-200"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="lead-popup-heading"
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-2xl w-[92%] sm:w-full max-w-[480px] p-5 sm:p-7 shadow-2xl border border-slate-200 relative my-auto max-h-[90vh] flex flex-col justify-between overflow-y-auto motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Clearly Visible X Close Button in Top-Right Corner */}
        <button
          type="button"
          id="lead-popup-close-btn"
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 z-10"
          aria-label="Close popup"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          /* SUCCESS STATE */
          <div 
            id="lead-popup-success" 
            className="py-6 sm:py-8 text-center"
          >
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-2">
              Thank You!
            </h3>
            <p className="text-sm sm:text-base text-slate-700 max-w-sm mx-auto mb-6 leading-relaxed">
              Your inquiry has been submitted successfully. Our team will contact you shortly.
            </p>

            <button
              type="button"
              id="lead-popup-success-close-btn"
              onClick={handleClose}
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 rounded-xl text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer min-h-[44px]"
            >
              Close
            </button>
          </div>
        ) : (
          /* FORM STATE */
          <div>
            {/* Top Brand & Regulatory Header */}
            <div className="pr-8 mb-4">
              <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-sm tracking-tight mb-1">
                <span className="text-slate-900 font-extrabold text-base">Tru Paisa</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200/80 text-slate-800 text-xs font-semibold mb-3">
                <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>SEBI Registered Research Analyst • Reg. {VERIFIED_ANALYST_INFO.sebiRegNo}</span>
              </div>

              {/* Main Heading */}
              <h2 
                id="lead-popup-heading"
                className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight"
              >
                Enquire About Paid Research Services
              </h2>
              
              {/* Supporting Text */}
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-normal">
                Plans starting from <span className="font-bold text-slate-900">₹5,999 + 18% GST</span>. Our team will contact you to discuss available paid research services and plans.
              </p>
            </div>

            {/* Popup Form */}
            <form id="lead-popup-form" onSubmit={handleSubmit} noValidate className="space-y-3.5">
              
              {/* 1. Full Name (Required) */}
              <div>
                <label 
                  htmlFor="popup-field-fullName" 
                  className="block text-xs font-bold text-slate-800 mb-1"
                >
                  Full Name <span className="text-emerald-700 font-bold">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    ref={nameInputRef}
                    type="text"
                    id="popup-field-fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    autoComplete="name"
                    className={`w-full pl-10 pr-3.5 py-2.5 text-base sm:text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600/30 transition-colors text-slate-900 placeholder:text-slate-400 min-h-[44px] ${
                      errors.fullName ? 'border-red-400 bg-red-50/20' : 'border-slate-300 hover:border-slate-400'
                    }`}
                  />
                </div>
                {errors.fullName && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.fullName}</span>
                  </p>
                )}
              </div>

              {/* 2. Mobile Number (Required - Indian 10 digits) */}
              <div>
                <label 
                  htmlFor="popup-field-mobileNumber" 
                  className="block text-xs font-bold text-slate-800 mb-1"
                >
                  Mobile Number <span className="text-emerald-700 font-bold">*</span>
                </label>
                <div className="relative flex rounded-xl shadow-2xs">
                  <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-300 bg-slate-100 text-slate-700 font-semibold text-sm select-none">
                    +91
                  </span>
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      id="popup-field-mobileNumber"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleMobileInput}
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      required
                      autoComplete="tel-national"
                      inputMode="numeric"
                      className={`w-full pl-10 pr-3.5 py-2.5 text-base sm:text-sm bg-white border rounded-r-xl focus:outline-none focus:ring-2 focus:ring-emerald-600/30 transition-colors text-slate-900 placeholder:text-slate-400 min-h-[44px] ${
                        errors.mobileNumber ? 'border-red-400 bg-red-50/20' : 'border-slate-300 hover:border-slate-400'
                      }`}
                    />
                  </div>
                </div>
                {errors.mobileNumber && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.mobileNumber}</span>
                  </p>
                )}
              </div>

              {/* 3. Interested Service (Required Dropdown) */}
              <div>
                <label 
                  htmlFor="popup-field-interestedService" 
                  className="block text-xs font-bold text-slate-800 mb-1"
                >
                  Interested Service <span className="text-emerald-700 font-bold">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <select
                    id="popup-field-interestedService"
                    name="interestedService"
                    value={formData.interestedService}
                    onChange={handleChange}
                    required
                    className={`w-full pl-10 pr-8 py-2.5 text-base sm:text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600/30 transition-colors text-slate-900 appearance-none cursor-pointer min-h-[44px] ${
                      errors.interestedService ? 'border-red-400 bg-red-50/20' : 'border-slate-300 hover:border-slate-400'
                    }`}
                  >
                    <option value="">Select a service</option>
                    <option value="Equity Research">Equity Research</option>
                    <option value="Intraday Research">Intraday Research</option>
                    <option value="Positional Research">Positional Research</option>
                    <option value="Futures Research">Futures Research</option>
                    <option value="Options Research">Options Research</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400 text-xs">
                    ▼
                  </div>
                </div>
                {errors.interestedService && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.interestedService}</span>
                  </p>
                )}
              </div>

              {/* 4 & 5: Optional Trading Experience & Email Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-0.5">
                {/* 4. Trading Experience (Optional) */}
                <div>
                  <label 
                    htmlFor="popup-field-tradingExperience" 
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Trading Experience <span className="text-[10px] font-normal text-slate-500">(Optional)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Award className="w-3.5 h-3.5" />
                    </div>
                    <select
                      id="popup-field-tradingExperience"
                      name="tradingExperience"
                      value={formData.tradingExperience}
                      onChange={handleChange}
                      className="w-full pl-9 pr-7 py-2 text-base sm:text-xs bg-white border border-slate-300 hover:border-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600/30 transition-colors text-slate-900 appearance-none cursor-pointer min-h-[40px]"
                    >
                      <option value="">Select your experience</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Less than 1 year">Less than 1 year</option>
                      <option value="1–3 years">1–3 years</option>
                      <option value="More than 3 years">More than 3 years</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 text-[10px]">
                      ▼
                    </div>
                  </div>
                </div>

                {/* 5. Email Address (Optional) */}
                <div>
                  <label 
                    htmlFor="popup-field-email" 
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Email Address <span className="text-[10px] font-normal text-slate-500">(Optional)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="email"
                      id="popup-field-email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@example.com"
                      autoComplete="email"
                      className="w-full pl-9 pr-3 py-2 text-base sm:text-xs bg-white border border-slate-300 hover:border-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600/30 transition-colors text-slate-900 placeholder:text-slate-400 min-h-[40px]"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-0.5 text-[11px] text-red-600">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* Consent Checkbox */}
              <div className="pt-1.5">
                <div className="flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    id="popup-consentAgreed"
                    name="consentAgreed"
                    checked={formData.consentAgreed}
                    onChange={handleChange}
                    required
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600 cursor-pointer shrink-0"
                  />
                  <label 
                    htmlFor="popup-consentAgreed" 
                    className="text-xs text-slate-700 leading-normal select-none cursor-pointer"
                  >
                    I consent to Tru Paisa / Sanskriti Samadhiya, SEBI Registered Research Analyst (INH000026293), contacting me by call, SMS or WhatsApp regarding research service information. <span className="text-emerald-700 font-bold">*</span>
                  </label>
                </div>
                {errors.consentAgreed && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.consentAgreed}</span>
                  </p>
                )}
              </div>

              {submissionError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{submissionError}</span>
                </div>
              )}

              {/* Large Primary CTA Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  id="lead-popup-submit-btn"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl text-base font-bold text-white bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 transition-all shadow-md shadow-emerald-950/10 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed touch-manipulation cursor-pointer min-h-[48px]"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span>Request Paid Research Consultation</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {/* Privacy Footer */}
              <div className="flex items-center justify-center gap-1 text-center text-[10px] text-slate-400 pt-0.5">
                <Lock className="w-3 h-3 text-slate-400" />
                <span>Your information is kept confidential.</span>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
