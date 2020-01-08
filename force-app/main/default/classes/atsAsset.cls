public with sharing class atsAsset {
   
   @AuraEnabled
    public static ats_asset__c getAsset(id recordid){
        return [select Next_Service__c, Latest_Mileage__c from ats_asset__c where id = :recordid]; 
    }
  
}
