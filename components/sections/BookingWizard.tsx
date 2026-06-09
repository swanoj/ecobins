"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
	ArrowLeft,
	ArrowRight,
	CalendarDays,
	CheckCircle2,
	ChevronRight,
	ExternalLink,
	MapPin,
	Sun,
	Trash2,
	User,
} from "lucide-react";
import { usePostHog } from "posthog-js/react";
import { useEffect, useRef, useState } from "react";
import { AddressAutocomplete } from "@/components/sections/AddressAutocomplete";
import {
	BIN_OPTIONS,
	type BinType,
	buildWooCommerceUrl,
	calculatePrice,
	calculateSavings,
	FREQUENCY_OPTIONS,
	type Frequency,
	POSTCODE_COUNCIL,
	PRICING,
	SERVICE_POSTCODES,
} from "@/lib/service-data";

// ─── Types ───────────────────────────────────────────────────────────────────

interface WizardData {
	postcode: string;
	frequency: Frequency | "";
	bins: Record<BinType, number>;
	address: string;
	suburb: string;
	binday: string;
	name: string;
	phone: string;
	email: string;
	date: string;
}

const EMPTY: WizardData = {
	postcode: "",
	frequency: "",
	bins: { general: 1, recycling: 1, green: 0 },
	address: "",
	suburb: "",
	binday: "",
	name: "",
	phone: "",
	email: "",
	date: "",
};

// ─── Step progress bar ───────────────────────────────────────────────────────

const STEP_LABELS = [
	"Area",
	"Service",
	"Bins",
	"Address",
	"Details",
	"Confirm",
];

