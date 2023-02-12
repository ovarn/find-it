import { getStorageValue } from './getStorageValue.js';

export function getStorageSyncValue(key) {
	return getStorageValue(key, 'sync');
}
