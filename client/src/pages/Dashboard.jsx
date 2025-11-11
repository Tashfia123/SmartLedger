const apiBase = import.meta.env.VITE_API_URL?.replace(/\/+$/, "") || "http://localhost:5000";
import { useEffect, useState } from "react";

export default function Dashboard() {
	const [counts, setCounts] = useState({ total: 0, income: 0, expense: 0 });
	useEffect(() => {
		Promise.all([
			fetch(`${apiBase}/api/transactions`).then(r => r.json()).catch(() => []),
		]).then(([rows]) => {
			const income = rows.filter(r => r.transaction_type === "income").length;
			const expense = rows.filter(r => r.transaction_type === "expense").length;
			setCounts({ total: rows.length, income, expense });
		});
	}, []);
	return (
		<div className="wrap page">
			<div className="container">
				<div className="card">
					<div className="badge">Dashboard</div>
					<h1>Overview</h1>
					<p className="sub">Quick snapshot of your ledger.</p>
					<div className="form-grid" style={{ marginTop: 16 }}>
						<div className="col-4"><div className="pill"><span className="dot" /> Total transactions: {counts.total}</div></div>
						<div className="col-4"><div className="pill ok"><span className="dot" /> Income: {counts.income}</div></div>
						<div className="col-4"><div className="pill error"><span className="dot" /> Expense: {counts.expense}</div></div>
					</div>
				</div>
			</div>
		</div>
	);
}


