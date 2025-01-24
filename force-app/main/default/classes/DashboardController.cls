public with sharing class DashboardController {
    @AuraEnabled(cacheable=true)
    public static List<Game__c> getGamesRecords() {
        try {
            return [
                SELECT Id, Name, Genre__c, Platform__c, Release_Date__c, Developer__c
                FROM Game__c
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
}