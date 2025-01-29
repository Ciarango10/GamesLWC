import { LightningElement, track } from 'lwc';

export default class Dashboard extends LightningElement {
    selectedGameId;
    isDarkMode = false;

    get themeClass() {
        return this.isDarkMode ? 'slds-theme_inverse slds-box slds-shadow_medium' : 'slds-theme_shade slds-box slds-shadow_medium';
    }

    get inverseThemeClass() {
        return this.isDarkMode ? 'slds-theme_default slds-p-around_medium' : 'slds-theme_inverse slds-p-around_medium';
    }

    get colorThemeClass() {
        return this.isDarkMode ? 'slds-text-heading_medium slds-text-color_default' : 'slds-text-heading_medium slds-text-color_inverse';
    }

    get buttonLabel() {
        return this.isDarkMode ? '☀' : '🌑';
    }

    handleTheme() {
        this.isDarkMode = !this.isDarkMode;
    }

    // Updates the selectedGameId when a game is selected in the DataTable component.
    handleRecordSelect(event) {
        this.selectedGameId = event.detail; // Receives the game ID from the custom event.
    }
}