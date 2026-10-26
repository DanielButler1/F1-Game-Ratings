import { Brain, Eye, Gauge, Swords } from "lucide-react";

const criteria = [
	{
		icon: Brain,
		title: "Experience",
		description: "Time in Formula 1 and how well a driver handles any situation.",
	},
	{
		icon: Swords,
		title: "Racecraft",
		description: "Racing wheel-to-wheel, overtaking and defending position.",
	},
	{
		icon: Eye,
		title: "Awareness",
		description: "Avoiding incidents and keeping track of the cars around them.",
	},
	{
		icon: Gauge,
		title: "Pace",
		description: "Raw speed and consistently delivering fast lap times.",
	},
];

/** The four rated attributes, as a compact row under the home hero. */
export default function RatingCriteria() {
	return (
		<div className="mx-auto grid max-w-5xl gap-6 border-t pt-6 text-left sm:grid-cols-2 lg:grid-cols-4">
			{criteria.map(({ icon: Icon, title, description }) => (
				<div key={title} className="space-y-1.5">
					<Icon className="size-4 text-[#e10600] dark:text-[#ff3b30]" />
					<h3 className="pt-1 text-sm font-semibold">{title}</h3>
					<p className="text-muted-foreground text-sm leading-6">{description}</p>
				</div>
			))}
		</div>
	);
}
