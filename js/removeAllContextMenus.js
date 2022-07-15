export async function removeAllContextMenus() {
	return new Promise((resolve, reject) => {
		chrome.contextMenus.removeAll(() => {
			if (chrome.runtime.lastError) {
				reject(chrome.runtime.lastError);
				return;
			}
			resolve();
		});
	});
}
