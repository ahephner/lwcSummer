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

    ///get files for attached to sales rep mobile entry
    @AuraEnabled(cacheable=True)
    public static list<ContentDocument> salesAssetFiles(string user){
        system.debug('userId '+user);
        List<string> fileIds = new List<String>();
        id x = [select id from ats_asset__c where ownerid =: user].id;
                //link ids
        list<ContentDocumentLink> ids = [select ContentDocumentId from ContentDocumentLink 
                                        where LinkedEntityId = :x];
        
        for(ContentDocumentLink i : ids){
            fileIds.add(i.ContentDocumentId);
        }
        
        list<ContentDocument> assetFiles = [select Id, Title, CreatedDate, FileType 
                                       		from ContentDocument where id in: fileIds];
        system.debug(assetFiles);
        return assetFiles;
    }
    //header value for sales rep mobile asset entry
    @AuraEnabled(cacheable=True)
    public static Ats_Asset__c getHeader(string user){
        Ats_Asset__c x = [Select Id,Name, Asset_Type__c, License_Plate__c from ATS_Asset__c where ownerid =:user ];
        return x; 
    }
}