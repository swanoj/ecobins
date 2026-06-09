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
import { ServiceArea } from "@/components/sections/ServiceArea";
import { Testimonials } from "@/components/sections/Testimonials";
import { UrgencyBanner } from "@/components/sections/UrgencyBanner";
import { WhyEco } from "@/components/sections/WhyEco";

export default function Home() {
	return (
		<>
			<Header />
			<main>
				<Hero />
				<Benefits />
				<BeforeAfter />
				<HowItWorks />
				<ProcessBand />
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
