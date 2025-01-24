import { LightningElement, track } from 'lwc';

export default class Dashboard extends LightningElement {
    @track selectedGameId;

    // Updates the selectedGameId when a game is selected in the DataTable component.
    handleRecordSelect(event) {
        this.selectedGameId = event.detail; // Receives the game ID from the custom event.
    }
}