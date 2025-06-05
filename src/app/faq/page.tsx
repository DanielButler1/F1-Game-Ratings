import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQPage() {
	return (
		<div className="container mx-auto max-w-7xl px-4 py-12">
			<h1 className="text-4xl font-bold mb-8">
				Frequently Asked Questions
			</h1>

			<Accordion type="single" collapsible className="w-full">
				<AccordionItem value="item-1">
					<AccordionTrigger>
						How often are driver ratings updated?
					</AccordionTrigger>
					<AccordionContent>
						Driver ratings are updated whenever EA
						Sports/Codemasters releases a new patch for the current
						F1 game. These updates typically occur after significant
						real-world F1 events or when there are major changes in
						driver performance.
					</AccordionContent>
				</AccordionItem>

				<AccordionItem value="item-2">
					<AccordionTrigger>
						How are the ratings calculated?
					</AccordionTrigger>
					<AccordionContent>
						The ratings are determined by EA Sports/Codemasters
						based on real-world F1 performance data, historical
						results, and expert analysis. Each attribute
						(Experience, Racecraft, Awareness, and Pace) is
						evaluated independently, and the Overall rating is
						calculated as a weighted average of these attributes.
					</AccordionContent>
				</AccordionItem>

				<AccordionItem value="item-3">
					<AccordionTrigger>
						Why do some drivers have estimated ratings?
					</AccordionTrigger>
					<AccordionContent>
						When a driver hasn&apos;t received an official rating
						update in a newer game version, we may show estimated
						ratings based on their last known values. These
						estimates help provide continuity in tracking driver
						progression but are clearly marked as estimates.
					</AccordionContent>
				</AccordionItem>

				<AccordionItem value="item-4">
					<AccordionTrigger>
						Can I contribute to the project?
					</AccordionTrigger>
					<AccordionContent>
						Yes! This project is open source, and we welcome
						contributions. You can help by:
						<ul className="list-disc list-inside mt-2 space-y-1">
							<li>Adding missing driver ratings data</li>
							<li>Improving the website&apos;s features</li>
							<li>Fixing bugs</li>
							<li>Suggesting new features</li>
						</ul>
						Visit our GitHub repository to get started.
					</AccordionContent>
				</AccordionItem>

				<AccordionItem value="item-5">
					<AccordionTrigger>
						How can I compare drivers from different seasons?
					</AccordionTrigger>
					<AccordionContent>
						Use our Compare feature to select multiple drivers and
						view their ratings side by side. You can compare drivers
						from the same season or across different F1 games to see
						how their ratings have evolved over time.
					</AccordionContent>
				</AccordionItem>

				<AccordionItem value="item-6">
					<AccordionTrigger>What games are covered?</AccordionTrigger>
					<AccordionContent>
						We track driver ratings from F1 2020 through the latest
						F1 25 game. Each game&apos;s data includes the base
						release ratings and all subsequent patch updates that
						modified driver ratings.
					</AccordionContent>
				</AccordionItem>

				<AccordionItem value="item-7">
					<AccordionTrigger>
						How accurate are the ratings?
					</AccordionTrigger>
					<AccordionContent>
						The ratings are taken directly from official game data,
						so they reflect EA Sports/Codemasters&apos; official
						driver evaluations. While subjective, these ratings are
						based on real-world performance data and are regularly
						updated to maintain accuracy.
					</AccordionContent>
				</AccordionItem>

				<AccordionItem value="item-8">
					<AccordionTrigger>
						Where does the data come from?
					</AccordionTrigger>
					<AccordionContent>
						All ratings data is sourced directly from the official
						F1 game website releases. We extract this data after
						each game release and ratings update. Our process is
						transparent and can be reviewed in our open-source
						repository.
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	);
}
