import React, { useState, useEffect } from "react";
import {
	Bell,
	AlertTriangle,
	Settings,
	Users,
	Calendar,
	CheckCircle,
} from "lucide-react";
import { airQualityAPI } from "../services/api";
import { useAirQualityContext } from "../context/AirQualityContext";
import AlertBanner from "../components/ui/AlertBanner";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { formatDateTime } from "../utils/formatters";
import { toast } from "react-toastify";

const Alerts = () => {
	const { alerts, selectedLocation, userGroup, setUserGroup } =
		useAirQualityContext();
	const [emergencyAlerts, setEmergencyAlerts] = useState([]);
	const [alertHistory, setAlertHistory] = useState([]);
	const [subscriptionSettings, setSubscriptionSettings] = useState({
		user_group: userGroup,
		aqi_threshold: 100,
		notification_types: ["browser"],
		location: selectedLocation,
	});
	const [loading, setLoading] = useState(false);
	const [subscribed, setSubscribed] = useState(false);

	useEffect(() => {
		const fetchAlerts = async () => {
			try {
				const [, emergencyResponse] = await Promise.all([
					airQualityAPI.getAlerts(),
					airQualityAPI.getEmergencyAlerts(),
				]);

				setEmergencyAlerts(emergencyResponse.data.data.emergency_alerts || []);

				// Simulate alert history
				const mockHistory = [
					{
						id: 1,
						title: "Moderate Air Quality Alert",
						message:
							"AQI increased to 125. Sensitive individuals should limit outdoor activities.",
						level: "moderate",
						timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
						acknowledged: true,
					},
					{
						id: 2,
						title: "Good Air Quality",
						message: "Air quality has improved to Good levels (AQI: 45).",
						level: "info",
						timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
						acknowledged: true,
					},
					{
						id: 3,
						title: "Poor Air Quality Warning",
						message: "AQI reached 215. Avoid outdoor activities.",
						level: "severe",
						timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
						acknowledged: true,
					},
				];
				setAlertHistory(mockHistory);
			} catch (error) {
				console.error("Error fetching alerts:", error);
			}
		};

		fetchAlerts();
	}, [selectedLocation]);

	const handleSubscribe = async () => {
		try {
			setLoading(true);
			const success = await airQualityAPI.subscribeToAlerts(
				subscriptionSettings
			);

			if (success) {
				setSubscribed(true);
				toast.success("Successfully subscribed to air quality alerts!");
			} else {
				toast.error("Failed to subscribe to alerts. Please try again.");
			}
		} catch (error) {
			toast.error("Error subscribing to alerts: " + error.message);
		} finally {
			setLoading(false);
		}
	};

	const allAlerts = [...(alerts || []), ...(emergencyAlerts || [])];
	const activeAlertsCount = allAlerts.length;

	return (
		<div className="space-y-6">
			{/* Page Header */}
			<div className="bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl p-6">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold mb-2">Alert Management</h1>
						<p className="text-red-100">
							Stay informed about air quality changes in {selectedLocation}
						</p>
					</div>
					<div className="text-right">
						<div className="flex items-center space-x-2 mb-2">
							<Bell className="w-5 h-5" />
							<span className="font-semibold">Active Alerts</span>
						</div>
						<div className="text-3xl font-bold">{activeAlertsCount}</div>
						<div className="text-sm text-red-100">Current notifications</div>
					</div>
				</div>
			</div>

			{/* Active Alerts Section */}
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<h2 className="text-xl font-semibold text-gray-900">Active Alerts</h2>
					{activeAlertsCount === 0 && (
						<div className="flex items-center space-x-2 text-green-600">
							<CheckCircle className="w-5 h-5" />
							<span className="text-sm font-medium">No active alerts</span>
						</div>
					)}
				</div>

				{activeAlertsCount > 0 ? (
					<AlertBanner alerts={allAlerts} />
				) : (
					<div className="aqi-card text-center py-8">
						<CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
						<h3 className="text-lg font-semibold text-gray-900 mb-2">
							All Clear!
						</h3>
						<p className="text-gray-600">
							No air quality alerts at this time. Air quality is within
							acceptable levels.
						</p>
					</div>
				)}
			</div>

			{/* Alert Subscription Settings */}
			<div className="aqi-card">
				<div className="flex items-center space-x-2 mb-6">
					<Settings className="w-5 h-5 text-blue-500" />
					<h3 className="text-lg font-semibold text-gray-700">
						Alert Subscription Settings
					</h3>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* User Group Selection */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-3">
							<Users className="w-4 h-4 inline mr-2" />
							User Group
						</label>
						<div className="space-y-2">
							{[
								{
									id: "general",
									label: "General Public",
									desc: "Standard air quality alerts",
								},
								{
									id: "sensitive",
									label: "Sensitive Groups",
									desc: "Enhanced alerts for respiratory conditions",
								},
								{
									id: "elderly",
									label: "Elderly",
									desc: "Health-focused recommendations",
								},
								{
									id: "children",
									label: "Children/Parents",
									desc: "Child-safe activity guidance",
								},
							].map((group) => (
								<label
									key={group.id}
									className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
								>
									<input
										type="radio"
										name="userGroup"
										value={group.id}
										checked={subscriptionSettings.user_group === group.id}
										onChange={(e) => {
											setSubscriptionSettings((prev) => ({
												...prev,
												user_group: e.target.value,
											}));
											setUserGroup(e.target.value);
										}}
										className="mt-1"
									/>
									<div>
										<div className="font-medium text-gray-900">
											{group.label}
										</div>
										<div className="text-sm text-gray-500">{group.desc}</div>
									</div>
								</label>
							))}
						</div>
					</div>

					{/* Alert Thresholds */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-3">
							<AlertTriangle className="w-4 h-4 inline mr-2" />
							Alert Threshold
						</label>
						<div className="space-y-4">
							<div>
								<label className="block text-sm text-gray-600 mb-2">
									AQI Alert Level
								</label>
								<select
									value={subscriptionSettings.aqi_threshold}
									onChange={(e) =>
										setSubscriptionSettings((prev) => ({
											...prev,
											aqi_threshold: parseInt(e.target.value),
										}))
									}
									className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								>
									<option value={50}>Good → Satisfactory (AQI 50+)</option>
									<option value={100}>
										Satisfactory → Moderate (AQI 100+)
									</option>
									<option value={200}>Moderate → Poor (AQI 200+)</option>
									<option value={300}>Poor → Very Poor (AQI 300+)</option>
								</select>
							</div>

							<div>
								<label className="block text-sm text-gray-600 mb-2">
									Notification Methods
								</label>
								<div className="space-y-2">
									{[
										{ id: "browser", label: "Browser Notifications" },
										{ id: "email", label: "Email Alerts" },
										{ id: "sms", label: "SMS Notifications" },
									].map((method) => (
										<label
											key={method.id}
											className="flex items-center space-x-2"
										>
											<input
												type="checkbox"
												checked={subscriptionSettings.notification_types.includes(
													method.id
												)}
												onChange={(e) => {
													if (e.target.checked) {
														setSubscriptionSettings((prev) => ({
															...prev,
															notification_types: [
																...prev.notification_types,
																method.id,
															],
														}));
													} else {
														setSubscriptionSettings((prev) => ({
															...prev,
															notification_types:
																prev.notification_types.filter(
																	(t) => t !== method.id
																),
														}));
													}
												}}
												className="rounded"
											/>
											<span className="text-sm text-gray-700">
												{method.label}
											</span>
										</label>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="mt-6 pt-4 border-t border-gray-200">
					<button
						onClick={handleSubscribe}
						disabled={loading || subscribed}
						className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
							subscribed
								? "bg-green-100 text-green-700 cursor-not-allowed"
								: loading
								? "bg-gray-100 text-gray-400 cursor-not-allowed"
								: "bg-blue-600 text-white hover:bg-blue-700"
						}`}
					>
						{loading ? (
							<>
								<div className="animate-spin w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full inline-block mr-2"></div>
								Subscribing...
							</>
						) : subscribed ? (
							<>
								<CheckCircle className="w-4 h-4 inline mr-2" />
								Subscribed to Alerts
							</>
						) : (
							"Subscribe to Air Quality Alerts"
						)}
					</button>

					{subscribed && (
						<p className="text-sm text-green-600 mt-2 text-center">
							You'll receive notifications when AQI exceeds{" "}
							{subscriptionSettings.aqi_threshold}
						</p>
					)}
				</div>
			</div>

			{/* Alert History */}
			<div className="aqi-card">
				<div className="flex items-center space-x-2 mb-4">
					<Calendar className="w-5 h-5 text-purple-500" />
					<h3 className="text-lg font-semibold text-gray-700">
						Recent Alert History
					</h3>
				</div>

				<div className="space-y-3">
					{alertHistory.map((alert) => (
						<div
							key={alert.id}
							className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg"
						>
							<div className="flex-shrink-0">
								{alert.level === "severe" && (
									<AlertTriangle className="w-5 h-5 text-red-500" />
								)}
								{alert.level === "moderate" && (
									<AlertTriangle className="w-5 h-5 text-yellow-500" />
								)}
								{alert.level === "info" && (
									<CheckCircle className="w-5 h-5 text-green-500" />
								)}
							</div>

							<div className="flex-1">
								<div className="flex items-center justify-between mb-1">
									<h4 className="font-medium text-gray-900">{alert.title}</h4>
									<span className="text-xs text-gray-500">
										{formatDateTime(alert.timestamp)}
									</span>
								</div>
								<p className="text-sm text-gray-600">{alert.message}</p>
							</div>

							<div className="flex-shrink-0">
								{alert.acknowledged && (
									<CheckCircle className="w-4 h-4 text-green-500" />
								)}
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Alert Information */}
			<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
				<div className="flex items-start space-x-3">
					<Bell className="w-5 h-5 text-blue-600 mt-0.5" />
					<div>
						<h4 className="font-semibold text-blue-900">
							About Air Quality Alerts
						</h4>
						<p className="text-blue-700 text-sm mt-1">
							Our alert system monitors air quality in real-time and notifies
							you when levels may affect your health. Alerts are personalized
							based on your user group and sensitivity to air pollution.
						</p>
						<div className="mt-2 text-xs text-blue-600">
							<span className="font-medium">Alert Levels:</span> Info (AQI
							improvements) • Moderate (Sensitive groups) • Severe (Everyone
							affected)
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Alerts;
