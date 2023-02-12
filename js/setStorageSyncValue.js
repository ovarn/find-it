import { setStorageValue } from './setStorageValue.js';

export function setStorageSyncValue(key) {
	return setStorageValue(key, 'sync');
}