function StepBar({
	step,
	noBottomMargin,
}: {
	step: number;
	noBottomMargin?: boolean;
}) {
	return (
		<div className={`flex items-center gap-0 ${noBottomMargin ? "" : "mb-8"}`}>
			{STEP_LABELS.map((label, i) => {
				const done = i < step;
				const current = i === step;
				return (
					<div key={label} className="flex items-center flex-1 last:flex-none">
						<div className="flex flex-col items-center gap-1">
							<div
								className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-display font-bold transition-colors duration-300 ${
									done
										? "bg-[var(--color-green)] text-white"
										: current
											? "bg-[var(--color-ink)] text-white"
											: "bg-[var(--color-line)] text-[var(--color-muted)]"
								}`}
							>
								{done ? <CheckCircle2 size={16} /> : i + 1}
							</div>
							<span
								className={`text-[11px] font-semibold hidden sm:block ${current ? "text-[var(--color-ink)]" : "text-[var(--color-muted)]"}`}
							>
								{label}
							</span>
						</div>
						{i < STEP_LABELS.length - 1 && (
							<div
								className={`flex-1 h-[2px] mx-1 mt-[-12px] transition-colors duration-300 ${done ? "bg-[var(--color-green)]" : "bg-[var(--color-line)]"}`}
							/>
						)}
					</div>
				);
			})}
		</div>
	);
}

// ─── Slide animation ─────────────────────────────────────────────────────────

const slide = (dir: 1 | -1) => ({
	initial: { opacity: 0, x: dir * 40 },
	animate: { opacity: 1, x: 0 },
	exit: { opacity: 0, x: dir * -40 },
	transition: {
		duration: 0.28,
		ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
	},
});

// ─── Shared UI atoms ─────────────────────────────────────────────────────────

function Btn({
	children,
	onClick,
	disabled,
	variant = "primary",
	type = "button",
}: {
	children: React.ReactNode;
	onClick?: () => void;
	disabled?: boolean;
	variant?: "primary" | "ghost";
	type?: "button" | "submit";
}) {
	return (
		<button
			type={type}
			onClick={onClick}
			disabled={disabled}
			className={`inline-flex items-center justify-center gap-2 font-display font-extrabold text-[16px] rounded-full px-7 py-4 transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
				variant === "primary"
					? "bg-[var(--color-green)] text-white hover:bg-[var(--color-green-deep)] hover:-translate-y-0.5 shadow-[0_10px_24px_-8px_color-mix(in_srgb,var(--color-green)_60%,transparent)]"
					: "border-[1.5px] border-[var(--color-line)] text-[var(--color-ink)] hover:border-[var(--color-green)] hover:text-[var(--color-green-deep)]"
			}`}
		>
			{children}
		</button>
	);
}

function FieldWrap({
	label,
	children,
	hint,
}: {
	label: string;
	children: React.ReactNode;
	hint?: React.ReactNode;
}) {
	return (
		<div className="mb-4">
			<div className="flex items-center justify-between mb-[7px]">
				<label className="font-semibold text-[13px] text-[var(--color-ink)]">
					{label}
				</label>
				{hint && (
					<span className="text-[12px] text-[var(--color-muted)]">{hint}</span>
				)}
			</div>
			{children}
		</div>
	);
}

function Input({
	value,
	onStringChange,
	...rest
}: Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> & {
	value: string;
	onStringChange: (v: string) => void;
}) {
	return (
		<input
			{...rest}
			value={value}
			onChange={(e) => onStringChange(e.target.value)}
			className="w-full px-4 py-3 border-[1.5px] border-[var(--color-line)] rounded-[12px] font-body text-[15px] bg-white text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-green)] transition-colors"
		/>
	);
}

// ─── Live price strip ─────────────────────────────────────────────────────────

function PriceStrip({ data }: { data: WizardData }) {
	const totalBins = data.bins.general + data.bins.recycling + data.bins.green;
	const hasFreq = !!data.frequency;
	const price = hasFreq
		? calculatePrice(data.frequency as Frequency, data.bins)
		: null;
	const savings =
		data.frequency === "one-off" ? calculateSavings(data.bins) : 0;
	const freq = FREQUENCY_OPTIONS.find((f) => f.id === data.frequency);

	return (
		<div className="mb-6">
			<AnimatePresence mode="wait">
				{price !== null ? (
					<motion.div
						key={`${data.frequency}-${totalBins}`}
						initial={{ opacity: 0, y: 6 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -4 }}
						transition={{
							duration: 0.24,
							ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
						}}
						className="flex items-center gap-4 px-5 py-3.5 rounded-[14px] bg-[color-mix(in_srgb,var(--color-green)_7%,transparent)] border border-[color-mix(in_srgb,var(--color-green)_20%,transparent)]"
					>
						{/* Big price */}
						<div className="flex-none">
							<p className="text-[10px] font-bold tracking-widest uppercase text-[var(--color-muted)] leading-none mb-1">
								From
							</p>
							<div className="flex items-baseline gap-1">
								<span className="font-display font-black text-[34px] leading-none text-[var(--color-green)]">
									${price}
								</span>
								<span className="font-semibold text-[13px] text-[var(--color-muted)]">
									/clean
								</span>
							</div>
						</div>

						{/* Divider */}
						<div className="w-px self-stretch bg-[color-mix(in_srgb,var(--color-green)_25%,transparent)]" />

						{/* Details */}
						<div className="flex-1 min-w-0">
							<p className="font-bold text-[14px] text-[var(--color-ink)] leading-tight">
								{freq?.label}
							</p>
							<p className="text-[12px] text-[var(--color-muted)] mt-0.5">
								{totalBins} bin{totalBins !== 1 ? "s" : ""} · pressure washed
								&amp; sanitised
							</p>
						</div>

						{/* Savings nudge */}
						{savings > 0 && (
							<div className="flex-none text-right hidden sm:block">
								<p className="text-[12px] font-bold text-[var(--color-green-deep)] leading-tight">
									Save ${savings}
								</p>
								<p className="text-[11px] text-[var(--color-muted)]">
									with a plan ↓
								</p>
							</div>
						)}
					</motion.div>
				) : (
					<motion.div
						key="from"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
						className="flex items-center gap-3 px-5 py-3 rounded-[14px] bg-[var(--color-surface-2)] border border-[var(--color-line)]"
					>
						<div className="flex items-baseline gap-1">
							<span className="text-[11px] font-bold uppercase tracking-widest text-[var(--color-muted)]">
								From
							</span>
							<span className="font-display font-black text-[28px] leading-none text-[var(--color-green)] ml-1.5">
								$12
							</span>
							<span className="font-semibold text-[13px] text-[var(--color-muted)]">
								/clean
							</span>
						</div>
						<div className="w-px self-stretch bg-[var(--color-line)]" />
						<p className="text-[13px] text-[var(--color-muted)]">
							per bin · price updates as you choose
						</p>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}

// ─── Step 1 — Postcode (interactive service-area map) ────────────────────────

function isMapsLoaded(): boolean {
	return (
		typeof window !== "undefined" &&
		typeof (window as Window & { google?: { maps?: { Map?: unknown } } }).google
			?.maps?.Map === "function"
	);
}

function StepPostcode({ data, update, onNext }: StepProps) {
	const [touched, setTouched] = useState(false);
	const [mapStatus, setMapStatus] = useState<"loading" | "ready" | "error">(
		"loading",
	);

	const mapDivRef = useRef<HTMLDivElement>(null);
	const mapRef = useRef<google.maps.Map | null>(null);
	const infoRef = useRef<google.maps.InfoWindow | null>(null);
	const updateRef = useRef(update);
	const selectedRef = useRef(data.postcode);

	// Keep refs current
	useEffect(() => {
		updateRef.current = update;
	});
	useEffect(() => {
		selectedRef.current = data.postcode;
	});

	const isValid = (SERVICE_POSTCODES as readonly string[]).includes(
		data.postcode,
	);
	const isInvalid = touched && data.postcode.length === 4 && !isValid;
	const council = POSTCODE_COUNCIL[data.postcode];

	// Single async init: wait for Maps API + GeoJSON, then create map
	useEffect(() => {
		let cancelled = false;

		async function init() {
			// Wait for Google Maps API (polls every 200ms)
			await new Promise<void>((resolve) => {
				if (isMapsLoaded()) {
					resolve();
					return;
				}
				const id = setInterval(() => {
					if (isMapsLoaded()) {
						clearInterval(id);
						resolve();
					}
				}, 200);
			});

			// Fetch GeoJSON in parallel (or it may already be cached)
			let geoData: object;
			try {
				const r = await fetch("/service-area.geojson");
				if (!r.ok) throw new Error();
				geoData = await r.json();
			} catch {
				if (!cancelled) setMapStatus("error");
				return;
			}

			if (cancelled || !mapDivRef.current || mapRef.current) return;

			const map = new window.google.maps.Map(mapDivRef.current, {
				center: { lat: -37.875, lng: 144.775 },
				zoom: 10,
				disableDefaultUI: true,
				zoomControl: true,
				gestureHandling: "cooperative",
				styles: [
					{ elementType: "geometry", stylers: [{ color: "#edf2f7" }] },
					{ elementType: "labels.text.fill", stylers: [{ color: "#718096" }] },
					{
						elementType: "labels.text.stroke",
						stylers: [{ color: "#edf2f7" }],
					},
					{
						featureType: "water",
						elementType: "geometry",
						stylers: [{ color: "#bee3f8" }],
					},
					{
						featureType: "road",
						elementType: "geometry",
						stylers: [{ color: "#ffffff" }],
					},
					{
						featureType: "road.arterial",
						elementType: "geometry",
						stylers: [{ color: "#e2e8f0" }],
					},
					{
						featureType: "road.highway",
						elementType: "geometry",
						stylers: [{ color: "#cbd5e0" }],
					},
					{
						featureType: "administrative.locality",
						elementType: "labels.text.fill",
						stylers: [{ color: "#4a5568" }],
					},
					{ featureType: "poi", stylers: [{ visibility: "off" }] },
					{ featureType: "transit", stylers: [{ visibility: "off" }] },
				],
			});

			mapRef.current = map;
			infoRef.current = new window.google.maps.InfoWindow({
				disableAutoPan: true,
			});

			map.data.addGeoJson(geoData);
			map.data.setStyle({
				fillColor: "#16a34a",
				fillOpacity: 0.13,
				strokeColor: "#16a34a",
				strokeWeight: 1.5,
				strokeOpacity: 0.8,
				cursor: "pointer",
			});

			map.data.addListener("mouseover", (e: google.maps.Data.MouseEvent) => {
				const pc = e.feature.getProperty("POA_CODE21") as string;
				const sel = pc === selectedRef.current;
				map.data.overrideStyle(e.feature, {
					fillOpacity: sel ? 0.65 : 0.3,
					strokeWeight: 2.5,
				});
				const info = POSTCODE_COUNCIL[pc];
				if (infoRef.current && e.latLng) {
					infoRef.current.setContent(
						`<div style="font:600 13px/1.5 system-ui,sans-serif">${info?.suburb ?? pc}</div>` +
							`<div style="font:400 12px/1.5 system-ui,sans-serif;color:#555">${pc} · click to select</div>`,
					);
					infoRef.current.setPosition(e.latLng);
					infoRef.current.open(map);
				}
			});

			map.data.addListener("mouseout", (e: google.maps.Data.MouseEvent) => {
				map.data.revertStyle(e.feature);
				infoRef.current?.close();
			});

			map.data.addListener("click", (e: google.maps.Data.MouseEvent) => {
				const pc = e.feature.getProperty("POA_CODE21") as string;
				const info = POSTCODE_COUNCIL[pc];
				updateRef.current("postcode", pc);
				if (info?.confidence === "high")
					updateRef.current("binday", info.suggestedBinDay);
				else updateRef.current("binday", "");
			});

			if (!cancelled) setMapStatus("ready");
		}

		init();
		return () => {
			cancelled = true;
		};
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	// Re-apply polygon styles when selected postcode changes
	useEffect(() => {
		if (!mapRef.current) return;
		mapRef.current.data.setStyle((feature) => {
			const pc = feature.getProperty("POA_CODE21") as string;
			const sel = pc === data.postcode;
			return {
				fillColor: "#16a34a",
				fillOpacity: sel ? 0.45 : 0.13,
				strokeColor: "#16a34a",
				strokeWeight: sel ? 2.5 : 1.5,
				strokeOpacity: 0.8,
				cursor: "pointer",
			};
		});
	}, [data.postcode]);

	function handlePostcodeChange(raw: string) {
		const v = raw.replace(/\D/g, "").slice(0, 4);
		update("postcode", v);
		setTouched(false);
		const info = POSTCODE_COUNCIL[v];
		if (info?.confidence === "high") update("binday", info.suggestedBinDay);
		else if (v.length === 4) update("binday", "");
	}

	const confidenceLabelMap = {
		high: "Your bin collection day is typically",
		medium: "Your bin collection day is likely",
		low: null,
	} as const;

	return (
		<div>
			<h3 className="text-[22px] mb-1">Do we service your area?</h3>
			<p className="text-[var(--color-muted)] text-[15px] mb-4">
				Click your suburb on the map, or type your postcode.
			</p>

			{/* Full-width map with floating postcode bubble */}
			<div
				className="relative rounded-[16px] overflow-hidden border border-[var(--color-line)] mb-4"
				style={{ height: "380px" }}
			>
				<div ref={mapDivRef} className="w-full h-full" />

				{mapStatus === "loading" && (
					<div className="absolute inset-0 flex items-center justify-center bg-slate-50 pointer-events-none">
						<p className="text-[13px] text-[var(--color-muted)]">
							Loading map…
						</p>
					</div>
				)}
				{mapStatus === "error" && (
					<div className="absolute inset-0 flex items-center justify-center bg-slate-50 pointer-events-none">
						<p className="text-[13px] text-[var(--color-muted)]">
							Map unavailable — type your postcode below
						</p>
					</div>
				)}

				{/* Floating postcode input bubble */}
				<div className="absolute bottom-3 left-3 right-3">
					<div
						className={`flex items-center gap-3 rounded-[14px] px-4 py-3 backdrop-blur-sm transition-all duration-200 ${
							isValid
								? "bg-white/95 border-[1.5px] border-[var(--color-green)] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.18)]"
								: isInvalid
									? "bg-white/95 border-[1.5px] border-red-400 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.18)]"
									: "bg-white/90 border border-white/70 shadow-[0_4px_16px_-4px_rgba(0,0,0,0.12)]"
						}`}
					>
						<MapPin
							size={16}
							className={`flex-none transition-colors ${isValid ? "text-[var(--color-green)]" : "text-[var(--color-muted)]"}`}
						/>
						<input
							type="text"
							inputMode="numeric"
							maxLength={4}
							value={data.postcode}
							onChange={(e) => handlePostcodeChange(e.target.value)}
							onBlur={() => setTouched(true)}
							placeholder="Type postcode or click a suburb…"
							className="flex-1 min-w-0 bg-transparent font-body text-[15px] font-bold tracking-wider outline-none text-[var(--color-ink)] placeholder:font-normal placeholder:text-[var(--color-muted)] placeholder:tracking-normal"
						/>
						<AnimatePresence mode="wait">
							{isValid && council && (
								<motion.div
									key="valid-badge"
									initial={{ opacity: 0, x: 8 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0 }}
									className="flex items-center gap-2 flex-none"
								>
									<span className="text-[13px] text-[var(--color-muted)] hidden sm:block truncate max-w-[140px]">
										{council.suburb}
									</span>
									<CheckCircle2
										size={18}
										className="text-[var(--color-green)]"
									/>
								</motion.div>
							)}
							{isInvalid && (
								<motion.div
									key="invalid-badge"
									initial={{ opacity: 0, x: 8 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0 }}
									className="flex-none"
								>
									<span className="text-[12px] text-red-500 font-semibold whitespace-nowrap">
										Not in service area
									</span>
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				</div>
			</div>

			{/* Bin day & error banners below the map */}
			<AnimatePresence>
				{isValid && council && confidenceLabelMap[council.confidence] && (
					<motion.div
						key="binday"
						initial={{ opacity: 0, y: 6 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0 }}
						className="flex items-center gap-2 px-4 py-3 rounded-[12px] bg-[color-mix(in_srgb,var(--color-green)_8%,transparent)] border border-[color-mix(in_srgb,var(--color-green)_20%,transparent)] mb-4"
					>
						<Sun
							size={14}
							className="text-[var(--color-green-deep)] flex-none"
						/>
						<p className="text-[13px] text-[var(--color-green-deep)]">
							{confidenceLabelMap[council.confidence]}{" "}
							<strong>{council.suggestedBinDay}</strong>
							{council.confidence === "medium" && " — confirm next step"}
							{council.binDayNote && (
								<span className="text-[var(--color-muted)] font-normal">
									{" "}
									· {council.binDayNote}
								</span>
							)}
						</p>
					</motion.div>
				)}
				{isInvalid && (
					<motion.div
						key="outside"
						initial={{ opacity: 0, y: 6 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0 }}
						className="flex items-start gap-3 p-3.5 rounded-[14px] bg-red-50 border border-red-200 mb-4"
					>
						<MapPin size={16} className="text-red-500 mt-0.5 flex-none" />
						<div>
							<p className="font-semibold text-[13px] text-red-700">
								Outside our service area
							</p>
							<p className="text-[12px] text-red-500 mt-0.5">
								We cover 3011–3013, 3015–3016, 3018–3019, 3024–3030 &amp; 3032.{" "}
								<a href="mailto:info@ecobincleaning.net" className="underline">
									Contact us
								</a>
								.
							</p>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Continue button — animates in when a valid postcode is selected */}
			<AnimatePresence>
				{isValid && (
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 6 }}
						transition={{
							duration: 0.24,
							ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
						}}
					>
						<Btn onClick={onNext}>
							Continue <ArrowRight size={16} />
						</Btn>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}

// ─── Step 2 — Frequency ──────────────────────────────────────────────────────

function StepFrequency({ data, update, onNext, onBack }: StepProps) {
	const showOneOffNudge = data.frequency === "one-off";
	const savings = calculateSavings(data.bins);

	return (
		<div>
			<h3 className="text-[22px] mb-1">How often would you like a clean?</h3>
			<p className="text-[var(--color-muted)] text-[15px] mb-6">
				All plans cover both your bins on every clean.
			</p>

			<div className="flex flex-col gap-3 mb-4">
				{FREQUENCY_OPTIONS.map((opt) => {
					const active = data.frequency === opt.id;
					const price = calculatePrice(opt.id, data.bins);
					return (
						<button
							key={opt.id}
							type="button"
							onClick={() => update("frequency", opt.id)}
							className={`relative w-full text-left flex items-center justify-between gap-3 px-5 py-4 rounded-[14px] border-[1.5px] transition-all ${
								active
									? "border-[var(--color-green)] bg-[color-mix(in_srgb,var(--color-green)_7%,transparent)]"
									: "border-[var(--color-line)] bg-white hover:border-[var(--color-green)] hover:bg-[color-mix(in_srgb,var(--color-green)_4%,transparent)]"
							}`}
						>
							<div>
								<div className="flex items-center gap-2">
									<span className="font-display font-bold text-[16px]">
										{opt.label}
									</span>
									{opt.badge && (
										<span className="text-[11px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full bg-[var(--color-green)] text-white">
											{opt.badge}
										</span>
									)}
								</div>
								<span className="text-[13px] text-[var(--color-muted)]">
									{opt.sublabel}
								</span>
							</div>
							<div className="flex items-center gap-3 flex-none">
								<span className="font-display font-bold text-[15px] text-[var(--color-green)]">
									${price}/clean
								</span>
								<div
									className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
										active
											? "border-[var(--color-green)] bg-[var(--color-green)]"
											: "border-[var(--color-line)]"
									}`}
								>
									{active && <div className="w-2 h-2 rounded-full bg-white" />}
								</div>
							</div>
						</button>
					);
				})}
			</div>

			{/* One-off upsell nudge */}
			<AnimatePresence>
				{showOneOffNudge && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.25 }}
						className="overflow-hidden mb-4"
					>
						<div className="flex items-start gap-3 px-4 py-3 rounded-[12px] bg-[color-mix(in_srgb,var(--color-lime)_12%,transparent)] border border-[color-mix(in_srgb,var(--color-lime)_35%,transparent)]">
							<span className="text-[18px] leading-none mt-0.5">💡</span>
							<p className="text-[13px] text-[var(--color-ink)]">
								<strong>Save ${savings} per clean</strong> by switching to
								fortnightly — bins stay hygienic year-round, no lock-in.
							</p>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			<div className="flex gap-3">
				<Btn variant="ghost" onClick={onBack}>
					<ArrowLeft size={16} /> Back
				</Btn>
				<Btn onClick={onNext} disabled={!data.frequency}>
					Continue <ArrowRight size={16} />
				</Btn>
			</div>
		</div>
	);
}

