'use strict';

const defaultSearches = {
	'duckduckgo': {
		'title': 'DuckDuckGo: %s',
		'url' : 'https://duckduckgo.com/?q={0}',
	},
};

chrome.runtime.onInstalled.addListener(async (details) => {
	if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
		let urlMap = {};
		const syncSearches = await getStorageSyncValue('searches');
		const searches = syncSearches && Object.keys(syncSearches).length ? syncSearches : defaultSearches;

		for (let id in searches) {
			const search = searches[id];
			chrome.contextMenus.create({
				id: id,
				title: search.title,
				contexts: ['selection'],
			});

			urlMap[id] = search.url;
		}

		chrome.storage.local.set({urlMap});
	}
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
	if (!info.selectionText) {
		return;
	}

	const urlMap = await getStorageLocalValue('urlMap');
	const url = urlMap[info.menuItemId];

	if (url) {
		chrome.tabs.create({
			url: url.replace('{0}', info.selectionText),
		});
	}
});

function getStorageSyncValue(key) {
	return getStorageValue(key, 'sync');
}

function getStorageLocalValue(key) {
	return getStorageValue(key, 'local');
}

async function getStorageValue(key, storageType) {
	return new Promise((resolve, reject) => {
		chrome.storage[storageType].get(key, (value) => {
			if (chrome.runtime.lastError) {
				return reject(chrome.runtime.lastError);
			}
			resolve(value[key]);
		});
	});
}