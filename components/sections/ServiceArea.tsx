"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const suburbs = [
	{ name: "Tarneit", hot: true },
	{ name: "Truganina" },
	{ name: "Hoppers Crossing" },
	{ name: "Werribee" },
	{ name: "Point Cook" },
	{ name: "Williams Landing" },
	{ name: "Wyndham Vale" },
	{ name: "Altona" },
	{ name: "Laverton" },
	{ name: "Williamstown" },
	{ name: "Newport" },
	{ name: "Yarraville" },
	{ name: "Footscray" },
];

export function ServiceArea() {
	return (
		<section className="py-[78px]">
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
						Service area
					</span>
					<h2 className="mt-3.5 text-[clamp(32px,4vw,48px)]">
						Now booking across Melbourne's west
					</h2>
					<p className="mt-3.5 text-[18px] text-[var(--color-muted)]">
						This launch offer is for Tarneit — but we clean bins right across
						Hobsons Bay and Wyndham.
					</p>
				</motion.div>

				<motion.div
					className="flex flex-wrap gap-2.5 justify-center max-w-[840px] mx-auto"
					initial={{ opacity: 0, y: 22 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, delay: 0.1 }}
				>
					{suburbs.map(({ name, hot }) => (
						<span
							key={name}
							className={cn(
								"border rounded-full px-[18px] py-[9px] font-semibold text-[14px] transition-all duration-300 scale-100 active:scale-[0.96] hover:scale-105 hover:shadow-sm cursor-default",
								hot
									? "bg-[var(--color-green)] text-white border-[var(--color-green)] hover:bg-[var(--color-green-deep)]"
									: "bg-[var(--color-surface)] border-[var(--color-line)] hover:border-emerald-500/40 hover:bg-emerald-50/10",
							)}
						>
							{name}
						</span>
					))}
				</motion.div>
			</div>
		</section>
	);
}
