import { Sparkles, Workflow, TrendingUp, MousePointerClick, CheckCircle2, ArrowRight, Quote } from 'lucide-react';
import { portfolioData } from '@/data/portfolio';
import Link from 'next/link';

const AboutContent = () => {
  const { title, intro, journey, philosophy, differentiators, cta, keywords } = portfolioData.about;

  // Parse journey data
  const journeySteps = journey[0].split('→').map(s => s.trim());
  const experienceText = journey[1];

  return (
    <div className="w-full">
      <section itemScope itemType="http://schema.org/Person" className="flex flex-col gap-4">

        {/* Header Card with Philosophy */}
        <div className="bg-white/50 border border-sage-100 rounded-2xl p-5 shadow-sm">
          <h2 className="text-lg font-bold text-forest-900 mb-3 leading-tight" itemProp="jobTitle">
            {title}
          </h2>
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 mt-0.5 flex-shrink-0 text-lime-500" aria-hidden="true" />
              <p className="text-forest-700 text-sm leading-relaxed">
                {intro}
              </p>
            </div>

            <div className="flex items-start gap-3 pt-2 border-t border-sage-100/50">
              <Quote className="w-5 h-5 mt-0.5 flex-shrink-0 text-lime-500" aria-hidden="true" />
              <p className="text-forest-700 text-sm leading-relaxed italic">
                "{philosophy}"
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Journey Card */}
          <div className="bg-white/50 border border-sage-100 rounded-2xl p-5 shadow-sm flex flex-col gap-3 h-full">
            <div className="flex items-center gap-2 mb-1">
              <Workflow className="w-4 h-4 text-lime-600" aria-hidden="true" />
              <h3 className="font-semibold text-forest-900 text-xs uppercase tracking-wide">My Journey</h3>
            </div>

            <div className="flex flex-col gap-2 text-xs text-forest-700 flex-grow">
              {journeySteps.map((step, index) => (
                <div key={index} className="flex items-start gap-2 relative">
                  <div className="flex flex-col items-center mt-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-lime-500 flex-shrink-0" />
                    {index < journeySteps.length - 1 && (
                      <div className="w-0.5 h-full bg-sage-200 absolute top-2 left-[2.5px] -z-10 min-h-[16px]" />
                    )}
                  </div>
                  <span className="leading-tight pb-1">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Why Me Card */}
          <div className="bg-white/50 border border-sage-100 rounded-2xl p-5 shadow-sm flex flex-col gap-3 h-full">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-4 h-4 text-lime-600" aria-hidden="true" />
              <h3 className="font-semibold text-forest-900 text-xs uppercase tracking-wide">Why Work With Me?</h3>
            </div>
            <div className="grid grid-cols-1 gap-2 flex-grow">
              {differentiators.map((item, index) => (
                <div key={index} className="text-forest-700 text-xs flex items-start gap-2">
                  <span className="text-lime-600 mt-0.5">✓</span>
                  <span className="leading-tight">{item.replace('✅ ', '')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Experience Text at Bottom - Removed as per request */}
        {/* {experienceText && (
          <div className="text-[10px] text-forest-600 bg-sage-50 p-3 rounded-xl border border-sage-100 italic text-center">
            {experienceText}
          </div>
        )} */}

        {/* CTA - Removed as per request */}
        {/* <div className="flex items-center justify-center gap-2 pt-1">
          <MousePointerClick className="w-4 h-4 text-lime-600 animate-bounce" aria-hidden="true" />
          <p className="text-forest-900 font-medium text-sm">
            {cta}
            <Link href="/#projects" className="text-lime-600 hover:text-lime-700 hover:underline font-normal ml-2 transition-colors">
              (Check out my projects below)
            </Link>
          </p>
        </div> */}

        {/* Enhanced SEO Schema.org markup */}
        <meta itemProp="name" content="Aman Suryavanshi" />
        <meta itemProp="alternateName" content="Aman - AI Solutions Architect" />
        <meta itemProp="description" content={intro} />
        {keywords.map((keyword, index) => (
          <meta key={index} itemProp="knowsAbout" content={keyword} />
        ))}
        <link itemProp="additionalType" href="http://schema.org/EngineeringProfessional" />
        <link itemProp="sameAs" href="https://github.com/AmanSuryavanshi-1" />
        <link itemProp="sameAs" href="https://www.linkedin.com/in/amansuryavanshi-ai/" />
      </section>
    </div>
  );
};

export default AboutContent;