// ─── 3D Wheelie bin SVG ───────────────────────────────────────────────────────

// ─── Step 3 — Bins ───────────────────────────────────────────────────────────

function StepBins({ data, update, onNext, onBack }: StepProps) {
	const total = data.bins.general + data.bins.recycling + data.bins.green;

	function setCount(type: BinType, val: number) {
		update("bins", { ...data.bins, [type]: Math.max(0, val) });
	}

	return (
		<div>
			<h3 className="text-[22px] mb-1">Which bins need cleaning?</h3>
			<p className="text-[var(--color-muted)] text-[15px] mb-6">
				Select the types and quantities. Mix and match as needed.
			</p>

			<div className="flex flex-col gap-3 mb-4">
				{BIN_OPTIONS.map(({ id, label, lid, hex, desc }) => {
					const count = data.bins[id];
					return (
						<div
							key={id}
							className="flex items-center gap-4 px-5 py-4 rounded-[14px] border-[1.5px] transition-all"
							style={{
								borderColor: count > 0 ? hex : "var(--color-line)",
								background: count > 0 ? `${hex}0f` : "white",
							}}
						>
							<span
								className="w-10 h-10 rounded-[10px] flex items-center justify-center flex-none"
								style={{ background: `${hex}1a` }}
							>
								<Trash2 size={20} style={{ color: hex }} />
							</span>
							<div className="flex-1 min-w-0">
								<p className="font-display font-bold text-[15px]">{label}</p>
								<p className="text-[12px] text-[var(--color-muted)]">
									{lid} · {desc}
								</p>
							</div>
							{/* Counter */}
							<div className="flex items-center gap-2 flex-none">
								<button
									type="button"
									onClick={() => setCount(id, count - 1)}
									disabled={count === 0}
									className="w-8 h-8 rounded-full border-[1.5px] font-bold text-[18px] flex items-center justify-center disabled:opacity-30 transition-colors"
									style={{ borderColor: count > 0 ? hex : "var(--color-line)" }}
								>
									−
								</button>
								<span className="w-6 text-center font-display font-bold text-[17px]">
									{count}
								</span>
								<button
									type="button"
									onClick={() => setCount(id, count + 1)}
									className="w-8 h-8 rounded-full border-[1.5px] font-bold text-[18px] flex items-center justify-center transition-colors"
									style={{ borderColor: count > 0 ? hex : "var(--color-line)" }}
								>
									+
								</button>
							</div>
						</div>
					);
				})}
			</div>

			{total === 0 && (
				<p className="text-[13px] text-red-500 mb-4">
					Please select at least one bin.
				</p>
			)}

			<div className="flex gap-3">
				<Btn variant="ghost" onClick={onBack}>
					<ArrowLeft size={16} /> Back
				</Btn>
				<Btn onClick={onNext} disabled={total === 0}>
					Continue <ArrowRight size={16} />
				</Btn>
			</div>
		</div>
	);
}

