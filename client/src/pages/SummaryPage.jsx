import { useEffect, useState } from "react";

const apiBase = import.meta.env.VITE_API_URL?.replace(/\/+$/, "") || "http://localhost:5000";

export default function SummaryPage() {
	const [rows, setRows] = useState([]);
	useEffect(() => {
		fetch(`${apiBase}/api/transactions`)
			.then(r => r.json())
			.then(setRows)
			.catch(() => setRows([]));
	}, []);

	return (
		<div className="wrap">
			<div className="container">
				<div className="card">
					<div className="badge">All Transactions</div>
					<h1>Summary</h1>
					<div className="table-wrap" style={{ marginTop: 12 }}>
						<table>
							<thead>
								<tr>
									<th>Date</th>
									<th>Type</th>
									<th>Category</th>
									<th>Subcategory</th>
									<th>Client/Vendor</th>
									<th>Invoice</th>
									<th style={{ textAlign: "right" }}>Amount</th>
									<th>Payment Mode</th>
									<th>Status</th>
									<th>Remarks</th>
								</tr>
							</thead>
							<tbody>
								{rows.map(r => (
									<tr key={r.transaction_id}>
										<td>{r.date?.slice(0,10)}</td>
										<td><span className="pill" style={{ color: r.transaction_type === "income" ? "var(--ok)" : "var(--err)" }}>{r.transaction_type}</span></td>
										<td>{r.category}</td>
										<td>{r.sub_category}</td>
										<td>{r.client_vendor}</td>
										<td>{r.invoice_number}</td>
										<td style={{ textAlign: "right" }}>{Number(r.amount).toFixed(2)}</td>
										<td>{r.payment_mode}</td>
										<td>{r.payment_status}</td>
										<td>{r.remarks}</td>
									</tr>
								))}
								{rows.length === 0 && (
									<tr><td colSpan={10} style={{ color: "var(--muted)" }}>No data.</td></tr>
								)}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
}


