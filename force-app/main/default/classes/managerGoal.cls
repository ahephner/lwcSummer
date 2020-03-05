public with sharing class managerGoal {
    @AuraEnabled(cacheable = true)
    public static sales_rep__c  getGoal(id userId) {
        return [select Active_Monthly_Budget__c from Sales_Rep__c where Salesforce_User__c =: userId];
    }
}
