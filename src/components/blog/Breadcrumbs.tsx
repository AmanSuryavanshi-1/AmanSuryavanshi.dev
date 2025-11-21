'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbsProps {
    items: {
        label: string;
        href?: string;
    }[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
    return (
        <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
                <li>
                    <Link href="/" className="text-forest-400 hover:text-lime-500 transition-colors">
                        <Home size={16} />
                        <span className="sr-only">Home</span>
                    </Link>
                </li>

                {items.map((item, index) => (
                    <li key={index} className="flex items-center">
                        <ChevronRight size={14} className="text-forest-300 mx-1" />
                        {item.href ? (
                            <Link
                                href={item.href}
                                className="text-sm font-medium text-forest-500 hover:text-lime-600 transition-colors"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span className="text-sm font-medium text-forest-800 line-clamp-1 max-w-[200px] sm:max-w-xs">
                                {item.label}
                            </span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
