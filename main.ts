import {App, Modal, Plugin} from 'obsidian';

export default class AccountingViewerPlugin extends Plugin {
	async onload() {
		this.registerMarkdownCodeBlockProcessor("accounting", (source, el, ctx) => {
			console.log("Hello, World!");
			const records = this.parseRecords(source);
			console.log(JSON.stringify(records, null, 2));
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
					break;
				case "entry":
					/** Create Table */
					el.createEl("table", {cls: "journal-entry"}, (table) => {
						const tableHead = table.createEl("thead");
						const tableBody = table.createEl("tbody");

						/** Create page reference row */
						const headPageRow = tableHead.createEl("tr");
						const pageHeader = headPageRow.createEl("th", {text: record.page, cls: "page-num"})
						pageHeader.setAttr("colspan", "5");
						record.page === undefined && headPageRow.setAttr("hidden", "")

						/** Create Table Header */
						const headerRow = tableHead.createEl("tr");
						const dateHeader = headerRow.createEl("th", {text: "DATE"});
						const accountHeader = headerRow.createEl("th", {text: "ACCOUNTS", cls: "account-header"});
						const postRefHeader = headerRow.createEl("th", {text: "POST REF.", cls: "post-ref"});
						const drHeader = headerRow.createEl("th", {text: "DR."});
						const crHeader = headerRow.createEl("th", {text: "CR."});

						/** Manipulate visibility based on conditions */
						postRefHeader.setAttr("hidden", "");
						record.param === "" && dateHeader.setAttr("hidden", "");
						record.post_ref === undefined && postRefHeader.setAttr("hidden", "");

						/** Create Table Body */
						let onceShow = true;
						record.records.forEach((entry: any) => {
							/** Create Rows based on records */
							const entryRow = table.createEl("tr");
							const dateCell = entryRow.createEl("td", {cls: "date"})
							onceShow ?
								dateCell.setText(new Date(record.param).toLocaleDateString(
									'en-US', {year: 'numeric', month: 'short', day: 'numeric'}
								)) :
								dateCell.setText("")
							onceShow = false;
							const accountCell = entryRow.createEl(
								"td", {text: entry.type === "desc" ? entry.description : entry.account}
							);
							const postRefCell = entryRow.createEl(
								"td", {text: entry.post_ref}
							);
							const drCell = entryRow.createEl(
								"td", {text: entry.type === "DR" ? entry.amount : ""}
							);
							const crCell = entryRow.createEl(
								"td", {text: entry.type === "CR" ? entry.amount : ""}
							);

							/** Manipulate visibility based on conditions */
							accountCell.toggleClass("description", entry.type === "desc");
							entry.type === "desc" ? postRefCell.removeAttribute("hidden") : postRefCell.setAttr("hidden", "");
							record.param === "" && dateCell.setAttr("hidden", "");
							entry.post_ref !== undefined && postRefHeader.removeAttribute("hidden");
							entry.post_ref !== undefined && postRefCell.removeAttribute("hidden");
						});
					});
					break;
				case "t-account":
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
					break;
				default:
					break;
			}
			// add gap between tables
			el.createEl("br");
		});
	}

	onunload() {
		new SampleModal(this.app, "Accounting Viewer disabled!").open();
		console.log("Bye, World!");
	}
}

class SampleModal extends Modal {
	constructor(app: App, public message: string) {
		super(app);
		this.message = message;
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText(this.message);
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}
