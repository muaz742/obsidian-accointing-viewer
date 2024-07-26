import {Plugin} from 'obsidian';

export default class AccountingViewerPlugin extends Plugin {
	async onload() {
		this.registerMarkdownCodeBlockProcessor("accounting", (source, el, ctx) => {
			const records = this.parseRecords(source);
			this.renderViews(records, el)
		});
	}

	parseRecords(source: string) {
		const lines = source.split("\n");
		const records = [];
		let currentRecord: any = null;
		let balance_record = false;
		for (const line of lines) {
			if (line.trim() === "") continue; // Skip empty lines

			if (!line.startsWith("\t") && !line.startsWith("   ")) {
				currentRecord && records.push(currentRecord)
				currentRecord = {
					type: line.trim().includes(" ") ? line.split(" ")[0] : line.trim(),
					param: line.trim().includes(" ") ? line.split(" ").slice(1).join(" ") : "",
					records: []
				};
			} else {
				if (!currentRecord) continue;
				switch (currentRecord.type) {
					case "transaction":
						currentRecord.records.push(line.split("\"")[1].trim());
						break;
					case "entry":
						switch (true) {
							case line.trim().startsWith("page"):
								currentRecord.page = line.split("\"")[1]?.trim();
								break;
							case line.trim().startsWith("+"):
								currentRecord.records.push({
									type: "DR",
									account: line.split("+")[1].trim().split(":")[0].trim(),
									amount: line.split("+")[1].trim().split(":")[1].trim(),
									post_ref: line.split("+")[1].trim().split(":")[2]?.trim()
								});
								break;
							case line.trim().startsWith("-"):
								currentRecord.records.push({
									type: "CR",
									account: line.split("-")[1].trim().split(":")[0].trim(),
									amount: line.split("-")[1].trim().split(":")[1].trim(),
									post_ref: line.split("-")[1].trim().split(":")[2]?.trim()
								});
								break;
							case line.trim().startsWith("desc"):
								currentRecord.records.push({
									type: "desc",
									description: line.split("\"")[1].trim()
								});
								break;
							default:
								// No action for lines that don't match any of the cases
								break;
						}
						break;
					case "t-account":
						let record = {};
						switch (true) {
							case line.trim().startsWith("+"):
								record = {
									type: "DR",
									account: line.split("+")[1].trim().split(":")[0].trim(),
									amount: line.split("+")[1].trim().split(":")[1].trim(),
									post_ref: line.split("+")[1].trim().split(":")[2]?.trim()
								};
								balance_record ? currentRecord.balance.push(record) : currentRecord.records.push(record);
								break;
							case line.trim().startsWith("-"):
								record = {
									type: "CR",
									account: line.split("-")[1].trim().split(":")[0].trim(),
									amount: line.split("-")[1].trim().split(":")[1]?.trim(),
									post_ref: line.split("-")[1].trim().split(":")[2]?.trim()
								};
								balance_record ? currentRecord.balance.push(record) : currentRecord.records.push(record);
								break;
							case line.trim().startsWith("balance"):
								balance_record = true;
								currentRecord.balance = [];
								break;
							default:
								// No action for lines that don't match any of the cases
								break;
						}
						break;
					default:
						break;
				}
			}
		}
		currentRecord && records.push(currentRecord)
		return records;
	}

	renderViews(records: any, el: HTMLElement) {
		records.forEach((record: any) => {
			switch (record.type) {
				case "transaction":
					this.renderTransactionTable(record, el);
					break;
				case "entry":
					this.renderJournalEntryTable(record, el);
					break;
				case "t-account":
					this.renderTAccountTable(record, el);
					break;
				default:
					break;
			}
			// add gap between tables
			el.createEl("br");
		});
	}

	renderTransactionTable(record: any, el: HTMLElement) {
		/** Create Table */
		el.createEl("table", {cls: "transaction"}, (table) => {
			const tableHead = table.createEl("thead");
			const tableBody = table.createEl("tbody");

			/** Create Table Header */
			const headRow = tableHead.createEl("tr");
			headRow.createEl("th", {text: "DATE", cls: "date"});
			headRow.createEl("th", {text: "TRANSACTION"});

			/** Create Table Body */
			record.records.forEach((entry: any) => {
				const entryRow = tableBody.createEl("tr");
				entryRow.createEl("td", {
					text: record.param !== "" ?
						new Date(record.param).toLocaleDateString(
							'en-US',
							{year: 'numeric', month: 'short', day: 'numeric'}
						) : ""
				});
				entryRow.createEl("td", {text: entry});
			});
		});
	}

