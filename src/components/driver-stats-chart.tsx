"use client";

import { Card } from "@/components/ui/card";
import {
	RadarChart,
	PolarGrid,
	PolarAngleAxis,
	Radar,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import React from "react";

interface RadarDataPoint {
	stat: string;
	value: number;
}

interface DriverStatsChartProps {
	driverName: string;
	stats: {
		overall: number;
		experience: number;
		racecraft: number;
		awareness: number;
		pace: number;
	};
}

const CustomTooltip = ({
	active,
	payload,
}: {
	active?: boolean;
	payload?: Array<{
		value: number;
		payload: RadarDataPoint;
	}>;
}) => {
	if (!active || !payload?.length) return null;

	return (
		<div className="rounded-lg border bg-background p-2 shadow-md">
			<p className="font-medium text-sm">
				{payload[0].payload.stat}:{" "}
				<span className="text-blue-600">{payload[0].value}</span>
			</p>
		</div>
	);
};

export default function DriverStatsChart({
	stats,
}: DriverStatsChartProps) {
	const radarData = [
		{ stat: "Overall", value: stats.overall },
		{ stat: "Experience", value: stats.experience },
		{ stat: "Racecraft", value: stats.racecraft },
		{ stat: "Awareness", value: stats.awareness },
		{ stat: "Pace", value: stats.pace },
	];

	return (
		<Card className="p-6">
			<div className="space-y-4">
				<div className="items-center p-0">
					<h3 className="text-xl font-semibold">Driver Stats</h3>
				</div>
				<div className="h-[300px]">
					<ResponsiveContainer width="100%" height="100%">
						<RadarChart data={radarData}>
							<PolarGrid />
							<PolarAngleAxis
								dataKey="stat"
								tick={{ fontSize: 12 }}
							/>
							<Tooltip content={<CustomTooltip />} />
							<Radar
								name="Current Stats"
								dataKey="value"
								fill="transparent"
								stroke="#2563eb"
								strokeWidth={2}
							/>
						</RadarChart>
					</ResponsiveContainer>
				</div>
				<div className="pt-4">
					<div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
						<div className="col-span-2 flex justify-between items-center border-b pb-2 mb-2">
							<div>
								<span className="font-medium">Overall:</span>{" "}
								<span className="text-blue-600">
									{stats.overall}
								</span>
							</div>
						</div>
						<div className="flex justify-between">
							<span>Experience</span>
							<span className="text-blue-600">
								{stats.experience}
							</span>
						</div>
						<div className="flex justify-between">
							<span>Racecraft</span>
							<span className="text-blue-600">
								{stats.racecraft}
							</span>
						</div>
						<div className="flex justify-between">
							<span>Awareness</span>
							<span className="text-blue-600">
								{stats.awareness}
							</span>
						</div>
						<div className="flex justify-between">
							<span>Pace</span>
							<span className="text-blue-600">{stats.pace}</span>
						</div>
					</div>
				</div>
			</div>
		</Card>
	);
}
