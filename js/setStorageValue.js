export async function setStorageValue(key, storageType) {
	return new Promise((resolve, reject) => {
		chrome.storage[storageType].set(key, () => {
			if (chrome.runtime.lastError) {
				reject(chrome.runtime.lastError);
				return;
			}
			resolve();
		});
	});
}