	renderJournalEntryTable(record: any, el: HTMLElement) {
		/** Check if data exists */
		const hasData = {
			page: false,
			date: false,
			account: false,
			post_ref: false,
			debit: false,
			credit: false
		}
		record.page !== undefined && (hasData.page = true);
		record.param !== "" && (hasData.date = true);
		record.records.forEach((entry: any) => {
			if (entry.type === "DR") {
				hasData.account = true;
				hasData.post_ref = entry.post_ref !== undefined ? true : hasData.post_ref;
				hasData.debit = true;
			}
			if (entry.type === "CR") {
				hasData.account = true;
				hasData.post_ref = entry.post_ref !== undefined ? true : hasData.post_ref;
				hasData.credit = true;
			}
		});
		record.records.forEach((entry: any) => {
				if (entry.type === "desc") {
					hasData.account = true;
				}
			}
		);

		/** Create Table */
		const table = el.createEl("table", {cls: "journal-entry"});
		const tableHead = table.createEl("thead");
		const tableBody = table.createEl("tbody");

		/** Create page reference row */
		const headPageRow = tableHead.createEl("tr");
		const pageHeader = headPageRow.createEl("th", {text: record.page, cls: "page-num"})
		pageHeader.setAttr("colspan", "5");
		record.page === undefined && headPageRow.setAttr("hidden", "")

		/** Create Table Header */
		const headRow = tableHead.createEl("tr");
		hasData.date && headRow.createEl("th", {text: "DATE", cls: "date"});
		hasData.account && headRow.createEl("th", {text: "ACCOUNTS", cls: "account-header"});
		hasData.post_ref && headRow.createEl("th", {text: "POST REF.", cls: "post-ref"});
		hasData.debit && headRow.createEl("th", {text: "DR."});
		hasData.credit && headRow.createEl("th", {text: "CR."});

		/** Create Table Body */
		let onceShow = true;
		record.records.forEach((entry: any) => {
			const entryRow = tableBody.createEl("tr");
			hasData.date && entryRow.createEl("td", {
				cls: "date",
				text: onceShow ?
					new Date(record.param).toLocaleDateString(
						'en-US', {year: 'numeric', month: 'short', day: 'numeric'}
					) :
					""
			})
			onceShow = false;
			if (entry.type === "desc") {
				hasData.account && entryRow.createEl("td", {text: entry.description, cls: "description"});
				hasData.post_ref && entryRow.createEl("td", {text: ""});
				hasData.debit && entryRow.createEl("td", {text: ""});
				hasData.credit && entryRow.createEl("td", {text: ""});
			} else {
				hasData.account && entryRow.createEl("td", {
					text: entry.account,
					cls: entry.type === "DR" ? "debit" : "credit"
				});
				hasData.post_ref && entryRow.createEl("td", {text: entry.post_ref});
				hasData.debit && entry.type === "DR" ?
					entryRow.createEl("td", {text: entry.amount}) :
					entryRow.createEl("td", {text: ""});
				hasData.credit && entry.type === "CR" ?
					entryRow.createEl("td", {text: entry.amount}) :
					entryRow.createEl("td", {text: ""});
			}
		});
	}

	renderTAccountTable(record: any, el: HTMLElement) {
		/** Create Table */
		el.createEl("table", {cls: "t-account"}, (table) => {
			const head = table.createEl("thead");
			const body = table.createEl("tbody");

			/** Create Table Header */
			const headerRow = head.createEl("tr");
			headerRow.createEl("th", {text: record.param, cls: "account-header"}).setAttr("colspan", "4");

			/** Create Table Body */

			/** Transform records into table rows */
			let debits: any = [];
			let credits: any = [];
			record.records.forEach((entry: any) => {
				if (entry.type === "DR") {
					debits.push({
						account: entry.account,
						amount: entry.amount
					});
				}
				if (entry.type === "CR") {
					credits.push({
						account: entry.account,
						amount: entry.amount
					});
				}
			});
			const steps = debits.length > credits.length ? debits.length : credits.length;

			/** Create Record Rows */
			for (let i = 0; i < steps; i++) {
				const entryRow = body.createEl("tr");
				entryRow.createEl("td", {text: debits[i]?.account});
				entryRow.createEl("td", {text: debits[i]?.amount});
				entryRow.createEl("td", {text: credits[i]?.account});
				entryRow.createEl("td", {text: credits[i]?.amount});
			}

			/** Transform balance records into table rows */
			let debitsBalance: any = [];
			let creditsBalance: any = [];
			if (record.balance !== undefined) {
				record.balance.forEach((entry: any) => {
					if (entry.type === "DR") {
						debitsBalance.push({
							account: entry.account,
							amount: entry.amount
						});
					}
					if (entry.type === "CR") {
						creditsBalance.push({
							account: entry.account,
							amount: entry.amount
						});
					}
				});
			}

			/** Create Balance Rows */
			const stepsBalance = debitsBalance.length > creditsBalance.length ? debitsBalance.length : creditsBalance.length;
			for (let i = 0; i < stepsBalance; i++) {
				const entryRow = body.createEl("tr", {cls: "balance-row"});
				entryRow.createEl("td", {text: debitsBalance[i]?.account});
				entryRow.createEl("td", {text: debitsBalance[i]?.amount});
				entryRow.createEl("td", {text: creditsBalance[i]?.account});
				entryRow.createEl("td", {text: creditsBalance[i]?.amount});
			}
		});
	}

	onunload() {
	}
}

