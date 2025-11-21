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
			colors: {
				// white: '#FFFFFF',
				// dark: '#12372A',
				// 'dark-variant': '#436850',
				// 'primary-light': '#ADBC9F',
				// 'primary-variant': '#FBFADA',
				// 'secondary-light': '#9dcd6f',
				// 'secondary-variant': '#749a48',
				// text: '#4A4A4A',
				forest: {
					950: '#05100C', // Very dark shade for gradients
					900: '#12372A',  // Dark shade for primary text and backgrounds
					700: '#2A5741',
					500: '#436850',
				},
				sage: {
					300: '#ADBC9F',
					100: '#FBFADA',
				},
				lime: {
					500: '#9DCF6F',
					700: '#749A48',
				},

				// forest: {
				// 	900: '#12372A',
				// 	800: '#1E4435',
				// 	700: '#2A5741',
				// 	600: '#375F4B',
				// 	500: '#436850',
				//   },
				//   sage: {
				// 	300: '#ADBC9F',
				// 	200: '#C4CFBA',
				// 	100: '#FBFADA',
				//   },
				//   lime: {
				// 	600: '#8AB85D',
				// 	500: '#9DCF6F',
				// 	400: '#AFD988',
				//   },

				//  ==== ShadCN ====

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
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			// added animation & keyframes for Learn More button in About Me page
			animation: {
				shimmer: "shimmer 2s linear infinite"
			},
			keyframes: {
				shimmer: {
					from: {
						backgroundPosition: "0 0"
					},
					to: {
						backgroundPosition: "-200% 0"
					}
				}
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
};
export default config;
