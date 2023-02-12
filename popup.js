function addOpenSettingsHandler() {
	const settingsButton = document.getElementById('settings-button');

	if (!settingsButton) {
		console.error('The settings button is not found.');
		return;
	}

	settingsButton.addEventListener('click', (event) => {
		const openingPage = chrome.runtime.openOptionsPage();
		openingPage.then(() => { }, (error) => {
			console.error(`Error: ${error}`);
		});
	});
}

document.addEventListener('DOMContentLoaded', addOpenSettingsHandler);
