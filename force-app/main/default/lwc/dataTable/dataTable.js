import { LightningElement, wire } from 'lwc';
import getGamesRecords from '@salesforce/apex/DashboardController.getGamesRecords';

export default class DataTable extends LightningElement {
    games = [];
    error = undefined;

    columns = [
        { label: 'Game Name', fieldName: 'Name', type: 'text' },
        { label: 'Genre', fieldName: 'Genre__c', type: 'text' },
        { label: 'Platform', fieldName: 'Platform__c', type: 'text' },
        { label: 'Release Date', fieldName: 'Release_Date__c', type: 'date' },
        { label: 'Developer', fieldName: 'Developer__c', type: 'text' },
        {  
            type: 'button', 
            typeAttributes: {
                label: 'More Info',
                name: 'moreInfo',
                variant: 'brand',
                iconName: 'utility:info',
                iconPosition: 'right'
            }
        }
    ];

    // Fetches game records from Salesforce and handles success or failure states.
    @wire(getGamesRecords)
    getDashboardHandler({ data, error }) {
        if (data) {
            this.games = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.games = [];
        }
    }

    // Handles the row action when the "More Info" button is clicked.
    // Dispatches a custom event to notify the parent component about the selected record ID.
    handleSelectedGame(event) {
        const selectedGameId = event.detail.row.Id; 
        this.dispatchEvent(new CustomEvent('selectedgame', { detail:selectedGameId }));
    }
}