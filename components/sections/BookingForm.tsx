"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Lock } from "lucide-react";
import Link from "next/link";
import { usePostHog } from "posthog-js/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { type BookingFormData, bookingSchema } from "@/lib/validations";

const perks = [
	"Both bins cleaned, sanitised & deodorised",
	"Two visits, one month apart",
	"Same day as your council collection",
	"No lock-in contract — cancel anytime",
];

export function BookingForm() {
	const [submitted, setSubmitted] = useState(false);
	const [firstName, setFirstName] = useState("");
	const posthog = usePostHog();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<BookingFormData>({ resolver: zodResolver(bookingSchema) });

	async function onSubmit(data: BookingFormData) {
		try {
			const res = await fetch("/api/book", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});
			if (!res.ok) throw new Error("Submission failed");
			setFirstName(data.name.trim().split(" ")[0]);
			setSubmitted(true);
			posthog?.capture("booking_submitted", {
				bins: data.bins,
				binday: data.binday,
			});
		} catch {
			alert(
				"Something went wrong — please try again or call us on 0402 544 575.",
			);
		}
	}

	return (
		<section
			className="py-[78px] relative overflow-hidden bg-[linear-gradient(135deg,#0C3A52_0%,#14708e_55%,#1E9466_100%)] text-white"
			id="book"
		>
			<div className="mx-auto max-w-[1180px] px-6 grid grid-cols-1 lg:grid-cols-2 gap-[54px] items-center">
				{/* Left copy */}
				<motion.div
					initial={{ opacity: 0, y: 22 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
				>
					<span className="inline-flex items-center gap-2 font-body font-bold text-[13px] tracking-[.14em] uppercase text-[var(--color-lime)]">
						<span className="w-[7px] h-[7px] rounded-full bg-[var(--color-lime)]" />
						Tarneit launch offer
					</span>
					<h2 className="mt-3.5 text-[clamp(34px,4.4vw,54px)] text-white">
						Book your 2 cleans for $39
					</h2>
					<p className="mt-4 text-[19px] opacity-90 max-w-[26em]">
						Lock in both bins, two visits a month apart, for less than half the
						usual price. Secure your spot — the Tarneit round opens June 17 and
						places are limited.
					</p>
					<ul className="mt-7 flex flex-col gap-[13px]">
						{perks.map((p) => (
							<li
								key={p}
								className="flex items-center gap-3 text-[16px] font-semibold"
							>
								<svg
									className="w-[22px] h-[22px] text-[var(--color-lime)] flex-none"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth={2.4}
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d="M20 6L9 17l-5-5" />
								</svg>
								{p}
							</li>
						))}
					</ul>
				</motion.div>

				{/* Form card */}
				<motion.div
					className="bg-white text-[var(--color-ink)] rounded-[24px] p-8 shadow-[var(--shadow-lg)]"
					initial={{ opacity: 0, y: 22 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, delay: 0.1 }}
				>
					<AnimatePresence mode="wait">
						{submitted ? (
							<motion.div
								key="success"
								className="text-center py-5"
								initial={{ opacity: 0, scale: 0.95 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ duration: 0.4 }}
							>
								<div className="w-[68px] h-[68px] rounded-full bg-[color-mix(in_srgb,var(--color-green)_16%,transparent)] flex items-center justify-center mx-auto mb-[18px]">
									<CheckCircle2
										size={34}
										className="text-[var(--color-green-deep)]"
									/>
								</div>
								<h3 className="text-[26px] mb-2.5">You're on the list! 🎉</h3>
								<p className="text-[var(--color-muted)] text-[15px]">
									Thanks {firstName} — we've got your details. We'll text you to
									confirm your first clean date and the secure payment link for
									your $39 offer.
								</p>
							</motion.div>
						) : (
							<motion.form
								key="form"
								onSubmit={handleSubmit(onSubmit)}
								noValidate
							>
								<div className="flex items-baseline justify-between gap-3 mb-1.5">
									<h3 className="text-[24px]">Claim the offer</h3>
									<span className="font-display font-black text-[26px] text-[var(--color-green-deep)]">
										<s className="text-[16px] text-[var(--color-muted)] font-semibold mr-1.5">
											$100
										</s>
										$39
									</span>
								</div>
								<p className="text-[var(--color-muted)] text-[14px] mb-[22px]">
									Takes under 2 minutes. We'll confirm your bin day by text.
								</p>

								<Field label="Full name" error={errors.name?.message}>
									<input
										{...register("name")}
										type="text"
										placeholder="Jane Smith"
										className={inputCls(!!errors.name)}
									/>
								</Field>

								<div className="grid grid-cols-2 gap-3.5">
									<Field label="Mobile" error={errors.phone?.message}>
										<input
											{...register("phone")}
											type="tel"
											placeholder="0400 000 000"
											className={inputCls(!!errors.phone)}
										/>
									</Field>
									<Field label="Email" error={errors.email?.message}>
										<input
											{...register("email")}
											type="email"
											placeholder="you@email.com"
											className={inputCls(!!errors.email)}
										/>
									</Field>
								</div>

								<Field label="Street address" error={errors.address?.message}>
									<input
										{...register("address")}
										type="text"
										placeholder="12 Example St, Tarneit VIC 3029"
										className={inputCls(!!errors.address)}
									/>
								</Field>

								<div className="grid grid-cols-2 gap-3.5">
									<Field label="Your bin day" error={errors.binday?.message}>
										<select
											{...register("binday")}
											className={inputCls(!!errors.binday)}
										>
											<option value="">Select…</option>
											{[
												"Monday",
												"Tuesday",
												"Wednesday",
												"Thursday",
												"Friday",
												"Not sure",
											].map((d) => (
												<option key={d}>{d}</option>
											))}
										</select>
									</Field>
									<Field label="Bins to clean" error={errors.bins?.message}>
										<select
											{...register("bins")}
											className={inputCls(!!errors.bins)}
										>
											{[
												"Both bins (rubbish + recycling)",
												"Rubbish only",
												"Recycling only",
												"3 or more (extra bins)",
											].map((b) => (
												<option key={b}>{b}</option>
											))}
										</select>
									</Field>
								</div>

								<button
									type="submit"
									disabled={isSubmitting}
									className="w-full mt-1 font-display font-extrabold text-[18px] text-white bg-[var(--color-green)] rounded-full py-[19px] transition-all hover:bg-[var(--color-green-deep)] hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
								>
									{isSubmitting ? "Booking…" : "Book & secure my spot — $39"}
								</button>

								<p className="mt-3.5 flex items-center justify-center gap-1.5 text-[12px] text-[var(--color-muted)]">
									<Lock size={14} className="text-[var(--color-green)]" />
									Secure booking · pay online after confirmation
								</p>
							</motion.form>
						)}
					</AnimatePresence>
				</motion.div>
			</div>
		</section>
	);
}

function inputCls(hasError: boolean) {
	return `w-full px-[15px] py-[13px] border-[1.5px] rounded-[12px] font-body text-[15px] bg-[var(--color-surface-2)] text-[var(--color-ink)] transition-colors focus:outline-none focus:border-[var(--color-green)] ${hasError ? "border-red-400" : "border-[var(--color-line)]"}`;
}

function Field({
	label,
	error,
	children,
}: {
	label: string;
	error?: string;
	children: React.ReactNode;
}) {
	return (
		<div className="mb-4">
			<label className="block font-semibold text-[13px] mb-[7px] text-[var(--color-ink)]">
				{label}
			</label>
			{children}
			{error && <p className="mt-1 text-[12px] text-red-500">{error}</p>}
		</div>
	);
}
