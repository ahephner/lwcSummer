public with sharing class getGoalsController {
    @AuraEnabled(cacheable=true)
    public static list<Sales_Goal__c> getGoals(string userId){
        List<Sales_Goal__c> goals = [select id, Name, 
                                    Customer_Name__c,Prev_Month_Rep_Forecast__c,
                                    Current_Month_Prev_Year__c,Forecast_Amount__c,
                                    Updates__c from Sales_Goal__c where  Current_Month_Goal__c = True 
                                    and Sales_Rep__r.Salesforce_User__c =:userId];
        return goals; 
    }
	@AuraEnabled(cacheable=true)
    public static object getForecastTotal(string userId){
        AggregateResult [] forecastTotal = [select sum(Forecast_Amount__c)ttt from sales_goal__c
                                           where budget_type__c = 'Monthly Sales' and inactive__c = false 
                                           and current_month_goal__c = true and Sales_Rep__r.Salesforce_User__c =:userId];
        object x = forecastTotal[0].get('ttt');
        return x;  
        
    }
     @AuraEnabled(Cacheable=true)
    public static Account[] searchAccount(string searchKey){
        searchKey = '%' + searchKey + '%';
        list<account> accountList = new list<account>();
        if(searchKey == '%%'){
            return null;
        }else if(searchKey != '%%'){
            accountList = [select id, name from account where name like :searchKey or AccountNumber like :searchKey or Customer_Name__c like :searchKey limit 5]; 
            return accountList; 
        }else{
        	return null;
        }
    }
}