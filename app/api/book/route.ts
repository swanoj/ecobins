import { NextResponse } from "next/server";
import { Resend } from "resend";
import { BookingConfirmation } from "@/emails/BookingConfirmation";
import { getSupabase } from "@/lib/supabase";
import { bookingSchema } from "@/lib/validations";

const resend = new Resend(process.env.RESEND_API_KEY || "re_mock_key_for_build");

export async function POST(req: Request) {
	const body = await req.json();
	const parsed = bookingSchema.safeParse(body);

	if (!parsed.success) {
		return NextResponse.json(
			{ error: parsed.error.flatten() },
			{ status: 400 },
		);
	}

	const { name, email, phone, address, binday, bins } = parsed.data;

	// Store lead in Supabase (cast until typed schema is generated via `supabase gen types`)
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const { error: dbError } = await (getSupabase() as any)
		.from("bookings")
		.insert({
			name,
			email,
			phone,
			address,
			binday,
			bins,
		});

	if (dbError) {
		console.error("Supabase insert error:", dbError);
		// Don't fail the user request — still send email
	}

	// Send confirmation email to customer
	await resend.emails.send({
		from: "Eco Bin Cleaning <hello@ecobincleaning.net>",
		to: email,
		subject: "You're booked! 2 cleans for $39 — Eco Bin Cleaning",
		react: BookingConfirmation({ name, address, binday, bins }),
	});

	// Notify owner
	await resend.emails.send({
		from: "Eco Bin Cleaning Bookings <hello@ecobincleaning.net>",
		to: "info@ecobincleaning.net",
		subject: `New booking: ${name} — ${address}`,
		react: BookingConfirmation({ name, address, binday, bins }),
	});

	return NextResponse.json({ success: true });
}
