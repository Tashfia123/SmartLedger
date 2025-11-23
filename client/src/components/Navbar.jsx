import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
	const { pathname } = useLocation();
	
	const menuItems = [
		{ to: "/", label: "Dashboard", icon: "📊" },
		{ to: "/summary", label: "Transaction", icon: "📋" },
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


