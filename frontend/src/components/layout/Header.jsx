import React from "react";
import { Wind, RefreshCw, Bell } from "lucide-react";
import LocationSelector from "../ui/LocationSelector";
import { useAirQualityContext } from "../../context/AirQualityContext";

const Header = () => {
	const {
		selectedLocation,
		setSelectedLocation,
		refreshData,
		loading,
		alerts,
		currentData,
	} = useAirQualityContext();

	return (
		<header className="bg-white shadow-sm border-b border-gray-200">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					{/* Logo and Title */}
					<div className="flex items-center space-x-3">
						<div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg">
							<Wind className="w-6 h-6 text-white" />
						</div>
						<div>
							<h1 className="text-xl font-bold text-gray-900">AirAlert Pro</h1>
							<p className="text-sm text-gray-500">NASA Space Apps 2025</p>
						</div>
					</div>

					{/* Center - Location Selector */}
					<div className="flex-1 flex justify-center max-w-md">
						<LocationSelector
							selectedLocation={selectedLocation}
							onLocationChange={setSelectedLocation}
							className="w-full max-w-xs"
						/>
					</div>

					{/* Right side - Controls */}
					<div className="flex items-center space-x-4">
						{/* Alert indicator */}
						{alerts && alerts.length > 0 && (
							<div className="flex items-center space-x-1">
								<Bell className="w-5 h-5 text-red-500" />
								<span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
									{alerts.length}
								</span>
							</div>
						)}

						{/* Current AQI Quick Display */}
						{currentData && currentData.aqi && (
							<div className="hidden sm:flex items-center space-x-2 px-3 py-1 rounded-full bg-gray-100">
								<div className="text-sm text-gray-600">AQI:</div>
								<div
									className="text-sm font-bold"
									style={{ color: currentData.aqi.color }}
								>
									{Math.round(currentData.aqi.aqi)}
								</div>
							</div>
						)}

						{/* Refresh Button */}
						<button
							onClick={refreshData}
							disabled={loading}
							className={`p-2 rounded-lg transition-colors ${
								loading
									? "bg-gray-100 text-gray-400 cursor-not-allowed"
									: "bg-blue-100 text-blue-600 hover:bg-blue-200"
							}`}
							title="Refresh data"
						>
							<RefreshCw
								className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
							/>
						</button>
					</div>
				</div>
			</div>
		</header>
	);
};

export default Header;
