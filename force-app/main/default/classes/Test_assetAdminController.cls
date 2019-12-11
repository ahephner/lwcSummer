//TURN OFF ATS ASSET ADD ADMIN FILE PROCESS BUILDER FIRST
@isTest
public with sharing class Test_assetAdminController {
    @isTest
    static void getFiles(){
          ATS_Asset__c Truck = new ATS_Asset__c(name = 'Truck', RecordTypeId='0122M000001cvDpQAI'); 
          insert Truck; 
          Admin_File__c File = new Admin_File__c(name = 'Truck File',ATS_Asset__c= Truck.id );
          insert File; 

           //setup document link. Setting it up this way then querying it and adding it to the link 
           //below was how it was recommended to be done on the stackoverflow for Apex
   		ContentVersion docFile = new ContentVersion(
            Title = 'Test',
            PathOnClient = 'Test.jpg',
            VersionData = Blob.valueOf('Test Content Data'),
            IsMajorVersion = true
        );
        insert docfile;
        List<ContentDocument> documents = [Select Id, title, LatestPublishedVersionID from ContentDocument];
        
        ContentDocumentLink link = new ContentDocumentLink(ContentDocumentId = documents[0].id, LinkedEntityId = Truck.Id, ShareType = 'V', Visibility = 'InternalUsers'); 
        insert link; 
        ContentDocumentLink link2 = new ContentDocumentLink(ContentDocumentId = documents[0].id, LinkedEntityId = File.Id, ShareType = 'V', Visibility = 'InternalUsers'); 
        insert link2; 



        Test.startTest();
        list<ContentDocument> docs = assetAdminController.getFiles(Truck.Id);
        string adminFile = assetAdminController.adminId(Truck.Id);
        Test.stopTest();
        System.assertEquals(docs.size(), 1);
        System.assertEquals(adminFile,File.Id);
    }
}
