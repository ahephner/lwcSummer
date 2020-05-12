public with sharing class getGoals {
    @AuraEnabled(Cacheable=true)
    public static list<Sales_Goal__c> getGoals(ID userID) {
        
        List<Sales_Goal__c> goals = [select id, Name, 
                                    Customer__c,Prev_Month_Rep_Forecast__c,
                                    Current_Month_Prev_Year__c,Forecast_Amount__c,
                                    Updates__c from Sales_Goal__c where sales_rep__r.Salesforce_User__c =:userID 
                                    and Current_Month_Goal__c = True];
        return goals; 


    }
}
