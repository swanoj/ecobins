"use client";

import { motion } from "framer-motion";

const reviews = [
	{
		initials: "MH",
		name: "Monica Hall",
		role: "Stay-at-home mum",
		quote:
			'"I\'m so glad I started using Eco Bin Cleaning! No more unwanted creepy crawlies hanging around — not to mention the offensive odour is gone."',
	},
	{
		initials: "ST",
		name: "Sam Tedesco",
		role: "Director",
		quote:
			'"These guys provide such an incredible service. My bins are cleaned on the same day as collection. So easy!"',
	},
	{
		initials: "VB",
		name: "Vanessa Bramhall",
		role: "Bookkeeper",
		quote:
			'"Love this company! They do an amazing job and it\'s SO easy to book online. No more smelly bins."',
	},
];

const StarRow = () => (
	<div className="flex gap-0.5 text-[#F5A623] mb-3.5">
		{Array(5)
			.fill(null)
			.map((_, i) => (
				<svg
					key={i}
					className="w-[18px] h-[18px]"
					viewBox="0 0 24 24"
					fill="currentColor"
				>
					<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
				</svg>
			))}
	</div>
);

export function Testimonials() {
	return (
		<section
			className="bg-[var(--color-surface)] border-t border-b border-[var(--color-line)] py-[78px]"
			id="reviews"
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
						What our customers say
					</span>
					<h2 className="mt-3.5 text-[clamp(32px,4vw,48px)]">
						Loved by locals
					</h2>
				</motion.div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-[22px]">
					{reviews.map(({ initials, name, role, quote }, i) => (
						<motion.div
							key={name}
							className="bg-[var(--color-surface)] border border-[var(--color-line)] hover:border-emerald-500/35 hover:scale-[1.01] hover:shadow-lg rounded-[18px] p-7 shadow-[var(--shadow-card)] transition-all duration-300 translate-y-0 scale-100"
							initial={{ opacity: 0, y: 22 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: i * 0.1 }}
						>
							<StarRow />
							<p className="text-[16px] leading-[1.6]">{quote}</p>
							<div className="flex items-center gap-3 mt-5">
								<span className="w-[42px] h-[42px] rounded-full bg-[linear-gradient(135deg,#0C3A52,#14708e_55%,#1E9466)] text-white font-display font-extrabold text-[16px] flex items-center justify-center flex-none">
									{initials}
								</span>
								<div>
									<b className="text-[15px] block">{name}</b>
									<span className="text-[13px] text-[var(--color-muted)]">
										{role}
									</span>
								</div>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
