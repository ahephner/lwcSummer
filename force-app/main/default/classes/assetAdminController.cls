public with sharing class assetAdminController {

    @AuraEnabled(cacheable=True)
    public static list<ContentDocument> getFiles(string assetId) {
        set<ContentDocumentLink> ids = [select ContentDocumentLinkId from ContentDocumentLink where linkedentityid = :assetId];
        set [select name from Admin_File__c where ATS_Asset__c = :assetId];
        return null;  
    }
}
