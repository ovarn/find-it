export async function setStorageValue(key, storageType) {
	return new Promise((resolve, reject) => {
		chrome.storage[storageType].set(key, () => {
			if (chrome.runtime.lastError) {
				return reject(chrome.runtime.lastError);
			}
			resolve();
		});
	});
}
