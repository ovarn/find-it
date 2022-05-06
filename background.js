'use strict';

const defaultSearches = [
	{
		'id': 'duckduckgo',
		'title': 'DuckDuckGo: %s',
		'url' : 'https://duckduckgo.com/?q={0}',
	},
];

chrome.runtime.onInstalled.addListener((details) => {
	defaultSearches.forEach((search) => {
		chrome.contextMenus.create({
			id: search.id,
			title: search.title,
			contexts: ['selection'],
		});
	});
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
	if (!info.selectionText) {
		return;
	}

	const search = defaultSearches.find((search) => {
		return search.id === info.menuItemId;
	});

	if (search) {
		chrome.tabs.create({
			url: search.url.replace('{0}', info.selectionText),
		});
	}
});