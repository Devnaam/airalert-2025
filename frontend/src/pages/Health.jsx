import React, { useState, useEffect } from "react";
import { Heart, Users, Activity, AlertCircle, TrendingUp } from "lucide-react";
import { airQualityAPI } from "../services/api";
import { useAirQualityContext } from "../context/AirQualityContext";
import HealthRecommendations from "../components/widgets/HealthRecommendations";
import PollutantBreakdown from "../components/widgets/PollutantBreakdown";
import PollutantChart from "../components/charts/PollutantChart";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { getPollutantName } from "../utils/formatters";

const Health = () => {
	const { currentData, selectedLocation, userGroup, setUserGroup } =
		useAirQualityContext();
	const [pollutantData, setPollutantData] = useState(null);
	const [healthRecommendations, setHealthRecommendations] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchHealthData = async () => {
			try {
				setLoading(true);
				const [pollutantResponse, healthResponse] = await Promise.all([
					airQualityAPI.getPollutantBreakdown(),
					airQualityAPI.getHealthRecommendations(userGroup),
				]);

				setPollutantData(pollutantResponse.data.data);
				setHealthRecommendations(healthResponse.data.data);
			} catch (error) {
				console.error("Error fetching health data:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchHealthData();
	}, [selectedLocation, userGroup]);

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-96">
				<LoadingSpinner size="lg" text="Loading health analysis..." />
			</div>
		);
	}

	const currentAQI = currentData?.aqi?.aqi || 0;
	const aqiCategory = currentData?.aqi?.category || "Unknown";

	// Health impact assessment based on AQI
	const getHealthImpact = (aqi) => {
		if (aqi <= 50)
			return {
				level: "minimal",
				color: "#10B981",
				description: "Air quality is satisfactory for most people",
			};
		if (aqi <= 100)
			return {
				level: "low",
				color: "#F59E0B",
				description:
					"Acceptable for most, sensitive individuals may experience minor issues",
			};
		if (aqi <= 200)
			return {
				level: "moderate",
				color: "#EF4444",
				description: "Unhealthy for sensitive groups, may cause symptoms",
			};
		if (aqi <= 300)
			return {
				level: "high",
				color: "#DC2626",
				description: "Everyone may experience health effects",
			};
		return {
			level: "severe",
			color: "#7F1D1D",
			description: "Health alert: serious health effects for everyone",
		};
	};

	const healthImpact = getHealthImpact(currentAQI);

	// Health tips based on user group and AQI
	const getHealthTips = (userGroup, aqi) => {
		const baseTips = [];

		if (aqi > 100) {
			baseTips.push("Consider wearing a mask when outdoors");
			baseTips.push("Close windows and use air purifiers indoors");
			baseTips.push("Avoid outdoor exercise during peak pollution hours");
		}

		if (userGroup === "sensitive") {
			baseTips.push("Keep rescue medications readily available");
			baseTips.push("Monitor symptoms closely");
			baseTips.push("Consult healthcare provider if symptoms worsen");
		}

		if (userGroup === "elderly") {
			baseTips.push("Limit time spent outdoors");
			baseTips.push("Stay hydrated and get adequate rest");
			baseTips.push("Monitor heart rate and breathing");
		}

		if (userGroup === "children") {
			baseTips.push("Limit outdoor playtime for children");
			baseTips.push("Keep children indoors during high pollution");
			baseTips.push("Watch for respiratory symptoms in children");
		}

		return baseTips.length > 0
			? baseTips
			: ["Air quality is generally safe for outdoor activities"];
	};

	const healthTips = getHealthTips(userGroup, currentAQI);

	return (
		<div className="space-y-6">
			{/* Page Header */}
			<div className="bg-gradient-to-r from-pink-600 to-red-600 text-white rounded-xl p-6">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold mb-2">Health Impact Analysis</h1>
						<p className="text-pink-100">
							Personalized health guidance based on air quality in{" "}
							{selectedLocation}
						</p>
					</div>
					<div className="text-right">
						<div className="flex items-center space-x-2 mb-2">
							<Heart className="w-5 h-5" />
							<span className="font-semibold">Current Health Risk</span>
						</div>
						<div className="text-2xl font-bold capitalize">
							{healthImpact.level}
						</div>
						<div className="text-sm text-pink-100">
							AQI: {Math.round(currentAQI)}
						</div>
					</div>
				</div>
			</div>

			{/* User Group Selector */}
			<div className="aqi-card">
				<div className="flex items-center space-x-2 mb-4">
					<Users className="w-5 h-5 text-blue-500" />
					<h3 className="text-lg font-semibold text-gray-700">
						Select Your Profile
					</h3>
				</div>

				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					{[
						{
							id: "general",
							label: "General Public",
							icon: "👥",
							desc: "Healthy adults",
						},
						{
							id: "sensitive",
							label: "Sensitive Groups",
							icon: "🫁",
							desc: "Asthma, COPD, heart disease",
						},
						{
							id: "elderly",
							label: "Elderly (65+)",
							icon: "👴",
							desc: "Senior citizens",
						},
						{
							id: "children",
							label: "Children",
							icon: "👶",
							desc: "Under 18 years",
						},
					].map((group) => (
						<button
							key={group.id}
							onClick={() => setUserGroup(group.id)}
							className={`p-4 rounded-lg border-2 transition-all ${
								userGroup === group.id
									? "border-blue-500 bg-blue-50 text-blue-700"
									: "border-gray-200 hover:border-gray-300 text-gray-700"
							}`}
						>
							<div className="text-2xl mb-2">{group.icon}</div>
							<div className="font-medium text-sm mb-1">{group.label}</div>
							<div className="text-xs text-gray-500">{group.desc}</div>
						</button>
					))}
				</div>
			</div>

			{/* Health Impact Overview */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{/* Current Health Risk */}
				<div className="aqi-card">
					<div className="flex items-center space-x-2 mb-4">
						<AlertCircle className="w-5 h-5 text-orange-500" />
						<h3 className="text-lg font-semibold text-gray-700">
							Current Risk Level
						</h3>
					</div>

					<div className="text-center mb-4">
						<div
							className="text-4xl font-bold mb-2"
							style={{ color: healthImpact.color }}
						>
							{healthImpact.level.toUpperCase()}
						</div>
						<div className="text-sm text-gray-600">
							{healthImpact.description}
						</div>
					</div>

					<div className="space-y-2">
						<div className="flex justify-between text-sm">
							<span>Current AQI:</span>
							<span className="font-bold" style={{ color: healthImpact.color }}>
								{Math.round(currentAQI)}
							</span>
						</div>
						<div className="flex justify-between text-sm">
							<span>Category:</span>
							<span className="font-medium">{aqiCategory}</span>
						</div>
						<div className="flex justify-between text-sm">
							<span>User Group:</span>
							<span className="font-medium capitalize">
								{userGroup.replace("_", " ")}
							</span>
						</div>
					</div>
				</div>

				{/* Health Symptoms */}
				<div className="aqi-card">
					<div className="flex items-center space-x-2 mb-4">
						<Activity className="w-5 h-5 text-red-500" />
						<h3 className="text-lg font-semibold text-gray-700">
							Potential Symptoms
						</h3>
					</div>

					<div className="space-y-3">
						{currentAQI <= 50 && (
							<div className="flex items-center space-x-3">
								<div className="w-2 h-2 bg-green-500 rounded-full"></div>
								<span className="text-sm text-gray-700">
									No symptoms expected
								</span>
							</div>
						)}

						{currentAQI > 50 && currentAQI <= 100 && (
							<>
								<div className="flex items-center space-x-3">
									<div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
									<span className="text-sm text-gray-700">
										Mild respiratory irritation (sensitive individuals)
									</span>
								</div>
							</>
						)}

						{currentAQI > 100 && currentAQI <= 200 && (
							<>
								<div className="flex items-center space-x-3">
									<div className="w-2 h-2 bg-orange-500 rounded-full"></div>
									<span className="text-sm text-gray-700">
										Coughing, throat irritation
									</span>
								</div>
								<div className="flex items-center space-x-3">
									<div className="w-2 h-2 bg-orange-500 rounded-full"></div>
									<span className="text-sm text-gray-700">
										Shortness of breath during exercise
									</span>
								</div>
								<div className="flex items-center space-x-3">
									<div className="w-2 h-2 bg-orange-500 rounded-full"></div>
									<span className="text-sm text-gray-700">
										Eye and nose irritation
									</span>
								</div>
							</>
						)}

						{currentAQI > 200 && (
							<>
								<div className="flex items-center space-x-3">
									<div className="w-2 h-2 bg-red-500 rounded-full"></div>
									<span className="text-sm text-gray-700">
										Difficulty breathing
									</span>
								</div>
								<div className="flex items-center space-x-3">
									<div className="w-2 h-2 bg-red-500 rounded-full"></div>
									<span className="text-sm text-gray-700">Chest tightness</span>
								</div>
								<div className="flex items-center space-x-3">
									<div className="w-2 h-2 bg-red-500 rounded-full"></div>
									<span className="text-sm text-gray-700">
										Increased heart rate
									</span>
								</div>
								<div className="flex items-center space-x-3">
									<div className="w-2 h-2 bg-red-500 rounded-full"></div>
									<span className="text-sm text-gray-700">Fatigue</span>
								</div>
							</>
						)}
					</div>
				</div>

				{/* Health Tips */}
				<div className="aqi-card">
					<div className="flex items-center space-x-2 mb-4">
						<TrendingUp className="w-5 h-5 text-green-500" />
						<h3 className="text-lg font-semibold text-gray-700">Health Tips</h3>
					</div>

					<div className="space-y-2">
						{healthTips.map((tip, index) => (
							<div key={index} className="flex items-start space-x-2">
								<div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
								<span className="text-sm text-gray-700">{tip}</span>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Main Health Components */}
			<div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
				{/* Health Recommendations */}
				<HealthRecommendations userGroup={userGroup} />

				{/* Pollutant Breakdown */}
				<PollutantBreakdown />
			</div>

			{/* Detailed Pollutant Analysis */}
			{pollutantData && (
				<div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
					{/* Pollutant Radar Chart */}
					<PollutantChart pollutantData={pollutantData} />

					{/* Individual Pollutant Health Effects */}
					<div className="aqi-card">
						<div className="flex items-center space-x-2 mb-4">
							<Activity className="w-5 h-5 text-purple-500" />
							<h3 className="text-lg font-semibold text-gray-700">
								Pollutant Health Effects
							</h3>
						</div>

						<div className="space-y-4">
							{pollutantData.pollutant_breakdown &&
								Object.entries(pollutantData.pollutant_breakdown).map(
									([pollutant, data]) => (
										<div
											key={pollutant}
											className="p-3 border border-gray-200 rounded-lg"
										>
											<div className="flex items-center justify-between mb-2">
												<div className="font-semibold text-gray-900">
													{getPollutantName(pollutant)}
												</div>
												<div className="text-sm text-gray-500">
													AQI: {data.aqi}
												</div>
											</div>
											<p className="text-sm text-gray-600 mb-2">
												{data.health_impact}
											</p>
											<div className="text-xs text-gray-500">
												Current: {data.value} {data.unit} | Category:{" "}
												{data.category}
											</div>
										</div>
									)
								)}
						</div>
					</div>
				</div>
			)}

			{/* When to Seek Medical Attention */}
			<div className="bg-red-50 border border-red-200 rounded-lg p-4">
				<div className="flex items-start space-x-3">
					<AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
					<div>
						<h4 className="font-semibold text-red-900">
							When to Seek Medical Attention
						</h4>
						<div className="text-red-700 text-sm mt-2 space-y-1">
							<p>• Persistent coughing or wheezing</p>
							<p>• Difficulty breathing or shortness of breath</p>
							<p>• Chest pain or tightness</p>
							<p>• Unusual fatigue or dizziness</p>
							<p>• Worsening of existing respiratory or heart conditions</p>
						</div>
						<div className="mt-3 text-xs text-red-600">
							<strong>Emergency:</strong> Call emergency services if
							experiencing severe breathing difficulties or chest pain.
						</div>
					</div>
				</div>
			</div>

			{/* Health Data Sources */}
			<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
				<div className="flex items-start space-x-3">
					<Heart className="w-5 h-5 text-blue-600 mt-0.5" />
					<div>
						<h4 className="font-semibold text-blue-900">
							Health Guidance Sources
						</h4>
						<p className="text-blue-700 text-sm mt-1">
							Health recommendations are based on guidelines from WHO, EPA, and
							Indian Central Pollution Control Board (CPCB). Individual health
							responses may vary. Consult healthcare professionals for
							personalized medical advice.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Health;
