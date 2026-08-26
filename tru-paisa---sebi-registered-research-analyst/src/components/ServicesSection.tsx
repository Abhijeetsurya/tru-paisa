import { 
  TrendingUp, 
  Clock, 
  BarChart3, 
  Layers, 
  PieChart, 
  ArrowRight
} from 'lucide-react';
import { ResearchServiceType } from '../types';

interface ServicesSectionProps {
  onSelectService: (service: ResearchServiceType) => void;
}

interface CompactServiceItem {
  id: ResearchServiceType;
  title: string;
  description: string;
}

const COMPACT_SERVICES: CompactServiceItem[] = [
  {
    id: 'Equity Research',
    title: 'Equity Research',
    description: 'Fundamental and technical evaluations for listed equities on the NSE/BSE.'
  },
  {
    id: 'Intraday Research',
    title: 'Intraday Research',
    description: 'Momentum, key levels, and technical setups for same-day market sessions.'
  },
  {
    id: 'Positional Research',
    title: 'Positional Research',
    description: 'Multi-day and multi-week technical chart breakouts and sector trend analysis.'
  },
  {
    id: 'Futures Research',
    title: 'Futures Research',
    description: 'Open Interest (OI) buildup, volume trends, and index/stock futures analysis.'
  },
  {
    id: 'Options Research',
    title: 'Options Research',
    description: 'Structured option strategies, strike analysis, and risk-defined market frameworks.'
  }
];

export default function ServicesSection({ onSelectService }: ServicesSectionProps) {
  const getServiceIcon = (id: ResearchServiceType) => {
    switch (id) {
      case 'Equity Research':
        return <TrendingUp className="w-4 h-4 text-emerald-700" />;
      case 'Intraday Research':
        return <Clock className="w-4 h-4 text-emerald-700" />;
      case 'Positional Research':
        return <BarChart3 className="w-4 h-4 text-emerald-700" />;
      case 'Futures Research':
        return <Layers className="w-4 h-4 text-emerald-700" />;
      case 'Options Research':
        return <PieChart className="w-4 h-4 text-emerald-700" />;
      default:
        return <BarChart3 className="w-4 h-4 text-emerald-700" />;
    }
  };

  return (
    <section id="services-section" className="py-10 sm:py-14 bg-white border-b border-slate-200/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section Heading */}
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
          <h2 
            id="services-heading"
            className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2"
          >
            Our Research Services
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Structured market analysis across segments from a SEBI Registered Research Analyst.
          </p>
        </div>

        {/* 5 Compact Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {COMPACT_SERVICES.map((service, index) => (
            <div
              key={service.id}
              id={`service-card-${index + 1}`}
              className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 sm:p-5 hover:border-slate-300 hover:bg-slate-50/90 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100/80 flex items-center justify-center shrink-0">
                    {getServiceIcon(service.id)}
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    {service.title}
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  {service.description}
                </p>
              </div>

              <button
                type="button"
                id={`select-service-btn-${index + 1}`}
                onClick={() => onSelectService(service.id)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:text-emerald-950 transition-colors pt-2 border-t border-slate-200/60 cursor-pointer"
              >
                <span>Request {service.title} Details</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
