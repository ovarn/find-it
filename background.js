'use strict';

const defaultSearches = {
	'duckduckgo': {
		'title': 'DuckDuckGo: %s',
		'url' : 'https://duckduckgo.com/?q={0}',
	},
};

chrome.runtime.onInstalled.addListener(async (details) => {
	const syncSearches = await getStorageSyncValue('searches');
	const searches = syncSearches && Object.keys(syncSearches).length ? syncSearches : defaultSearches;

	for (let id in searches) {
		const search = searches[id];
		chrome.contextMenus.create({
			id: id,
			title: search.title,
			contexts: ['selection'],
		});
	}

	chrome.storage.sync.set({searches});
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
	if (!info.selectionText) {
		return;
	}

	const searches = await getStorageSyncValue('searches');
	const url = searches[info.menuItemId]?.url;

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