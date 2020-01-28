public with sharing class mapAccounts {
    @AuraEnabled(cacheable=true)
    public static List<Account> getMyAccounts(ID userId){
        System.debug('user id '+ userId); 
        return [select id, name, billingstreet, billingcity,  billingstate, 
                billingpostalcode from account where ownerid = :userid and billingstreet !=Null and billingcity != Null
                and billingstate != Null and billingpostalcode != Null  limit 25]; 
    }
}
