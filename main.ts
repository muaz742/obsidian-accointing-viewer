import {App, Modal, Plugin} from 'obsidian';

export default class AccountingViewerPlugin extends Plugin {
	async onload() {
		this.registerMarkdownCodeBlockProcessor("accounting", (source, el, ctx) => {
			console.log("Hello, World!");
			const records = this.parseRecords(source);
			console.log(JSON.stringify(records, null, 2));
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
