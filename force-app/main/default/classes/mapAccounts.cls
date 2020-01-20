public with sharing class mapAccounts {
    @AuraEnabled(cacheable=true)
    public static List<Account> getMyAccounts(ID userId){
        System.debug('user id '+ userId); 
        return [select id, name, billingstreet, billingcity,  billingstate, 
                billingpostalcode from account where ownerid = :userid limit 25]; 
    }
}
