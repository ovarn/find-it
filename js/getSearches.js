import {defaultSearches} from './defaultSearches.js';
import {getStorageSyncValue} from './getStorageSyncValue.js';

export async function getSearches() {
	const syncSearches = await getStorageSyncValue('searches');
	if (syncSearches && Object.keys(syncSearches).length) {
		return syncSearches;
	}
	return defaultSearches;
}
