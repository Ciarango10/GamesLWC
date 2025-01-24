import { LightningElement, wire } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getGamesRecords from '@salesforce/apex/DashboardController.getGamesRecords';
import updateGame from '@salesforce/apex/DashboardController.updateGame';
import deleteGame from '@salesforce/apex/DashboardController.deleteGame';

export default class DataTable extends LightningElement {
    games = [];
    editableGame = {};
    error = undefined;
    isModalOpen = false;
    wiredGames;
    filter = '';

    // Defines the columns for the data table
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
                iconPosition: 'right',
                class: 'button-fixed-size'
            }
        },
        {
            type: 'button',
            typeAttributes: {
                label: 'Edit',
                name: 'edit',
                variant: 'neutral',
                iconName: 'utility:edit',
                iconPosition: 'right',
                class: 'button-fixed-size'
            }
        },
        {
            type: 'button',
            typeAttributes: {
                label: 'Delete',
                name: 'delete',
                variant: 'destructive',
                iconName: 'utility:delete',
                iconPosition: 'right',
                class: 'button-fixed-size'
            }
        }
    ];

    // Options for the genre picklist
    genreOptions = [
        { label: 'Adventure', value: 'Adventure' },
        { label: 'RPG', value: 'RPG' },
        { label: 'Battle Royale', value: 'Battle Royale' },
        { label: 'FPS', value: 'FPS' },
        { label: 'MOBA', value: 'MOBA' },
        { label: 'Sports', value: 'Sports' },
        { label: 'Open World', value: 'Open World' },
    ];

    // Options for the platform picklist
    platformOptions = [
        { label: 'PC', value: 'PC' },
        { label: 'CONSOLE', value: 'CONSOLE' },
        { label: 'MOBILE', value: 'MOBILE' }
    ];

    // Fetches game records from Salesforce, wired to Apex method `getGamesRecords`
    @wire(getGamesRecords, { filter: '$filter' })
    getDashboardHandler(response) {
        this.wiredGames = response; // Store the response for refreshApex
        const { data, error } = response;
        if (data) {
            this.games = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.games = [];
        }
    }

    // Handles changes to the filter input
    handleFilterChange(event) {
        this.filter = event.target.value; 
    }

    // Handles actions performed on rows in the data table
    handleSelectedGame(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;

        switch (actionName) {
            case 'moreInfo':
                this.handleMoreInfo(row);
                break;
            case 'edit':
                this.handleEdit(row);
                break;
            case 'delete':
                this.handleDelete(row);
                break;
            default:
                break;
        }
    }

    // Handles the "More Info" button action
    handleMoreInfo(row) {
        const selectedGameId = row.Id;
        // Dispatch a custom event to notify the parent component
        this.dispatchEvent(new CustomEvent('selectedgame', { detail: selectedGameId }));
    }

    // Handles the "Edit" button action
    handleEdit(row) {
        this.editableGame = {
            ...row,
            Genre__c: row.Genre__c ? row.Genre__c.split(';') : [],
            Platform__c: row.Platform__c ? row.Platform__c.split(';') : []
        };
        this.isModalOpen = true;
    }

    // Handles changes to fields inside the edit modal
    handleFieldChange(event) {
        const field = event.target.dataset.field;
        const value = event.target.value;
        this.editableGame = { ...this.editableGame, [field]: value };
    }

    // Updates the game record by calling the `updateGame` Apex method
    editGame() {
        updateGame({ game: this.editableGame })
            .then(() => {
                this.closeModal();
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Game updated successfully',
                        variant: 'success',
                    })
                );
                return refreshApex(this.wiredGames); // Refresh the data table  
            })
            .catch(error => {
                this.error = error;
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: 'Error updating game: ' + error.body.message,
                        variant: 'error',
                    })
                );
            });
    }

    // Deletes the game record by calling the `deleteGame` Apex method
    handleDelete(row) {
        const gameIdToDelete = row.Id;
        deleteGame({ gameId: gameIdToDelete})
            .then(() => { 
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Game deleted successfully',
                        variant: 'success',
                    })
                );
                return refreshApex(this.wiredGames); // Refresh the data table  
            })
            .catch(error => {
                this.error = error;
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: 'Error deleting game: ' + error.body.message,
                        variant: 'error',
                    })
                );
            });
    }

    // Closes the edit modal and clears the editable game object
    closeModal() {
        this.editableGame = {};
        this.isModalOpen = false;
    }
}