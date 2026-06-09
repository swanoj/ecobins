import { z } from "zod";

export const bookingSchema = z.object({
	name: z.string().min(2, "Please enter your full name"),
	phone: z.string().min(8, "Please enter a valid mobile number"),
	email: z.string().email("Please enter a valid email"),
	address: z.string().min(5, "Please enter your street address"),
	binday: z.string().min(1, "Please select your bin day"),
	bins: z.string().min(1, "Please select which bins"),
});

export type BookingFormData = z.infer<typeof bookingSchema>;
