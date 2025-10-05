import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Play, Star, Users, Award, Zap } from "lucide-react";

const CallToAction = () => {
	const [email, setEmail] = useState("");
	const [isSubscribed, setIsSubscribed] = useState(false);

	const handleSubscribe = (e) => {
		e.preventDefault();
		if (email) {
			setIsSubscribed(true);
			setTimeout(() => setIsSubscribed(false), 3000);
			setEmail("");
		}
	};

	const stats = [
		{
			icon: <Users className="w-6 h-6" />,
			value: "1,000+",
			label: "Active Users",
		},
		{ icon: <Star className="w-6 h-6" />, value: "24/7", label: "Monitoring" },
		{ icon: <Award className="w-6 h-6" />, value: "NASA", label: "Space Apps" },
		{ icon: <Zap className="w-6 h-6" />, value: "99.9%", label: "Uptime" },
	];

	return (
		<section className="py-24 bg-gradient-to-br from-white via-[#FFF5F2] to-[#FF7F50]/10 relative overflow-hidden">
			{/* Background Elements */}
			<div className="absolute inset-0">
				<div className="absolute top-10 left-10 w-20 h-20 bg-blue-400/20 rounded-full blur-xl"></div>
				<div className="absolute top-40 right-20 w-32 h-32 bg-green-400/20 rounded-full blur-xl"></div>
				<div className="absolute bottom-20 left-1/4 w-24 h-24 bg-purple-400/20 rounded-full blur-xl"></div>

				{/* Animated Particles */}
				{[...Array(15)].map((_, i) => (
					<div
						key={i}
						className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse"
						style={{
							left: `${Math.random() * 100}%`,
							top: `${Math.random() * 100}%`,
							animationDelay: `${Math.random() * 3}s`,
							animationDuration: `${2 + Math.random() * 2}s`,
						}}
					/>
				))}
			</div>

			<div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Main CTA */}
				<div className="text-center mb-16">
					<h2 className="text-4xl sm:text-6xl font-bold text-white mb-6 leading-tight">
						Ready to Breathe
						<span className="block bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
							Easier?
						</span>
					</h2>
					<p className="text-xl sm:text-2xl text-gray-200 max-w-3xl mx-auto mb-8 leading-relaxed">
						Join thousands of users who trust AirAlert Pro for real-time air
						quality monitoring and health-focused environmental insights.
					</p>

					{/* Action Buttons */}
					<div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
						<Link
							to="/dashboard"
							className="group bg-[#FF7F50] text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-[#FF6B3C] transition-all duration-300 transform hover:scale-105 shadow-2xl"
						>
							<span className="flex items-center space-x-3">
								<span>Start Monitoring Now</span>
								<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
							</span>
						</Link>

						<button className="group flex items-center space-x-3 bg-white/80 backdrop-blur-sm text-[#FF7F50] px-8 py-4 rounded-full text-lg font-semibold hover:bg-white transition-all duration-300 border border-[#FF7F50]/20">
							<Play className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
							<span>Watch 2-min Demo</span>
						</button>
					</div>

					{/* Newsletter Signup */}
					<div className="max-w-md mx-auto">
						<form onSubmit={handleSubscribe} className="flex space-x-2">
							<input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="Enter your email for updates"
								className="flex-1 px-4 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/30"
							/>
							<button
								type="submit"
								className="bg-white text-blue-900 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300"
							>
								{isSubscribed ? "✓ Subscribed!" : "Subscribe"}
							</button>
						</form>
						<p className="text-gray-300 text-sm mt-2">
							Get notified about air quality alerts and platform updates
						</p>
					</div>
				</div>

				{/* Stats Section */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
					{stats.map((stat, index) => (
						<div key={index} className="text-center">
							<div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl text-white mb-4 border border-white/20">
								{stat.icon}
							</div>
							<div className="text-3xl font-bold text-white mb-1">
								{stat.value}
							</div>
							<div className="text-gray-300 text-sm">{stat.label}</div>
						</div>
					))}
				</div>

				{/* Features Preview */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					<div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300">
						<div className="text-4xl mb-4">🛰️</div>
						<h3 className="text-xl font-bold text-white mb-3">
							NASA TEMPO Data
						</h3>
						<p className="text-gray-300">
							Real-time atmospheric monitoring from space with hourly satellite
							observations covering your location.
						</p>
					</div>

					<div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300">
						<div className="text-4xl mb-4">🤖</div>
						<h3 className="text-xl font-bold text-white mb-3">
							AI Predictions
						</h3>
						<p className="text-gray-300">
							24-hour air quality forecasts powered by machine learning
							algorithms trained on environmental patterns.
						</p>
					</div>

					<div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300">
						<div className="text-4xl mb-4">🏥</div>
						<h3 className="text-xl font-bold text-white mb-3">
							Health Insights
						</h3>
						<p className="text-gray-300">
							Personalized health recommendations based on air quality levels
							and your individual health profile.
						</p>
					</div>
				</div>

				{/* Challenge Badge */}
				<div className="text-center mt-16">
					<div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-full border border-yellow-400/30">
						<Award className="w-5 h-5 text-yellow-400 mr-2" />
						<span className="text-yellow-100 font-medium">
							Official NASA Space Apps Challenge 2025 Project
						</span>
					</div>
				</div>
			</div>
		</section>
	);
};

export default CallToAction;
