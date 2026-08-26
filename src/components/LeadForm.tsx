import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  Send, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Award, 
  Briefcase, 
  Lock, 
  AlertCircle,
  RefreshCw,
  ShieldCheck
} from 'lucide-react';
import { 
  LeadFormData, 
  ResearchServiceType, 
  UTMParameters,
  VERIFIED_ANALYST_INFO
} from '../types';
import { trackLeadConversion } from '../utils/analytics';

interface LeadFormProps {
  utmParams: UTMParameters;
  preselectedService?: ResearchServiceType | '';
}

export default function LeadForm({ utmParams, preselectedService }: LeadFormProps) {
  const [formData, setFormData] = useState<LeadFormData>({
    fullName: '',
    mobileNumber: '',
    email: '',
    city: '',
    tradingExperience: '',
    interestedService: preselectedService || 'Equity Research',
    consentAgreed: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof LeadFormData, string>>>({});
  const [submissionError, setSubmissionError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // Update selected service if parent changes it
  useEffect(() => {
    if (preselectedService) {
      setFormData(prev => ({ ...prev, interestedService: preselectedService }));
    }
  }, [preselectedService]);

  const validateField = (name: keyof LeadFormData, value: unknown): string => {
    switch (name) {
      case 'fullName':
        if (!value || typeof value !== 'string' || value.trim().length < 2) {
          return 'Please enter your full name.';
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

      // Successful backend acceptance -> Trigger Meta Lead Conversion -> Success State
      trackLeadConversion();
      setIsSuccess(true);
    } catch (err) {
      console.error('Lead submission error:', err);
      setSubmissionError('Unable to submit your inquiry right now. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setFormData({
      fullName: '',
      mobileNumber: '',
      email: '',
      city: '',
      tradingExperience: '',
      interestedService: 'Equity Research',
      consentAgreed: false,
    });
    setErrors({});
    setIsSuccess(false);
  };

  return (
    <section id="lead-form-section" className="py-8 sm:py-12 bg-slate-50 border-b border-slate-200/80 scroll-mt-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-8 shadow-sm relative overflow-hidden">
          
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Official Research Inquiry</span>
            </div>
            <h2 
              id="lead-form-heading"
              className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mb-1.5"
            >
              Get Research Details
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
              Fill in your details and our team will contact you with information about the available research services.
            </p>
          </div>

          {/* Success State */}
          {isSuccess ? (
            <div 
              id="form-success-message"
              className="bg-slate-50 border border-emerald-200 rounded-xl p-6 sm:p-8 text-center my-2 shadow-xs"
            >
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-3.5">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1.5">
                Submission Received
              </h3>
              <p className="text-sm text-slate-700 max-w-md mx-auto mb-5 leading-relaxed">
                Thank you. Your details have been submitted successfully. Our team will contact you shortly.
              </p>

              <div className="p-3.5 bg-white border border-slate-200/80 rounded-lg max-w-md mx-auto text-left text-xs text-slate-600 mb-5 space-y-1">
                <div><span className="font-semibold text-slate-800">Name:</span> {formData.fullName}</div>
                <div><span className="font-semibold text-slate-800">Mobile:</span> +91 {formData.mobileNumber}</div>
                <div><span className="font-semibold text-slate-800">Service:</span> {formData.interestedService || 'General Inquiry'}</div>
              </div>

              <button
                type="button"
                id="submit-another-inquiry-btn"
                onClick={handleResetForm}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 active:bg-slate-100 transition-colors touch-manipulation cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Submit Another Inquiry</span>
              </button>
            </div>
          ) : (
            /* Compact Lead Form */
            <form id="lead-capture-form" onSubmit={handleSubmit} noValidate className="space-y-4">
              
              {/* Row 1: Full Name (Required) */}
              <div>
                <label 
                  htmlFor="field-fullName" 
                  className="block text-xs font-bold text-slate-800 mb-1"
                >
                  Full Name <span className="text-emerald-700">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    id="field-fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    autoComplete="name"
                    className={`w-full pl-10 pr-3.5 py-2.5 sm:py-3 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600/30 transition-colors text-slate-900 placeholder:text-slate-400 ${
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

              {/* Row 2: Mobile Number (Required) */}
              <div>
                <label 
                  htmlFor="field-mobileNumber" 
                  className="block text-xs font-bold text-slate-800 mb-1"
                >
                  Mobile Number <span className="text-emerald-700">*</span>
                </label>
                <div className="relative flex rounded-xl shadow-2xs">
                  <span className="inline-flex items-center px-3.5 rounded-l-xl border border-r-0 border-slate-300 bg-slate-100 text-slate-700 font-semibold text-sm select-none">
                    +91
                  </span>
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      id="field-mobileNumber"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleMobileInput}
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      required
                      autoComplete="tel-national"
                      inputMode="numeric"
                      className={`w-full pl-10 pr-3.5 py-2.5 sm:py-3 text-sm bg-white border rounded-r-xl focus:outline-none focus:ring-2 focus:ring-emerald-600/30 transition-colors text-slate-900 placeholder:text-slate-400 ${
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

              {/* Row 3: Interested Service (Required) */}
              <div>
                <label 
                  htmlFor="field-interestedService" 
                  className="block text-xs font-bold text-slate-800 mb-1"
                >
                  Interested Service <span className="text-emerald-700">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <select
                    id="field-interestedService"
                    name="interestedService"
                    value={formData.interestedService}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-8 py-2.5 sm:py-3 text-sm bg-white border border-slate-300 hover:border-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600/30 transition-colors text-slate-900 appearance-none cursor-pointer"
                  >
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

              {/* Row 4: Optional Fields - Trading Experience */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                {/* Trading Experience (Optional) */}
                <div>
                  <label 
                    htmlFor="field-tradingExperience" 
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Experience <span className="text-[10px] font-normal text-slate-600">(Optional)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                      <Award className="w-3.5 h-3.5" />
                    </div>
                    <select
                      id="field-tradingExperience"
                      name="tradingExperience"
                      value={formData.tradingExperience}
                      onChange={handleChange}
                      className="w-full pl-8 pr-6 py-2 text-xs bg-white border border-slate-300 hover:border-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600/30 transition-colors text-slate-900 appearance-none cursor-pointer"
                    >
                      <option value="">Select</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Less than 1 year">&lt; 1 year</option>
                      <option value="1–3 years">1–3 years</option>
                      <option value="More than 3 years">&gt; 3 years</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none text-slate-400 text-[10px]">
                      ▼
                    </div>
                  </div>
                </div>

                {/* Email (Optional) */}
                <div>
                  <label 
                    htmlFor="field-email" 
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Email <span className="text-[10px] font-normal text-slate-600">(Optional)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="email"
                      id="field-email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@email.com"
                      autoComplete="email"
                      className="w-full pl-8 pr-2.5 py-2 text-xs bg-white border border-slate-300 hover:border-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600/30 transition-colors text-slate-900 placeholder:text-slate-400"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-0.5 text-[11px] text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* City (Optional) */}
                <div>
                  <label 
                    htmlFor="field-city" 
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    City <span className="text-[10px] font-normal text-slate-600">(Optional)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="text"
                      id="field-city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Your city"
                      autoComplete="address-level2"
                      className="w-full pl-8 pr-2.5 py-2 text-xs bg-white border border-slate-300 hover:border-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600/30 transition-colors text-slate-900 placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </div>

              {/* Consent Checkbox */}
              <div className="pt-2">
                <div className="flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    id="consentAgreed"
                    name="consentAgreed"
                    checked={formData.consentAgreed}
                    onChange={handleChange}
                    required
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600 cursor-pointer shrink-0"
                  />
                  <label 
                    htmlFor="consentAgreed" 
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

              {/* Submit CTA */}
              <div className="pt-1">
                <button
                  type="submit"
                  id="lead-form-submit-btn"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl text-base font-bold text-white bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 transition-all shadow-md shadow-emerald-950/10 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed touch-manipulation cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit & Get Details</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {/* Privacy and Security Assurance */}
              <div className="flex items-center justify-center gap-1.5 text-center text-[11px] text-slate-500 pt-0.5">
                <Lock className="w-3 h-3 text-slate-400" />
                <span>Your information is kept private and confidential.</span>
              </div>
            </form>
          )}

        </div>
      </div>
    </section>
  );
}
