import { Card } from "@/components/ui/card";
import { Page, PageHeader, Section } from "@/components/page";

const attributes = [
	{
		title: "Overall Rating",
		description:
			"The overall rating is a weighted average of all other attributes, representing a driver's complete ability. This is the primary metric used for quick comparisons between drivers.",
	},
	{
		title: "Experience",
		description:
			"Reflects a driver's time in F1 and their accumulated knowledge. Higher experience ratings indicate better race management and strategic decision-making capabilities.",
	},
	{
		title: "Racecraft",
		description:
			"Measures a driver's ability to race wheel-to-wheel, overtake, and defend positions. This rating impacts how well AI drivers perform in close racing situations.",
	},
	{
		title: "Awareness",
		description:
			"Represents spatial awareness and ability to avoid incidents. Drivers with high awareness ratings are less likely to be involved in collisions and make better decisions in traffic.",
	},
	{
		title: "Pace",
		description:
			"Indicates raw speed and qualifying performance. This rating affects a driver's ability to extract maximum performance from the car in both qualifying and race conditions.",
	},
];

export default function RatingSystemPage() {
	return (
		<Page>
			<PageHeader title="F1 Game Driver Rating System">
				The F1 game series uses a comprehensive rating system to
				evaluate drivers across multiple attributes. Each attribute is
				scored on a scale of 0-99, contributing to a driver&apos;s
				overall rating.
			</PageHeader>

			<div className="grid gap-4 md:grid-cols-2">
				{attributes.map((attribute) => (
					<Card key={attribute.title} className="gap-2 p-5">
						<h2 className="font-semibold">{attribute.title}</h2>
						<p className="text-muted-foreground text-sm">
							{attribute.description}
						</p>
					</Card>
				))}
			</div>

			<Section
				title="Rating updates"
				description="Driver ratings are updated throughout the F1 season to reflect real-world performance. Major updates typically coincide with game patches and can include:"
			>
				<ul className="text-muted-foreground list-inside list-disc space-y-2 text-sm">
					<li>
						Performance adjustments based on recent race results
					</li>
					<li>
						Modifications reflecting significant career milestones
					</li>
					<li>
						Changes due to exceptional performances or poor form
					</li>
					<li>Updates for rookie drivers as they gain experience</li>
				</ul>
			</Section>

			<Section title="Open source data">
				<p className="text-muted-foreground max-w-3xl text-sm">
					All driver ratings data used on this site is open source and
					can be found in our GitHub repository. This allows for
					community verification and contribution to ensure accuracy
					and transparency in our rating tracking system.
				</p>
			</Section>
		</Page>
	);
}
import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata(
	"Rating System",
	"Understand how the Formula One driver rating categories are defined and interpreted."
);
