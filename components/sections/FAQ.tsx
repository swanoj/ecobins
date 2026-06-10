"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";

const faqs = [
	{
		q: "What exactly do I get for $39?",
		a: "Two full bin cleans — both your rubbish and recycling bins — one month apart. Each clean sanitises and deodorises inside and out. That's normally $100, so you save over 60%.",
	},
	{
		q: "When do you clean my bins?",
		a: "We clean the same day your bins are emptied (occasionally the day after). Just leave them out as usual — we handle the rest.",
	},
	{
		q: "Is it safe for my family and pets?",
		a: "Absolutely. We only use biodegradable, eco-friendly sanitisers and deodorisers — never harsh chemicals — and recycled water in a fully self-contained unit.",
	},
	{
		q: "Do I need to be home?",
		a: "Nope. As long as your bins are kerbside on collection day, we'll clean them whether you're home or not.",
	},
	{
		q: "Is there a contract?",
		a: "No lock-in. The $39 offer is two cleans. Love it? You can switch to an ongoing fortnightly or monthly plan anytime — your call.",
	},
];

function FAQItem({ q, a }: { q: string; a: string }) {
	const [open, setOpen] = useState(false);
	return (
		<div className="border border-[var(--color-line)] rounded-[14px] bg-[var(--color-surface)] mb-3 overflow-hidden hover:border-emerald-500/35 hover:shadow-sm transition-all duration-300 translate-y-0 scale-100">
			<button
				onClick={() => setOpen((v) => !v)}
				className="w-full flex items-center justify-between gap-3 px-6 py-5 font-display font-bold text-[17px] text-left cursor-pointer hover:text-[var(--color-green-deep)] transition-colors"
				aria-expanded={open}
			>
				{q}
				<span
					className={`w-6 h-6 flex items-center justify-center text-[var(--color-green-deep)] transition-transform duration-200 flex-none ${open ? "rotate-45" : ""}`}
				>
					<Plus size={24} />
				</span>
			</button>
			<AnimatePresence initial={false}>
				{open && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.25 }}
						className="overflow-hidden"
					>
						<p className="px-6 pb-[22px] text-[var(--color-muted)] text-[15px] leading-[1.6]">
							{a}
						</p>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}

export function FAQ() {
	return (
		<section className="bg-[var(--color-surface)] border-t border-b border-[var(--color-line)] py-[78px]">
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
						Good to know
					</span>
					<h2 className="mt-3.5 text-[clamp(32px,4vw,48px)]">
						Questions, answered
					</h2>
				</motion.div>
				<div className="max-w-[760px] mx-auto">
					{faqs.map((faq) => (
						<FAQItem key={faq.q} {...faq} />
					))}
				</div>
			</div>
		</section>
	);
}
