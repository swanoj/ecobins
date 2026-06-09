import {
	Body,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Preview,
	Section,
	Text,
} from "@react-email/components";

interface BookingConfirmationProps {
	name: string;
	address: string;
	binday: string;
	bins: string;
}

export function BookingConfirmation({
	name,
	address,
	binday,
	bins,
}: BookingConfirmationProps) {
	const firstName = name.trim().split(" ")[0];
	return (
		<Html>
			<Head />
			<Preview>You're booked! 2 cleans for $39 — Eco Bin Cleaning</Preview>
			<Body
				style={{
					backgroundColor: "#F2F6EF",
					fontFamily: "system-ui, sans-serif",
				}}
			>
				<Container
					style={{
						maxWidth: 560,
						margin: "40px auto",
						backgroundColor: "#fff",
						borderRadius: 18,
						padding: "40px 36px",
						boxShadow: "0 12px 30px -12px rgba(15,42,30,.18)",
					}}
				>
					<Heading
						style={{
							color: "#0F2A1E",
							fontSize: 28,
							fontWeight: 900,
							margin: "0 0 8px",
						}}
					>
						You're on the list, {firstName}! 🎉
					</Heading>
					<Text style={{ color: "#586b5e", fontSize: 16, marginTop: 0 }}>
						Thanks for booking the Tarneit launch offer. Here's what happens
						next:
					</Text>

					<Section
						style={{
							background: "#F2F6EF",
							borderRadius: 12,
							padding: "20px 24px",
							margin: "24px 0",
						}}
					>
						<Text
							style={{
								margin: "0 0 6px",
								fontSize: 14,
								fontWeight: 700,
								color: "#1F7A3D",
								textTransform: "uppercase",
								letterSpacing: "0.1em",
							}}
						>
							Your booking details
						</Text>
						<Text style={{ margin: "4px 0", fontSize: 15, color: "#0F2A1E" }}>
							<b>Address:</b> {address}
						</Text>
						<Text style={{ margin: "4px 0", fontSize: 15, color: "#0F2A1E" }}>
							<b>Bin day:</b> {binday}
						</Text>
						<Text style={{ margin: "4px 0", fontSize: 15, color: "#0F2A1E" }}>
							<b>Bins:</b> {bins}
						</Text>
					</Section>

					<Text style={{ color: "#0F2A1E", fontSize: 15 }}>
						We'll send you a text shortly to confirm your first clean date and a
						secure payment link for your $39 offer. No payment is needed until
						we confirm.
					</Text>

					<Hr style={{ borderColor: "#E3EADD", margin: "28px 0" }} />

					<Text style={{ color: "#586b5e", fontSize: 13 }}>
						Questions? Reply to this email or call/SMS <b>0402 544 575</b>.
						<br />— The Eco Bin Cleaning team 🌿
					</Text>
				</Container>
			</Body>
		</Html>
	);
}
