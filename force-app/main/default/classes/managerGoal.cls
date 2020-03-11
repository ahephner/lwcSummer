public with sharing class managerGoal {
    @AuraEnabled(cacheable = true)
    public static sales_rep__c  getGoal(id userId) {
        system.debug('hey');
        return [select Active_Monthly_Budget__c from Sales_Rep__c where Salesforce_User__c =: userId];
    }
    
    //this will return the previous sales goals 
    @AuraEnabled(cacheable = true)
    public static list<Sales_Goal__c> getMonthlyGoals(id userId){
        //system.debug('userId ' + userId);
        ID repId = [Select Id from Sales_Rep__c where Salesforce_User__c =: userId limit 1].Id;
        //system.debug('repId ' + repId);
        return [select id, progress_amount__c, total_budget_amount__c,month_name__c, forecast_amount__c from  sales_goal__c 
                where sales_rep__c =:repId and budget_type__c = 'Monthly Sales' and inactive__c = false and 
                date__c <= this_month order by date__c DESC];                
    }
}