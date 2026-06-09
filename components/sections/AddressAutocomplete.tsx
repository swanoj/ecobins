"use client";

import { useEffect, useRef, useState } from "react";

interface AddressParts {
	streetAddress: string;
	suburb: string;
	postcode: string;
}

interface Props {
	value: string;
	onStringChange: (v: string) => void;
	onAddressSelect?: (parts: AddressParts) => void;
	placeholder?: string;
	className?: string;
}

// Checks at runtime whether the Google Maps JS API is loaded
function hasGoogleMaps(): boolean {
	return (
		typeof window !== "undefined" &&
		typeof window.google !== "undefined" &&
		typeof window.google.maps !== "undefined" &&
		typeof window.google.maps.places !== "undefined"
	);
}

export function AddressAutocomplete({
	value,
	onStringChange,
	onAddressSelect,
	placeholder,
	className,
}: Props) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [ready, setReady] = useState(false);

	// Poll until Google Maps loads (handles async script strategy)
	useEffect(() => {
		if (hasGoogleMaps()) {
			setReady(true);
			return;
		}
		const id = setInterval(() => {
			if (hasGoogleMaps()) {
				setReady(true);
				clearInterval(id);
			}
		}, 300);
		return () => clearInterval(id);
	}, []);

	useEffect(() => {
		if (!ready || !inputRef.current) return;

		const autocomplete = new window.google.maps.places.Autocomplete(
			inputRef.current,
			{
				componentRestrictions: { country: "au" },
				fields: ["address_components", "formatted_address"],
				types: ["address"],
			},
		);

		const listener = autocomplete.addListener("place_changed", () => {
			const place = autocomplete.getPlace();
			if (!place.address_components) return;

			let streetNumber = "";
			let streetName = "";
			let suburb = "";
			let postcode = "";

			for (const component of place.address_components) {
				const types = component.types;
				if (types.includes("street_number")) streetNumber = component.long_name;
				else if (types.includes("route")) streetName = component.long_name;
				else if (types.includes("locality")) suburb = component.long_name;
				else if (types.includes("postal_code")) postcode = component.long_name;
			}

			const streetAddress = [streetNumber, streetName]
				.filter(Boolean)
				.join(" ");
			onStringChange(streetAddress);
			onAddressSelect?.({ streetAddress, suburb, postcode });
		});

		return () => {
			window.google.maps.event.removeListener(listener);
		};
	}, [ready, onStringChange, onAddressSelect]);

	return (
		<input
			ref={inputRef}
			value={value}
			onChange={(e) => onStringChange(e.target.value)}
			placeholder={
				placeholder ?? (ready ? "Start typing your address…" : "Street address")
			}
			className={
				className ??
				"w-full px-4 py-3 border-[1.5px] border-[var(--color-line)] rounded-[12px] font-body text-[15px] bg-white text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-green)] transition-colors"
			}
			autoComplete="off"
		/>
	);
}
