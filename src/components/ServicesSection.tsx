import { useState } from 'react';
import { 
  TrendingUp, 
  ArrowRight, 
  ShieldCheck,
  Coins,
  LineChart
} from 'lucide-react';
import { ResearchServiceType } from '../types';

interface ServicesSectionProps {
  onSelectService: (service: ResearchServiceType) => void;
}

interface ServiceItem {
  title: string;
  price: string;
  category: 'Equity' | 'Commodity';
  description: string;
  mappingService: ResearchServiceType;
}

const ALL_SERVICES: ServiceItem[] = [
  // Equity
  {
    title: 'Stock Cash',
    price: '₹5,999 + 18% GST',
    category: 'Equity',
    description: 'Cash segment fundamental & technical research reports for NSE/BSE listed equities.',
    mappingService: 'Equity Research'
  },
  {
    title: 'Cash Positional',
    price: '₹7,999 + 18% GST',
    category: 'Equity',
    description: 'Multi-day holding insights and breakout setups across quality equities.',
    mappingService: 'Positional Research'
  },
  {
    title: 'Stock Future',
    price: '₹8,999 + 18% GST',
    category: 'Equity',
    description: 'Derivative market research, volume tracking, and stock futures analysis.',
    mappingService: 'Futures Research'
  },
  {
    title: 'Future STBT/BTST',
    price: '₹8,999 + 18% GST',
    category: 'Equity',
    description: 'Short-term overnight positional strategies for stock futures.',
    mappingService: 'Futures Research'
  },
  {
    title: 'Stock Option',
    price: '₹9,999 + 18% GST',
    category: 'Equity',
    description: 'Stock option strategies with predefined risk-reward ratios and strike analysis.',
    mappingService: 'Options Research'
  },
  {
    title: 'Option BTST',
    price: '₹9,999 + 18% GST',
    category: 'Equity',
    description: 'Overnight tactical option research calls for momentum moves.',
    mappingService: 'Options Research'
  },
  {
    title: 'Index Future',
    price: '₹11,999 + 18% GST',
    category: 'Equity',
    description: 'Nifty and Bank Nifty futures analysis and key directional levels.',
    mappingService: 'Futures Research'
  },
  {
    title: 'Index Option',
    price: '₹12,999 + 18% GST',
    category: 'Equity',
    description: 'Index options structured setups (Nifty / BankNifty) with volatility assessment.',
    mappingService: 'Options Research'
  },
  {
    title: 'Equity Combo Standard',
    price: '₹14,999 + 18% GST',
    category: 'Equity',
    description: 'Comprehensive multi-segment research package across Cash and Derivatives.',
    mappingService: 'Equity Research'
  },
  {
    title: 'Positional Combo',
    price: '₹16,999 + 18% GST',
    category: 'Equity',
    description: 'Extended horizon positional research across high-conviction stocks and indices.',
    mappingService: 'Positional Research'
  },

  // Commodity
  {
    title: 'Index Option + Stock Option + Index Future',
    price: '₹12,999 + 18% GST',
    category: 'Commodity',
    description: 'Integrated derivative research across major commodity contracts.',
    mappingService: 'Options Research'
  },
  {
    title: 'Base Metals',
    price: '₹7,999 + 18% GST',
    category: 'Commodity',
    description: 'Copper, Zinc, Aluminium and Nickel MCX research and trend reports.',
    mappingService: 'Futures Research'
  },
  {
    title: 'Bullions',
    price: '₹8,999 + 18% GST',
    category: 'Commodity',
    description: 'Gold and Silver MCX structured analysis and global market drivers.',
    mappingService: 'Positional Research'
  },
  {
    title: 'Energy',
    price: '₹7,999 + 18% GST',
    category: 'Commodity',
    description: 'Crude Oil and Natural Gas technical setups and inventory impact analysis.',
    mappingService: 'Futures Research'
  }
];

export default function ServicesSection({ onSelectService }: ServicesSectionProps) {
  const [activeTab, setActiveTab] = useState<'Equity' | 'Commodity'>('Equity');

  const filteredServices = ALL_SERVICES.filter(s => s.category === activeTab);

  return (
    <section id="services-section" className="py-10 sm:py-16 bg-white border-b border-slate-200/80 scroll-mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Transparent Pricing & Plans</span>
          </div>
          <h2 
            id="services-heading"
            className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2"
          >
            Paid Research Services & Plans
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Explore our available research services and plans. Pricing is displayed transparently below.
          </p>
        </div>

        {/* Equity / Commodity Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1.5 bg-slate-100 border border-slate-200 rounded-xl">
            <button
              type="button"
              id="tab-equity-btn"
              onClick={() => setActiveTab('Equity')}
              className={`flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'Equity'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <LineChart className="w-4 h-4" />
              <span>Equity Market Services ({ALL_SERVICES.filter(s => s.category === 'Equity').length})</span>
            </button>
            <button
              type="button"
              id="tab-commodity-btn"
              onClick={() => setActiveTab('Commodity')}
              className={`flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'Commodity'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Coins className="w-4 h-4" />
              <span>Commodity Services ({ALL_SERVICES.filter(s => s.category === 'Commodity').length})</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredServices.map((service, index) => (
            <div
              key={service.title}
              id={`service-card-${index + 1}`}
              className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 sm:p-6 hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100/80 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-4 h-4 text-emerald-700" />
                  </div>
                  <span className="inline-flex px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-emerald-900">
                    {service.category}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5">
                  {service.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {service.description}
                </p>
              </div>

              <div>
                <div className="pt-3 pb-3.5 border-t border-slate-200/80 mb-3 flex items-baseline justify-between">
                  <span className="text-xs font-semibold text-slate-500">Plan Price:</span>
                  <span className="text-base sm:text-lg font-extrabold text-emerald-800">
                    {service.price}
                  </span>
                </div>

                <button
                  type="button"
                  id={`select-service-btn-${index + 1}`}
                  onClick={() => onSelectService(service.mappingService)}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-bold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 transition-colors shadow-2xs cursor-pointer"
                >
                  <span>Enquire About Plan</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-700" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
