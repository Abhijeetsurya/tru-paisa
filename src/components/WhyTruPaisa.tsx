import { LineChart, Compass, FileCheck } from 'lucide-react';

export default function WhyTruPaisa() {
  const points = [
    {
      icon: <LineChart className="w-5 h-5 text-emerald-700" />,
      title: 'Research-Based',
      description: 'Systematic technical, fundamental, and derivatives analysis rather than speculative tips or market rumors.'
    },
    {
      icon: <Compass className="w-5 h-5 text-emerald-700" />,
      title: 'Structured',
      description: 'Clear market rationale and structured analysis for each research setup.'
    },
    {
      icon: <FileCheck className="w-5 h-5 text-emerald-700" />,
      title: 'Transparent',
      description: 'Clear service details and regulatory disclosures as a SEBI Registered Research Analyst.'
    }
  ];

  return (
    <section id="why-tru-paisa-section" className="py-10 sm:py-14 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
          <h2 
            id="why-heading"
            className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2"
          >
            Why Tru Paisa
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            A structured approach to Indian stock market research.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {points.map((point, index) => (
            <div 
              key={index}
              id={`why-point-card-${index + 1}`}
              className="p-5 rounded-xl bg-white border border-slate-200/80 flex flex-col items-start text-left hover:border-slate-300 transition-colors shadow-2xs"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-3.5 shrink-0">
                {point.icon}
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1.5">
                {point.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {point.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
