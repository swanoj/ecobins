"use client";

import { Phone } from "lucide-react";
import Link from "next/link";

export function MobileCTA() {
	return (
		<div className="md:hidden fixed bottom-0 left-0 right-0 z-[70] flex gap-2.5 px-4 py-3 bg-[color-mix(in_srgb,var(--color-bg)_92%,transparent)] backdrop-blur-[10px] border-t border-[var(--color-line)]">
			<Link
				href="tel:0402544575"
				className="flex-none inline-flex items-center justify-center px-5 py-4 rounded-full border-[1.5px] border-[var(--color-line)] font-display font-extrabold hover:border-[var(--color-green)] transition-colors"
			>
				<Phone size={18} />
			</Link>
			<Link
				href="#book"
				className="flex-1 inline-flex items-center justify-center font-display font-extrabold text-[16px] text-white bg-[var(--color-green)] rounded-full py-4 transition-all hover:bg-[var(--color-green-deep)]"
			>
				Claim 2 for $39
			</Link>
		</div>
	);
}
