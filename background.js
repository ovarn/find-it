'use strict';

const defaultSearches = {
	'duckduckgo': {
		'title': 'DuckDuckGo: %s',
		'url' : 'https://duckduckgo.com/?q={0}',
	},
};

chrome.runtime.onInstalled.addListener((details) => {
	createContextMenus();
});

chrome.storage.onChanged.addListener((changes, areaName) => {
	createContextMenus();
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
	if (!info.selectionText) {
		return;
	}

	let url;
	const searchId = info.menuItemId;
	const syncSearches = await getStorageSyncValue('searches');

	if (syncSearches && syncSearches[searchId]) {
		url = syncSearches[searchId].url;
	} else if (defaultSearches && defaultSearches[searchId]) {
		url = defaultSearches[searchId].url;
	}

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

async function removeAllContextMenus() {
	return new Promise((resolve, reject) => {
		chrome.contextMenus.removeAll(() => {
			if (chrome.runtime.lastError) {
				return reject(chrome.runtime.lastError);
			}
			resolve();
		});
	});
}

async function getSearches() {
	const syncSearches = await getStorageSyncValue('searches');
	if (syncSearches && Object.keys(syncSearches).length) {
		return syncSearches;
	}
	return defaultSearches;
}

async function createContextMenus() {
	await removeAllContextMenus();
	const searches = await getSearches();
	for (let id in searches) {
		const search = searches[id];
		chrome.contextMenus.create({
			id: id,
			title: search.title,
			contexts: ['selection'],
		});
	}
}

chrome.action.onClicked.addListener((tab) => {
	chrome.tabs.create({
		url: 'index.html',
	});
});
