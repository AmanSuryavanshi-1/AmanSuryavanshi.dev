import { NextRequest, NextResponse } from 'next/server';
import { portfolioData } from '@/data/portfolio';

// Valid section names for query parameter
type SectionName = 'core' | 'skills' | 'experience' | 'services' | 'about' | 'projects';

// CORS headers for external access (n8n, automation tools)
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle OPTIONS preflight request for CORS
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: corsHeaders,
    });
}

/**
 * GET /api/portfolio
 * 
 * Query Parameters:
 * - sections (comma-separated): core, skills, experience, services, about, projects
 * - projects (comma-separated project IDs): For specific project details
 * 
 * Default (no params): Returns only core identity for minimal token usage
 * 
 * Examples:
 * - GET /api/portfolio → { core: { name, role, tagline, socials } }
 * - GET /api/portfolio?sections=skills,experience → { core: {...}, skills: [...], experience: [...] }
 * - GET /api/portfolio?projects=aviators-training-centre,omni-post-ai → { core: {...}, projects: [...] }
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        // Parse query parameters
        const sectionsParam = searchParams.get('sections');
        const projectsParam = searchParams.get('projects');

        const requestedSections: SectionName[] = sectionsParam
            ? (sectionsParam.split(',').map(s => s.trim().toLowerCase()) as SectionName[])
            : [];

        const requestedProjectIds: string[] = projectsParam
            ? projectsParam.split(',').map(p => p.trim())
            : [];

        // Build response object
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response: Record<string, any> = {};

        // Always include core identity (minimal footprint for token efficiency)
        response.core = {
            name: portfolioData.hero.name,
            role: portfolioData.hero.subtitle,
            tagline: portfolioData.hero.tagline,
            socials: {
                email: portfolioData.about.personalInfo.email,
                phone: portfolioData.about.personalInfo.phone,
                resume: portfolioData.hero.buttons.secondary.href,
                portfolio: portfolioData.hero.buttons.primary.href,
            },
        };

        // Include requested sections
        if (requestedSections.includes('skills')) {
            response.skills = {
                mainTitle: portfolioData.skills.mainTitle,
                subTitle: portfolioData.skills.subTitle,
                coreSpecialty: {
                    title: portfolioData.skills.coreSpecialty.title,
                    description: portfolioData.skills.coreSpecialty.description,
                    skills: portfolioData.skills.coreSpecialty.skills.map(s => ({
                        name: s.name,
                        details: s.details,
                    })),
                    impact: portfolioData.skills.coreSpecialty.impact,
                },
                categories: portfolioData.skills.categories.map(cat => ({
                    id: cat.id,
                    title: cat.title,
                    description: cat.description,
                    groups: cat.groups.map(g => ({
                        title: g.title,
                        items: g.items.map(item => ({
                            label: item.label,
                            value: item.value,
                        })),
                    })),
                })),
                proficiencySummary: portfolioData.skills.proficiencySummary,
                currentlyLearning: portfolioData.skills.currentlyLearning,
            };
        }

        if (requestedSections.includes('experience')) {
            response.experience = portfolioData.experience.map(exp => ({
                role: exp.role,
                type: exp.type,
                period: exp.period,
                duration: exp.duration,
                achievements: exp.achievements,
                keyProjects: exp.keyProjects.map(p => ({
                    title: p.title,
                    url: p.url,
                })),
            }));
        }

        if (requestedSections.includes('services')) {
            response.services = portfolioData.services.map(service => ({
                id: service.id,
                title: service.title,
                subtitle: service.subtitle,
                problem: service.problem,
                solution: service.solution,
                outcomes: service.outcomes,
                tech: service.tech,
                idealClient: service.idealClient,
                relatedProjects: service.relatedProjects?.map(p => ({
                    title: p.title,
                    url: p.url,
                })),
            }));
        }

        if (requestedSections.includes('about')) {
            response.about = {
                title: portfolioData.about.title,
                intro: portfolioData.about.intro,
                journey: portfolioData.about.journey,
                philosophy: portfolioData.about.philosophy,
                differentiators: portfolioData.about.differentiators,
                personalInfo: {
                    name: portfolioData.about.personalInfo.name,
                    title: portfolioData.about.personalInfo.title,
                    description: portfolioData.about.personalInfo.description,
                    email: portfolioData.about.personalInfo.email,
                    phone: portfolioData.about.personalInfo.phone,
                    education: portfolioData.about.personalInfo.education,
                    address: portfolioData.about.personalInfo.address,
                    languages: portfolioData.about.personalInfo.languages,
                },
                qualifications: portfolioData.about.qualificationsData.qualifications,
            };
        }

        // Handle projects
        if (requestedProjectIds.length > 0) {
            // Specific project IDs requested → return full project details
            const fullProjects = portfolioData.projects
                .filter(p => requestedProjectIds.includes(p.id))
                .map(p => ({
                    id: p.id,
                    title: p.title,
                    tagLine: p.tagLine,
                    category: p.category,
                    type: p.type,
                    shortDescription: p.shortDescription,
                    description: p.detailedDescription,
                    challenge: p.challenge,
                    solution: p.solution,
                    impact: p.impact,
                    technicalOverview: p.technicalOverview,
                    techStack: p.techStack,
                    badges: p.badges,
                    imageUrl: p.imageUrl,
                    liveUrl: p.liveUrl,
                    codeUrl: p.codeUrl,
                    blogUrl: p.blogUrl,
                    featured: p.featured,
                    metrics: p.metrics,
                    documentation: p.documentation,
                    gallery: p.gallery,
                }));

            response.projects = fullProjects;
        } else if (requestedSections.includes('projects')) {
            // sections=projects but no specific IDs → return summaries only
            response.projects = portfolioData.projects.map(p => ({
                id: p.id,
                title: p.title,
                shortDescription: p.shortDescription,
                techStack: p.techStack.slice(0, 5), // Top 5 technologies
                featured: p.featured,
                liveUrl: p.liveUrl,
            }));
        }

        return NextResponse.json(response, {
            status: 200,
            headers: corsHeaders,
        });

    } catch (error) {
        console.error('Portfolio API Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch portfolio data' },
            { status: 500, headers: corsHeaders }
        );
    }
}
