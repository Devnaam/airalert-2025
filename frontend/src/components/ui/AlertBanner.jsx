import React from "react";
import { AlertTriangle } from "lucide-react";

const AlertBanner = ({ alerts, className = "" }) => {
	if (!alerts || alerts.length === 0) return null;

	return (
		<div
			className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}
		>
			<div className="flex items-center space-x-3">
				<AlertTriangle className="w-5 h-5 text-red-500" />
				<div className="flex-1">
					<h3 className="text-sm font-medium text-red-800">
						Air Quality Alerts ({alerts.length})
					</h3>
					<div className="mt-2 text-sm text-red-700">
						{alerts.map((alert, index) => (
							<div key={index} className="mb-1">
								• {alert.message}
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default AlertBanner;
