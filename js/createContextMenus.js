import {getSearches} from './getSearches.js';
import {removeAllContextMenus} from './removeAllContextMenus.js';

export async function createContextMenus() {
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
