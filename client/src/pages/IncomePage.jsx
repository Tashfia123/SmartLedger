import { useEffect, useState } from "react";
import { apiBase } from "../utils/api";

export default function IncomePage() {
	const [rows, setRows] = useState([]);
	useEffect(() => {
		fetch(`${apiBase}/api/transactions`).then(r => r.json()).then(all => {
			setRows(all.filter(r => r.transaction_type === "income"));
		}).catch(() => setRows([]));
	}, []);
	return (
		<div className="wrap page">
			<div className="container">
				<div className="card">
					<div className="badge">Income</div>
					<h1>Income Transactions</h1>
					<div className="table-wrap" style={{ marginTop: 12 }}>
						<table>
							<thead>
								<tr>
									<th>Date</th><th>Category</th><th>Subcategory</th><th>Description</th><th style={{textAlign:"right"}}>Amount</th>
								</tr>
							</thead>
							<tbody>
								{rows.map(r => (
									<tr key={r.transaction_id}>
										<td>{r.date?.slice(0,10)}</td>
										<td>{r.category}</td>
										<td>{r.sub_category}</td>
										<td>{r.description}</td>
										<td style={{textAlign:"right"}}>{Number(r.amount).toFixed(2)}</td>
									</tr>
								))}
								{rows.length === 0 && <tr><td colSpan={5} style={{color:"var(--muted)"}}>No data.</td></tr>}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
}


