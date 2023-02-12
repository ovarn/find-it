import { setStorageValue } from './setStorageValue.js';

export function setStorageLocalValue(key) {
	return setStorageValue(key, 'local');
}
