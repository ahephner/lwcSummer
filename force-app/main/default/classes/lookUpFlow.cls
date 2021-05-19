public with sharing class lookUpFlow {
@AuraEnabled(Cacheable=true)
public static List<Product__c> searchProd(String searchTerm){
    string x; 
    x = '%'+searchTerm+'%';
    List<Product__c> prods = [select id, name, product_name__c
                             from Product__c where name like:x OR product_name__c like:x];
    System.debug(prods);
                             return prods; 
}
}
