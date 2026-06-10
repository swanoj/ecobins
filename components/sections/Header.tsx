"use client";

import { Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function Header() {
	return (
		<header className="sticky top-0 z-60 border-b border-[var(--color-line)] bg-[color-mix(in_srgb,var(--color-bg)_86%,transparent)] backdrop-blur-[12px]">
			<div className="mx-auto flex max-w-7xl items-center justify-between px-6 h-[74px]">
				<Link
					href="#top"
					aria-label="Eco Bin Cleaning home"
					className="flex items-center gap-3"
				>
					<Image
						src="/assets/logo.png"
						alt="Eco Bin Cleaning"
						width={120}
						height={46}
						className="h-[46px] w-auto"
					/>
				</Link>

				<div className="flex items-center gap-[18px]">
					<nav className="hidden md:flex gap-[26px]">
						{[
							["#offer", "The Offer"],
							["#how", "How It Works"],
							["#results", "Results"],
							["#reviews", "Reviews"],
						].map(([href, label]) => (
							<Link
								key={href}
								href={href}
								className="font-semibold text-[15px] text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors"
							>
								{label}
							</Link>
						))}
					</nav>
					<Link
						href="tel:0402544575"
						className="hidden md:flex items-center gap-2 font-display font-extrabold text-[16px]"
					>
						<Phone size={17} className="text-[var(--color-green)]" />
						0402 544 575
					</Link>
					<Link
						href="#book"
						className="inline-flex items-center justify-center gap-2 font-display font-extrabold text-[16px] text-white bg-[var(--color-green)] px-[26px] py-4 rounded-full scale-100 active:scale-[0.97] transition-all hover:-translate-y-0.5 hover:bg-[var(--color-green-deep)] hover:shadow-[0_12px_28px_-6px_rgba(46,154,79,0.35)] shadow-[0_10px_24px_-8px_color-mix(in_srgb,var(--color-green)_70%,transparent)]"
					>
						Book Now
					</Link>
				</div>
			</div>
		</header>
	);
}
