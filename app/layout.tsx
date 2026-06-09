import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Archivo, Hanken_Grotesk } from "next/font/google";
import Script from "next/script";
import { PHProvider } from "@/components/providers/posthog";
import "./globals.css";

const archivo = Archivo({
	subsets: ["latin"],
	weight: ["500", "600", "700", "800", "900"],
	variable: "--font-archivo",
	display: "swap",
});

const hanken = Hanken_Grotesk({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
	variable: "--font-hanken",
	display: "swap",
});

export const metadata: Metadata = {
	title: "Eco Bin Cleaning — 2 Cleans for $39 | Tarneit",
	description:
		"Professional wheelie-bin cleaning that kills 99.9% of germs and wipes out the stink — using recycled water and biodegradable, family-safe products. Cleaned the same day your bins go out.",
	openGraph: {
		title: "Eco Bin Cleaning — 2 Cleans for $39 | Tarneit",
		description:
			"Fresh bins, cleaner home. Book the Tarneit launch offer today.",
		url: "https://ecobincleaning.net",
		siteName: "Eco Bin Cleaning",
		locale: "en_AU",
		type: "website",
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className={`${archivo.variable} ${hanken.variable}`}>
			<body>
				<PHProvider>
					{children}
					<Analytics />
					<SpeedInsights />
				</PHProvider>
				{process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY && (
					<Script
						src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
						strategy="afterInteractive"
					/>
				)}
			</body>
		</html>
	);
}
