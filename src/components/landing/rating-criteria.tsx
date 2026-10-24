import { Brain, Eye, Gauge, Swords } from "lucide-react";
import { Section } from "@/components/page";

const criteria = [
	{
		icon: Brain,
		title: "Experience",
		description:
			"Reflects a driver's experience in Formula 1 and their ability to handle different racing situations.",
	},
	{
		icon: Swords,
		title: "Racecraft",
		description:
			"Measures a driver's ability to race wheel-to-wheel, overtake, and defend their position.",
	},
	{
		icon: Eye,
		title: "Awareness",
		description:
			"Indicates how well a driver avoids incidents and maintains spatial awareness during races.",
	},
	{
		icon: Gauge,
		title: "Pace",
		description:
			"Represents raw speed and the ability to consistently deliver fast lap times.",
	},
];

export default function RatingCriteriaSection() {
	return (
		<Section title="Rating criteria">
			<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
				{criteria.map(({ icon: Icon, title, description }) => (
					<div key={title} className="space-y-4 border-t pt-5">
						<div className="flex items-center gap-3">
							<div className="flex size-9 items-center justify-center rounded-full border">
								<Icon className="text-muted-foreground size-4" />
							</div>
							<h3 className="font-semibold">{title}</h3>
						</div>
						<p className="text-muted-foreground text-sm leading-6">
							{description}
						</p>
					</div>
				))}
			</div>
		</Section>
	);
}
