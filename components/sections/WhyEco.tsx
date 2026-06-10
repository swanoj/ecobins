"use client";

import { motion } from "framer-motion";
import { CloudDownload, Leaf, SlidersHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const values = [
	{
		icon: CloudDownload,
		title: "Our own recycled water",
		desc: "Fully self-contained high-pressure unit — minimal waste left behind.",
	},
	{
		icon: Leaf,
		title: "Biodegradable products",
		desc: "Family- and pet-safe sanitisers and deodorisers — never harsh chemicals.",
	},
	{
		icon: SlidersHorizontal,
		title: "Local & reliable",
		desc: "Proudly servicing Tarneit and Melbourne's west, same day as your collection.",
	},
];

export function WhyEco() {
	return (
		<section className="py-[78px]">
			<div className="mx-auto max-w-7xl px-6 grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-[54px] items-center">
				<motion.div
					className="relative w-full h-[260px] sm:h-[360px] lg:h-[440px] rounded-[20px] overflow-hidden shadow-[var(--shadow-lg)]"
					initial={{ opacity: 0, y: 22 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
				>
					<Image
						src="/assets/tech-washing.jpg"
						alt="Eco bin cleaning truck in action"
						fill
						className="object-cover"
					/>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 22 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, delay: 0.1 }}
				>
					<span className="inline-flex items-center gap-2 font-body font-bold text-[13px] tracking-[.14em] uppercase text-[var(--color-green-deep)]">
						<span className="w-[7px] h-[7px] rounded-full bg-[var(--color-lime)]" />
						Clean &amp; green
					</span>
					<h2 className="mt-3.5 text-[clamp(30px,3.6vw,44px)]">
						Spotless bins,
						<br />
						without the guilt
					</h2>
					<p className="mt-4 text-[18px] text-[var(--color-muted)] max-w-[32em]">
						We're a local Melbourne wheelie-bin cleaning service that does it
						the eco way — so your family and the environment both win.
					</p>

					<div className="mt-7 flex flex-col gap-[22px]">
						{values.map(({ icon: Icon, title, desc }) => (
							<div key={title} className="flex gap-4 group">
								<span className="w-[46px] h-[46px] rounded-[12px] bg-[color-mix(in_srgb,var(--color-teal)_14%,transparent)] text-[var(--color-teal)] flex items-center justify-center flex-none group-hover:scale-110 transition-transform duration-300">
									<Icon size={23} />
								</span>
								<div>
									<h4 className="text-[18px] mb-0.5">{title}</h4>
									<p className="text-[var(--color-muted)] text-[15px]">
										{desc}
									</p>
								</div>
							</div>
						))}
					</div>

					<Link
						href="#book"
						className="mt-[30px] inline-flex items-center gap-2 font-display font-extrabold text-[18px] text-white bg-[var(--color-navy)] px-[34px] py-[19px] rounded-full scale-100 active:scale-[0.97] hover:shadow-[0_12px_28px_-6px_rgba(12,58,82,0.3)] transition-all hover:bg-slate-900"
					>
						Book my 2 cleans
					</Link>
				</motion.div>
			</div>
		</section>
	);
}
