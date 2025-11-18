import { BrowserRouter, Route, Routes } from "react-router-dom";
import EntryPage from "./pages/EntryPage.jsx";
import SummaryPage from "./pages/SummaryPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import IncomePage from "./pages/IncomePage.jsx";
import ExpensesPage from "./pages/ExpensesPage.jsx";
import SalariesPage from "./pages/SalariesPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import Sidebar from "./components/Navbar.jsx";

export default function App() {
	return (
		<BrowserRouter>
			<div className="app-layout">
				<Sidebar />
				<main className="main-content">
					<Routes>
						<Route path="/" element={<Dashboard />} />
						<Route path="/new" element={<EntryPage />} />
						<Route path="/summary" element={<SummaryPage />} />
						<Route path="/income" element={<IncomePage />} />
						<Route path="/expenses" element={<ExpensesPage />} />
						<Route path="/salaries" element={<SalariesPage />} />
						<Route path="/settings" element={<SettingsPage />} />
					</Routes>
				</main>
			</div>
		</BrowserRouter>
	);
}


