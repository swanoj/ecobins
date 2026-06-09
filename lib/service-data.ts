export const SERVICE_POSTCODES = [
	"3011",
	"3012",
	"3013",
	"3015",
	"3016",
	"3018",
	"3019",
	"3024",
	"3025",
	"3026",
	"3027",
	"3028",
	"3029",
	"3030",
	"3032",
] as const;

export type ServicePostcode = (typeof SERVICE_POSTCODES)[number];

// confidence: "high" = from official Wyndham council map
//             "medium" = strong local knowledge, verify via link
//             "low" = educated guess, always prompt to verify
export interface CouncilInfo {
	name: string;
	suburb: string;
	binDayUrl: string;
	suggestedBinDay: string;
	confidence: "high" | "medium" | "low";
	binDayNote?: string;
}

export const POSTCODE_COUNCIL: Record<string, CouncilInfo> = {
	// ── Maribyrnong ───────────────────────────────────────────────────────────
	"3011": {
		name: "Maribyrnong City Council",
		suburb: "West Footscray / Kingsville",
		binDayUrl:
			"https://www.maribyrnong.vic.gov.au/Residents/Waste-and-Recycling/Bin-Collection",
		suggestedBinDay: "Tuesday",
		confidence: "low",
	},
	"3012": {
		name: "Maribyrnong City Council",
		suburb: "Brooklyn / Yarraville",
		binDayUrl:
			"https://www.maribyrnong.vic.gov.au/Residents/Waste-and-Recycling/Bin-Collection",
		suggestedBinDay: "Thursday",
		confidence: "low",
	},
	"3013": {
		name: "Maribyrnong City Council",
		suburb: "Seddon / Yarraville",
		binDayUrl:
			"https://www.maribyrnong.vic.gov.au/Residents/Waste-and-Recycling/Bin-Collection",
		suggestedBinDay: "Thursday",
		confidence: "low",
	},

	// ── Hobsons Bay ───────────────────────────────────────────────────────────
	"3015": {
		name: "Hobsons Bay City Council",
		suburb: "Newport / Spotswood",
		binDayUrl:
			"https://www.hobsonsbay.vic.gov.au/Services/Waste-and-recycling/When-will-my-bins-be-collected",
		suggestedBinDay: "Tuesday",
		confidence: "medium",
	},
	"3016": {
		name: "Hobsons Bay City Council",
		suburb: "Williamstown",
		binDayUrl:
			"https://www.hobsonsbay.vic.gov.au/Services/Waste-and-recycling/When-will-my-bins-be-collected",
		suggestedBinDay: "Tuesday",
		confidence: "medium",
	},
	"3018": {
		name: "Hobsons Bay City Council",
		suburb: "Altona / Seaholme",
		binDayUrl:
			"https://www.hobsonsbay.vic.gov.au/Services/Waste-and-recycling/When-will-my-bins-be-collected",
		suggestedBinDay: "Tuesday",
		confidence: "medium",
	},
	"3019": {
		name: "Hobsons Bay City Council",
		suburb: "Altona North",
		binDayUrl:
			"https://www.hobsonsbay.vic.gov.au/Services/Waste-and-recycling/When-will-my-bins-be-collected",
		suggestedBinDay: "Tuesday",
		confidence: "medium",
	},
	"3025": {
		name: "Hobsons Bay City Council",
		suburb: "Altona Meadows / Laverton",
		binDayUrl:
			"https://www.hobsonsbay.vic.gov.au/Services/Waste-and-recycling/When-will-my-bins-be-collected",
		suggestedBinDay: "Tuesday",
		confidence: "medium",
	},
	"3026": {
		name: "Wyndham City Council",
		suburb: "Laverton North",
		binDayUrl:
			"https://www.wyndham.vic.gov.au/services/waste-recycling/household-bins/household-bin-services",
		suggestedBinDay: "Tuesday",
		confidence: "high",
	},
	"3028": {
		name: "Hobsons Bay City Council",
		suburb: "Altona Meadows",
		binDayUrl:
			"https://www.hobsonsbay.vic.gov.au/Services/Waste-and-recycling/When-will-my-bins-be-collected",
		suggestedBinDay: "Tuesday",
		confidence: "medium",
	},

	// ── Wyndham (from official Wyndham City Council collection map) ───────────
	"3024": {
		name: "Wyndham City Council",
		suburb: "Hoppers Crossing / Wyndham Vale",
		binDayUrl:
			"https://www.wyndham.vic.gov.au/services/waste-recycling/household-bins/household-bin-services",
		suggestedBinDay: "Wednesday",
		confidence: "high",
		binDayNote:
			"Most of Hoppers Crossing is Wednesday. Outer Wyndham Vale may be Thursday or Friday.",
	},
	"3027": {
		name: "Wyndham City Council",
		suburb: "Williams Landing",
		binDayUrl:
			"https://www.wyndham.vic.gov.au/services/waste-recycling/household-bins/household-bin-services",
		suggestedBinDay: "Tuesday",
		confidence: "high",
	},
	"3029": {
		name: "Wyndham City Council",
		suburb: "Tarneit / Hoppers Crossing / Werribee",
		binDayUrl:
			"https://www.wyndham.vic.gov.au/services/waste-recycling/household-bins/household-bin-services",
		suggestedBinDay: "Wednesday",
		confidence: "high",
		binDayNote:
			"Tarneit and Hoppers Crossing are Wednesday. Werribee is Thursday.",
	},
	"3030": {
		name: "Wyndham City Council",
		suburb: "Point Cook",
		binDayUrl:
			"https://www.wyndham.vic.gov.au/services/waste-recycling/household-bins/household-bin-services",
		suggestedBinDay: "Monday",
		confidence: "high",
	},

	// ── Moonee Valley ─────────────────────────────────────────────────────────
	"3032": {
		name: "Moonee Valley City Council",
		suburb: "Ascot Vale / Moonee Ponds",
		binDayUrl:
			"https://www.mvcc.vic.gov.au/waste-and-environment/rubbish-and-recycling/",
		suggestedBinDay: "Thursday",
		confidence: "low",
	},
};

