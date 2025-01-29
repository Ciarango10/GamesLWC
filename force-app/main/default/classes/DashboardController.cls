public with sharing class DashboardController {
    @AuraEnabled(cacheable=true)
    public static List<Game__c> getGamesRecords(String filter) {
        String searchFilter = '%' + (filter != null ? filter : '') + '%';  
        String multiPicklistFilter = (filter != null ? filter : '');
        try {
            return [
                SELECT Id, Name, Genre__c, Platform__c, Release_Date__c, Developer__c
                FROM Game__c
                WHERE Name LIKE :searchFilter 
                OR Genre__c INCLUDES (:multiPicklistFilter)
                OR Platform__c INCLUDES (:multiPicklistFilter)
                OR Developer__c LIKE :searchFilter
            ];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static Game__c getGameDetails(Id gameId) {
        try {
            return [
                SELECT Id, Name, Genre__c, Platform__c, Release_Date__c, Developer__c, Logo__c 
                FROM Game__c
                WHERE Id =: gameId
            ];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static void updateGame(Game__c game) {
        try {
            if (game.Id == null) {
                throw new AuraHandledException('The game record must have a valid ID to update.');
            }
            Database.update(game, false);
        } catch (Exception e) {
            throw new AuraHandledException('An error occurred while updating the game record: ' + e.getMessage());
        }
    }

    @AuraEnabled
    public static void deleteGame(Id gameId) {
        try {
            if (gameId == null) {
                throw new AuraHandledException('The game ID is required.');
            }
            Game__c gameToDelete = [
                SELECT Id 
                FROM Game__c
                WHERE Id =: gameId
            ];
            Database.delete(gameToDelete, false);
        } catch (Exception e) {
            throw new AuraHandledException('An error occurred while deleting the game record: ' + e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Game__c> getGamesSalesData() {
        try {
            return [
                SELECT Name, Sales__c
                FROM Game__c
            ];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}