public class rewardsController {
    //used in flow to search for sales docs to add to the reward section. 
    @AuraEnabled(cacheable=true)
    public static list<Sales_Document__c> getDocs(string accountId, string searchTerm){
        string key = '%'+searchTerm+'%';
        system.debug('key '+key);
        system.debug('accountId	 '+accountId);
        List<Sales_Document__c> docList = [select id, name, Product_Sub_Total__c from sales_document__c
                                          where customer__c =:accountId and name like :key and Doc_Type__c = 'Invoice'];
        //system.debug('size '+ docList.size());
        return docList; 
    }

}