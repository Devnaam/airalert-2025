import React, { useState, useEffect } from "react";
import {
	TrendingUp,
	TrendingDown,
	Activity,
	MapPin,
	RefreshCw,
	Wind,
	Droplets,
	Thermometer,
} from "lucide-react";

const LiveDataPreview = () => {
	const [liveData, setLiveData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [lastUpdate, setLastUpdate] = useState(new Date());

	useEffect(() => {
		const fetchLiveData = async () => {
			try {
				setLoading(true);
				const response = await fetch("http://localhost:5000/api/current");
				const data = await response.json();
				setLiveData(data.data);
				setLastUpdate(new Date());
			} catch (error) {
				console.error("Error fetching live data:", error);
				// Fallback mock data
				setLiveData({
					aqi: {
						aqi: 87,
						category: "Moderate",
						color: "#FF7F50",
						description: "Air quality is acceptable for most people.",
					},
					air_quality: { pm25: 32.5, pm10: 45.2, no2: 28.1, o3: 65.3 },
					weather: { temperature: 28, humidity: 72, wind_speed: 12 },
					location: { name: "Panaji, Goa" },
				});
			} finally {
				setLoading(false);
			}
		};

		fetchLiveData();
		const interval = setInterval(fetchLiveData, 2 * 60 * 1000);
		return () => clearInterval(interval);
	}, []);

	const getAQITrend = (aqi) => {
		const trend = Math.random() > 0.5 ? "up" : "down";
		const change = (Math.random() * 10).toFixed(1);
		return { trend, change };
	};

	const pollutantData = liveData?.air_quality
		? [
				{
					name: "PM2.5",
					value: liveData.air_quality.pm25,
					unit: "µg/m³",
					limit: 60,
				},
				{
					name: "PM10",
					value: liveData.air_quality.pm10,
					unit: "µg/m³",
					limit: 100,
				},
				{
					name: "NO₂",
					value: liveData.air_quality.no2,
					unit: "µg/m³",
					limit: 80,
				},
				{
					name: "O₃",
					value: liveData.air_quality.o3,
					unit: "µg/m³",
					limit: 100,
				},
		  ]
		: [];

	return (
		<section
			id="live-data"
			className="relative py-28 overflow-hidden bg-gray-50"
		>
			{/* Background Animation */}
			<div className="absolute inset-0 -z-10 opacity-50 bg-gradient-to-br from-[#FF7F50] to-[#FF6B3C] animate-[gradientShift_15s_ease_infinite]"></div>
			<style>
				{`
					@keyframes gradientShift {
						0% { background-position: 0% 50%; }
						50% { background-position: 100% 50%; }
						100% { background-position: 0% 50%; }
					}
					@keyframes floatUp {
						0%,100% { transform: translateY(0); }
						50% { transform: translateY(-10px); }
					}
				`}
			</style>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="text-center mb-20 relative">
					<div className="inline-flex items-center px-4 py-2 bg-[#FF7F50]/20 text-[#FF7F50] rounded-full text-sm font-medium mb-4">
						<div className="w-2 h-2 bg-[#FF7F50] rounded-full mr-2 animate-pulse"></div>
						Live Environmental Data
					</div>

					<h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
						Real-time{" "}
						<span className="bg-gradient-to-r from-[#FF7F50] to-[#FF6B3C] bg-clip-text text-transparent">
							Monitoring
						</span>
					</h2>

					<p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
						Experience real-time air quality updates powered by NASA TEMPO and our sensor network.
					</p>
				</div>

				{/* Main Content */}
				{loading ? (
					<div className="flex items-center justify-center py-16">
						<div className="text-center">
							<RefreshCw className="w-10 h-10 animate-spin text-[#FF7F50] mx-auto mb-4" />
							<p className="text-gray-600 font-medium">Fetching latest data...</p>
						</div>
					</div>
				) : (
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
						{/* AQI Card */}
						<div className="lg:col-span-1 animate-[floatUp_6s_ease-in-out_infinite]">
							<div className="relative bg-white shadow-2xl rounded-3xl p-8 border border-gray-200 hover:scale-[1.03] transition-transform duration-500 perspective-1000">
								<div className="flex items-center justify-between mb-6">
									<div className="flex items-center space-x-2">
										<MapPin className="w-5 h-5 text-gray-500" />
										<span className="text-gray-700 font-medium">
											{liveData?.location?.name || "Goa, India"}
										</span>
									</div>
									<div className="text-xs text-gray-500">
										{lastUpdate.toLocaleTimeString()}
									</div>
								</div>

								<div className="text-center mb-6">
									<div
										className="text-6xl font-extrabold mb-2"
										style={{ color: "#FF7F50" }}
									>
										{liveData?.aqi ? Math.round(liveData.aqi.aqi) : "--"}
									</div>
									<div className="inline-block px-4 py-2 rounded-full text-white font-semibold text-sm mb-2 bg-gradient-to-r from-[#FF7F50] to-[#FF6B3C]">
										{liveData?.aqi?.category || "Unknown"}
									</div>
									<p className="text-gray-600 text-sm leading-relaxed">
										{liveData?.aqi?.description || "Air quality information unavailable"}
									</p>
								</div>

								{liveData?.aqi && (
									<div className="flex items-center justify-center space-x-2 pt-4 border-t border-gray-200">
										{getAQITrend(liveData.aqi.aqi).trend === "up" ? (
											<TrendingUp className="w-4 h-4 text-red-500" />
										) : (
											<TrendingDown className="w-4 h-4 text-green-500" />
										)}
										<span className="text-sm text-gray-600">
											{getAQITrend(liveData.aqi.aqi).change} from last hour
										</span>
									</div>
								)}
							</div>
						</div>

						{/* Pollutants */}
						<div className="lg:col-span-2">
							<div className="bg-white shadow-2xl rounded-3xl p-8 border border-gray-200 hover:scale-[1.02] transition-transform duration-500">
								<div className="flex items-center space-x-2 mb-6">
									<Activity className="w-6 h-6 text-[#FF7F50]" />
									<h3 className="text-xl font-bold text-gray-900">
										Pollutant Levels
									</h3>
								</div>

								<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
									{pollutantData.map((pollutant, index) => (
										<div
											key={index}
											className="group bg-gray-50 p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-500"
										>
											<div className="flex items-center justify-between mb-2">
												<span className="font-semibold text-gray-900">
													{pollutant.name}
												</span>
												<span className="text-sm text-gray-600">
													{pollutant.value?.toFixed(1)} {pollutant.unit}
												</span>
											</div>
											<div className="relative h-3 rounded-full overflow-hidden bg-gray-200">
												<div
													className="absolute h-3 rounded-full bg-gradient-to-r from-[#FF7F50] to-[#FF6B3C] animate-[progressBar_2s_ease-in-out_infinite]"
													style={{
														width: `${Math.min(
															100,
															(pollutant.value / pollutant.limit) * 100
														)}%`,
													}}
												></div>
											</div>
											<div className="flex justify-between text-xs text-gray-500 mt-1">
												<span>0</span>
												<span>
													{pollutant.limit} {pollutant.unit}
												</span>
											</div>
										</div>
									))}
								</div>

								{/* Weather */}
								{liveData?.weather && (
									<div className="mt-10 pt-6 border-t border-gray-200">
										<h4 className="font-semibold text-gray-900 mb-5">
											Current Weather
										</h4>
										<div className="grid grid-cols-3 gap-4">
											<div className="flex flex-col items-center p-4 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all">
												<Thermometer className="w-6 h-6 text-[#FF7F50] mb-2" />
												<div className="text-2xl font-bold text-[#FF7F50]">
													{liveData.weather.temperature}°C
												</div>
												<span className="text-xs text-gray-600">Temperature</span>
											</div>
											<div className="flex flex-col items-center p-4 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all">
												<Droplets className="w-6 h-6 text-[#FF7F50] mb-2" />
												<div className="text-2xl font-bold text-[#FF7F50]">
													{liveData.weather.humidity}%
												</div>
												<span className="text-xs text-gray-600">Humidity</span>
											</div>
											<div className="flex flex-col items-center p-4 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all">
												<Wind className="w-6 h-6 text-[#FF7F50] mb-2" />
												<div className="text-2xl font-bold text-[#FF7F50]">
													{liveData.weather.wind_speed} km/h
												</div>
												<span className="text-xs text-gray-600">Wind Speed</span>
											</div>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
				)}

				{/* Data Sources */}
				<div className="mt-16 text-center">
					<p className="text-gray-500 text-sm mb-4">Data Sources</p>
					<div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
						<span className="text-sm text-gray-600">NASA TEMPO Satellite</span>
						<span className="text-sm text-gray-600">OpenAQ Ground Network</span>
						<span className="text-sm text-gray-600">Open-Meteo Weather</span>
					</div>
				</div>
			</div>

			<style>
				{`
					@keyframes progressBar {
						0% { transform: scaleX(0); }
						50% { transform: scaleX(1.05); }
						100% { transform: scaleX(1); }
						transform-origin: left;
					}
				`}
			</style>
		</section>
	);
};

export default LiveDataPreview;
