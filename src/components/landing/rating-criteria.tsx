import { Card } from "@/components/ui/card";

export default function RatingCriteriaSection() {
	return (
		<section className="py-16">
			<div className="container mx-auto px-4">
				<h2 className="text-3xl font-bold mb-10">Rating Criteria</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					<Card className="p-6">
						<h3 className="text-xl font-semibold mb-3">
							Experience
						</h3>
						<p className="text-gray-600 dark:text-gray-400">
							Reflects a driver&apos;s experience in Formula 1 and
							their ability to handle different racing situations.
						</p>
					</Card>
					<Card className="p-6">
						<h3 className="text-xl font-semibold mb-3">
							Racecraft
						</h3>
						<p className="text-gray-600 dark:text-gray-400">
							Measures a driver&apos;s ability to race
							wheel-to-wheel, overtake, and defend their position.
						</p>
					</Card>
					<Card className="p-6">
						<h3 className="text-xl font-semibold mb-3">
							Awareness
						</h3>
						<p className="text-gray-600 dark:text-gray-400">
							Indicates how well a driver avoids incidents and
							maintains spatial awareness during races.
						</p>
					</Card>
					<Card className="p-6">
						<h3 className="text-xl font-semibold mb-3">Pace</h3>
						<p className="text-gray-600 dark:text-gray-400">
							Represents raw speed and the ability to consistently
							deliver fast lap times.
						</p>
					</Card>
				</div>
			</div>
		</section>
	);
}
