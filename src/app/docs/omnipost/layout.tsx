import { ReactNode } from "react";

export const metadata = {
  title: {
    template: "%s | OmniPost AI Docs",
    default: "OmniPost AI Documentation | Aman Suryavanshi"
  },
  description: "Official documentation for OmniPost AI. A revolutionary Agentic AI system using n8n & Next.js to fully automate B2B content creation at scale.",
};

export default function OmniPostLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
    </>
  );
}
