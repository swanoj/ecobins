"use client";

import { motion } from "framer-motion";
import { Clock, Shield } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";

const Hero3DCanvas = dynamic(() => import("../3d/Hero3DCanvas"), {
	ssr: false,
	loading: () => (
		<div className="relative w-full h-[320px] md:h-[480px] lg:h-[540px] rounded-3xl overflow-hidden bg-slate-950 flex items-center justify-center border border-slate-800 shadow-2xl">
			<div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
		</div>
	),
});

const stars = Array(5).fill(null);

export function Hero() {
	return (
		<section className="relative pt-[54px] pb-[40px]" id="top">
			<div className="mx-auto max-w-7xl px-6 grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-[54px] items-center">
				{/* Copy */}
				<motion.div
					initial={{ opacity: 0, y: 24 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
				>
					<span className="inline-flex items-center gap-2 font-body font-bold text-[13px] tracking-[.14em] uppercase text-[var(--color-green-deep)]">
						<span className="w-[7px] h-[7px] rounded-full bg-[var(--color-lime)]" />
						Fresh bins, cleaner home · Tarneit
					</span>

					<h1 className="mt-[18px] text-[clamp(46px,6.4vw,82px)] font-black">
						Your bin doesn't
						<br />
						have to <span className="text-[var(--color-green)]">smell.</span>
					</h1>

					<p className="mt-5 text-[19px] text-[var(--color-muted)] max-w-[30em]">
						Professional wheelie-bin cleaning that kills 99.9% of germs and
						wipes out the stink — using recycled water and biodegradable,
						family-safe products. Cleaned the same day your bins go out.
					</p>

					{/* Offer badge */}
					<div className="mt-7 inline-flex flex-col items-start rounded-[16px] px-5 py-[14px] text-white bg-[linear-gradient(135deg,#0C3A52_0%,#14708e_55%,#1E9466_100%)] shadow-[var(--shadow-card)]">
						<span className="font-body font-bold text-[12px] tracking-[.14em] uppercase opacity-85">
							Normally <s className="opacity-70">$100</s> · Tarneit launch offer
						</span>
						<span className="font-display font-black text-[30px] leading-none mt-0.5 flex items-baseline gap-2">
							Two cleans for <span className="text-[40px]">$39</span>
						</span>
						<span className="text-[12px] font-semibold tracking-[.06em] uppercase opacity-90 mt-1.5">
							Both bins · 2 visits · 1 month apart
						</span>
					</div>

					<div className="mt-6 flex flex-wrap gap-[14px] items-center">
						<Link
							href="#book"
							className="inline-flex items-center gap-2 font-display font-extrabold text-[18px] text-white bg-[var(--color-green)] px-[34px] py-[19px] rounded-full scale-100 active:scale-[0.97] transition-all hover:-translate-y-0.5 hover:bg-[var(--color-green-deep)] hover:shadow-[0_12px_28px_-6px_rgba(46,154,79,0.35)] shadow-[0_10px_24px_-8px_color-mix(in_srgb,var(--color-green)_70%,transparent)]"
						>
							Claim 2 cleans for $39 →
						</Link>
						<Link
							href="tel:0402544575"
							className="inline-flex items-center gap-2 font-display font-extrabold text-[18px] px-[34px] py-[19px] rounded-full border-[1.5px] border-[var(--color-line)] scale-100 active:scale-[0.97] hover:border-[var(--color-green)] hover:text-[var(--color-green-deep)] hover:bg-slate-50 transition-all hover:shadow-sm"
						>
							Call or SMS
						</Link>
					</div>

					<div className="mt-[26px] flex items-center gap-5 flex-wrap">
						<div className="flex items-center gap-2.5">
							<div className="flex gap-0.5 text-[#F5A623]">
								{stars.map((_, i) => (
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
							<span className="font-semibold text-[14px] text-[var(--color-muted)]">
								<b className="text-[var(--color-ink)]">Rated 5★</b> on Google
							</span>
						</div>
						<span className="w-px h-[26px] bg-[var(--color-line)]" />
						<span className="font-semibold text-[14px] text-[var(--color-muted)]">
							🌿 Recycled water · biodegradable
						</span>
					</div>
				</motion.div>

				{/* Media */}
				<motion.div
					className="relative"
					initial={{ opacity: 0, scale: 0.97 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.7, delay: 0.15 }}
				>
					<Hero3DCanvas />

					{/* Chip 1 */}
					<div className="absolute top-6 left-4 sm:-left-[26px] bg-[var(--color-surface)] rounded-[14px] px-[15px] py-3 shadow-[var(--shadow-card)] flex items-center gap-[11px] border border-[var(--color-line)] transition-all">
						<span className="w-[38px] h-[38px] rounded-[10px] bg-[color-mix(in_srgb,var(--color-green)_14%,transparent)] text-[var(--color-green-deep)] flex items-center justify-center flex-none">
							<Shield size={20} />
						</span>
						<span>
							<p className="font-display font-extrabold text-[14px] leading-tight">
								99.9% germs killed
							</p>
							<p className="text-[12px] text-[var(--color-muted)]">
								Hospital-grade sanitiser
							</p>
						</span>
					</div>

					{/* Chip 2 */}
					<div className="absolute bottom-7 right-4 sm:-right-[22px] bg-[var(--color-surface)] rounded-[14px] px-[15px] py-3 shadow-[var(--shadow-card)] flex items-center gap-[11px] border border-[var(--color-line)] transition-all">
						<span className="w-[38px] h-[38px] rounded-[10px] bg-[color-mix(in_srgb,var(--color-green)_14%,transparent)] text-[var(--color-green-deep)] flex items-center justify-center flex-none">
							<Clock size={20} />
						</span>
						<span>
							<p className="font-display font-extrabold text-[14px] leading-tight">
								Same-day service
							</p>
							<p className="text-[12px] text-[var(--color-muted)]">
								Cleaned on your bin day
							</p>
						</span>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
