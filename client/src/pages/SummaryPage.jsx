import { useEffect, useState, useMemo } from "react";

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
	{
		key: "Current_Liabilities", name: "Current_Liabilities", type: "liability", subs: [
			"Accounts Payable", "Short-term Loans", "Accrued Expenses", "Taxes Payable",
			"Unearned Revenue", "Current Portion of Long-term Debt", "Bank Overdraft",
		],
	},
	{
		key: "Long_Term_Liabilities", name: "Long_Term_Liabilities", type: "liability", subs: [
			"Long-term Loans", "Bonds Payable", "Mortgage Payable", "Lease Obligations",
			"Deferred Tax Liabilities", "Pension Liabilities",
		],
	},
	{
		key: "Current_Assets", name: "Current_Assets", type: "asset", subs: [
			"Cash", "Bank Accounts", "Accounts Receivable", "Inventory",
			"Prepaid Expenses", "Short-term Investments", "Marketable Securities",
		],
	},
	{
		key: "Fixed_Assets", name: "Fixed_Assets", type: "asset", subs: [
			"Property, Plant & Equipment", "Land", "Buildings", "Vehicles",
			"Machinery & Equipment", "Furniture & Fixtures", "Computer Equipment",
		],
	},
	{
		key: "Intangible_Assets", name: "Intangible_Assets", type: "asset", subs: [
			"Goodwill", "Patents", "Trademarks", "Copyrights",
			"Software Development Costs", "Licenses", "Brand Value",
		],
	},
	{
		key: "Investments", name: "Investments", type: "asset", subs: [
			"Long-term Investments", "Stocks", "Bonds", "Mutual Funds",
			"Real Estate Investments", "Investment Properties",
		],
	},
];

