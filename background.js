import {getSearches} from './js/getSearches.js';
import {defaultSearches} from './js/defaultSearches.js';
import {getStorageSyncValue} from './js/getStorageSyncValue.js';

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

async function removeAllContextMenus() {
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
