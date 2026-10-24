import { Card } from "@/components/ui/card";
import { Section } from "@/components/page";

const criteria = [
	{
		title: "Experience",
		description:
			"Reflects a driver's experience in Formula 1 and their ability to handle different racing situations.",
	},
	{
		title: "Racecraft",
		description:
			"Measures a driver's ability to race wheel-to-wheel, overtake, and defend their position.",
	},
	{
		title: "Awareness",
		description:
			"Indicates how well a driver avoids incidents and maintains spatial awareness during races.",
	},
	{
		title: "Pace",
		description:
			"Represents raw speed and the ability to consistently deliver fast lap times.",
	},
];

export default function RatingCriteriaSection() {
	return (
		<Section title="Rating criteria">
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
				{criteria.map((item) => (
					<Card key={item.title} className="gap-2 p-5">
						<h3 className="font-semibold">{item.title}</h3>
						<p className="text-muted-foreground text-sm">
							{item.description}
						</p>
					</Card>
				))}
			</div>
		</Section>
	);
}
