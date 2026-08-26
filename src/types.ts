// ==========================================
// META PIXEL CONFIGURATION
// Replace this value after deploying the website.
// ==========================================
export const META_PIXEL_ID = "REPLACE_WITH_REAL_META_PIXEL_ID";

export type TradingExperience = 
  | 'Beginner'
  | 'Less than 1 year'
  | '1–3 years'
  | 'More than 3 years';

export type ResearchServiceType = 
  | 'Equity Research'
  | 'Intraday Research'
  | 'Positional Research'
  | 'Futures Research'
  | 'Options Research';

export interface LeadFormData {
  fullName: string;
  mobileNumber: string;
  email: string;
  city: string;
  tradingExperience: TradingExperience | '';
  interestedService: ResearchServiceType | '';
  consentAgreed: boolean;
}

export interface UTMParameters {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  referrer?: string;
  page_url?: string;
}

export interface ServiceDetail {
  id: ResearchServiceType;
  title: string;
  badge: string;
  description: string;
  features: string[];
  horizon: string;
}

export const VERIFIED_ANALYST_INFO = {
  brandName: 'Tru Paisa',
  analystName: 'Sanskriti Samadhiya',
  sebiRegNo: 'INH000026293',
  registrationType: 'Research Analyst',
  websiteUrl: 'https://trupaisa.com/',
  supportEmail: 'info@trupaisa.com',
  phone: '+91 99932-55505',
  phoneLink: 'tel:+919993255505',
  emailLink: 'mailto:info@trupaisa.com',
  address: '407, Satguru Parinay, AB Road, Indore, Madhya Pradesh 452001',
  officialDisclaimer: 'Investment in securities market are subject to market risks. Read all the related documents carefully before investing. Registration granted by SEBI and certification from NISM in no way guarantee performance of the intermediary or provide any assurance of returns to investors.'
};
