import { BeforeAfter } from "@/components/sections/BeforeAfter";
import { Benefits } from "@/components/sections/Benefits";
import { BookingWizard } from "@/components/sections/BookingWizard";
import { FAQ } from "@/components/sections/FAQ";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Footer } from "@/components/sections/Footer";
import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { MobileCTA } from "@/components/sections/MobileCTA";
import { ProcessBand } from "@/components/sections/ProcessBand";
import { FleetAndCrew } from "@/components/sections/FleetAndCrew";
import { ServiceArea } from "@/components/sections/ServiceArea";
import { Testimonials } from "@/components/sections/Testimonials";
import { UrgencyBanner } from "@/components/sections/UrgencyBanner";
import { WhyEco } from "@/components/sections/WhyEco";

export default function Home2() {
	return (
		<>
			<Header />
			<main className="bg-[#FAFCF8] text-[#0F2A1E] font-sans antialiased overflow-x-hidden selection:bg-emerald-100 selection:text-emerald-800">
				{/* home-2 top sandbox notice */}
				<div className="bg-[#0C3A52] text-white py-2 text-center text-[10px] font-black tracking-widest uppercase relative z-50">
					🚧 Homepage Sandbox (Home-2 Draft) — Experimenting with layout architectures
				</div>
				<Hero />
				<Benefits />
				<BeforeAfter />
				<HowItWorks />
				<ProcessBand />
				<FleetAndCrew />
				<WhyEco />
				<Testimonials />
				<BookingWizard />
				<UrgencyBanner />
				<ServiceArea />
				<FAQ />
				<FinalCTA />
			</main>
			<Footer />
			<MobileCTA />
		</>
	);
}