export type Frequency = "weekly" | "fortnightly" | "monthly" | "one-off";

export interface PricingTier {
	basePerBin: number;
	addOnPerBin: number;
}

export const PRICING: Record<Frequency, PricingTier> = {
	weekly: { basePerBin: 12, addOnPerBin: 10 },
	fortnightly: { basePerBin: 14, addOnPerBin: 10 },
	monthly: { basePerBin: 18, addOnPerBin: 10 },
	"one-off": { basePerBin: 35, addOnPerBin: 15 },
};

export function calculatePrice(
	frequency: Frequency,
	bins: Record<BinType, number>,
): number {
	const { basePerBin, addOnPerBin } = PRICING[frequency];
	const total = bins.general + bins.recycling + bins.green;
	if (total === 0) return basePerBin;
	return basePerBin + Math.max(0, total - 1) * addOnPerBin;
}

export function calculateSavings(bins: Record<BinType, number>): number {
	// How much cheaper fortnightly is vs one-off per clean (over 3 cleans)
	const oneOff = calculatePrice("one-off", bins);
	const fortnightly = calculatePrice("fortnightly", bins);
	return oneOff - fortnightly;
}

export interface FrequencyOption {
	id: Frequency;
	label: string;
	sublabel: string;
	wcSlug: string;
	badge?: string;
}

export const FREQUENCY_OPTIONS: FrequencyOption[] = [
	{
		id: "weekly",
		label: "Every week",
		sublabel: "Best protection — never a missed cycle",
		wcSlug: "residential-bin-cleaning-weekly",
	},
	{
		id: "fortnightly",
		label: "Every 2 weeks",
		sublabel: "Most popular — clean every other collection",
		wcSlug: "residential-bin-cleaning-every-2-weeks",
		badge: "Most popular",
	},
	{
		id: "monthly",
		label: "Every 4 weeks",
		sublabel: "Light use households",
		wcSlug: "residential-bin-cleaning-every-4-weeks",
	},
	{
		id: "one-off",
		label: "One-off clean",
		sublabel: "Just this once",
		wcSlug: "residential-bin-cleaning-one-off-bin-clean",
	},
];

export type BinType = "general" | "recycling" | "green";

export interface BinOption {
	id: BinType;
	label: string;
	lid: string; // lid colour for visual indicator
	hex: string;
	desc: string;
}

export const BIN_OPTIONS: BinOption[] = [
	{
		id: "general",
		label: "General Waste",
		lid: "Red lid",
		hex: "#DC2626",
		desc: "Household rubbish",
	},
	{
		id: "recycling",
		label: "Recycling",
		lid: "Yellow lid",
		hex: "#CA8A04",
		desc: "Cardboard, bottles, cans",
	},
	{
		id: "green",
		label: "Green / Garden",
		lid: "Green lid",
		hex: "#16A34A",
		desc: "Grass, leaves, food scraps",
	},
];

// Build the WooCommerce prefill redirect URL
export function buildWooCommerceUrl(params: {
	frequency: Frequency;
	postcode: string;
	address: string;
	suburb: string;
	binday: string;
	bins: Record<BinType, number>;
	name: string;
	phone: string;
	email: string;
	date: string;
}): string {
	const base = "https://ecobincleaning.net/product";
	const slug =
		FREQUENCY_OPTIONS.find((f) => f.id === params.frequency)?.wcSlug ??
		"residential-bin-cleaning-weekly";

	const q = new URLSearchParams({
		prefill_postcode: params.postcode,
		prefill_address: params.address,
		prefill_suburb: params.suburb,
		prefill_binday: params.binday,
		prefill_bins_general: String(params.bins.general),
		prefill_bins_recycling: String(params.bins.recycling),
		prefill_bins_green: String(params.bins.green),
		prefill_name: params.name,
		prefill_phone: params.phone,
		prefill_email: params.email,
		prefill_date: params.date,
	});

	return `${base}/${slug}/?${q.toString()}`;
}
