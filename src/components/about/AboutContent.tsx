import { Sparkles, Workflow, TrendingUp, MousePointerClick } from 'lucide-react';
const AboutContent = () => {
  return (
    <div className="prose prose-forest max-w-none">
      <section itemScope itemType="http://schema.org/Person" className="flex flex-col gap-2.5">
        <h2 className="text-lg font-semibold text-forest-900 mb-0" itemProp="jobTitle">
          From Building Code to Orchestrating Intelligence
        </h2>

        <div className="flex items-start gap-3">
          <Sparkles className="w-6 h-6 mt-1 flex-shrink-0 text-lime-500" aria-hidden="true" />
          <p className="text-forest-700 leading-normal max-w-2xl">
            Most developers write code. I design systems that write themselves. After building multiple applications, I discovered solutions aren&apos;t coded from scratch-they&apos;re intelligently orchestrated. That&apos;s when I became a <span itemProp="jobTitle">Solutions Architect specializing in AI automation</span>.
          </p>
        </div>

        <div className="flex items-start gap-3">
          <Workflow className="w-6 h-6 mt-1 flex-shrink-0 text-lime-500" aria-hidden="true" />
          <p className="text-forest-700 leading-normal max-w-2xl">
            Take my Aviators Training Centre project: I orchestrated <span itemProp="knowsAbout">N8N workflows</span>, <span itemProp="knowsAbout">AI responses</span>, <span itemProp="knowsAbout">Firebase</span>, and <span itemProp="knowsAbout">Next.js</span>. <strong className="text-forest-900" itemProp="award">Result: ₹300K revenue, 50+ organic leads, 80% less manual work.</strong>
          </p>
        </div>

        <div className="flex items-start gap-3">
          <TrendingUp className="w-6 h-6 mt-1 flex-shrink-0 text-lime-500" aria-hidden="true" />
          <p className="text-forest-700 leading-normal max-w-2xl">
            I eliminate features through automation, command AI to execute faster, and architect systems that grow value after deployment. <strong className="text-forest-900">Orchestration &gt; Execution. Strategy &gt; Syntax.</strong>
          </p>
        </div>

        <div className="flex items-start gap-3 mt-1">
          <MousePointerClick className="w-5 h-5 mt-1 flex-shrink-0 text-lime-500" aria-hidden="true" />
          <p className="text-forest-700/80 leading-normal italic text-sm max-w-2xl">
            Click on &apos;Personal Info&apos; or &apos;Qualifications&apos; to explore my background &amp; expertise
          </p>
        </div>

        {/* Enhanced SEO Schema.org markup */}
        <meta itemProp="name" content="Aman Suryavanshi" />
        <meta itemProp="alternateName" content="Aman - Solutions Architect" />
        <meta itemProp="description" content="Solutions Architect and Automation Consultant specializing in AI-powered workflow orchestration, business process automation, and intelligent system integration. Delivering measurable ROI through strategic automation architecture." />
        <meta itemProp="knowsAbout" content="AI Automation" />
        <meta itemProp="knowsAbout" content="Workflow Orchestration" />
        <meta itemProp="knowsAbout" content="N8N Automation" />
        <meta itemProp="knowsAbout" content="Next.js Development" />
        <meta itemProp="knowsAbout" content="Firebase Integration" />
        <meta itemProp="knowsAbout" content="Business Process Automation" />
        <meta itemProp="knowsAbout" content="System Architecture" />
        <meta itemProp="knowsAbout" content="RAG Systems" />
        <link itemProp="additionalType" href="http://schema.org/EngineeringProfessional" />
        <link itemProp="sameAs" href="https://github.com/amansuryavanshi" />
        <link itemProp="sameAs" href="https://linkedin.com/in/amansuryavanshi" />
      </section>
    </div>
  );
};

export default AboutContent;
