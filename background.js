import { defaultSearches } from './js/defaultSearches.js';
import { getStorageSyncValue } from './js/getStorageSyncValue.js';
import { createContextMenus } from './js/createContextMenus.js';

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
			url: url.replace('{0}', info.selectionText.replace(/\s/g, '+')),
		});
	}
});
