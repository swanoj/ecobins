"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function ProcessBand() {
	return (
		<motion.section
			className="relative min-h-[380px] grid place-items-center overflow-hidden bg-[var(--color-navy)]"
			initial={{ opacity: 0 }}
			whileInView={{ opacity: 1 }}
			viewport={{ once: true }}
			transition={{ duration: 0.8 }}
		>
			<Image
				src="/assets/spray-action.jpg"
				alt="High-pressure eco bin clean in progress"
				fill
				className="object-cover opacity-55"
			/>
			<div className="relative z-10 text-center text-white px-6 py-[60px] max-w-[760px]">
				<span className="inline-flex items-center gap-2 font-body font-bold text-[13px] tracking-[.14em] uppercase text-[var(--color-lime)]">
					<span className="w-[7px] h-[7px] rounded-full bg-[var(--color-lime)]" />
					Recycled water · high pressure
				</span>
				<h2 className="mt-3 text-[clamp(30px,4vw,46px)] text-white">
					We do the dirty work, so you don't
				</h2>
				<p className="mt-3.5 text-[18px] opacity-90 max-w-[30em] mx-auto">
					High-pressure jets blast out built-up grime, then we sanitise and
					deodorise inside and out — leaving nothing behind but a fresh,
					hygienic bin.
				</p>
			</div>
		</motion.section>
	);
}
