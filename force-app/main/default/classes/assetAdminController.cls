public with sharing class assetAdminController {

    @AuraEnabled(cacheable=True)
    public static list<ContentDocument> getFiles(string assetId) {
        //if we ever need some more logic uncomment below then add loop at bottom of method
        //with returnFiles.add(); 
        //list<ContentDocument> returnFiles = new list<ContentDocument>();
        List<String> cd = new List<String>(); 
        id x = [select id from Admin_File__c where ATS_Asset__c = :assetId limit 1].id;
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
    @AuraEnabled(cacheable=True)
    public static id adminID(string assetId){
        id x = [select id from Admin_File__c where ATS_Asset__c = :assetId limit 1].id;
        return x; 
    }
    @AuraEnabled(cacheable=True)
    public static list<ContentDocument> salesAssetFiles(string user){
        system.debug('userId '+user);
        List<string> fileIds = new List<String>();
        id x = [select id from ats_asset__c where sales_rep__r.ownerid =: user and sold__c = false and Asset_Type__c = 'Sales Rep Pickup (SRPU)' limit 1].id;
                //link ids
        list<ContentDocumentLink> ids = [select ContentDocumentId from ContentDocumentLink 
                                        where LinkedEntityId = :x];
        
        for(ContentDocumentLink i : ids){
            fileIds.add(i.ContentDocumentId);
        }
        
        list<ContentDocument> assetFiles = [select Id, Title, CreatedDate, FileType 
                                       		from ContentDocument where id in: fileIds];
        //system.debug(assetFiles);
        return assetFiles;
    }
    @AuraEnabled(cacheable=True)
    public static Ats_Asset__c getHeader(string user){
        Ats_Asset__c x = [Select Id,Name, Asset_Type__c, License_Plate__c, Total_Work_Miles__c, Total_Personal_Miles__c 
                          from ATS_Asset__c where sales_rep__r.ownerid =:user and sold__c = false
                          and (Asset_Type__c = 'Sales Rep Pickup (SRPU)' or Asset_Type__c = 'Pickup (PU)') limit 1];
        return x;
    }
}