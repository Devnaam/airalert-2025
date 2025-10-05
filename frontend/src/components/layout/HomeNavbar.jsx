import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const HomeNavbar = ({ scrollY }) => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	// Navbar background stays white with subtle shadow on scroll
	const navbarBg =
		scrollY > 20 ? "bg-white shadow-lg" : "bg-white/95 backdrop-blur-sm";

	const textColor = "text-gray-900";
	const accentColor = "#FF7F50";

	const navItems = [
		{ name: "Features", href: "#features" },
		{ name: "Technology", href: "#technology" },
		{ name: "Live Data", href: "#live-data" },
		{ name: "About", href: "/about" },
	];

	return (
		<nav
			className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navbarBg}`}
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					{/* Logo */}
					<Link to="/" className="flex items-center space-x-3">
						<div
							className={`w-10 h-10 bg-[${accentColor}] rounded-lg flex items-center justify-center transition-all duration-300`}
						>
							<span className="text-white text-xl font-bold">🌬️</span>
						</div>
						<div>
							<h1 className="text-xl font-bold text-gray-900">AirAlert Pro</h1>
							<p className="text-xs text-gray-500">NASA Space Apps 2025</p>
						</div>
					</Link>

					{/* Desktop Navigation */}
					<div className="hidden md:flex items-center space-x-8">
						{navItems.map((item) => (
							<a
								key={item.name}
								href={item.href}
								className={`text-sm font-medium transition-colors duration-300 hover:text-[${accentColor}] ${textColor}`}
							>
								{item.name}
							</a>
						))}

						<Link
							to="/dashboard"
							className={`bg-[${accentColor}] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-[#E57248] transition-all duration-300 transform hover:scale-105`}
						>
							Launch Dashboard
						</Link>
					</div>

					{/* Mobile menu button */}
					<div className="md:hidden">
						<button
							onClick={() => setIsMenuOpen(!isMenuOpen)}
							className={`p-2 rounded-md text-gray-900 transition-colors duration-300`}
						>
							{isMenuOpen ? (
								<X className="w-6 h-6" />
							) : (
								<Menu className="w-6 h-6" />
							)}
						</button>
					</div>
				</div>

				{/* Mobile Navigation */}
				{isMenuOpen && (
					<div className="md:hidden bg-white rounded-lg mt-2 p-4 shadow-lg">
						<div className="space-y-4">
							{navItems.map((item) => (
								<a
									key={item.name}
									href={item.href}
									className="block text-gray-900 text-sm font-medium hover:text-[#FF7F50] transition-colors"
									onClick={() => setIsMenuOpen(false)}
								>
									{item.name}
								</a>
							))}
							<Link
								to="/dashboard"
								className="block bg-[#FF7F50] text-white px-4 py-2 rounded-full text-sm font-medium text-center hover:bg-[#E57248] transition-all duration-300"
								onClick={() => setIsMenuOpen(false)}
							>
								Launch Dashboard
							</Link>
						</div>
					</div>
				)}
			</div>
		</nav>
	);
};

export default HomeNavbar;
