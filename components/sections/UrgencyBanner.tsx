import { MapPin } from "lucide-react";

export function UrgencyBanner() {
	return (
		<section className="bg-[var(--color-navy)] text-white py-5">
			<div className="mx-auto max-w-[1180px] px-6 flex items-center justify-center gap-3.5 text-center flex-wrap">
				<span className="w-[30px] h-[30px] rounded-[8px] bg-white/15 flex items-center justify-center">
					<MapPin size={16} className="text-[var(--color-lime)]" />
				</span>
				<span className="text-[17px]">
					Proudly serving <b className="text-[var(--color-lime)]">Tarneit</b> —
					Tarneit round opens <b>June 17</b>. Spots are limited.
				</span>
			</div>
		</section>
	);
}
