"use client";

import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";

const reviews = [
	{
		initials: "MH",
		name: "Monica Hall",
		role: "Stay-at-home Mum",
		suburb: "Tarneit VIC",
		date: "2 days ago",
		quote:
			'"I\'m so glad I started using Eco Bin Cleaning! No more unwanted creepy crawlies hanging around — not to mention the offensive odour is gone."',
	},
	{
		initials: "ST",
		name: "Sam Tedesco",
		role: "Local Business Director",
		suburb: "Truganina VIC",
		date: "5 days ago",
		quote:
			'"These guys provide such an incredible service. My bins are cleaned on the same day as collection. So easy!"',
	},
	{
		initials: "VB",
		name: "Vanessa Bramhall",
		role: "Professional Bookkeeper",
		suburb: "Hoppers Crossing VIC",
		date: "1 week ago",
		quote:
			'"Love this company! They do an amazing job and it\'s SO easy to book online. No more smelly bins."',
	},
];

const StarRow = () => (
	<div className="flex gap-0.5 text-amber-500">
		{Array(5)
			.fill(null)
			.map((_, i) => (
				<Star
					key={i}
					size={16}
					className="fill-amber-500 stroke-amber-500"
				/>
			))}
	</div>
);

// Google G logo SVG
const GoogleGLogo = ({ className = "w-4 h-4" }: { className?: string }) => (
	<svg className={className} viewBox="0 0 24 24">
		<path
			fill="#EA4335"
			d="M12 5.04c1.63 0 3.1.56 4.25 1.64l3.18-3.18C17.51 1.64 14.97 1 12 1 7.35 1 3.39 3.67 1.39 7.56l3.85 2.99c.9-2.7 3.44-4.51 6.76-4.51z"
		/>
		<path
			fill="#4285F4"
			d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.43 3.58l3.77 2.92c2.2-2.03 3.69-5.02 3.69-8.65z"
		/>
		<path
			fill="#FBBC05"
			d="M5.24 14.45c-.24-.72-.38-1.5-.38-2.3s.14-1.58.38-2.3L1.39 6.86C.5 8.65 0 10.27 0 12.15s.5 3.5 1.39 5.29l3.85-2.99z"
		/>
		<path
			fill="#34A853"
			d="M12 23c3.24 0 5.97-1.07 7.96-2.92l-3.77-2.92c-1.11.75-2.52 1.2-4.19 1.2-3.32 0-5.86-1.81-6.76-4.51H1.39l-3.85 2.99C3.39 20.33 7.35 23 12 23z"
		/>
	</svg>
);

export function Testimonials() {
	return (
		<section
			className="bg-[var(--color-surface)] border-t border-b border-[var(--color-line)] py-[78px] relative overflow-hidden"
			id="reviews"
		>
			<div className="mx-auto max-w-7xl px-6 relative z-10">
				<motion.div
					className="max-w-[720px] mx-auto mb-14 text-center flex flex-col items-center"
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

					{/* Google Verified Review Summarizer Badge */}
					<div className="mt-6 inline-flex flex-wrap items-center justify-center gap-3.5 bg-[var(--color-surface-2)] border border-[var(--color-line)] px-5 py-2.5 rounded-full shadow-xs">
						<GoogleGLogo className="w-[18px] h-[18px]" />
						<div className="flex gap-0.5 text-amber-500">
							{Array(5)
								.fill(null)
								.map((_, i) => (
									<Star
										key={i}
										size={13}
										className="fill-amber-500 stroke-amber-500"
									/>
								))}
						</div>
						<span className="text-[11px] md:text-[12px] font-black uppercase tracking-wider text-[var(--color-ink)] flex items-center gap-2 font-display">
							4.9/5 Rating • 142 Google Verified Reviews
							<span className="inline-flex w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
						</span>
					</div>
				</motion.div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-[22px]">
					{reviews.map(({ initials, name, role, suburb, date, quote }, i) => (
						<motion.div
							key={name}
							className="bg-[var(--color-surface)] border border-[var(--color-line)] hover:border-emerald-500/35 hover:scale-[1.01] hover:shadow-lg rounded-[22px] p-7 shadow-[var(--shadow-card)] transition-all duration-300 flex flex-col justify-between relative overflow-hidden group min-h-[300px]"
							initial={{ opacity: 0, y: 22 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: i * 0.1 }}
						>
							{/* Background Watermark Google "G" for Premium Awwwards feel */}
							<div className="absolute -top-6 -right-6 w-24 h-24 text-slate-100/5 pointer-events-none group-hover:scale-105 group-hover:text-emerald-50/5 transition-all duration-500">
								<svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
									<path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.96 5.96 0 018.03 12.557a5.96 5.96 0 015.96-5.961c1.554 0 2.955.59 4.053 1.558l3.125-3.125A10.316 10.316 0 0013.99 1.1c-5.733 0-10.38 4.647-10.38 10.38 0 5.733 4.647 10.38 10.38 10.38 5.733 0 10.38-4.647 10.38-10.38 0-.648-.065-1.296-.194-1.93L12.24 10.285z" />
								</svg>
							</div>

							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<StarRow />
									{/* Verified Google Review Tag */}
									<span className="text-[9px] bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border border-emerald-100/60 dark:border-emerald-900/30 flex items-center gap-1">
										<Check size={9} className="stroke-[3.5]" />
										Verified Purchase
									</span>
								</div>

								<p className="text-[15px] italic text-[var(--color-ink)] leading-relaxed relative z-10">
									{quote}
								</p>
							</div>

							<div className="flex items-center gap-3 mt-6 pt-5 border-t border-[var(--color-line)]/50 relative z-10">
								<span className="w-11 h-11 rounded-full bg-[linear-gradient(135deg,#0C3A52,#14708e_55%,#1E9466)] text-white font-display font-extrabold text-[15px] flex items-center justify-center flex-none shadow-xs">
									{initials}
								</span>
								<div className="flex-grow min-w-0">
									<div className="flex items-baseline justify-between gap-1.5">
										<b className="text-[15px] block text-[var(--color-ink)] font-extrabold truncate">{name}</b>
										<span className="text-[10px] text-[var(--color-muted)] font-bold uppercase shrink-0">{suburb}</span>
									</div>
									<div className="flex items-center gap-1.5 text-[11px] text-[var(--color-muted)] font-medium mt-0.5">
										<GoogleGLogo className="w-3 h-3 shrink-0" />
										<span>Google Review • {date}</span>
									</div>
								</div>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}

