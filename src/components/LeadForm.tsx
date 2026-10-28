import React, { useState } from 'react';
import { 
  CheckCircle, 
  Send, 
  User, 
  Phone, 
  Mail, 
  Lock, 
  AlertCircle,
  RefreshCw,
  ShieldCheck
} from 'lucide-react';
import { 
  LeadFormData, 
  ResearchServiceType, 
  UTMParameters
} from '../types';
import { trackLeadConversion } from '../utils/analytics';

interface LeadFormProps {
  utmParams: UTMParameters;
  preselectedService?: ResearchServiceType | '';
}

export default function LeadForm({ utmParams, preselectedService }: LeadFormProps) {
  const [formData, setFormData] = useState<LeadFormData>({
    fullName: '',
    email: '',
    mobileNumber: '',
    consentAgreed: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof LeadFormData, string>>>({});
  const [submissionError, setSubmissionError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const validateField = (name: keyof LeadFormData, value: unknown): string => {
    switch (name) {
      case 'fullName':
        if (!value || typeof value !== 'string' || value.trim().length < 2) {
          return 'Please enter your full name.';
        }
        return '';
      case 'email':
        if (!value || typeof value !== 'string' || value.trim() === '') {
          return 'Email address is required.';
        } else {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value.trim())) {
            return 'Please enter a valid email address.';
          }
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
      case 'consentAgreed':
        if (!value) {
          return 'Please check the consent box to proceed.';
        }
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const checked = e.target.checked;

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
    const emailError = validateField('email', formData.email);
    const mobileError = validateField('mobileNumber', formData.mobileNumber);
    const consentError = validateField('consentAgreed', formData.consentAgreed);

    if (nameError || emailError || mobileError || consentError) {
      setErrors({
        fullName: nameError,
        email: emailError,
        mobileNumber: mobileError,
        consentAgreed: consentError,
      });
      return;
    }

    setIsSubmitting(true);
    setSubmissionError('');

    try {
      const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx9jj5AsS0f50Fi0VkCf3n8krt6THC75VMz34Cqq5OLkziaQ7nojY7CUF1fCefG4mHbug/exec';
      
      const submitData = new URLSearchParams();
      submitData.append("name", formData.fullName.trim());
      submitData.append("email", formData.email.trim());
      submitData.append("mobile", formData.mobileNumber.trim());
      submitData.append("service", preselectedService || "Equity Research");

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

      // Track lead conversions in Meta Pixel & GA4
      trackLeadConversion({
        submissionId: `inline_${Date.now()}`,
        formType: 'inline',
        service: preselectedService || 'Equity Research',
      });
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
      email: '',
      mobileNumber: '',
      consentAgreed: false,
    });
    setErrors({});
    setIsSuccess(false);
  };

  return (
    <section id="lead-form-section" className="py-8 sm:py-12 bg-slate-50 border-b border-slate-200/80 scroll-mt-16">
      <div className="max-w-xl mx-auto px-4 sm:px-6">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-8 shadow-sm relative overflow-hidden">
          
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Paid Research Consultation</span>
            </div>
            <h2 
              id="lead-form-heading"
              className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mb-1.5"
            >
              Enquire About Paid Research Services
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
              Please enter your details below. Our team will contact you to discuss available research services and plans.
            </p>
          </div>

          {/* Paid-Service Information Card */}
          <div className="mb-5 p-4 bg-slate-50 border border-slate-200 rounded-xl text-center shadow-2xs">
            <div className="text-xs font-bold uppercase tracking-wide text-emerald-800 mb-0.5">
              Paid Research Services
            </div>
            <div className="text-sm sm:text-base font-extrabold text-slate-900 mb-1">
              Plans starting from ₹5,999 + 18% GST
            </div>
            <div className="text-xs text-slate-600 font-medium">
              Paid research service • Not free tips • Please review plans before submitting
            </div>
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
                Thank you. Your details have been submitted successfully. Our team will contact you shortly regarding our paid research plans.
              </p>

              <div className="p-3.5 bg-white border border-slate-200/80 rounded-lg max-w-md mx-auto text-left text-xs text-slate-600 mb-5 space-y-1">
                <div><span className="font-semibold text-slate-800">Name:</span> {formData.fullName}</div>
                <div><span className="font-semibold text-slate-800">Email:</span> {formData.email}</div>
                <div><span className="font-semibold text-slate-800">Mobile:</span> +91 {formData.mobileNumber}</div>
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
            /* Lead Form - ONLY 3 FIELDS: Name, Email, Number */
            <form id="lead-capture-form" onSubmit={handleSubmit} noValidate className="space-y-4">
              
              {/* 1. Full Name */}
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

              {/* 2. Email Address */}
              <div>
                <label 
                  htmlFor="field-email" 
                  className="block text-xs font-bold text-slate-800 mb-1"
                >
                  Email Address <span className="text-emerald-700">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    id="field-email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    required
                    autoComplete="email"
                    className={`w-full pl-10 pr-3.5 py-2.5 sm:py-3 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600/30 transition-colors text-slate-900 placeholder:text-slate-400 ${
                      errors.email ? 'border-red-400 bg-red-50/20' : 'border-slate-300 hover:border-slate-400'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>

              {/* 3. Mobile Number */}
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

              {/* Paid Service Qualification Notice */}
              <div className="p-3.5 bg-amber-50/80 border border-amber-200/90 rounded-xl text-left">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950 mb-0.5">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Paid Research Services Notice</span>
                </div>
                <p className="text-xs text-amber-900 leading-relaxed">
                  Tru Paisa provides paid research advisory services starting from <strong>₹5,999 + 18% GST</strong>. We do not provide free tips, free trials, or assured returns.
                </p>
              </div>

              {/* Consent Checkbox */}
              <div className="pt-1">
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
                      <span>Request Paid Research Consultation</span>
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
