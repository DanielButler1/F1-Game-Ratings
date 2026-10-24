"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { ThemeToggle } from "./theme-toggle";
import { Menu } from "lucide-react";
import {
	Drawer,
	DrawerContent,
	DrawerTrigger,
	DrawerHeader,
	DrawerTitle,
	DrawerClose,
} from "./ui/drawer";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navigation = [
	{ href: "/drivers", label: "Drivers" },
	{ href: "/teams", label: "Teams" },
	{ href: "/games", label: "Games" },
	{ href: "/compare", label: "Compare" },
	{ href: "/timeline", label: "Timeline" },
	{ href: "/updates", label: "Updates" },
	{ href: "/about", label: "About" },
];

const navItem =
	"text-muted-foreground hover:text-foreground rounded-md px-2.5 py-1.5 whitespace-nowrap transition-colors";

export function Logo() {
	return (
		<span className="flex items-center gap-2">
			<span className="rounded bg-[#e10600] px-1.5 py-0.5 text-base font-bold leading-tight text-white dark:bg-[#cc0500]">
				F1
			</span>
			<span className="font-bold tracking-tight">Driver Ratings</span>
		</span>
	);
}

export default function Header() {
	const [isOpen, setIsOpen] = useState(false);
	const pathname = usePathname();

	const isActiveRoute = (href: string) =>
		pathname === href || pathname.startsWith(`${href}/`);

	return (
		<header className="bg-background/85 sticky top-0 z-40 border-b backdrop-blur">
			<div className="mx-auto flex h-14 w-full max-w-7xl items-center gap-3 px-4 sm:px-6 lg:gap-6 lg:px-10">
				<Link href="/" className="shrink-0" aria-label="F1 Driver Ratings home">
					<Logo />
				</Link>
				<nav className="hidden min-w-0 items-center gap-1 text-sm lg:flex">
					{navigation.map((item) => (
						<Link
							key={item.href}
							href={item.href}
							aria-current={
								isActiveRoute(item.href) ? "page" : undefined
							}
							className={cn(
								navItem,
								isActiveRoute(item.href) &&
									"text-foreground bg-muted"
							)}
						>
							{item.label}
						</Link>
					))}
				</nav>
				<div className="ml-auto flex items-center gap-1.5 sm:gap-2">
					<ThemeToggle />
					<Drawer open={isOpen} onOpenChange={setIsOpen}>
						<DrawerTrigger asChild className="lg:hidden">
							<Button variant="ghost" size="icon" aria-label="Menu">
								<Menu className="size-5" />
							</Button>
						</DrawerTrigger>
						<DrawerContent>
							<DrawerHeader className="border-b">
								<DrawerTitle>
									<Logo />
								</DrawerTitle>
							</DrawerHeader>
							<nav className="flex flex-col gap-1 p-3">
								{navigation.map((item) => (
									<DrawerClose key={item.href} asChild>
										<Link
											href={item.href}
											aria-current={
												isActiveRoute(item.href)
													? "page"
													: undefined
											}
											className={cn(
												"hover:bg-muted rounded-lg px-3 py-2.5 text-[15px] transition-colors",
												isActiveRoute(item.href) &&
													"bg-muted font-medium"
											)}
										>
											{item.label}
										</Link>
									</DrawerClose>
								))}
							</nav>
						</DrawerContent>
					</Drawer>
				</div>
			</div>
		</header>
	);
}
