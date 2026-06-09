/**
 * Eco Bin Cleaning — WooCommerce prefill snippet
 *
 * Paste this into WordPress Admin → Appearance → Customize → Additional CSS/JS
 * (or use the "Insert Headers and Footers" plugin → Footer Scripts)
 *
 * When a user completes the booking wizard on ecobincleaning.net (Next.js site)
 * they are redirected here with prefill_* query params. This script reads those
 * params and fills in the product form fields automatically.
 */
(() => {
	const p = new URLSearchParams(window.location.search);
	if (!p.has("prefill_postcode")) return; // not a prefill redirect, do nothing

	function fill(selector, value) {
		if (!value) return;
		const el = document.querySelector(selector);
		if (!el) return;
		const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
			window[el.tagName === "SELECT" ? "HTMLSelectElement" : "HTMLInputElement"]
				.prototype,
			"value",
		).set;
		nativeInputValueSetter.call(el, value);
		el.dispatchEvent(new Event("input", { bubbles: true }));
		el.dispatchEvent(new Event("change", { bubbles: true }));
	}

	function tryFill() {
		// -- Adjust the selectors below to match the actual field names/IDs on
		//    the WooCommerce product page once you have backend access and can inspect them.
		fill('[name="postcode"],  #postcode', p.get("prefill_postcode"));
		fill('[name="address"],   #address', p.get("prefill_address"));
		fill('[name="city"],      #city', p.get("prefill_suburb"));
		fill('[name="bin_day"],   #bin_day', p.get("prefill_binday"));
		fill('[name="first_clean_date"], #first_clean_date', p.get("prefill_date"));

		// Bin quantities (adjust names to match WooCommerce product fields)
		fill(
			'[name="bins_general"],   #bins_general',
			p.get("prefill_bins_general"),
		);
		fill(
			'[name="bins_recycling"], #bins_recycling',
			p.get("prefill_bins_recycling"),
		);
		fill('[name="bins_green"],     #bins_green', p.get("prefill_bins_green"));

		// Scroll the form into view
		const form = document.querySelector(
			"form.cart, .product form, form#product-form",
		);
		if (form) form.scrollIntoView({ behavior: "smooth", block: "center" });
	}

	// Run after DOM is ready and also after a short delay in case the form
	// is rendered by JS (some booking plugins hydrate after page load)
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", tryFill);
	} else {
		tryFill();
	}
	setTimeout(tryFill, 1200); // catch late-hydrating plugin fields
})();
