public with sharing class getReturnDetails {
	@auraEnabled(cacheable =true)
    public static list<Return_Request_Detail__c> getDets(string recordId){
        
        string ord = [select ProcessInstance.TargetObjectId from processinstanceworkitem where id =: recordid limit 1].ProcessInstance.TargetObjectId;
        list<Return_Request_Detail__c> details = [select id, name,Product_Name__c, Product_Code__c, Original_Order_Quantity__c,Return_Quantity__c
                                                 from Return_Request_Detail__c where Return_Request__c =:ord];
        
        return details; 
    }
    

}