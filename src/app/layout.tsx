import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Aman Suryavanshi | Web Developer Portfolio",
  description:
    "Discover the portfolio and blog of Aman Suryavanshi, showcasing web development projects, technical blogs on JavaScript, React, Next.js, and available freelance services.",
  keywords: [
    "Aman Suryavanshi",
    "web developer",
    "freelance web developer",
    "JavaScript developer",
    "React developer",
    "Next.js portfolio",
    "frontend developer",
    "web development blog",
  ],
  openGraph: {
    title: "Aman Suryavanshi | Web Developer Portfolio",
    description:
      "Explore Aman Suryavanshi's portfolio and blog featuring web development projects, tutorials, and freelance services. Open to freelance and job opportunities.",
    url: "https://AmanSuryavanshi.dev",
    images: [
      {
        url: "/public/Images/AS main.png", 
        width: 1200,
        height: 630,
        alt: "Aman Suryavanshi Portfolio Preview",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aman Suryavanshi | Web Developer Portfolio",
    description:
      "Discover Aman Suryavanshi's web development projects and blog insights. Available for freelance opportunities and job offers.",
    images: ["/public/Images/profile-pic.png"], // Replace with your preview image
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* JSON-LD for schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Aman Suryavanshi",
              "url": "https://AmanSuryavanshi.dev",
              "jobTitle": "Web Developer",
              "description":
                "Portfolio and blog of Aman Suryavanshi, showcasing web development projects, blog articles, and available freelance services.",
              "sameAs": [
                "https://github.com/AmanSuryavanshi-1",
                "https://www.linkedin.com/in/amansuryavanshi/"
              ],
            }),
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
