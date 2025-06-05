import * as React from "react";
import { cn } from "@/lib/utils";

interface ComparisonBarProps {
	leftValue: number;
	rightValue: number;
	className?: string;
}

export function ComparisonBar({
	leftValue,
	rightValue,
	className,
}: ComparisonBarProps) {
	const total = leftValue + rightValue;
	const leftPercentage = total === 0 ? 0 : (leftValue / total) * 100;
	const rightPercentage = total === 0 ? 0 : (rightValue / total) * 100;

	const isLeftLower = leftValue < rightValue;
	const isRightLower = rightValue < leftValue;

	return (
		<div className="flex items-center w-full gap-4">
			{/* Left value */}
			<div className="text-right">
				<span className="text-sm font-medium">{leftValue}</span>
			</div>

			{/* Bar container */}
			<div
				className={cn(
					"relative h-2 flex-1 flex items-center",
					className
				)}
			>
				{/* Center dividing line */}
				<div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-border transform -translate-x-1/2" />

				{/* Left bar */}
				<div className="absolute right-1/2 w-1/2 h-full">
					<div
						className={cn(
							"h-full rounded-l-full transition-all ml-auto",
							isLeftLower ? "bg-blue-500/25" : "bg-blue-500"
						)}
						style={{ width: `${leftPercentage}%` }}
					/>
				</div>

				{/* Right bar */}
				<div className="absolute left-1/2 w-1/2 h-full">
					<div
						className={cn(
							"h-full rounded-r-full transition-all",
							isRightLower ? "bg-red-500/24" : "bg-red-500"
						)}
						style={{ width: `${rightPercentage}%` }}
					/>
				</div>
			</div>

			{/* Right value */}
			<div>
				<span className="text-sm font-medium">{rightValue}</span>
			</div>
		</div>
	);
}
