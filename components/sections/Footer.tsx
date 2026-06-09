import Image from "next/image";
import Link from "next/link";

export function Footer() {
	const year = new Date().getFullYear();
	return (
		<footer className="bg-[var(--color-navy)] text-[#cfe0e8] pt-[60px] pb-[30px]">
			<div className="mx-auto max-w-[1180px] px-6">
				<div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr] gap-10 pb-10 border-b border-white/10">
					<div>
						<div className="bg-white rounded-[14px] px-[18px] py-[14px] inline-block shadow-[0_8px_24px_-10px_rgba(0,0,0,0.4)]">
							<Image
								src="/assets/logo.png"
								alt="Eco Bin Cleaning"
								width={120}
								height={42}
								className="h-[42px] w-auto"
							/>
						</div>
						<p className="mt-[18px] text-[14px] leading-[1.6] max-w-[34em] text-white/70">
							Eco Bin Cleaning keeps your wheelie bins clean and hygienic —
							minimising mould, odours and household pests. Environmentally
							safe, using recycled water and biodegradable sanitisers.
						</p>
					</div>

					<div>
						<h4 className="font-display text-white text-[15px] tracking-[.04em] uppercase mb-4">
							Company
						</h4>
						{[
							["#offer", "The Offer"],
							["#how", "How It Works"],
							["#results", "Results"],
							["#reviews", "Reviews"],
							["#book", "Book Now"],
						].map(([href, label]) => (
							<Link
								key={href}
								href={href}
								className="block text-[15px] mb-[11px] text-white/78 hover:text-white transition-colors"
							>
								{label}
							</Link>
						))}
					</div>

					<div>
						<h4 className="font-display text-white text-[15px] tracking-[.04em] uppercase mb-4">
							Contact
						</h4>
						<p className="block text-[15px] mb-[11px] text-white/78">
							Hobsons Bay, Melbourne
						</p>
						<Link
							href="tel:0402544575"
							className="block text-[15px] mb-[11px] text-white/78 hover:text-white transition-colors"
						>
							Call / SMS: 0402 544 575
						</Link>
						<Link
							href="mailto:info@ecobincleaning.net"
							className="block text-[15px] mb-[11px] text-white/78 hover:text-white transition-colors"
						>
							info@ecobincleaning.net
						</Link>
						<Link
							href="https://ecobincleaning.net"
							target="_blank"
							rel="noopener"
							className="block text-[15px] mb-[11px] text-white/78 hover:text-white transition-colors"
						>
							ecobincleaning.com.au
						</Link>
					</div>
				</div>

				<div className="pt-6 flex justify-between flex-wrap gap-2.5 text-[13px] text-white/50">
					<span>© {year} Eco Bin Cleaning. All rights reserved.</span>
					<span>
						Servicing Tarneit &amp; Melbourne's west · Clean &amp; Green 🌿
					</span>
				</div>
			</div>
		</footer>
	);
}
