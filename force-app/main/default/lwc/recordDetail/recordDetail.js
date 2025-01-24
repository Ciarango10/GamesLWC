import { LightningElement, api, wire} from 'lwc';
import getGameDetails from '@salesforce/apex/DashboardController.getGameDetails';

export default class RecordDetail extends LightningElement {
    @api gameDetailId;
    game = null;
    error = undefined;
    
    // Fetches detailed information about a specific game when the gameDetailId changes.
    @wire(getGameDetails, { gameId: '$gameDetailId' })
    getDashboardHandler({ data, error }) {
        if (data) {
            this.game = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.game = null;
        }
    }
}