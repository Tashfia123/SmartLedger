import { apiBase } from "../utils/api";
import { useEffect, useState, useMemo } from "react";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
);

// Helper function to get week number
function getWeekNumber(date) {
	const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
	const dayNum = d.getUTCDay() || 7;
	d.setUTCDate(d.getUTCDate() + 4 - dayNum);
	const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
	return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

export default function Dashboard() {
	const [counts, setCounts] = useState({ total: 0, income: 0, expense: 0, liability: 0, asset: 0 });
	const [totals, setTotals] = useState({ income: 0, expense: 0, liability: 0, asset: 0 });
	const [monthlyData, setMonthlyData] = useState([]);
	const [yearlyData, setYearlyData] = useState([]);
	const [weeklyData, setWeeklyData] = useState([]);
	const [todayData, setTodayData] = useState([]);
	const [thisMonthData, setThisMonthData] = useState([]);
	const [topClients, setTopClients] = useState([]);
	const [topVendors, setTopVendors] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedView, setSelectedView] = useState("monthly"); // "yearly", "monthly", "weekly", "today", "thisMonth"

	useEffect(() => {
		fetch(`${apiBase}/api/transactions`)
			.then(r => r.json())
			.catch(() => [])
			.then(rows => {
				const incomeCount = rows.filter(r => r.transaction_type === "income").length;
				const expenseCount = rows.filter(r => r.transaction_type === "expense").length;
				const liabilityCount = rows.filter(r => r.transaction_type === "liability").length;
				const assetCount = rows.filter(r => r.transaction_type === "asset").length;
				setCounts({ total: rows.length, income: incomeCount, expense: expenseCount, liability: liabilityCount, asset: assetCount });
				
				// Calculate total amounts
				const totalIncome = rows
					.filter(r => r.transaction_type === "income")
					.reduce((sum, r) => sum + parseFloat(r.amount || 0), 0);
				const totalExpense = rows
					.filter(r => r.transaction_type === "expense")
					.reduce((sum, r) => sum + parseFloat(r.amount || 0), 0);
				const totalLiability = rows
					.filter(r => r.transaction_type === "liability")
					.reduce((sum, r) => sum + parseFloat(r.amount || 0), 0);
				const totalAsset = rows
					.filter(r => r.transaction_type === "asset")
					.reduce((sum, r) => sum + parseFloat(r.amount || 0), 0);
				setTotals({ income: totalIncome, expense: totalExpense, liability: totalLiability, asset: totalAsset });
				
				// Calculate monthly data from transactions (same as summary page)
				const monthlyMap = new Map();
				rows.filter(r => r.date).forEach(r => {
					const date = new Date(r.date);
					const year = date.getFullYear();
					const month = date.getMonth() + 1;
					const monthKey = `${year}-${String(month).padStart(2, '0')}`;
					
					if (!monthlyMap.has(monthKey)) {
						monthlyMap.set(monthKey, {
							month: monthKey,
							year: year,
							month_num: month,
							income: 0,
							expense: 0,
							liability: 0,
							asset: 0
						});
					}
					
					const entry = monthlyMap.get(monthKey);
					const amount = parseFloat(r.amount || 0);
					if (r.transaction_type === "income") entry.income += amount;
					else if (r.transaction_type === "expense") entry.expense += amount;
					else if (r.transaction_type === "liability") entry.liability += amount;
					else if (r.transaction_type === "asset") entry.asset += amount;
				});
				
				const monthlyArray = Array.from(monthlyMap.values())
					.sort((a, b) => {
						if (a.year !== b.year) return b.year - a.year;
						return b.month_num - a.month_num;
					})
					.slice(0, 12)
					.reverse();
				setMonthlyData(monthlyArray);
				
				// Calculate yearly data from transactions (last 3 years)
				const yearlyMap = new Map();
				rows.filter(r => r.date).forEach(r => {
					const date = new Date(r.date);
					const year = date.getFullYear();
					
					if (!yearlyMap.has(year)) {
						yearlyMap.set(year, {
							year: year,
							income: 0,
							expense: 0,
							liability: 0,
							asset: 0
						});
					}
					
					const entry = yearlyMap.get(year);
					const amount = parseFloat(r.amount || 0);
					if (r.transaction_type === "income") entry.income += amount;
					else if (r.transaction_type === "expense") entry.expense += amount;
					else if (r.transaction_type === "liability") entry.liability += amount;
					else if (r.transaction_type === "asset") entry.asset += amount;
				});
				
				const yearlyArray = Array.from(yearlyMap.values())
					.sort((a, b) => b.year - a.year)
					.slice(0, 3)
					.reverse();
				setYearlyData(yearlyArray);
				
				// Calculate weekly data from transactions (latest week)
				const now = new Date();
				const latestWeekStart = new Date(now);
				latestWeekStart.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
				latestWeekStart.setHours(0, 0, 0, 0);
				
				const latestWeekEnd = new Date(latestWeekStart);
				latestWeekEnd.setDate(latestWeekStart.getDate() + 6);
				latestWeekEnd.setHours(23, 59, 59, 999);
				
				const weeklyTransactions = rows.filter(r => {
					if (!r.date) return false;
					const transactionDate = new Date(r.date);
					return transactionDate >= latestWeekStart && transactionDate <= latestWeekEnd;
				});
				
				const weeklyIncome = weeklyTransactions
					.filter(r => r.transaction_type === "income")
					.reduce((sum, r) => sum + parseFloat(r.amount || 0), 0);
				const weeklyExpense = weeklyTransactions
					.filter(r => r.transaction_type === "expense")
					.reduce((sum, r) => sum + parseFloat(r.amount || 0), 0);
				const weeklyLiability = weeklyTransactions
					.filter(r => r.transaction_type === "liability")
					.reduce((sum, r) => sum + parseFloat(r.amount || 0), 0);
				const weeklyAsset = weeklyTransactions
					.filter(r => r.transaction_type === "asset")
					.reduce((sum, r) => sum + parseFloat(r.amount || 0), 0);
				
				setWeeklyData([{
					week_start: latestWeekStart.toISOString().split('T')[0],
					week: latestWeekStart.toISOString().split('T')[0],
					year: latestWeekStart.getFullYear(),
					week_num: getWeekNumber(latestWeekStart),
					income: weeklyIncome,
					expense: weeklyExpense,
					liability: weeklyLiability,
					asset: weeklyAsset
				}]);

			// Calculate today's data from all transactions (same as summary page)
			const todayStr = now.toISOString().split('T')[0]; // YYYY-MM-DD format
			const todayYear = now.getFullYear();
			const todayMonth = now.getMonth() + 1;
			const todayDay = now.getDate();
			
			const todayTransactions = rows.filter(r => {
				if (!r.date) return false;
				// Handle both date string formats (YYYY-MM-DD or full ISO string)
				const dateStr = r.date.split('T')[0]; // Get YYYY-MM-DD part
				const transactionDate = new Date(r.date);
				// Compare year, month, and day to handle timezone issues
				return transactionDate.getFullYear() === todayYear &&
				       transactionDate.getMonth() + 1 === todayMonth &&
				       transactionDate.getDate() === todayDay;
			});
			
			const todayIncome = todayTransactions
				.filter(r => r.transaction_type === "income")
				.reduce((sum, r) => sum + parseFloat(r.amount || 0), 0);
			const todayExpense = todayTransactions
				.filter(r => r.transaction_type === "expense")
				.reduce((sum, r) => sum + parseFloat(r.amount || 0), 0);
			const todayLiability = todayTransactions
				.filter(r => r.transaction_type === "liability")
				.reduce((sum, r) => sum + parseFloat(r.amount || 0), 0);
			const todayAsset = todayTransactions
				.filter(r => r.transaction_type === "asset")
				.reduce((sum, r) => sum + parseFloat(r.amount || 0), 0);
			
			setTodayData([{
				day: todayStr,
				day_str: todayStr,
				income: todayIncome,
				expense: todayExpense,
				liability: todayLiability,
				asset: todayAsset
			}]);
			
			// Calculate this month data from all transactions (same as summary page)
			const currentYear = now.getFullYear();
			const currentMonth = now.getMonth() + 1;
			
			const thisMonthTransactions = rows.filter(r => {
				if (!r.date) return false;
				const transactionDate = new Date(r.date);
				return transactionDate.getFullYear() === currentYear && 
				       transactionDate.getMonth() + 1 === currentMonth;
			});
			
			const thisMonthIncome = thisMonthTransactions
				.filter(r => r.transaction_type === "income")
				.reduce((sum, r) => sum + parseFloat(r.amount || 0), 0);
			const thisMonthExpense = thisMonthTransactions
				.filter(r => r.transaction_type === "expense")
				.reduce((sum, r) => sum + parseFloat(r.amount || 0), 0);
			const thisMonthLiability = thisMonthTransactions
				.filter(r => r.transaction_type === "liability")
				.reduce((sum, r) => sum + parseFloat(r.amount || 0), 0);
			const thisMonthAsset = thisMonthTransactions
				.filter(r => r.transaction_type === "asset")
				.reduce((sum, r) => sum + parseFloat(r.amount || 0), 0);
			
			setThisMonthData([{
				year: currentYear,
				month: currentMonth,
				month_str: `${currentYear}-${String(currentMonth).padStart(2, '0')}`,
				income: thisMonthIncome,
				expense: thisMonthExpense,
				liability: thisMonthLiability,
				asset: thisMonthAsset
			}]);

			// Calculate top clients from transactions data
			const clientMap = new Map();
			rows
				.filter(r => r.transaction_type === "income" && r.client_vendor && r.client_vendor.trim() !== "")
				.forEach(r => {
					const name = r.client_vendor.trim();
					const amount = parseFloat(r.amount || 0);
					if (clientMap.has(name)) {
						const existing = clientMap.get(name);
						existing.transaction_count += 1;
						existing.total_amount += amount;
					} else {
						clientMap.set(name, {
							client_vendor: name,
							transaction_count: 1,
							total_amount: amount,
						});
					}
				});
			const topClientsList = Array.from(clientMap.values())
				.sort((a, b) => b.total_amount - a.total_amount)
				.slice(0, 10);
			setTopClients(topClientsList);

			// Calculate top vendors from transactions data
			const vendorMap = new Map();
			rows
				.filter(r => r.transaction_type === "expense" && r.client_vendor && r.client_vendor.trim() !== "")
				.forEach(r => {
					const name = r.client_vendor.trim();
					const amount = parseFloat(r.amount || 0);
					if (vendorMap.has(name)) {
						const existing = vendorMap.get(name);
						existing.transaction_count += 1;
						existing.total_amount += amount;
					} else {
						vendorMap.set(name, {
							client_vendor: name,
							transaction_count: 1,
							total_amount: amount,
						});
					}
				});
			const topVendorsList = Array.from(vendorMap.values())
				.sort((a, b) => b.total_amount - a.total_amount)
				.slice(0, 10);
			setTopVendors(topVendorsList);

			setLoading(false);
		});
	}, []);

	const netProfit = totals.income - totals.expense;

	// Calculate totals for current view
	const viewTotals = useMemo(() => {
		switch (selectedView) {
			case "yearly":
				return yearlyData.reduce((acc, d) => ({
					income: acc.income + parseFloat(d.income || 0),
					expense: acc.expense + parseFloat(d.expense || 0),
					liability: acc.liability + parseFloat(d.liability || 0),
					asset: acc.asset + parseFloat(d.asset || 0),
				}), { income: 0, expense: 0, liability: 0, asset: 0 });
			case "monthly":
				return monthlyData.reduce((acc, d) => ({
					income: acc.income + parseFloat(d.income || 0),
					expense: acc.expense + parseFloat(d.expense || 0),
					liability: acc.liability + parseFloat(d.liability || 0),
					asset: acc.asset + parseFloat(d.asset || 0),
				}), { income: 0, expense: 0, liability: 0, asset: 0 });
			case "weekly":
				return weeklyData.length > 0 ? {
					income: parseFloat(weeklyData[0].income || 0),
					expense: parseFloat(weeklyData[0].expense || 0),
					liability: parseFloat(weeklyData[0].liability || 0),
					asset: parseFloat(weeklyData[0].asset || 0),
				} : { income: 0, expense: 0, liability: 0, asset: 0 };
			case "today":
				return todayData.length > 0 ? {
					income: parseFloat(todayData[0].income || 0),
					expense: parseFloat(todayData[0].expense || 0),
					liability: parseFloat(todayData[0].liability || 0),
					asset: parseFloat(todayData[0].asset || 0),
				} : { income: 0, expense: 0, liability: 0, asset: 0 };
			case "thisMonth":
				return thisMonthData.length > 0 ? {
					income: parseFloat(thisMonthData[0].income || 0),
					expense: parseFloat(thisMonthData[0].expense || 0),
					liability: parseFloat(thisMonthData[0].liability || 0),
					asset: parseFloat(thisMonthData[0].asset || 0),
				} : { income: 0, expense: 0, liability: 0, asset: 0 };
			default:
				return { income: 0, expense: 0, liability: 0, asset: 0 };
		}
	}, [selectedView, yearlyData, monthlyData, weeklyData, todayData, thisMonthData]);

	const monthlyChartData = {
		labels: monthlyData.map(d => {
			const [year, month] = d.month.split("-");
			const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
			return `${monthNames[parseInt(month) - 1]} ${year}`;
		}),
		datasets: [
			{
				label: "Income",
				data: monthlyData.map(d => parseFloat(d.income || 0)),
				backgroundColor: "rgba(34, 197, 94, 0.7)",
				borderColor: "rgba(34, 197, 94, 1)",
				borderWidth: 1,
			},
			{
				label: "Expense",
				data: monthlyData.map(d => parseFloat(d.expense || 0)),
				backgroundColor: "rgba(239, 68, 68, 0.7)",
				borderColor: "rgba(239, 68, 68, 1)",
				borderWidth: 1,
			},
			{
				label: "Liability",
				data: monthlyData.map(d => parseFloat(d.liability || 0)),
				backgroundColor: "rgba(251, 191, 36, 0.7)",
				borderColor: "rgba(251, 191, 36, 1)",
				borderWidth: 1,
			},
			{
				label: "Asset",
				data: monthlyData.map(d => parseFloat(d.asset || 0)),
				backgroundColor: "rgba(59, 130, 246, 0.7)",
				borderColor: "rgba(59, 130, 246, 1)",
				borderWidth: 1,
			},
		],
	};

	const yearlyChartData = {
		labels: yearlyData.map(d => String(d.year || "")),
		datasets: [
			{
				label: "Income",
				data: yearlyData.map(d => parseFloat(d.income || 0)),
				backgroundColor: "rgba(34, 197, 94, 0.7)",
				borderColor: "rgba(34, 197, 94, 1)",
				borderWidth: 1,
			},
			{
				label: "Expense",
				data: yearlyData.map(d => parseFloat(d.expense || 0)),
				backgroundColor: "rgba(239, 68, 68, 0.7)",
				borderColor: "rgba(239, 68, 68, 1)",
				borderWidth: 1,
			},
			{
				label: "Liability",
				data: yearlyData.map(d => parseFloat(d.liability || 0)),
				backgroundColor: "rgba(251, 191, 36, 0.7)",
				borderColor: "rgba(251, 191, 36, 1)",
				borderWidth: 1,
			},
			{
				label: "Asset",
				data: yearlyData.map(d => parseFloat(d.asset || 0)),
				backgroundColor: "rgba(59, 130, 246, 0.7)",
				borderColor: "rgba(59, 130, 246, 1)",
				borderWidth: 1,
			},
		],
	};

	const weeklyChartData = {
		labels: weeklyData.length > 0 ? ["Latest Week"] : [],
		datasets: [
			{
				label: "Income",
				data: weeklyData.length > 0 ? [parseFloat(weeklyData[0].income || 0)] : [0],
				backgroundColor: "rgba(34, 197, 94, 0.7)",
				borderColor: "rgba(34, 197, 94, 1)",
				borderWidth: 1,
			},
			{
				label: "Expense",
				data: weeklyData.length > 0 ? [parseFloat(weeklyData[0].expense || 0)] : [0],
				backgroundColor: "rgba(239, 68, 68, 0.7)",
				borderColor: "rgba(239, 68, 68, 1)",
				borderWidth: 1,
			},
			{
				label: "Liability",
				data: weeklyData.length > 0 ? [parseFloat(weeklyData[0].liability || 0)] : [0],
				backgroundColor: "rgba(251, 191, 36, 0.7)",
				borderColor: "rgba(251, 191, 36, 1)",
				borderWidth: 1,
			},
			{
				label: "Asset",
				data: weeklyData.length > 0 ? [parseFloat(weeklyData[0].asset || 0)] : [0],
				backgroundColor: "rgba(59, 130, 246, 0.7)",
				borderColor: "rgba(59, 130, 246, 1)",
				borderWidth: 1,
			},
		],
	};

	const todayChartData = {
		labels: ["Today"],
		datasets: [
			{
				label: "Income",
				data: todayData.length > 0 ? [parseFloat(todayData[0].income || 0)] : [0],
				backgroundColor: "rgba(34, 197, 94, 0.7)",
				borderColor: "rgba(34, 197, 94, 1)",
				borderWidth: 1,
			},
			{
				label: "Expense",
				data: todayData.length > 0 ? [parseFloat(todayData[0].expense || 0)] : [0],
				backgroundColor: "rgba(239, 68, 68, 0.7)",
				borderColor: "rgba(239, 68, 68, 1)",
				borderWidth: 1,
			},
			{
				label: "Liability",
				data: todayData.length > 0 ? [parseFloat(todayData[0].liability || 0)] : [0],
				backgroundColor: "rgba(251, 191, 36, 0.7)",
				borderColor: "rgba(251, 191, 36, 1)",
				borderWidth: 1,
			},
			{
				label: "Asset",
				data: todayData.length > 0 ? [parseFloat(todayData[0].asset || 0)] : [0],
				backgroundColor: "rgba(59, 130, 246, 0.7)",
				borderColor: "rgba(59, 130, 246, 1)",
				borderWidth: 1,
			},
		],
	};

	const thisMonthChartData = {
		labels: [new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })],
		datasets: [
			{
				label: "Income",
				data: thisMonthData.length > 0 ? [parseFloat(thisMonthData[0].income || 0)] : [0],
				backgroundColor: "rgba(34, 197, 94, 0.7)",
				borderColor: "rgba(34, 197, 94, 1)",
				borderWidth: 1,
			},
			{
				label: "Expense",
				data: thisMonthData.length > 0 ? [parseFloat(thisMonthData[0].expense || 0)] : [0],
				backgroundColor: "rgba(239, 68, 68, 0.7)",
				borderColor: "rgba(239, 68, 68, 1)",
				borderWidth: 1,
			},
			{
				label: "Liability",
				data: thisMonthData.length > 0 ? [parseFloat(thisMonthData[0].liability || 0)] : [0],
				backgroundColor: "rgba(251, 191, 36, 0.7)",
				borderColor: "rgba(251, 191, 36, 1)",
				borderWidth: 1,
			},
			{
				label: "Asset",
				data: thisMonthData.length > 0 ? [parseFloat(thisMonthData[0].asset || 0)] : [0],
				backgroundColor: "rgba(59, 130, 246, 0.7)",
				borderColor: "rgba(59, 130, 246, 1)",
				borderWidth: 1,
			},
		],
	};

	const chartOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: "top",
			},
			tooltip: {
				callbacks: {
					label: function(context) {
						const value = context.parsed.y;
						return `${context.dataset.label}: ${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
					},
				},
			},
		},
		scales: {
			y: {
				beginAtZero: true,
				ticks: {
					callback: function(value) {
						return value.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
					},
				},
			},
		},
	};

	return (
		<div className="wrap page">
			<div className="container">
				<div className="card">
					<div className="badge">Dashboard</div>
					<h1>Overview</h1>
					<p className="sub">Quick snapshot of your ledger.</p>
					<div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 16, marginTop: 16 }}>
						<div style={{ 
							padding: "12px 16px", 
							fontSize: 14, 
							fontWeight: 600,
							backgroundColor: "#fff",
							border: "1px solid var(--border)",
							borderRadius: 0
						}}>
							<span className="dot" />
							<div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
								<span style={{ fontSize: 11, opacity: 0.8, fontWeight: 500 }}>Total Transactions</span>
								<span>{counts.total}</span>
							</div>
						</div>
						<div style={{ 
							padding: "12px 16px", 
							fontSize: 14, 
							fontWeight: 600,
							backgroundColor: "rgba(34, 197, 94, 0.1)",
							border: "1px solid rgba(34, 197, 94, 0.3)",
							borderRadius: 0
						}}>
							<span className="dot" />
							<div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
								<span style={{ fontSize: 11, opacity: 0.8, fontWeight: 500 }}>Income</span>
								<span style={{ color: "var(--ok)" }}>{counts.income}</span>
							</div>
						</div>
						<div style={{ 
							padding: "12px 16px", 
							fontSize: 14, 
							fontWeight: 600,
							backgroundColor: "rgba(239, 68, 68, 0.1)",
							border: "1px solid rgba(239, 68, 68, 0.3)",
							borderRadius: 0
						}}>
							<span className="dot" />
							<div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
								<span style={{ fontSize: 11, opacity: 0.8, fontWeight: 500 }}>Expense</span>
								<span style={{ color: "var(--err)" }}>{counts.expense}</span>
							</div>
						</div>
						<div style={{ 
							padding: "12px 16px", 
							fontSize: 14, 
							fontWeight: 600,
							backgroundColor: "rgba(251, 191, 36, 0.1)",
							border: "1px solid rgba(251, 191, 36, 0.3)",
							borderRadius: 0
						}}>
							<span className="dot" style={{ backgroundColor: "#fbbf24" }} />
							<div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
								<span style={{ fontSize: 11, opacity: 0.8, fontWeight: 500 }}>Liability</span>
								<span style={{ color: "#fbbf24" }}>{counts.liability}</span>
							</div>
						</div>
						<div style={{ 
							padding: "12px 16px", 
							fontSize: 14, 
							fontWeight: 600,
							backgroundColor: "rgba(59, 130, 246, 0.1)",
							border: "1px solid rgba(59, 130, 246, 0.3)",
							borderRadius: 0
						}}>
							<span className="dot" style={{ backgroundColor: "#3b82f6" }} />
							<div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
								<span style={{ fontSize: 11, opacity: 0.8, fontWeight: 500 }}>Asset</span>
								<span style={{ color: "#3b82f6" }}>{counts.asset}</span>
							</div>
						</div>
						<div style={{ 
							padding: "12px 16px", 
							fontSize: 14, 
							fontWeight: 600,
							backgroundColor: netProfit >= 0 ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)",
							border: `1px solid ${netProfit >= 0 ? "rgba(34, 197, 94, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
							borderRadius: 0
						}}>
							<span className="dot" />
							<div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
								<span style={{ fontSize: 11, opacity: 0.8, fontWeight: 500 }}>Net {netProfit >= 0 ? "Profit" : "Loss"}</span>
								<span style={{ color: netProfit >= 0 ? "var(--ok)" : "var(--err)" }}>
									{netProfit >= 0 ? "+" : ""}{netProfit.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
								</span>
							</div>
						</div>
					</div>
				</div>

				{/* Analytics Section with Filter Buttons */}
				<div className="card" style={{ marginTop: 24 }}>
					<div className="badge">Analytics</div>
					<h2>Transaction Summary</h2>
					<p className="sub">Income vs Expense trends</p>
					
					{/* Filter Buttons */}
					<div style={{ 
						display: "flex", 
						gap: 12, 
						marginTop: 20, 
						marginBottom: 24,
						flexWrap: "wrap"
					}}>
						<button
							className={`view-filter-btn ${selectedView === "today" ? "active" : ""}`}
							onClick={() => setSelectedView("today")}
						>
							Today
						</button>
						<button
							className={`view-filter-btn ${selectedView === "thisMonth" ? "active" : ""}`}
							onClick={() => setSelectedView("thisMonth")}
						>
							This Month
						</button>
						<button
							className={`view-filter-btn ${selectedView === "weekly" ? "active" : ""}`}
							onClick={() => setSelectedView("weekly")}
						>
							This Week
						</button>
						<button
							className={`view-filter-btn ${selectedView === "monthly" ? "active" : ""}`}
							onClick={() => setSelectedView("monthly")}
						>
							This Year
						</button>
						<button
							className={`view-filter-btn ${selectedView === "yearly" ? "active" : ""}`}
							onClick={() => setSelectedView("yearly")}
						>
							Last Few Years
						</button>
					</div>

					{/* Yearly Graph */}
					{selectedView === "yearly" && (
						<>
							<h3 style={{ marginBottom: 8, fontSize: 18, fontWeight: 600 }}>Yearly Summary</h3>
							<p className="sub" style={{ marginBottom: 20 }}>Income vs Expense trends over the last 3 years</p>
							{/* Totals Display */}
							<div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20, padding: "12px", background: "var(--bg)", borderRadius: 8 }}>
								<div style={{ textAlign: "center" }}>
									<div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>Income</div>
									<div style={{ fontSize: 16, fontWeight: 700, color: "var(--ok)" }}>{viewTotals.income.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
								</div>
								<div style={{ textAlign: "center" }}>
									<div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>Expense</div>
									<div style={{ fontSize: 16, fontWeight: 700, color: "var(--err)" }}>{viewTotals.expense.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
								</div>
								<div style={{ textAlign: "center" }}>
									<div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>Liability</div>
									<div style={{ fontSize: 16, fontWeight: 700, color: "#fbbf24" }}>{viewTotals.liability.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
								</div>
								<div style={{ textAlign: "center" }}>
									<div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>Asset</div>
									<div style={{ fontSize: 16, fontWeight: 700, color: "#3b82f6" }}>{viewTotals.asset.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
								</div>
							</div>
							{loading ? (
								<div style={{ padding: "40px", textAlign: "center", color: "#666" }}>Loading chart data...</div>
							) : yearlyData.length === 0 ? (
								<div style={{ padding: "40px", textAlign: "center", color: "#666" }}>No yearly transaction data available</div>
							) : (
								<div style={{ height: "400px", marginTop: 20 }}>
									<Bar 
										data={yearlyChartData} 
										options={{
											...chartOptions,
											plugins: {
												...chartOptions.plugins,
												title: {
													display: true,
													text: "Yearly Transaction Summary (Last 3 Years)",
													font: {
														size: 16,
														weight: "bold",
													},
												},
											},
										}} 
									/>
								</div>
							)}
						</>
					)}

					{/* Monthly Graph */}
					{selectedView === "monthly" && (
						<>
							<h3 style={{ marginBottom: 8, fontSize: 18, fontWeight: 600 }}>Monthly Summary</h3>
							<p className="sub" style={{ marginBottom: 20 }}>Income vs Expense trends over the last 12 months</p>
							{/* Totals Display */}
							<div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20, padding: "12px", background: "var(--bg)", borderRadius: 8 }}>
								<div style={{ textAlign: "center" }}>
									<div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>Income</div>
									<div style={{ fontSize: 16, fontWeight: 700, color: "var(--ok)" }}>{viewTotals.income.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
								</div>
								<div style={{ textAlign: "center" }}>
									<div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>Expense</div>
									<div style={{ fontSize: 16, fontWeight: 700, color: "var(--err)" }}>{viewTotals.expense.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
								</div>
								<div style={{ textAlign: "center" }}>
									<div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>Liability</div>
									<div style={{ fontSize: 16, fontWeight: 700, color: "#fbbf24" }}>{viewTotals.liability.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
								</div>
								<div style={{ textAlign: "center" }}>
									<div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>Asset</div>
									<div style={{ fontSize: 16, fontWeight: 700, color: "#3b82f6" }}>{viewTotals.asset.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
								</div>
							</div>
							{loading ? (
								<div style={{ padding: "40px", textAlign: "center", color: "#666" }}>Loading chart data...</div>
							) : monthlyData.length === 0 ? (
								<div style={{ padding: "40px", textAlign: "center", color: "#666" }}>No transaction data available</div>
							) : (
								<div style={{ height: "400px", marginTop: 20 }}>
									<Bar 
										data={monthlyChartData} 
										options={{
											...chartOptions,
											plugins: {
												...chartOptions.plugins,
												title: {
													display: true,
													text: "Monthly Transaction Summary (Last 12 Months)",
													font: {
														size: 16,
														weight: "bold",
													},
												},
											},
										}} 
									/>
								</div>
							)}
						</>
					)}

					{/* Weekly Graph */}
					{selectedView === "weekly" && (
						<>
							<h3 style={{ marginBottom: 8, fontSize: 18, fontWeight: 600 }}>Latest Week Summary</h3>
							<p className="sub" style={{ marginBottom: 20 }}>Income vs Expense for the most recent week</p>
							{/* Totals Display */}
							<div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20, padding: "12px", background: "var(--bg)", borderRadius: 8 }}>
								<div style={{ textAlign: "center" }}>
									<div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>Income</div>
									<div style={{ fontSize: 16, fontWeight: 700, color: "var(--ok)" }}>{viewTotals.income.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
								</div>
								<div style={{ textAlign: "center" }}>
									<div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>Expense</div>
									<div style={{ fontSize: 16, fontWeight: 700, color: "var(--err)" }}>{viewTotals.expense.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
								</div>
								<div style={{ textAlign: "center" }}>
									<div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>Liability</div>
									<div style={{ fontSize: 16, fontWeight: 700, color: "#fbbf24" }}>{viewTotals.liability.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
								</div>
								<div style={{ textAlign: "center" }}>
									<div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>Asset</div>
									<div style={{ fontSize: 16, fontWeight: 700, color: "#3b82f6" }}>{viewTotals.asset.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
								</div>
							</div>
							{loading ? (
								<div style={{ padding: "40px", textAlign: "center", color: "#666" }}>Loading chart data...</div>
							) : weeklyData.length === 0 ? (
								<div style={{ padding: "40px", textAlign: "center", color: "#666" }}>No weekly transaction data available</div>
							) : (
								<div style={{ height: "400px", marginTop: 20 }}>
									<Bar 
										data={weeklyChartData} 
										options={{
											...chartOptions,
											plugins: {
												...chartOptions.plugins,
												title: {
													display: true,
													text: weeklyData.length > 0 
														? `Latest Week Transaction Summary (Week of ${new Date(weeklyData[0].week).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })})`
														: "Latest Week Transaction Summary",
													font: {
														size: 16,
														weight: "bold",
													},
												},
											},
										}} 
									/>
								</div>
							)}
						</>
					)}

					{/* Today Graph */}
					{selectedView === "today" && (
						<>
							<h3 style={{ marginBottom: 8, fontSize: 18, fontWeight: 600 }}>Today's Summary</h3>
							<p className="sub" style={{ marginBottom: 20 }}>Income vs Expense for today</p>
							{/* Totals Display */}
							<div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20, padding: "12px", background: "var(--bg)", borderRadius: 8 }}>
								<div style={{ textAlign: "center" }}>
									<div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>Income</div>
									<div style={{ fontSize: 16, fontWeight: 700, color: "var(--ok)" }}>{viewTotals.income.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
								</div>
								<div style={{ textAlign: "center" }}>
									<div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>Expense</div>
									<div style={{ fontSize: 16, fontWeight: 700, color: "var(--err)" }}>{viewTotals.expense.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
								</div>
								<div style={{ textAlign: "center" }}>
									<div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>Liability</div>
									<div style={{ fontSize: 16, fontWeight: 700, color: "#fbbf24" }}>{viewTotals.liability.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
								</div>
								<div style={{ textAlign: "center" }}>
									<div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>Asset</div>
									<div style={{ fontSize: 16, fontWeight: 700, color: "#3b82f6" }}>{viewTotals.asset.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
								</div>
							</div>
							{loading ? (
								<div style={{ padding: "40px", textAlign: "center", color: "#666" }}>Loading chart data...</div>
							) : (
								<div style={{ height: "400px", marginTop: 20 }}>
									<Bar 
										data={todayChartData} 
										options={{
											...chartOptions,
											plugins: {
												...chartOptions.plugins,
												title: {
													display: true,
													text: `Today's Transaction Summary (${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })})`,
													font: {
														size: 16,
														weight: "bold",
													},
												},
											},
										}} 
									/>
								</div>
							)}
						</>
					)}

					{/* This Month Graph */}
					{selectedView === "thisMonth" && (
						<>
							<h3 style={{ marginBottom: 8, fontSize: 18, fontWeight: 600 }}>This Month Summary</h3>
							<p className="sub" style={{ marginBottom: 20 }}>Income vs Expense for the current month</p>
							{/* Totals Display */}
							<div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20, padding: "12px", background: "var(--bg)", borderRadius: 8 }}>
								<div style={{ textAlign: "center" }}>
									<div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>Income</div>
									<div style={{ fontSize: 16, fontWeight: 700, color: "var(--ok)" }}>{viewTotals.income.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
								</div>
								<div style={{ textAlign: "center" }}>
									<div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>Expense</div>
									<div style={{ fontSize: 16, fontWeight: 700, color: "var(--err)" }}>{viewTotals.expense.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
								</div>
								<div style={{ textAlign: "center" }}>
									<div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>Liability</div>
									<div style={{ fontSize: 16, fontWeight: 700, color: "#fbbf24" }}>{viewTotals.liability.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
								</div>
								<div style={{ textAlign: "center" }}>
									<div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>Asset</div>
									<div style={{ fontSize: 16, fontWeight: 700, color: "#3b82f6" }}>{viewTotals.asset.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
								</div>
							</div>
							{loading ? (
								<div style={{ padding: "40px", textAlign: "center", color: "#666" }}>Loading chart data...</div>
							) : (
								<div style={{ height: "400px", marginTop: 20 }}>
									<Bar 
										data={thisMonthChartData} 
										options={{
											...chartOptions,
											plugins: {
												...chartOptions.plugins,
												title: {
													display: true,
													text: `This Month Transaction Summary (${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })})`,
													font: {
														size: 16,
														weight: "bold",
													},
												},
											},
										}} 
									/>
								</div>
							)}
						</>
					)}
				</div>

				{/* Top Clients and Vendors */}
				<div className="form-grid" style={{ marginTop: 24, gap: 24 }}>
					<div className="col-6">
						<div className="card">
							<div className="badge ok">Top Clients</div>
							<h2>Top 10 Income Sources</h2>
							<p className="sub">Clients generating the most revenue</p>
							{loading ? (
								<div style={{ padding: "20px", textAlign: "center", color: "#666" }}>Loading...</div>
							) : topClients.length === 0 ? (
								<div style={{ padding: "20px", textAlign: "center", color: "#666" }}>No client data available</div>
							) : (
								<div style={{ marginTop: 16 }}>
									{topClients.map((client, index) => (
										<div key={client.client_vendor || index} style={{
											display: "flex",
											justifyContent: "space-between",
											alignItems: "center",
											padding: "12px 0",
											borderBottom: index < topClients.length - 1 ? "1px solid var(--border)" : "none",
										}}>
											<div style={{ display: "flex", alignItems: "center", gap: 12 }}>
												<div style={{
													width: 24,
													height: 24,
													borderRadius: "50%",
													background: "linear-gradient(135deg, var(--ok), #16a34a)",
													display: "flex",
													alignItems: "center",
													justifyContent: "center",
													color: "#fff",
													fontWeight: 700,
													fontSize: 12,
												}}>
													{index + 1}
												</div>
												<div>
													<div style={{ fontWeight: 600, fontSize: 14 }}>{client.client_vendor}</div>
													<div style={{ fontSize: 12, color: "var(--muted)" }}>
														{client.transaction_count || 0} transaction{(client.transaction_count || 0) !== 1 ? "s" : ""}
													</div>
												</div>
											</div>
											<div style={{ fontWeight: 700, color: "var(--ok)", fontSize: 16 }}>
												{parseFloat(client.total_amount || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
											</div>
										</div>
									))}
								</div>
							)}
						</div>
					</div>

					<div className="col-6">
						<div className="card">
							<div className="badge error">Top Vendors</div>
							<h2>Top 10 Expense Sources</h2>
							<p className="sub">Vendors with the highest expenses</p>
							{loading ? (
								<div style={{ padding: "20px", textAlign: "center", color: "#666" }}>Loading...</div>
							) : topVendors.length === 0 ? (
								<div style={{ padding: "20px", textAlign: "center", color: "#666" }}>No vendor data available</div>
							) : (
								<div style={{ marginTop: 16 }}>
									{topVendors.map((vendor, index) => (
										<div key={vendor.client_vendor || index} style={{
											display: "flex",
											justifyContent: "space-between",
											alignItems: "center",
											padding: "12px 0",
											borderBottom: index < topVendors.length - 1 ? "1px solid var(--border)" : "none",
										}}>
											<div style={{ display: "flex", alignItems: "center", gap: 12 }}>
												<div style={{
													width: 24,
													height: 24,
													borderRadius: "50%",
													background: "linear-gradient(135deg, var(--err), #dc2626)",
													display: "flex",
													alignItems: "center",
													justifyContent: "center",
													color: "#fff",
													fontWeight: 700,
													fontSize: 12,
												}}>
													{index + 1}
												</div>
												<div>
													<div style={{ fontWeight: 600, fontSize: 14 }}>{vendor.client_vendor}</div>
													<div style={{ fontSize: 12, color: "var(--muted)" }}>
														{vendor.transaction_count || 0} transaction{(vendor.transaction_count || 0) !== 1 ? "s" : ""}
													</div>
												</div>
											</div>
											<div style={{ fontWeight: 700, color: "var(--err)", fontSize: 16 }}>
												{parseFloat(vendor.total_amount || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
											</div>
										</div>
									))}
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}


