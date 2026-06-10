"use client";

import { motion } from "framer-motion";

const steps = [
	{
		n: "1",
		title: "Book online",
		desc: "Grab the Tarneit 2-for-$39 offer above. Pop in your address and bin day — no phone tag required.",
	},
	{
		n: "2",
		title: "We clean on bin day",
		desc: "Leave your bins out as normal. Our truck arrives the same day, jets them with recycled water and sanitises inside & out.",
	},
	{
		n: "3",
		title: "Fresh again next month",
		desc: "Your second clean lands a month later — so your bins stay hygienic, odour-free and pest-free.",
	},
];

export function HowItWorks() {
	return (
		<section
			className="bg-[var(--color-surface)] border-t border-b border-[var(--color-line)] py-[78px]"
			id="how"
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
						Easy as it gets
					</span>
					<h2 className="mt-3.5 text-[clamp(32px,4vw,48px)]">How it works</h2>
					<p className="mt-3.5 text-[18px] text-[var(--color-muted)]">
						Two cleans, one month apart, for $39. Book in two minutes and leave
						the dirty work to us.
					</p>
				</motion.div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-[22px]">
					{steps.map(({ n, title, desc }, i) => (
						<motion.div
							key={n}
							className="bg-[var(--color-surface-2)] border border-[var(--color-line)] hover:border-emerald-500/30 hover:scale-[1.02] hover:shadow-md rounded-[18px] p-[30px] relative transition-all duration-300 translate-y-0 scale-100"
							initial={{ opacity: 0, y: 22 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: i * 0.12 }}
						>
							<span className="w-[34px] h-[34px] rounded-[10px] bg-[var(--color-green)] text-white font-display font-black text-[15px] flex items-center justify-center mb-[18px]">
								{n}
							</span>
							<h3 className="text-[21px] mb-2">{title}</h3>
							<p className="text-[var(--color-muted)] text-[15px]">{desc}</p>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