export default function SummaryPage() {
	const [rows, setRows] = useState([]);
	const [loading, setLoading] = useState(false);
	const [filters, setFilters] = useState({
		type: "",
		month: "",
	});
	const [searchQuery, setSearchQuery] = useState("");
	const [editingTransaction, setEditingTransaction] = useState(null);
	const [deleteConfirm, setDeleteConfirm] = useState(null);
	const [editFormData, setEditFormData] = useState({});
	const [editLoading, setEditLoading] = useState(false);
	const [editError, setEditError] = useState("");
	
	// New Transaction Modal State
	const [showNewTransactionModal, setShowNewTransactionModal] = useState(false);
	const [newTxnType, setNewTxnType] = useState("income");
	const [newTxnDate, setNewTxnDate] = useState(() => new Date().toISOString().slice(0, 10));
	const [newTxnCategories, setNewTxnCategories] = useState([]);
	const [newTxnCategoryId, setNewTxnCategoryId] = useState("");
	const [newTxnSubcategories, setNewTxnSubcategories] = useState([]);
	const [newTxnSubId, setNewTxnSubId] = useState("");
	const [newTxnDescription, setNewTxnDescription] = useState("");
	const [newTxnClientVendor, setNewTxnClientVendor] = useState("");
	const [newTxnInvoiceNumber, setNewTxnInvoiceNumber] = useState("");
	const [newTxnAmount, setNewTxnAmount] = useState("");
	const [newTxnPaymentMode, setNewTxnPaymentMode] = useState(paymentModes[0]);
	const [newTxnPaymentStatus, setNewTxnPaymentStatus] = useState(paymentStatuses[1]); // Default to "Completed"
	const [newTxnRemarks, setNewTxnRemarks] = useState("");
	const [newTxnSuggestions, setNewTxnSuggestions] = useState([]);
	const [newTxnBusy, setNewTxnBusy] = useState(false);
	const [newTxnError, setNewTxnError] = useState("");

	// Filter rows by search query (client/vendor and invoice number)
	const filteredRows = useMemo(() => {
		if (!searchQuery.trim()) return rows;
		
		const query = searchQuery.toLowerCase().trim();
		return rows.filter(r => {
			const clientVendor = (r.client_vendor || "").toLowerCase();
			const invoiceNumber = (r.invoice_number || "").toLowerCase();
			return clientVendor.includes(query) || invoiceNumber.includes(query);
		});
	}, [rows, searchQuery]);

	// Calculate totals from filtered rows
	const totals = useMemo(() => {
		const income = filteredRows
			.filter(r => r.transaction_type === "income")
			.reduce((sum, r) => sum + parseFloat(r.amount || 0), 0);
		const expense = filteredRows
			.filter(r => r.transaction_type === "expense")
			.reduce((sum, r) => sum + parseFloat(r.amount || 0), 0);
		const liability = filteredRows
			.filter(r => r.transaction_type === "liability")
			.reduce((sum, r) => sum + parseFloat(r.amount || 0), 0);
		const asset = filteredRows
			.filter(r => r.transaction_type === "asset")
			.reduce((sum, r) => sum + parseFloat(r.amount || 0), 0);
		const netProfit = income - expense;
		return { income, expense, liability, asset, netProfit };
	}, [filteredRows]);

	// Fetch transactions with filters
	const fetchTransactions = () => {
		setLoading(true);
		const params = new URLSearchParams();
		if (filters.type) params.append("type", filters.type);
		if (filters.month) params.append("month", filters.month);

		fetch(`${apiBase}/api/transactions?${params.toString()}`)
			.then(r => {
				if (!r.ok) throw new Error(`HTTP ${r.status}`);
				return r.json();
			})
			.then(data => {
				setRows(Array.isArray(data) ? data : []);
				setLoading(false);
			})
			.catch(err => {
				console.error("Error fetching transactions:", err);
				setRows([]);
				setLoading(false);
			});
	};

	useEffect(() => {
		fetchTransactions();
	}, [filters]);

	// Load categories for new transaction modal
	useEffect(() => {
		if (!showNewTransactionModal) return;
		
		// Load categories for selected type only
		fetch(`${apiBase}/api/categories?type=${encodeURIComponent(newTxnType)}`)
			.then(r => r.ok ? r.json() : Promise.reject())
			.then(rows => {
				if (Array.isArray(rows) && rows.length > 0) {
					setNewTxnCategories(rows.map(r => ({ ...r, local: false })));
				} else {
					throw new Error("no categories");
				}
			})
			.catch(() => {
				// Fallback to local catalog for this type
				const locals = fallbackCatalog
					.filter(c => c.type === newTxnType)
					.map((c, idx) => ({
						category_id: `local-${c.key}`,
						name: c.name,
						type: c.type,
						local: true,
						_subs: c.subs.map((s, i) => ({ sub_id: `local-${c.key}-${i}`, name: s })),
						_idx: idx,
					}));
				setNewTxnCategories(locals);
			});
		fetch(`${apiBase}/api/client-vendor/suggest`)
			.then(r => r.json())
			.then(rows => setNewTxnSuggestions(rows))
			.catch(() => {});
	}, [newTxnType, showNewTransactionModal]);

	// Reset selections when type switches
	useEffect(() => {
		if (!showNewTransactionModal) return;
		setNewTxnCategoryId("");
		setNewTxnSubId("");
	}, [newTxnType, showNewTransactionModal]);

	// Load subcategories when category is selected
	useEffect(() => {
		if (!showNewTransactionModal || !newTxnCategoryId) {
			setNewTxnSubcategories([]);
			setNewTxnSubId("");
			return;
		}
		const selected = newTxnFilteredCategories.find(c => String(c.category_id) === String(newTxnCategoryId));
		if (selected?.local && Array.isArray(selected._subs)) {
			setNewTxnSubcategories(selected._subs);
			setNewTxnSubId("");
			return;
		}
		fetch(`${apiBase}/api/subcategories/${newTxnCategoryId}`)
			.then(r => r.ok ? r.json() : Promise.reject())
			.then(rows => setNewTxnSubcategories(rows))
			.catch(() => setNewTxnSubcategories([]));
	}, [newTxnCategoryId, showNewTransactionModal]);

	const newTxnFilteredCategories = useMemo(
		() => newTxnCategories.filter(c => c.type === newTxnType),
		[newTxnCategories, newTxnType]
	);

	const handleFilterChange = (key, value) => {
		setFilters(prev => ({ ...prev, [key]: value }));
	};

	const handleExportCSV = () => {
		const params = new URLSearchParams();
		if (filters.type) params.append("type", filters.type);
		if (filters.month) params.append("month", filters.month);

		window.open(`${apiBase}/api/transactions/export?${params.toString()}`, "_blank");
	};

	const clearFilters = () => {
		setFilters({ type: "", month: "" });
		setSearchQuery("");
	};

	const hasActiveFilters = filters.type !== "" || filters.month !== "" || searchQuery.trim() !== "";

	// Get current month as default for month picker
	const currentMonth = new Date().toISOString().slice(0, 7);

	// Handle Edit
	const handleEdit = (transaction) => {
		setEditingTransaction(transaction);
		setEditFormData({
			transaction_type: transaction.transaction_type || "income",
			date: transaction.date?.slice(0, 10) || new Date().toISOString().slice(0, 10),
			category: transaction.category || "",
			sub_category: transaction.sub_category || "",
			description: transaction.description || "",
			client_vendor: transaction.client_vendor || "",
			invoice_number: transaction.invoice_number || "",
			amount: transaction.amount || "",
			payment_mode: transaction.payment_mode || paymentModes[0],
			payment_status: transaction.payment_status || paymentStatuses[0],
			remarks: transaction.remarks || "",
		});
		setEditError("");
	};

	const handleEditSubmit = async (e) => {
		e.preventDefault();
		setEditError("");
		setEditLoading(true);

		try {
			const normalized = typeof editFormData.amount === "string" ? editFormData.amount.replace(",", ".").trim() : editFormData.amount;
			const parsed = Number.parseFloat(normalized);
			if (!Number.isFinite(parsed) || parsed <= 0) {
				setEditError("Amount must be greater than 0.");
				setEditLoading(false);
				return;
			}

			const res = await fetch(`${apiBase}/api/transactions/${editingTransaction.transaction_id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					...editFormData,
					amount: parsed,
				}),
			});

			if (!res.ok) {
				const msg = await res.json().catch(() => ({}));
				throw new Error(msg?.error || "Failed to update");
			}

			setEditingTransaction(null);
			setEditFormData({});
			fetchTransactions();
		} catch (err) {
			setEditError(err.message);
		} finally {
			setEditLoading(false);
		}
	};

	// Handle Delete
	const handleDelete = async (id) => {
		setEditLoading(true);
		try {
			const res = await fetch(`${apiBase}/api/transactions/${id}`, {
				method: "DELETE",
			});

			if (!res.ok) {
				const msg = await res.json().catch(() => ({}));
				throw new Error(msg?.error || "Failed to delete");
			}

			setDeleteConfirm(null);
			fetchTransactions();
		} catch (err) {
			setEditError(err.message);
		} finally {
			setEditLoading(false);
		}
	};

	// Handle New Transaction Submit
	const handleNewTransactionSubmit = async (e) => {
		e.preventDefault();
		setNewTxnError("");
		const normalized = typeof newTxnAmount === "string" ? newTxnAmount.replace(",", ".").trim() : newTxnAmount;
		const parsed = Number.parseFloat(normalized);
		if (!Number.isFinite(parsed) || parsed <= 0) {
			setNewTxnError("Amount must be greater than 0.");
			return;
		}
		setNewTxnBusy(true);
		try {
			const catName = newTxnFilteredCategories.find(c => String(c.category_id) === String(newTxnCategoryId))?.name || null;
			const subName = newTxnSubcategories.find(s => String(s.sub_id) === String(newTxnSubId))?.name || null;
			const body = {
				transaction_type: newTxnType,
				date: newTxnDate,
				category: catName,
				sub_category: subName,
				description: newTxnDescription,
				client_vendor: newTxnClientVendor,
				invoice_number: newTxnInvoiceNumber,
				amount: parsed,
				payment_mode: newTxnPaymentMode,
				payment_status: newTxnPaymentStatus,
				remarks: newTxnRemarks,
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
			// Close modal and refresh transactions
			setShowNewTransactionModal(false);
			// Reset form
			setNewTxnDescription("");
			setNewTxnClientVendor("");
			setNewTxnInvoiceNumber("");
			setNewTxnAmount("");
			setNewTxnRemarks("");
			setNewTxnCategoryId("");
			setNewTxnSubId("");
			setNewTxnPaymentStatus(paymentStatuses[1]); // Reset to "Completed"
			fetchTransactions();
		} catch (err) {
			setNewTxnError(err.message);
		} finally {
			setNewTxnBusy(false);
		}
	};

	// Reset new transaction form
	const resetNewTransactionForm = () => {
		setNewTxnDescription("");
		setNewTxnClientVendor("");
		setNewTxnInvoiceNumber("");
		setNewTxnAmount("");
		setNewTxnRemarks("");
		setNewTxnCategoryId("");
		setNewTxnSubId("");
		setNewTxnPaymentStatus(paymentStatuses[1]); // Reset to "Completed"
		setNewTxnError("");
	};

	return (
		<div className="wrap">
			<div className="container">
				<div className="card">
					<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
						<div>
							<div className="badge">All Transactions</div>
							<h1>Summary</h1>
							<p className="sub" style={{ marginTop: 4 }}>Filter by month and type, then export to CSV</p>
						</div>
						<div style={{ display: "flex", gap: 12, alignItems: "center" }}>
							<button className="btn primary" onClick={() => setShowNewTransactionModal(true)} style={{ display: "flex", alignItems: "center", gap: 8 }}>
								<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
									<line x1="12" y1="5" x2="12" y2="19" />
									<line x1="5" y1="12" x2="19" y2="12" />
								</svg>
								New Transaction
							</button>
							<button className="btn primary" onClick={handleExportCSV} style={{ display: "flex", alignItems: "center", gap: 8 }}>
								<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
									<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
									<polyline points="7 10 12 15 17 10" />
									<line x1="12" y1="15" x2="12" y2="3" />
								</svg>
								Export CSV
							</button>
						</div>
					</div>

					{/* Totals Summary */}
					<div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16, marginBottom: 24 }}>
						<div>
							<div style={{ 
								padding: "16px 20px", 
								fontSize: 16, 
								fontWeight: 600,
								backgroundColor: "rgba(34, 197, 94, 0.1)",
								border: "1px solid rgba(34, 197, 94, 0.3)",
								borderRadius: 0
							}}>
								<span className="dot" />
								<div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
									<span style={{ fontSize: 12, opacity: 0.8, fontWeight: 500 }}>Total Income</span>
									<span>{totals.income.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
								</div>
							</div>
						</div>
						<div>
							<div style={{ 
								padding: "16px 20px", 
								fontSize: 16, 
								fontWeight: 600,
								backgroundColor: "rgba(239, 68, 68, 0.1)",
								border: "1px solid rgba(239, 68, 68, 0.3)",
								borderRadius: 0
							}}>
								<span className="dot" />
								<div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
									<span style={{ fontSize: 12, opacity: 0.8, fontWeight: 500 }}>Total Expense</span>
									<span>{totals.expense.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
								</div>
							</div>
						</div>
						<div>
							<div style={{ 
								padding: "16px 20px", 
								fontSize: 16, 
								fontWeight: 600,
								backgroundColor: "rgba(251, 191, 36, 0.1)",
								border: "1px solid rgba(251, 191, 36, 0.3)",
								borderRadius: 0
							}}>
								<span className="dot" style={{ backgroundColor: "#fbbf24" }} />
								<div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
									<span style={{ fontSize: 12, opacity: 0.8, fontWeight: 500 }}>Total Liability</span>
									<span style={{ color: "#fbbf24", fontWeight: 700 }}>{totals.liability.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
								</div>
							</div>
						</div>
						<div>
							<div style={{ 
								padding: "16px 20px", 
								fontSize: 16, 
								fontWeight: 600,
								backgroundColor: "rgba(59, 130, 246, 0.1)",
								border: "1px solid rgba(59, 130, 246, 0.3)",
								borderRadius: 0
							}}>
								<span className="dot" style={{ backgroundColor: "#3b82f6" }} />
								<div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
									<span style={{ fontSize: 12, opacity: 0.8, fontWeight: 500 }}>Total Asset</span>
									<span style={{ color: "#3b82f6", fontWeight: 700 }}>{totals.asset.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
								</div>
							</div>
						</div>
						<div>
							<div style={{ 
								padding: "16px 20px", 
								fontSize: 16, 
								fontWeight: 600,
								backgroundColor: totals.netProfit >= 0 ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)",
								border: `1px solid ${totals.netProfit >= 0 ? "rgba(34, 197, 94, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
								borderRadius: 0
							}}>
								<span className="dot" />
								<div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
									<span style={{ fontSize: 12, opacity: 0.8, fontWeight: 500 }}>Net {totals.netProfit >= 0 ? "Profit" : "Loss"}</span>
									<span style={{ color: totals.netProfit >= 0 ? "var(--ok)" : "var(--err)", fontWeight: 700 }}>
										{totals.netProfit >= 0 ? "+" : ""}{totals.netProfit.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
									</span>
								</div>
							</div>
						</div>
					</div>

					{/* Filters */}
					<div style={{ background: "var(--bg)", padding: 16, borderRadius: 12, marginBottom: 16, border: "1px solid var(--border)" }}>
						<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
							<h2 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>Filters & Search</h2>
							{hasActiveFilters && (
								<button className="btn ghost" onClick={clearFilters} style={{ fontSize: 12, padding: "6px 12px" }}>
									Clear All
								</button>
							)}
						</div>
						<div className="form-grid">
							<div className="col-4">
								<label>Month</label>
								<input
									type="month"
									value={filters.month}
									onChange={e => handleFilterChange("month", e.target.value)}
									max={currentMonth}
								/>
							</div>
							<div className="col-4">
								<label>Type</label>
								<select value={filters.type} onChange={e => handleFilterChange("type", e.target.value)}>
									<option value="">All</option>
									<option value="income">Income</option>
									<option value="expense">Expense</option>
								</select>
							</div>
							<div className="col-4">
								<label>Search (Client/Vendor or Invoice)</label>
								<input
									type="text"
									placeholder="Search by client, vendor, or invoice number..."
									value={searchQuery}
									onChange={e => setSearchQuery(e.target.value)}
									style={{ width: "100%" }}
								/>
							</div>
						</div>
					</div>

					{/* Results count */}
					<div style={{ marginBottom: 12, color: "var(--muted)", fontSize: 14 }}>
						{loading ? (
							"Loading..."
						) : filteredRows.length === 0 ? (
							searchQuery.trim() 
								? `No transactions found matching "${searchQuery}". ${rows.length > 0 ? `Showing ${rows.length} total transaction${rows.length !== 1 ? "s" : ""} in database.` : ""}`
								: filters.month || filters.type 
									? "No data found for the selected month/type." 
									: "No transactions found."
						) : (
							`Showing ${filteredRows.length} transaction${filteredRows.length !== 1 ? "s" : ""}${searchQuery.trim() && filteredRows.length !== rows.length ? ` (filtered from ${rows.length} total)` : ""}`
						)}
					</div>

					<div className="table-wrap">
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
									<th>Description</th>
									<th style={{ textAlign: "center", width: "120px" }}>Actions</th>
								</tr>
							</thead>
							<tbody>
								{filteredRows.map(r => (
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
										<td>{r.description}</td>
										<td style={{ textAlign: "center" }}>
											<div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
												<button
													className="btn ghost"
													onClick={() => handleEdit(r)}
													style={{ padding: "4px 8px", fontSize: 12 }}
													title="Edit"
												>
													✏️
												</button>
												<button
													className="btn ghost"
													onClick={() => setDeleteConfirm(r.transaction_id)}
													style={{ padding: "4px 8px", fontSize: 12, color: "var(--err)" }}
													title="Delete"
												>
													🗑️
												</button>
											</div>
										</td>
									</tr>
								))}
								{!loading && filteredRows.length === 0 && (
									<tr>
										<td colSpan={11} style={{ color: "var(--muted)", textAlign: "center", padding: "32px" }}>
											{searchQuery.trim() 
												? `No transactions found matching "${searchQuery}".`
												: filters.month || filters.type 
													? "No transactions found for the selected month/type." 
													: "No transactions found."}
										</td>
									</tr>
								)}
								{loading && (
									<tr>
										<td colSpan={11} style={{ color: "var(--muted)", textAlign: "center", padding: "32px" }}>
											Loading transactions...
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</div>
			</div>

			{/* Edit Modal */}
			{editingTransaction && (
				<div style={{
					position: "fixed",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					background: "rgba(0, 0, 0, 0.5)",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					zIndex: 1000,
					padding: 20,
				}} onClick={() => !editLoading && setEditingTransaction(null)}>
					<div className="card" style={{ maxWidth: 800, width: "100%", maxHeight: "90vh", overflow: "auto" }} onClick={e => e.stopPropagation()}>
						<div className="card-header">
							<div>
								<div className="badge">Edit Transaction</div>
								<h2>Edit Transaction #{editingTransaction.transaction_id}</h2>
							</div>
							<button className="btn ghost" onClick={() => setEditingTransaction(null)} disabled={editLoading}>✕</button>
						</div>

						{editError && (
							<div style={{ padding: 12, background: "rgba(239, 68, 68, 0.1)", border: "1px solid var(--err)", borderRadius: 8, marginBottom: 16, color: "var(--err)" }}>
								{editError}
							</div>
						)}

						<form onSubmit={handleEditSubmit}>
							<div className="form-grid">
								<div className="col-6">
									<label>Transaction Type</label>
									<div style={{ display: "flex", gap: 16 }}>
										<label><input type="radio" checked={editFormData.transaction_type === "income"} onChange={() => setEditFormData({...editFormData, transaction_type: "income"})} /> income</label>
										<label><input type="radio" checked={editFormData.transaction_type === "expense"} onChange={() => setEditFormData({...editFormData, transaction_type: "expense"})} /> expense</label>
									</div>
								</div>
								<div className="col-6">
									<label>Date</label>
									<input type="date" value={editFormData.date} onChange={e => setEditFormData({...editFormData, date: e.target.value})} />
								</div>
								<div className="col-4">
									<label>Category</label>
									<input type="text" value={editFormData.category} onChange={e => setEditFormData({...editFormData, category: e.target.value})} />
								</div>
								<div className="col-4">
									<label>Subcategory</label>
									<input type="text" value={editFormData.sub_category} onChange={e => setEditFormData({...editFormData, sub_category: e.target.value})} />
								</div>
								<div className="col-4">
									<label>Amount</label>
									<input type="text" value={editFormData.amount} onChange={e => setEditFormData({...editFormData, amount: e.target.value})} inputMode="decimal" />
								</div>
								<div className="col-6">
									<label>Client/Vendor</label>
									<input type="text" value={editFormData.client_vendor} onChange={e => setEditFormData({...editFormData, client_vendor: e.target.value})} />
								</div>
								<div className="col-6">
									<label>Invoice Number</label>
									<input type="text" value={editFormData.invoice_number} onChange={e => setEditFormData({...editFormData, invoice_number: e.target.value})} />
								</div>
								<div className="col-12">
									<label>Description</label>
									<textarea value={editFormData.description} onChange={e => setEditFormData({...editFormData, description: e.target.value})} rows={3} />
								</div>
								<div className="col-4">
									<label>Payment Mode</label>
									<select value={editFormData.payment_mode} onChange={e => setEditFormData({...editFormData, payment_mode: e.target.value})}>
										{paymentModes.map(m => <option key={m} value={m}>{m}</option>)}
									</select>
								</div>
								<div className="col-4">
									<label>Payment Status</label>
									<select value={editFormData.payment_status} onChange={e => setEditFormData({...editFormData, payment_status: e.target.value})}>
										{paymentStatuses.map(s => <option key={s} value={s}>{s}</option>)}
									</select>
								</div>
								<div className="col-4" />
								<div className="col-12">
									<label>Remarks</label>
									<textarea value={editFormData.remarks} onChange={e => setEditFormData({...editFormData, remarks: e.target.value})} rows={2} />
								</div>
							</div>

							<div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 24 }}>
								<button type="button" className="btn ghost" onClick={() => setEditingTransaction(null)} disabled={editLoading}>
									Cancel
								</button>
								<button type="submit" className="btn primary" disabled={editLoading}>
									{editLoading ? "Saving..." : "Save Changes"}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{/* Delete Confirmation Modal */}
			{deleteConfirm && (
				<div style={{
					position: "fixed",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					background: "rgba(0, 0, 0, 0.5)",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					zIndex: 1000,
				}} onClick={() => !editLoading && setDeleteConfirm(null)}>
					<div className="card" style={{ maxWidth: 400, width: "100%" }} onClick={e => e.stopPropagation()}>
						<h2 style={{ marginTop: 0 }}>Confirm Delete</h2>
						<p style={{ color: "var(--muted)", marginBottom: 24 }}>
							Are you sure you want to delete this transaction? This action cannot be undone.
						</p>
						{editError && (
							<div style={{ padding: 12, background: "rgba(239, 68, 68, 0.1)", border: "1px solid var(--err)", borderRadius: 8, marginBottom: 16, color: "var(--err)" }}>
								{editError}
							</div>
						)}
						<div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
							<button className="btn ghost" onClick={() => setDeleteConfirm(null)} disabled={editLoading}>
								Cancel
							</button>
							<button className="btn error" onClick={() => handleDelete(deleteConfirm)} disabled={editLoading}>
								{editLoading ? "Deleting..." : "Delete"}
							</button>
						</div>
					</div>
				</div>
			)}

			{/* New Transaction Modal */}
			{showNewTransactionModal && (
				<div style={{
					position: "fixed",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					background: "rgba(0, 0, 0, 0.5)",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					zIndex: 1000,
					padding: 20,
				}} onClick={() => !newTxnBusy && setShowNewTransactionModal(false)}>
					<div className="card" style={{ maxWidth: 950, width: "100%", maxHeight: "90vh", overflow: "auto" }} onClick={e => e.stopPropagation()}>
						<div className="card-header" style={{ paddingBottom: 20, borderBottom: "1px solid var(--border)", marginBottom: 24 }}>
							<div>
								<div className="badge">Add New Transaction</div>
								<h2 style={{ marginTop: 8, marginBottom: 4 }}>New Transaction</h2>
								<p className="sub" style={{ margin: 0 }}>Record income or expense with rich details. All fields are saved to your database.</p>
							</div>
							<div style={{ display: "flex", gap: 10 }}>
								<button className="btn ghost" type="button" onClick={resetNewTransactionForm} disabled={newTxnBusy}>Clear</button>
								<button className="btn ghost" onClick={() => setShowNewTransactionModal(false)} disabled={newTxnBusy}>✕</button>
							</div>
						</div>

						{newTxnError && (
							<div style={{ 
								padding: 14, 
								background: "rgba(239, 68, 68, 0.1)", 
								border: "1px solid var(--err)", 
								borderRadius: 8, 
								marginBottom: 24, 
								color: "var(--err)",
								fontSize: 14
							}}>
								{newTxnError}
							</div>
						)}

						<form onSubmit={handleNewTransactionSubmit} style={{ display: "flex", flexDirection: "column", gap: 32 }}>
							{/* Transaction Type Section */}
							<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
								<h3 style={{ fontSize: 16, fontWeight: 600, margin: 0, color: "var(--text)", paddingBottom: 8, borderBottom: "1px solid var(--border)" }}>Transaction Type *</h3>
								<div style={{ paddingTop: 8 }}>
									<select 
										value={newTxnType} 
										onChange={e => setNewTxnType(e.target.value)}
										style={{ width: "100%", maxWidth: 300 }}
									>
										<option value="income">Income</option>
										<option value="expense">Expense</option>
										<option value="liability">Liability</option>
										<option value="asset">Asset</option>
									</select>
								</div>
							</div>

							{/* Basic Information Section */}
							<div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
								<h3 style={{ fontSize: 16, fontWeight: 600, margin: 0, color: "var(--text)", paddingBottom: 8, borderBottom: "1px solid var(--border)" }}>Basic Information</h3>
								<div className="form-grid" style={{ gap: 16 }}>
									<div className="col-3">
										<label style={{ marginBottom: 8, display: "block", fontWeight: 500, fontSize: 14 }}>Date *</label>
										<input 
											value={newTxnDate} 
											onChange={e => setNewTxnDate(e.target.value)} 
											type="date" 
											style={{ width: "100%" }}
										/>
									</div>
									<div className="col-3">
										<label style={{ marginBottom: 8, display: "block", fontWeight: 500, fontSize: 14 }}>Category *</label>
										<select 
											value={newTxnCategoryId} 
											onChange={e => setNewTxnCategoryId(e.target.value)}
											style={{ width: "100%" }}
										>
											<option value="">Select Category</option>
											{newTxnFilteredCategories.map(c => (
												<option key={c.category_id} value={c.category_id}>{c.name}</option>
											))}
										</select>
									</div>
									<div className="col-3">
										<label style={{ marginBottom: 8, display: "block", fontWeight: 500, fontSize: 14 }}>Subcategory</label>
										<select 
											value={newTxnSubId} 
											onChange={e => setNewTxnSubId(e.target.value)}
											style={{ width: "100%" }}
										>
											<option value="">Select Subcategory</option>
											{newTxnSubcategories.map(s => (
												<option key={s.sub_id} value={s.sub_id}>{s.name}</option>
											))}
										</select>
									</div>
									<div className="col-3">
										<label style={{ marginBottom: 8, display: "block", fontWeight: 500, fontSize: 14 }}>Amount *</label>
										<input
											value={newTxnAmount}
											onChange={e => setNewTxnAmount(e.target.value)}
											type="text"
											inputMode="decimal"
											pattern="^[0-9]{1,20}(\\.[0-9]{1,2})?$"
											maxLength={32}
											placeholder="Enter amount"
											style={{ width: "100%" }}
										/>
									</div>
								</div>
								<div style={{ width: "100%" }}>
									<label style={{ marginBottom: 8, display: "block", fontWeight: 500, fontSize: 14 }}>Description</label>
									<input 
										value={newTxnDescription} 
										onChange={e => setNewTxnDescription(e.target.value)} 
										placeholder="Enter transaction description"
										style={{ width: "100%" }}
									/>
								</div>
							</div>

							{/* Client/Vendor Information Section */}
							<div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
								<h3 style={{ fontSize: 16, fontWeight: 600, margin: 0, color: "var(--text)", paddingBottom: 8, borderBottom: "1px solid var(--border)" }}>Client/Vendor Information</h3>
								<div className="form-grid" style={{ gap: 16 }}>
									<div className="col-6">
										<label style={{ marginBottom: 8, display: "block", fontWeight: 500, fontSize: 14 }}>Client/Vendor</label>
										<input 
											list="clientVendorListNew" 
											value={newTxnClientVendor} 
											onChange={e => setNewTxnClientVendor(e.target.value)} 
											placeholder="Enter client or vendor name"
											style={{ width: "100%" }}
										/>
										<datalist id="clientVendorListNew">
											{newTxnSuggestions.map(s => <option key={s} value={s} />)}
										</datalist>
									</div>
									<div className="col-6">
										<label style={{ marginBottom: 8, display: "block", fontWeight: 500, fontSize: 14 }}>Invoice Number</label>
										<input 
											value={newTxnInvoiceNumber} 
											onChange={e => setNewTxnInvoiceNumber(e.target.value)} 
											placeholder="Enter invoice number"
											style={{ width: "100%" }}
										/>
									</div>
								</div>
							</div>

							{/* Payment Information Section */}
							<div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
								<h3 style={{ fontSize: 16, fontWeight: 600, margin: 0, color: "var(--text)", paddingBottom: 8, borderBottom: "1px solid var(--border)" }}>Payment Information</h3>
								<div className="form-grid" style={{ gap: 16 }}>
									<div className="col-6">
										<label style={{ marginBottom: 8, display: "block", fontWeight: 500, fontSize: 14 }}>Payment Mode</label>
										<select 
											value={newTxnPaymentMode} 
											onChange={e => setNewTxnPaymentMode(e.target.value)}
											style={{ width: "100%" }}
										>
											{paymentModes.map(m => <option key={m} value={m}>{m}</option>)}
										</select>
									</div>
									<div className="col-6">
										<label style={{ marginBottom: 8, display: "block", fontWeight: 500, fontSize: 14 }}>Payment Status</label>
										<select 
											value={newTxnPaymentStatus} 
											onChange={e => setNewTxnPaymentStatus(e.target.value)}
											style={{ width: "100%" }}
										>
											{paymentStatuses.map(m => <option key={m} value={m}>{m}</option>)}
										</select>
									</div>
								</div>
							</div>

							{/* Additional Notes Section */}
							<div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
								<h3 style={{ fontSize: 16, fontWeight: 600, margin: 0, color: "var(--text)", paddingBottom: 8, borderBottom: "1px solid var(--border)" }}>Additional Notes</h3>
								<div>
									<label style={{ marginBottom: 8, display: "block", fontWeight: 500, fontSize: 14 }}>Remarks</label>
									<textarea 
										value={newTxnRemarks} 
										onChange={e => setNewTxnRemarks(e.target.value)} 
										rows={4} 
										placeholder="Enter any additional remarks or notes..."
										style={{ width: "100%", resize: "vertical" }}
									/>
								</div>
							</div>

							{/* Form Actions */}
							<div style={{ 
								display: "flex", 
								gap: 12, 
								justifyContent: "flex-end", 
								paddingTop: 16,
								borderTop: "1px solid var(--border)",
								marginTop: 8
							}}>
								<button 
									type="button" 
									className="btn ghost" 
									onClick={() => setShowNewTransactionModal(false)} 
									disabled={newTxnBusy}
									style={{ minWidth: 100 }}
								>
									Cancel
								</button>
								<button 
									type="submit" 
									className="btn primary" 
									disabled={newTxnBusy}
									style={{ minWidth: 140 }}
								>
									{newTxnBusy ? "Saving..." : "Submit Transaction"}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}


