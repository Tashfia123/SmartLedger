import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiBase } from "../utils/api";

const paymentModes = ["Cash", "Bank Transfer", "Credit Card", "Mobile Payment"];
const paymentStatuses = ["Pending", "Completed", "Refunded"];

// Local fallback data in case API isn't reachable yet
const fallbackCatalog = [
	{
		key: "Revenue", name: "Revenue", type: "income", subs: [
			"IT Service Revenue", "Subscription Revenue", "Custom Software Development Fees", "API Integration Fees",
			"Maintenance & Support Fees", "Licensing Revenue", "Training & Consulting Fees", "Affiliate & Referral Revenue",
			"Ad Revenue", "In-App Purchases",
		],
	},
	{
		key: "Non_Operating_Income", name: "Non_Operating_Income", type: "income", subs: [
			"Rental Income", "Gain on Sale of Assets", "Foreign Exchange Gains", "Unrealized Gains on Investments",
			"Government Grants or Subsidies", "Lawsuit Settlements Received",
		],
	},
	{
		key: "Finance_Income", name: "Finance_Income", type: "income", subs: [
			"Interest Earned on Investments", "Interest Earned on Loans Given", "Gain on Financial Instruments",
			"Fair Value Gains on Investments", "Dividends from Financial Securities",
		],
	},
	{
		key: "COGS", name: "COGS", type: "expense", subs: [
			"Cloud Hosting Costs", "Software Licenses", "Developer Costs", "Payment Gateway Fees",
			"Software Maintenance & Updates", "Customer Support Costs", "Server & Infrastructure Costs",
		],
	},
	{
		key: "Operating_Expense", name: "Operating_Expense", type: "expense", subs: [
			"Office Rent", "Office Service Charge", "Electricity Bill", "Internet Bill", "Salary & Wages", "Office Supplies",
			"Repair & Maintenance", "Allowances", "Telephone/Fax", "Entertainment", "Insurance", "HR & Recruitment Costs",
			"Software Subscriptions", "Bank Charges", "Depreciation", "Amortization", "Sales Commissions",
			"Advertising & Marketing Costs", "Public Relations (PR) Expenses", "Customer Acquisition Costs",
			"Website Maintenance Costs", "Research & Development Costs", "Refunds & Discounts Offered", "Bad Debts",
			"Penalties & Fines", "IT & Security Management Costs",
		],
	},
	{
		key: "Non_Operating_Expense", name: "Non_Operating_Expense", type: "expense", subs: [
			"Loss on Sale of Assets", "Foreign Exchange Losses", "Asset Impairment Losses", "Litigation Expenses",
			"Restructuring Costs", "Donations & Charitable Contributions", "Fines & Penalties", "Unusual or One-Time Expenses",
		],
	},
	{
		key: "Finance_Expense", name: "Finance_Expense", type: "expense", subs: [
			"Loan Interest Expense", "Bond Interest Expense", "Interest on Bank Overdrafts", "Lease Interest",
			"Amortization of Loan Fees", "Late Payment Interest Charges",
		],
	},
];

