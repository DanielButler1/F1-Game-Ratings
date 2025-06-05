"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { ThemeToggle } from "./theme-toggle";
import { Menu } from "lucide-react";
import {
	Drawer,
	DrawerContent,
	DrawerTrigger,
	DrawerHeader,
	DrawerClose,
} from "./ui/drawer";
import { useState } from "react";

const navigation = [
	{ href: "/drivers", label: "Drivers" },
	{ href: "/teams", label: "Teams" },
	{ href: "/games", label: "Games" },
	{ href: "/compare", label: "Compare" },
	{ href: "/timeline", label: "Timeline" },
	{ href: "/about", label: "About" },
];

export default function Header() {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<header className="border-b bg-background">
			<div className="container mx-auto max-w-7xl px-4">
				<div className="flex items-center justify-between py-4">
					<nav className="flex items-center space-x-8">
						<Link href="/" className="flex items-center gap-2">
							<div className="bg-[#e10600] dark:bg-[#cc0500] text-white font-bold text-xl px-2 py-1 rounded">
								F1
							</div>
							<span className="font-bold text-lg">
								Driver Ratings
							</span>
						</Link>
						<div className="hidden md:flex items-center space-x-6">
							{navigation.map((item) => (
								<Button key={item.href} variant="ghost" asChild>
									<Link
										href={item.href}
										className="text-sm font-medium hover:text-primary"
									>
										{item.label}
									</Link>
								</Button>
							))}
						</div>
					</nav>
					<div className="flex items-center gap-4">
						<div className="hidden md:block">
							<ThemeToggle />
						</div>
						<Drawer open={isOpen} onOpenChange={setIsOpen}>
							<DrawerTrigger asChild className="md:hidden">
								<Button variant="ghost" size="icon">
									<Menu className="h-5 w-5" />
								</Button>
							</DrawerTrigger>
							<DrawerContent>
								<DrawerHeader className="text-right">
									<div className="flex flex-col space-y-4 p-4">
										{navigation.map((item) => (
											<DrawerClose
												key={item.href}
												asChild
											>
												<Link
													href={item.href}
													className="text-sm font-medium hover:text-primary"
													onClick={() =>
														setIsOpen(false)
													}
												>
													{item.label}
												</Link>
											</DrawerClose>
										))}
										<div className="pt-4">
											<ThemeToggle />
										</div>
									</div>
								</DrawerHeader>
							</DrawerContent>
						</Drawer>
					</div>
				</div>
			</div>
		</header>
	);
}
