public with sharing class assetAdminController {

    @AuraEnabled(cacheable=True)
    public static list<ContentDocument> getFiles(string assetId) {
        //if we ever need some more logic uncomment below then add loop at bottom of method
        //with returnFiles.add(); 
        //list<ContentDocument> returnFiles = new list<ContentDocument>();
        List<String> cd = new List<String>(); 
        id x = [select id from Admin_File__c where ATS_Asset__c = :assetId].id;
        //link ids
        list<ContentDocumentLink> ids = [select ContentDocumentId from ContentDocumentLink 
                                        where LinkedEntityId = :x];
        
        for(ContentDocumentLink cdId : ids){
            cd.add(cdId.ContentDocumentId);
        }
        //files 
        list<ContentDocument> files = [select Id, Title, CreatedDate, FileType 
                                       from ContentDocument where id in : cd]; 
        return files; 

    }
}
