export async function getStorageValue(key, storageType) {
	return new Promise((resolve, reject) => {
		chrome.storage[storageType].get(key, (value) => {
			if (chrome.runtime.lastError) {
				reject(chrome.runtime.lastError);
				return;
			}
			resolve(value[key]);
		});
	});
}