// ─── Step 4 — Address ────────────────────────────────────────────────────────

function StepAddress({ data, update, onNext, onBack }: StepProps) {
	const council = POSTCODE_COUNCIL[data.postcode];
	const [showDayPicker, setShowDayPicker] = useState(false);
	const hasSuggestedDay =
		!!council?.suggestedBinDay && data.binday === council.suggestedBinDay;
	const dayConfirmed = !!data.binday && !showDayPicker;
	const canNext = data.address.trim().length > 3 && data.binday.length > 0;

	function handleAddressSelect(parts: {
		streetAddress: string;
		suburb: string;
		postcode: string;
	}) {
		update("address", parts.streetAddress);
		if (parts.suburb) update("suburb", parts.suburb);
	}

	return (
		<div>
			<h3 className="text-[22px] mb-1">Your property details</h3>
			<p className="text-[var(--color-muted)] text-[15px] mb-6">
				We'll clean on your council collection day — so the bins are always
				freshly emptied first.
			</p>

			<FieldWrap label="Street address">
				<AddressAutocomplete
					value={data.address}
					onStringChange={(v) => update("address", v)}
					onAddressSelect={handleAddressSelect}
					placeholder="Start typing your address…"
				/>
			</FieldWrap>

			<FieldWrap
				label="Suburb"
				hint={
					<span className="text-[var(--color-green-deep)] font-semibold">
						{data.postcode}
					</span>
				}
			>
				<Input
					value={data.suburb}
					onStringChange={(v) => update("suburb", v)}
					placeholder={council?.suburb.split(" / ")[0] ?? "Suburb"}
				/>
			</FieldWrap>

			{/* Bin day — confirm chip or picker */}
			<div className="mb-4">
				<div className="flex items-center justify-between mb-[7px]">
					<label className="font-semibold text-[13px] text-[var(--color-ink)]">
						Your bin collection day
					</label>
					{council && !showDayPicker && (
						<a
							href={council.binDayUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-1 text-[12px] text-[var(--color-teal)] font-semibold hover:underline"
						>
							Check council website <ExternalLink size={10} />
						</a>
					)}
				</div>

				{/* If we have a suggested day and the user hasn't switched to manual, show confirm UI */}
				{dayConfirmed && hasSuggestedDay && !showDayPicker ? (
					<div className="flex items-center gap-3 px-4 py-3 rounded-[12px] bg-[color-mix(in_srgb,var(--color-green)_10%,transparent)] border border-[color-mix(in_srgb,var(--color-green)_30%,transparent)]">
						<CheckCircle2
							size={18}
							className="text-[var(--color-green-deep)] flex-none"
						/>
						<div className="flex-1">
							<p className="font-bold text-[15px] text-[var(--color-green-deep)]">
								{data.binday}
							</p>
							{council.confidence !== "high" && (
								<p className="text-[12px] text-[var(--color-muted)] mt-0.5">
									Estimated — please verify
								</p>
							)}
						</div>
						<button
							type="button"
							onClick={() => setShowDayPicker(true)}
							className="text-[13px] font-semibold text-[var(--color-teal)] hover:underline flex-none"
						>
							Change
						</button>
					</div>
				) : (
					<>
						<select
							value={data.binday}
							onChange={(e) => {
								update("binday", e.target.value);
								setShowDayPicker(false);
							}}
							className="w-full px-4 py-3 border-[1.5px] border-[var(--color-line)] rounded-[12px] font-body text-[15px] bg-white text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-green)] transition-colors"
						>
							<option value="">Select your bin day…</option>
							{["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map(
								(d) => (
									<option key={d}>{d}</option>
								),
							)}
							<option value="Not sure">Not sure yet</option>
						</select>
						{council && (
							<p className="mt-1.5 text-[12px] text-[var(--color-muted)]">
								Bin days vary by street. Use the council website link above to
								find yours in 30 seconds.
							</p>
						)}
					</>
				)}
			</div>

			<div className="flex gap-3">
				<Btn variant="ghost" onClick={onBack}>
					<ArrowLeft size={16} /> Back
				</Btn>
				<Btn onClick={onNext} disabled={!canNext}>
					Continue <ArrowRight size={16} />
				</Btn>
			</div>
		</div>
	);
}

// ─── Step 5 — Contact + Date ─────────────────────────────────────────────────

function StepContact({ data, update, onNext, onBack }: StepProps) {
	const canNext =
		data.name.trim().length > 1 &&
		data.phone.trim().length > 7 &&
		data.email.includes("@") &&
		data.date.length > 0;

	// Min date = tomorrow
	const tomorrow = new Date();
	tomorrow.setDate(tomorrow.getDate() + 1);
	const minDate = tomorrow.toISOString().split("T")[0];

	return (
		<div>
			<h3 className="text-[22px] mb-1">Your contact details</h3>
			<p className="text-[var(--color-muted)] text-[15px] mb-6">
				We'll text to confirm your first clean date.
			</p>

			<FieldWrap label="Full name">
				<Input
					value={data.name}
					onStringChange={(v) => update("name", v)}
					placeholder="Jane Smith"
				/>
			</FieldWrap>

			<div className="grid grid-cols-2 gap-3">
				<FieldWrap label="Mobile">
					<Input
						value={data.phone}
						onStringChange={(v) => update("phone", v)}
						type="tel"
						placeholder="0400 000 000"
					/>
				</FieldWrap>
				<FieldWrap label="Email">
					<Input
						value={data.email}
						onStringChange={(v) => update("email", v)}
						type="email"
						placeholder="you@email.com"
					/>
				</FieldWrap>
			</div>

			<FieldWrap label="Preferred first clean date">
				<input
					type="date"
					min={minDate}
					value={data.date}
					onChange={(e) => update("date", e.target.value)}
					className="w-full px-4 py-3 border-[1.5px] border-[var(--color-line)] rounded-[12px] font-body text-[15px] bg-white text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-green)] transition-colors"
				/>
				<p className="mt-1.5 text-[12px] text-[var(--color-muted)]">
					Should be a day your bins are out. We'll confirm the exact date by
					text.
				</p>
			</FieldWrap>

			<div className="flex gap-3">
				<Btn variant="ghost" onClick={onBack}>
					<ArrowLeft size={16} /> Back
				</Btn>
				<Btn onClick={onNext} disabled={!canNext}>
					Review booking <ArrowRight size={16} />
				</Btn>
			</div>
		</div>
	);
}

// ─── Step 6 — Confirm ────────────────────────────────────────────────────────

function SummaryRow({
	icon,
	label,
	value,
}: {
	icon: React.ReactNode;
	label: string;
	value: string;
}) {
	return (
		<div className="flex items-start gap-3 py-3 border-b border-[var(--color-line)] last:border-0">
			<span className="mt-0.5 text-[var(--color-green-deep)] flex-none">
				{icon}
			</span>
			<div className="flex-1 min-w-0">
				<p className="text-[12px] text-[var(--color-muted)] uppercase tracking-wide font-semibold">
					{label}
				</p>
				<p className="text-[15px] font-semibold text-[var(--color-ink)] mt-0.5">
					{value}
				</p>
			</div>
		</div>
	);
}

function StepConfirm({
	data,
	onBack,
	onSubmit,
}: StepProps & { onSubmit: () => void }) {
	const freq = FREQUENCY_OPTIONS.find((f) => f.id === data.frequency);
	const price = data.frequency
		? calculatePrice(data.frequency as Frequency, data.bins)
		: 0;
	const savings =
		data.frequency === "one-off" ? calculateSavings(data.bins) : 0;
	const binStr = BIN_OPTIONS.filter(({ id }) => data.bins[id] > 0)
		.map(({ id, label }) => `${data.bins[id]}× ${label}`)
		.join(", ");
	const dateStr = data.date
		? new Date(data.date + "T12:00:00").toLocaleDateString("en-AU", {
				weekday: "long",
				day: "numeric",
				month: "long",
				year: "numeric",
			})
		: "";

	return (
		<div>
			<h3 className="text-[22px] mb-1">Review your booking</h3>
			<p className="text-[var(--color-muted)] text-[15px] mb-5">
				Everything look right? You'll pay on the next page.
			</p>

			{/* Price highlight */}
			<div className="flex items-center justify-between px-5 py-4 rounded-[14px] bg-[color-mix(in_srgb,var(--color-green)_8%,transparent)] border border-[color-mix(in_srgb,var(--color-green)_25%,transparent)] mb-4">
				<div>
					<p className="text-[11px] font-bold tracking-widest uppercase text-[var(--color-muted)]">
						Price per clean
					</p>
					<p className="font-display font-black text-[28px] leading-tight text-[var(--color-green)]">
						${price}
						<span className="text-[14px] font-semibold text-[var(--color-muted)] ml-1">
							/ clean
						</span>
					</p>
				</div>
				<div className="text-right">
					<p className="text-[13px] font-semibold text-[var(--color-ink)]">
						{freq?.label}
					</p>
					<p className="text-[12px] text-[var(--color-muted)]">{binStr}</p>
				</div>
			</div>

			{/* One-off upsell in confirm step */}
			{savings > 0 && (
				<div className="flex items-start gap-2 px-4 py-3 rounded-[12px] bg-[color-mix(in_srgb,var(--color-lime)_12%,transparent)] border border-[color-mix(in_srgb,var(--color-lime)_35%,transparent)] mb-4">
					<span className="text-[16px] leading-none mt-0.5">💡</span>
					<p className="text-[12px] text-[var(--color-ink)]">
						<strong>Prefer ongoing?</strong> Switch to fortnightly and pay just
						${calculatePrice("fortnightly", data.bins)}/clean — saving $
						{savings} every visit, no lock-in.
					</p>
				</div>
			)}

			<div className="bg-[var(--color-surface-2)] border border-[var(--color-line)] rounded-[16px] px-5 mb-5">
				<SummaryRow
					icon={<MapPin size={16} />}
					label="Address"
					value={`${data.address}, ${data.suburb} ${data.postcode}`}
				/>
				<SummaryRow
					icon={<CalendarDays size={16} />}
					label="Service"
					value={`${freq?.label ?? ""} — bin day: ${data.binday}`}
				/>
				<SummaryRow icon={<Trash2 size={16} />} label="Bins" value={binStr} />
				<SummaryRow
					icon={<CalendarDays size={16} />}
					label="First clean"
					value={dateStr}
				/>
				<SummaryRow
					icon={<User size={16} />}
					label="Contact"
					value={`${data.name} · ${data.phone}`}
				/>
			</div>

			<div className="bg-[color-mix(in_srgb,var(--color-navy)_6%,transparent)] border border-[color-mix(in_srgb,var(--color-navy)_15%,transparent)] rounded-[14px] px-5 py-4 mb-6 text-[14px] text-[var(--color-muted)]">
				<strong className="text-[var(--color-ink)]">Next step:</strong> You'll
				be taken to our secure checkout page where your details will be
				pre-filled. Payment is handled there — takes under a minute.
			</div>

			<div className="flex gap-3">
				<Btn variant="ghost" onClick={onBack}>
					<ArrowLeft size={16} /> Back
				</Btn>
				<Btn onClick={onSubmit}>
					Proceed to payment <ChevronRight size={16} />
				</Btn>
			</div>
		</div>
	);
}

// ─── Step props ───────────────────────────────────────────────────────────────

interface StepProps {
	data: WizardData;
	update: <K extends keyof WizardData>(key: K, value: WizardData[K]) => void;
	onNext: () => void;
	onBack: () => void;
}

// ─── Main wizard ─────────────────────────────────────────────────────────────

export function BookingWizard() {
	const [step, setStep] = useState(0);
	const [dir, setDir] = useState<1 | -1>(1);
	const [data, setData] = useState<WizardData>(EMPTY);
	const posthog = usePostHog();

	function update<K extends keyof WizardData>(key: K, value: WizardData[K]) {
		setData((prev) => ({ ...prev, [key]: value }));
	}

	function next() {
		setDir(1);
		setStep((s) => s + 1);
		posthog?.capture("booking_wizard_step", { step: step + 1 });
	}

	function back() {
		setDir(-1);
		setStep((s) => s - 1);
	}

	function handleSubmit() {
		posthog?.capture("booking_wizard_submitted", {
			postcode: data.postcode,
			frequency: data.frequency,
			total_bins: data.bins.general + data.bins.recycling + data.bins.green,
		});
		const url = buildWooCommerceUrl({
			frequency: data.frequency as never,
			postcode: data.postcode,
			address: data.address,
			suburb: data.suburb,
			binday: data.binday,
			bins: data.bins,
			name: data.name,
			phone: data.phone,
			email: data.email,
			date: data.date,
		});
		window.location.href = url;
	}

	const props: StepProps = { data, update, onNext: next, onBack: back };

	return (
		<section
			className="py-[78px] bg-[linear-gradient(135deg,#0C3A52_0%,#14708e_55%,#1E9466_100%)]"
			id="book"
		>
			<div className="mx-auto max-w-[1180px] px-6 grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-[54px] items-start">
				{/* Left — sell copy */}
				<div className="text-white pt-2 lg:sticky lg:top-28">
					<span className="inline-flex items-center gap-2 font-body font-bold text-[13px] tracking-[.14em] uppercase text-[var(--color-lime)]">
						<span className="w-[7px] h-[7px] rounded-full bg-[var(--color-lime)]" />
						Tarneit launch offer
					</span>
					<h2 className="mt-3.5 text-[clamp(30px,3.6vw,48px)] text-white font-black leading-tight">
						Book your 2 cleans
						<br />
						for $39
					</h2>
					<p className="mt-4 text-[17px] opacity-85 max-w-[26em]">
						Lock in both bins, two visits a month apart, for less than half the
						usual price. Secure your spot before the Tarneit round fills up.
					</p>
					<ul className="mt-6 flex flex-col gap-3">
						{[
							"Both bins cleaned, sanitised & deodorised",
							"Two visits, one month apart",
							"Same day as your council collection",
							"No lock-in — cancel anytime",
						].map((p) => (
							<li
								key={p}
								className="flex items-center gap-3 text-[15px] font-semibold opacity-90"
							>
								<svg
									className="w-5 h-5 text-[var(--color-lime)] flex-none"
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

					{/* Trust signals */}
					<div className="mt-8 flex items-center gap-3 opacity-80">
						<div className="flex gap-0.5 text-[#F5A623]">
							{Array(5)
								.fill(null)
								.map((_, i) => (
									<svg
										key={i}
										className="w-4 h-4"
										viewBox="0 0 24 24"
										fill="currentColor"
									>
										<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
									</svg>
								))}
						</div>
						<span className="text-[13px] font-semibold">
							Rated 5★ on Google · local &amp; trusted
						</span>
					</div>
				</div>

				{/* Right — wizard card */}
				<div className="bg-white text-[var(--color-ink)] rounded-[24px] p-8 shadow-[0_30px_60px_-24px_rgba(12,58,82,.4)]">
					<StepBar step={step} />
					{step > 0 && <PriceStrip data={data} />}

					<div className="overflow-hidden relative min-h-[320px]">
						<AnimatePresence mode="wait" initial={false}>
							<motion.div key={step} {...slide(dir)}>
								{step === 0 && <StepPostcode {...props} />}
								{step === 1 && <StepFrequency {...props} />}
								{step === 2 && <StepBins {...props} />}
								{step === 3 && <StepAddress {...props} />}
								{step === 4 && <StepContact {...props} />}
								{step === 5 && (
									<StepConfirm {...props} onSubmit={handleSubmit} />
								)}
							</motion.div>
						</AnimatePresence>
					</div>
				</div>
			</div>
		</section>
	);
}
