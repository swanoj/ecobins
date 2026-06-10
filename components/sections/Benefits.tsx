"use client";

import { motion } from "framer-motion";
import { Bug, Clock, Leaf, Shield } from "lucide-react";

const benefits = [
	{
		icon: Shield,
		title: "Kills germs",
		desc: "99.9% of bacteria sanitised with hospital-grade, eco-safe solution.",
	},
	{
		icon: Leaf,
		title: "Fresh smell",
		desc: "Deodorised so your bin — and your driveway — actually smells clean.",
	},
	{
		icon: Bug,
		title: "Less pests",
		desc: "No more flies, maggots, cockroaches or rodents drawn to the grime.",
	},
	{
		icon: Clock,
		title: "Same-day service",
		desc: "We clean the same day your bins are emptied — zero hassle for you.",
	},
];

export function Benefits() {
	return (
		<section
			className="bg-[var(--color-surface)] border-t border-b border-[var(--color-line)] py-[78px]"
			id="offer"
		>
			<div className="mx-auto max-w-7xl px-6">
				<motion.div
					className="max-w-[720px] mx-auto mb-12 text-center"
					initial={{ opacity: 0, y: 22 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
				>
					<span className="inline-flex items-center gap-2 font-body font-bold text-[13px] tracking-[.14em] uppercase text-[var(--color-green-deep)]">
						<span className="w-[7px] h-[7px] rounded-full bg-[var(--color-lime)]" />
						Why a clean bin matters
					</span>
					<h2 className="mt-3.5 text-[clamp(32px,4vw,48px)]">
						A fresh bin, every time
					</h2>
					<p className="mt-3.5 text-[18px] text-[var(--color-muted)]">
						Bins are warm, dark and full of food scraps — a breeding ground for
						bacteria and pests. Here's what every clean delivers.
					</p>
				</motion.div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
					{benefits.map(({ icon: Icon, title, desc }, i) => (
						<motion.div
							key={title}
							className="bg-[var(--color-surface-2)] border border-[var(--color-line)] hover:border-emerald-500/35 hover:-translate-y-1 hover:shadow-[0_12px_30px_-8px_rgba(46,154,79,0.12)] rounded-[18px] p-7 transition-all duration-300 translate-y-0 scale-100"
							initial={{ opacity: 0, y: 22 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: i * 0.1 }}
						>
							<span className="w-[52px] h-[52px] rounded-[14px] bg-[color-mix(in_srgb,var(--color-green)_13%,transparent)] text-[var(--color-green-deep)] flex items-center justify-center mb-[18px]">
								<Icon size={26} />
							</span>
							<h3 className="text-[20px] mb-1.5">{title}</h3>
							<p className="text-[var(--color-muted)] text-[15px]">{desc}</p>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
