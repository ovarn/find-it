export async function getStorageValue(key, storageType) {
	return new Promise((resolve, reject) => {
		chrome.storage[storageType].get(key, (value) => {
			if (chrome.runtime.lastError) {
				return reject(chrome.runtime.lastError);
			}
			resolve(value[key]);
		});
	});
}
