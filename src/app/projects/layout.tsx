import { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://amansuryavanshi.me";

export const metadata: Metadata = {
    title: "Projects | Aman Suryavanshi",
    description: "Explore my portfolio of AI automation projects, Next.js web apps, and system architectures. Case studies on generating revenue and reducing manual work.",
    alternates: {
        canonical: `${SITE_URL}/projects`,
    },
    openGraph: {
        title: "Projects | Aman Suryavanshi",
        description: "Explore my portfolio of AI automation projects, Next.js web apps, and system architectures.",
        url: `${SITE_URL}/projects`,
    },
};

export default function ProjectsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