export default function EntryPage() {
	const navigate = useNavigate();
	const [type, setType] = useState("income");
	const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
	const [categories, setCategories] = useState([]);
	const [categoryId, setCategoryId] = useState("");
	const [subcategories, setSubcategories] = useState([]);
	const [subId, setSubId] = useState("");
	const [description, setDescription] = useState("");
	const [clientVendor, setClientVendor] = useState("");
	const [invoiceNumber, setInvoiceNumber] = useState("");
	const [amount, setAmount] = useState("");
	const [paymentMode, setPaymentMode] = useState(paymentModes[0]);
	const [paymentStatus, setPaymentStatus] = useState(paymentStatuses[1]); // Default to "Completed"
	const [remarks, setRemarks] = useState("");
	const [suggestions, setSuggestions] = useState([]);
	const [recent, setRecent] = useState([]);
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		// Load categories for selected type only
		fetch(`${apiBase}/api/categories?type=${encodeURIComponent(type)}`)
			.then(r => r.ok ? r.json() : Promise.reject())
			.then(rows => {
				if (Array.isArray(rows) && rows.length > 0) {
					setCategories(rows.map(r => ({ ...r, local: false })));
				} else {
					throw new Error("no categories");
				}
			})
			.catch(() => {
				// Fallback to local catalog for this type
				const locals = fallbackCatalog
					.filter(c => c.type === type)
					.map((c, idx) => ({
						category_id: `local-${c.key}`,
						name: c.name,
						type: c.type,
						local: true,
						_subs: c.subs.map((s, i) => ({ sub_id: `local-${c.key}-${i}`, name: s })),
						_idx: idx,
					}));
				setCategories(locals);
			});
		fetch(`${apiBase}/api/client-vendor/suggest`)
			.then(r => r.json())
			.then(rows => setSuggestions(rows))
			.catch(() => {});
		refreshRecent();
	}, [type]);

	useEffect(() => {
		// reset selections when type switches
		setCategoryId("");
		setSubId("");
	}, [type]);

	useEffect(() => {
		if (!categoryId) {
			setSubcategories([]);
			setSubId("");
			return;
		}
		const selected = filteredCategories.find(c => String(c.category_id) === String(categoryId));
		if (selected?.local && Array.isArray(selected._subs)) {
			setSubcategories(selected._subs);
			setSubId("");
			return;
		}
		fetch(`${apiBase}/api/subcategories/${categoryId}`)
			.then(r => r.ok ? r.json() : Promise.reject())
			.then(rows => setSubcategories(rows))
			.catch(() => setSubcategories([]));
	}, [categoryId]);

	const filteredCategories = useMemo(
		() => categories.filter(c => c.type === type),
		[categories, type]
	);

	function refreshRecent() {
		fetch(`${apiBase}/api/transactions-recent`)
			.then(r => r.json())
			.then(setRecent)
			.catch(() => {});
	}

	async function handleSubmit(e) {
		e.preventDefault();
		setError("");
		const normalized = typeof amount === "string" ? amount.replace(",", ".").trim() : amount;
		const parsed = Number.parseFloat(normalized);
		if (!Number.isFinite(parsed) || parsed <= 0) {
			setError("Amount must be greater than 0.");
			return;
		}
		setBusy(true);
		try {
			const catName = filteredCategories.find(c => String(c.category_id) === String(categoryId))?.name || null;
			const subName = subcategories.find(s => String(s.sub_id) === String(subId))?.name || null;
			const body = {
				transaction_type: type,
				date,
				category: catName,
				sub_category: subName,
				description,
				client_vendor: clientVendor,
				invoice_number: invoiceNumber,
				amount: parsed,
				payment_mode: paymentMode,
				payment_status: paymentStatus,
				remarks,
			};
			const res = await fetch(`${apiBase}/api/transactions`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});
			if (!res.ok) {
				const msg = await res.json().catch(() => ({}));
				throw new Error(msg?.error || "Failed to save");
			}
			// go to summary page so the user can see the saved row
			navigate("/summary");
			// clear
			setDescription("");
			setClientVendor("");
			setInvoiceNumber("");
			setAmount("");
			setRemarks("");
			refreshRecent();
		} catch (err) {
			setError(err.message);
		} finally {
			setBusy(false);
		}
	}

	return (
		<div className="wrap">
			<div className="container">
				<div className="card">
					<div className="card-header">
						<div>
							<div className="badge">Add New Transaction</div>
							<h1>New Transaction</h1>
							<p className="sub">Record income or expense with rich details. All fields are saved to your database.</p>
						</div>
						<div style={{ display: "flex", gap: 10 }}>
							<button className="btn ghost" type="button" onClick={() => { setDescription(""); setClientVendor(""); setInvoiceNumber(""); setAmount(""); setRemarks(""); }}>Clear</button>
							<button className="btn primary" disabled={busy} type="submit" form="txnForm">Submit Information</button>
						</div>
					</div>

					<form id="txnForm" onSubmit={handleSubmit} style={{ display: "grid", gap: 18 }}>
						<div className="form-grid" style={{ alignItems: "end" }}>
							<div className="col-6">
								<label>Transaction Type</label>
								<div style={{ display: "flex", gap: 16 }}>
									<label><input type="radio" name="type" checked={type === "income"} onChange={() => setType("income")} /> income</label>
									<label><input type="radio" name="type" checked={type === "expense"} onChange={() => setType("expense")} /> expense</label>
								</div>
							</div>
							<div className="col-6" />
						</div>

						<div className="form-grid">
							<div className="col-4">
								<label>Date</label>
								<input value={date} onChange={e => setDate(e.target.value)} type="date" />
							</div>
							<div className="col-4">
								<label>Category</label>
								<select value={categoryId} onChange={e => setCategoryId(e.target.value)}>
									<option value="">Select</option>
									{filteredCategories.map(c => (
										<option key={c.category_id} value={c.category_id}>{c.name}</option>
									))}
								</select>
							</div>
							<div className="col-4">
								<label>Amount</label>
								<input
									value={amount}
									onChange={e => setAmount(e.target.value)}
									type="text"
									inputMode="decimal"
									pattern="^[0-9]{1,20}(\\.[0-9]{1,2})?$"
									maxLength={32}
									placeholder="e.g. 12345678901234567890.00"
								/>
							</div>
						</div>

						<div className="form-grid">
							<div className="col-4">
								<label>Sub category</label>
								<select value={subId} onChange={e => setSubId(e.target.value)}>
									<option value="">Select</option>
									{subcategories.map(s => (
										<option key={s.sub_id} value={s.sub_id}>{s.name}</option>
									))}
								</select>
							</div>
							<div className="col-4">
								<label>Description</label>
								<input value={description} onChange={e => setDescription(e.target.value)} />
							</div>
							<div className="col-4">
								<label>Client/vendor</label>
								<input list="clientVendorList" value={clientVendor} onChange={e => setClientVendor(e.target.value)} />
								<datalist id="clientVendorList">
									{suggestions.map(s => <option key={s} value={s} />)}
								</datalist>
							</div>
						</div>

						<div className="form-grid">
							<div className="col-4">
								<label>Invoice Number</label>
								<input value={invoiceNumber} onChange={e => setInvoiceNumber(e.target.value)} />
							</div>
							<div className="col-4">
								<label>Payment Mode</label>
								<select value={paymentMode} onChange={e => setPaymentMode(e.target.value)}>
									{paymentModes.map(m => <option key={m} value={m}>{m}</option>)}
								</select>
							</div>
							<div className="col-4">
								<label>Payment status</label>
								<select value={paymentStatus} onChange={e => setPaymentStatus(e.target.value)}>
									{paymentStatuses.map(m => <option key={m} value={m}>{m}</option>)}
								</select>
							</div>
						</div>

						<div className="col-12">
							<label>Remarks</label>
							<textarea value={remarks} onChange={e => setRemarks(e.target.value)} rows={4} />
						</div>

						{error && <div className="pill error"><span className="dot" /> {error}</div>}
					</form>

					<h1 style={{ marginTop: 24 }}>Recent</h1>
					<div className="table-wrap">
						<table>
							<thead>
								<tr>
									<th>Date</th>
									<th>Type</th>
									<th>Description</th>
									<th style={{ textAlign: "right" }}>Amount</th>
								</tr>
							</thead>
							<tbody>
								{recent.map((r, i) => (
									<tr key={i}>
										<td>{r.date?.slice(0,10)}</td>
										<td><span className="pill" style={{ color: r.transaction_type === "income" ? "var(--ok)" : "var(--err)" }}>{r.transaction_type}</span></td>
										<td>{r.description}</td>
										<td style={{ textAlign: "right" }}>{Number(r.amount).toFixed(2)}</td>
									</tr>
								))}
								{recent.length === 0 && (
									<tr><td colSpan={4} style={{ color: "var(--muted)" }}>No transactions yet.</td></tr>
								)}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
}


