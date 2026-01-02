import type { Config } from "tailwindcss";

const config: Config = {
	darkMode: ["class"],
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			// ══════════════════════════════════════════════════════════════════════════
			// DESIGN TOKEN ARCHITECTURE - Senior Design Engineer Standard
			// ══════════════════════════════════════════════════════════════════════════

			colors: {
				// ─────────────────────────────────────────────────────────────────────
				// CORE BRAND PALETTE
				// ─────────────────────────────────────────────────────────────────────
				forest: {
					950: '#0a1f15',  // Deep Forest (Dark Mode Base)
					900: '#12372A',  // Primary Brand Dark
					800: '#1E4435',
					700: '#2A5741',
					600: '#375F4B',
					500: '#436850',
					400: '#5C8B6C',
					300: '#78A689',
					200: '#98C0A8',
					100: '#BAD9C8',
					50: '#E3F0E9',
				},
				sage: {
					300: '#ADBC9F',
					200: '#C4D4B6',
					100: '#FBFADA',
					50: '#D3E6BB',   // NEW: Primary Background (Light Mode)
				},
				lime: {
					600: '#85B85A',
					500: '#9DCF6F',  // Primary Accent
					400: '#B1DB8A',
					700: '#749A48',  // Secondary Accent / Hover
				},

				// ─────────────────────────────────────────────────────────────────────
				// SEMANTIC SURFACE TOKENS (Layered Surface System)
				// ─────────────────────────────────────────────────────────────────────
				surface: {
					// Light Mode Surfaces
					base: '#D3E6BB',             // Primary background
					elevated: '#E4F0D4',         // Slightly elevated surfaces
					overlay: 'rgba(255,255,255,0.6)', // Cards, modals
					glass: 'rgba(255,255,255,0.2)',   // Glass morphism

					// Dark Mode Surfaces (prefixed with 'dark-')
					'dark-base': '#0a1f15',      // Primary background
					'dark-elevated': '#122a1e',  // Slightly elevated
					'dark-overlay': 'rgba(18,55,42,0.8)', // Cards
					'dark-glass': 'rgba(18,55,42,0.4)',   // Glass morphism
				},

				// ─────────────────────────────────────────────────────────────────────
				// SEMANTIC TEXT TOKENS
				// ─────────────────────────────────────────────────────────────────────
				text: {
					// Light Mode
					primary: '#12372A',       // forest-900 (Headlines, primary)
					secondary: '#436850',     // forest-500 (Body text)
					muted: '#5C8B6C',         // forest-400 (Captions, hints)
					accent: '#749A48',        // lime-700 (Links, highlights)

					// Dark Mode (inverted brand loop)
					'dark-primary': '#D3E6BB',    // sage-50 becomes primary text
					'dark-secondary': '#ADBC9F',  // sage-300
					'dark-muted': '#78A689',      // forest-300
					'dark-accent': '#9DCF6F',     // lime-500
				},

				// ─────────────────────────────────────────────────────────────────────
				// BUTTON DNA TOKENS
				// ─────────────────────────────────────────────────────────────────────
				btn: {
					// Primary Button (Solid)
					'primary-bg': '#12372A',         // forest-900
					'primary-bg-hover': '#2A5741',   // forest-700
					'primary-text': '#FBFADA',       // sage-100

					// Secondary Button (Outline)
					'secondary-border': '#749A48',   // lime-700
					'secondary-text': '#12372A',     // forest-900
					'secondary-hover-bg': '#9DCF6F', // lime-500
					'secondary-hover-text': '#12372A',

					// Ghost Button
					'ghost-text': '#436850',         // forest-500
					'ghost-hover-bg': 'rgba(157,207,111,0.15)', // lime-500/15
					'ghost-hover-text': '#749A48',   // lime-700

					// Dark Mode Primary
					'dark-primary-bg': '#9DCF6F',    // lime-500
					'dark-primary-text': '#0a1f15', // forest-950
					'dark-primary-hover-bg': '#B1DB8A', // lime-400
				},

				// ─────────────────────────────────────────────────────────────────────
				// SHADCN UI TOKENS (CSS Variable Based)
				// ─────────────────────────────────────────────────────────────────────
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				}
			},

			// ─────────────────────────────────────────────────────────────────────
			// FLUID SPACING SCALE
			// Based on 8px grid with fluid responsive scaling
			// ─────────────────────────────────────────────────────────────────────
			spacing: {
				'section': 'clamp(3rem, 5vw, 4rem)',      // Section padding (48-64px)
				'section-lg': 'clamp(4rem, 8vw, 6rem)',  // Large section padding (64-96px)
				'content-gap': 'clamp(2rem, 4vw, 3rem)', // Gap between content blocks
				'card-padding': 'clamp(1.5rem, 3vw, 2rem)', // Card internal padding
			},

			// ─────────────────────────────────────────────────────────────────────
			// TYPOGRAPHY TOKENS
			// ─────────────────────────────────────────────────────────────────────
			fontSize: {
				// Section headings (consistent across site)
				'section-title': ['clamp(1.5rem, 4vw, 2.25rem)', {
					lineHeight: '1.1',
					letterSpacing: '-0.025em',
					fontWeight: '700'
				}],
				// Hero heading (larger, special)
				'hero-title': ['clamp(2rem, 5vw, 3rem)', {
					lineHeight: '1',
					letterSpacing: '-0.03em',
					fontWeight: '700'
				}],
				// Card titles
				'card-title': ['clamp(1.125rem, 2vw, 1.5rem)', {
					lineHeight: '1.2',
					letterSpacing: '-0.015em',
					fontWeight: '600'
				}],
				// Body text
				'body': ['clamp(0.9375rem, 1.5vw, 1rem)', {
					lineHeight: '1.6',
					letterSpacing: '0'
				}],
				// Small text
				'small': ['0.875rem', {
					lineHeight: '1.5',
					letterSpacing: '0.01em'
				}],
			},

			fontFamily: {
				serif: ['var(--font-geist-sans)', 'Georgia', 'serif'],
				sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
			},

			// ─────────────────────────────────────────────────────────────────────
			// INTERACTION DNA (Transition Tokens)
			// ─────────────────────────────────────────────────────────────────────
			transitionDuration: {
				'interaction': '300ms',
			},
			transitionTimingFunction: {
				'interaction': 'cubic-bezier(0.4, 0, 0.2, 1)',
			},

			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				'card': '1.5rem',    // 24px - consistent card radius
				'button': '1.5rem',  // 24px - pill-shaped buttons
			},

			// ─────────────────────────────────────────────────────────────────────
			// SHADOWS (Layered for depth perception)
			// ─────────────────────────────────────────────────────────────────────
			boxShadow: {
				'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
				'glass-lg': '0 8px 40px rgba(0, 0, 0, 0.12)',
				'card': '0 4px 20px rgba(18, 55, 42, 0.08)',
				'card-hover': '0 8px 30px rgba(18, 55, 42, 0.12)',
				'button': '0 2px 8px rgba(18, 55, 42, 0.15)',
				'button-hover': '0 4px 16px rgba(18, 55, 42, 0.2)',
			},

			// ─────────────────────────────────────────────────────────────────────
			// BACKDROP BLUR (Glass Surfaces)
			// ─────────────────────────────────────────────────────────────────────
			backdropBlur: {
				'glass': '12px',
				'glass-heavy': '20px',
			},

			// ─────────────────────────────────────────────────────────────────────
			// ANIMATIONS
			// ─────────────────────────────────────────────────────────────────────
			animation: {
				shimmer: "shimmer 2s linear infinite",
				'fade-in': 'fadeIn 0.3s ease-out',
				'slide-up': 'slideUp 0.4s ease-out',
			},
			keyframes: {
				shimmer: {
					from: { backgroundPosition: "0 0" },
					to: { backgroundPosition: "-200% 0" }
				},
				fadeIn: {
					from: { opacity: '0' },
					to: { opacity: '1' },
				},
				slideUp: {
					from: { opacity: '0', transform: 'translateY(10px)' },
					to: { opacity: '1', transform: 'translateY(0)' },
				},
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
};
export default config;
