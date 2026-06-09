"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export function BeforeAfter() {
	return (
		<section className="py-[78px]" id="results">
			<div className="mx-auto max-w-[1180px] px-6">
				<motion.div
					className="max-w-[720px] mx-auto mb-12 text-center"
					initial={{ opacity: 0, y: 22 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
				>
					<span className="inline-flex items-center gap-2 font-body font-bold text-[13px] tracking-[.14em] uppercase text-[var(--color-green-deep)]">
						<span className="w-[7px] h-[7px] rounded-full bg-[var(--color-lime)]" />
						See the difference
					</span>
					<h2 className="mt-3.5 text-[clamp(32px,4vw,48px)]">
						From grimy to gleaming
					</h2>
					<p className="mt-3.5 text-[18px] text-[var(--color-muted)]">
						Real bins, real results.
					</p>
				</motion.div>

				<motion.div
					className="relative grid grid-cols-2 gap-6 max-w-[1000px] mx-auto"
					initial={{ opacity: 0, y: 22 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
				>
					<div className="relative rounded-[18px] overflow-hidden shadow-[var(--shadow-card)]">
						<div className="relative w-full h-[420px]">
							<Image
								src="/assets/eco-bin-cleaning-tarneit.png"
								alt="Dirty bin before cleaning"
								fill
								className="object-cover"
							/>
						</div>
						<span className="absolute top-[18px] left-[18px] font-display font-extrabold text-[14px] tracking-[.08em] uppercase px-4 py-2 rounded-full text-white bg-[var(--color-navy)]">
							Before
						</span>
					</div>

					<div className="relative rounded-[18px] overflow-hidden shadow-[var(--shadow-card)]">
						<div className="relative w-full h-[420px]">
							<Image
								src="/assets/clean-bin.jpg"
								alt="Clean bin after service"
								fill
								className="object-cover"
							/>
						</div>
						<span className="absolute top-[18px] right-[18px] font-display font-extrabold text-[14px] tracking-[.08em] uppercase px-4 py-2 rounded-full text-white bg-[var(--color-green)]">
							After
						</span>
					</div>

					{/* Arrow */}
					<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-14 h-14 rounded-full bg-[var(--color-surface)] flex items-center justify-center shadow-[var(--shadow-lg)] hidden md:flex">
						<ArrowRight size={24} className="text-[var(--color-green-deep)]" />
					</div>
				</motion.div>
			</div>
		</section>
	);
}
