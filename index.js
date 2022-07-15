import {getSearches} from './js/getSearches.js';
import {setStorageSyncValue} from './js/setStorageSyncValue.js';

(async function() {
    const searches = await getSearches();
    if (searches) {
        const input = document.querySelector('textarea');
        input.value = JSON.stringify(searches, null, '\t');
    }

    document.addEventListener('click', async (event) => {
        const action = event.target.dataset.action;
        if (action === 'set-searches') {
            event.preventDefault();
            try {
                const input = document.querySelector('textarea');
                const newSearches = JSON.parse(input.value || '{}');
                await setStorageSyncValue({'searches' : newSearches});
            } catch (e) {
                alert('Invalid JSON.');
            }
        }
    });
}());