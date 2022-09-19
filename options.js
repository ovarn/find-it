const {getSearches} = await import(chrome.runtime.getURL('/js/getSearches.js'));
const {setStorageSyncValue} = await import(chrome.runtime.getURL('/js/setStorageSyncValue.js'));

function createRow(search) {
    const row = document.createElement('tr');

    const titleTD = document.createElement('td');
    const titleInput = document.createElement('input');
    titleInput.setAttribute('type', 'text');
    titleInput.setAttribute('placeholder', 'DuckDuckGo %s');
    titleInput.setAttribute('value', search.title);
    titleTD.appendChild(titleInput);

    const urlTD = document.createElement('td');
    const urlInput = document.createElement('input');
    urlInput.setAttribute('type', 'textarea');
    urlInput.setAttribute('placeholder', 'https://duckduckgo.com/?q={0}');
    urlInput.setAttribute('value', search.url);
    urlTD.appendChild(urlInput);

    const deleteTD = document.createElement('td');
    const deleteBtn = document.createElement('button');
    deleteBtn.dataset.action = 'delete-row';
    deleteBtn.textContent = 'Delete';
    deleteTD.append(deleteBtn);

    const moveUpTD = document.createElement('td');
    const moveUpBtn = document.createElement('button');
    moveUpBtn.dataset.action = 'move-row-up';
    moveUpBtn.textContent = 'Move up';
    moveUpTD.append(moveUpBtn);

    const moveDownTD = document.createElement('td');
    const moveDownBtn = document.createElement('button');
    moveDownBtn.dataset.action = 'move-row-down';
    moveDownBtn.textContent = 'Move down';
    moveDownTD.append(moveDownBtn);

    row.append(titleTD, urlTD, deleteTD, moveUpTD, moveDownTD);
    return row;
}

function deleteRow(event) {
    const toDelete = confirm('Delete the row?');
    if (!toDelete) {
        return;
    }

    const row = event.target.parentElement.parentElement;
    if (row) {
        row.remove();
        toggleUpDownButtons();
    }
}

function moveRowUp(event) {
    const row = event.target.parentElement.parentElement;
    const prevRow = row.previousElementSibling;
    if (prevRow) {
        const tbody = row.parentElement;
        tbody.insertBefore(row, prevRow);
        toggleUpDownButtons();
    }
}

function moveRowDown(event) {
    const row = event.target.parentElement.parentElement;
    const nextRow = row.nextElementSibling;
    if (nextRow) {
        const tbody = row.parentElement;
        tbody.insertBefore(nextRow, row);
        toggleUpDownButtons();
    }
}

function addRow(event) {
    event.preventDefault();
    const titleInput = document.getElementById('title');
    const urlInput = document.getElementById('url');
    if (titleInput && urlInput) {
        const title = titleInput.value;
        const url = urlInput.value;
        if (title && url) {
            const newSearch = {title, url};
            const newRow = createRow(newSearch);

            const tableBody = document.querySelector('tbody');
            tableBody.appendChild(newRow);
            titleInput.value = '';
            urlInput.value = '';

            toggleUpDownButtons();
        } else {
            alert('Fill in Title and URL first.');
        }
    }
}

function toggleUpDownButtons() {
    const moveUpBtnSelector = 'button[data-action="move-row-up"]';
    const moveDownBtnSelector = 'button[data-action="move-row-down"]';

    const disabledMoveUpBtns = document.querySelectorAll(moveUpBtnSelector + ':disabled');
    if (disabledMoveUpBtns) {
        disabledMoveUpBtns.forEach((disabledMoveUpBtn) => {
            disabledMoveUpBtn.disabled = false;
        });
    }

    const moveUpBtns = document.querySelectorAll(moveUpBtnSelector);
    if (moveUpBtns) {
        moveUpBtns[0].disabled = true;
    }

    const disabledMoveDownBtns = document.querySelectorAll(moveDownBtnSelector + ':disabled');
    if (disabledMoveDownBtns) {
        disabledMoveDownBtns.forEach((disabledMoveDownBtn) => {
            disabledMoveDownBtn.disabled = false;
        });
    }

    const moveDownBtns = document.querySelectorAll(moveDownBtnSelector);
    if (moveDownBtns) {
        moveDownBtns[moveDownBtns.length - 1].disabled = true;
    }
}

function serializeSearches() {
    const rows = document.querySelectorAll('tbody tr');
    if (rows) {
        return Array.from(rows).map((row, index) => {
            const id = index;
            const title = row.children[0].children[0].value;
            const url = row.children[1].children[0].value;
            return {id, title, url};
        });
    }
    return [];
}

async function saveChanges() {
    const newSearches = serializeSearches();
    await setStorageSyncValue({'searches' : newSearches});
    alert('Saved');
}

const searches = await getSearches();
const rows = Object.values(searches).map(createRow);
const tableBody = document.querySelector('tbody');
if (tableBody) {
    tableBody.append(...rows);
    toggleUpDownButtons();
}

document.addEventListener('click', (event) => {
    const action = event.target.dataset.action;
    if (action === 'add-row') {
        addRow(event);
    } else if (action === 'move-row-up') {
        moveRowUp(event);
    } else if (action === 'move-row-down') {
        moveRowDown(event);
    } else if (action === 'delete-row') {
        deleteRow(event);
    } else if (action === 'save-changes') {
        saveChanges();
    }
});