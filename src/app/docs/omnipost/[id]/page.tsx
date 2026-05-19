import { notFound } from "next/navigation";
import { getOmniPostDoc, omniPostDocs, generateArticleJsonLd } from "@/lib/omnipost-docs";
import { Metadata } from "next";
import DocPageClient from "@/components/docs/DocPageClient";
import { portfolioData } from "@/data/portfolio";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return omniPostDocs.map((doc) => ({
    id: doc.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const docData = getOmniPostDoc(resolvedParams.id);
  
  if (!docData) {
    return {
      title: "Document Not Found",
    };
  }

  const { meta } = docData;

  return {
    title: meta.title,
    description: meta.seoDescription,
    openGraph: {
      title: meta.title,
      description: meta.seoDescription,
      type: "article",
      authors: ["Aman Suryavanshi"],
    },
  };
}

export default async function OmniPostDocPage({ params }: PageProps) {
  const resolvedParams = await params;
  const docData = getOmniPostDoc(resolvedParams.id);

  if (!docData) {
    notFound();
  }

  const { content, meta } = docData;
  const jsonLd = generateArticleJsonLd(meta);

  // We need the project object to pass to DocPageClient
  const project = portfolioData.projects.find(p => p.id === 'n8n-automation-suite');
  
  if (!project) {
     return <div>Project not found</div>;
  }

  // Remove non-serializable properties if any
  const { technologies, ...serializableProject } = project;

  // Let's also overwrite the title/tagline of the project just for this view so it matches the specific document
  const displayProject = {
      ...serializableProject,
      title: meta.title,
      tagLine: meta.seoDescription
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DocPageClient 
          project={displayProject as any} 
          content={content} 
          slug={meta.id} 
          multiDocs={omniPostDocs} 
          currentDocId={meta.id} 
      />
    </>
  );
}
