"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function FinalCTA() {
	return (
		<section className="py-[78px] text-center">
			<div className="mx-auto max-w-[1180px] px-6">
				<motion.div
					initial={{ opacity: 0, y: 22 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
				>
					<h2 className="text-[clamp(32px,4.4vw,52px)]">
						Ready for a bin that
						<br />
						doesn't make you gag?
					</h2>
					<p className="mt-4 text-[19px] text-[var(--color-muted)]">
						Claim two cleans for $39 before the Tarneit spots fill up.
					</p>
					<div className="mt-7 flex gap-3.5 justify-center flex-wrap">
						<Link
							href="#book"
							className="inline-flex items-center gap-2 font-display font-extrabold text-[18px] text-white bg-[var(--color-green)] px-[34px] py-[19px] rounded-full transition-all hover:-translate-y-0.5 hover:bg-[var(--color-green-deep)] shadow-[0_10px_24px_-8px_color-mix(in_srgb,var(--color-green)_70%,transparent)]"
						>
							Claim 2 cleans for $39 →
						</Link>
						<Link
							href="tel:0402544575"
							className="inline-flex items-center gap-2 font-display font-extrabold text-[18px] px-[34px] py-[19px] rounded-full border-[1.5px] border-[var(--color-line)] hover:border-[var(--color-green)] hover:text-[var(--color-green-deep)] transition-colors"
						>
							Call or SMS 0402 544 575
						</Link>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
