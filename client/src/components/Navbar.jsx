import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
	const { pathname } = useLocation();
	
	const menuItems = [
		{ to: "/", label: "Dashboard", icon: "📊" },
		{ to: "/new", label: "New Transaction", icon: "➕" },
		{ to: "/summary", label: "Summary", icon: "📋" },
		{ to: "/income", label: "Income", icon: "💰" },
		{ to: "/expenses", label: "Expenses", icon: "💸" },
		{ to: "/salaries", label: "Salaries", icon: "💵" },
		{ to: "/settings", label: "Settings", icon: "⚙️" },
	];

	return (
		<aside className="sidebar">
			<div className="sidebar-header">
				<span className="brand">SmartLedger</span>
			</div>
			<nav className="sidebar-nav">
				{menuItems.map((item) => (
					<Link
						key={item.to}
						className={`sidebar-link ${pathname === item.to ? "active" : ""}`}
						to={item.to}
					>
						<span className="sidebar-icon">{item.icon}</span>
						<span className="sidebar-label">{item.label}</span>
					</Link>
				))}
			</nav>
		</aside>
	);
}


