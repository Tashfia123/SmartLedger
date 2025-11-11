import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
	const { pathname } = useLocation();
	const link = (to, label) => (
		<Link className={`topnav-link ${pathname === to ? "active" : ""}`} to={to}>{label}</Link>
	);
	return (
		<header className="topnav">
			<div className="topnav-inner">
				<div className="topnav-left">
					<span className="brand">SmartLedger</span>
				</div>
				<nav className="topnav-right">
					{link("/", "Dashboard")}
					{link("/new", "New Transaction")}
					{link("/summary", "Summary")}
					{link("/income", "Income")}
					{link("/expenses", "Expenses")}
					{link("/salaries", "Salaries")}
					{link("/settings", "Settings")}
				</nav>
			</div>
		</header>
	);
}


