import {App, Modal, Plugin} from 'obsidian';

export default class AccountingViewerPlugin extends Plugin {
	async onload() {
		this.registerMarkdownCodeBlockProcessor("accounting", (source, el, ctx) => {
			console.log("Hello, World!");
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
