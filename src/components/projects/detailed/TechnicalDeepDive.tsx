"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Project } from "@/components/projects/projectsData";

interface TechnicalDeepDiveProps {
    project: Project;
}

export default function TechnicalDeepDive({ project }: TechnicalDeepDiveProps) {
    if (!project.detailedDescription) {
        return null;
    }

    return (
        <div className="mt-8 border-t border-forest-700/50 pt-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-lime-500">⚡</span> Technical Deep Dive
            </h3>

            <Accordion type="single" collapsible className="w-full space-y-2">
                <AccordionItem value="details" className="border border-forest-700/50 rounded-lg bg-forest-900/30 px-4">
                    <AccordionTrigger className="text-sage-100 hover:text-lime-500 hover:no-underline">
                        Project Details & Architecture
                    </AccordionTrigger>
                    <AccordionContent className="text-sage-300 leading-relaxed pt-2">
                        {project.detailedDescription}
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}
