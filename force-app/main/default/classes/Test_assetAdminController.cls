//TURN OFF ATS ASSET ADD ADMIN FILE PROCESS BUILDER FIRST
@isTest
public with sharing class Test_assetAdminController {
    @isTest
    static void getFiles(){
        string rid = [select id from recordtype where description like 'Parent/Company Account'].id;
        Account cust = new Account();
        cust.name = 'Golf Course';
        cust.RecordTypeId = rid;
        cust.Customer_Name__c = '123-Golf Course';
       insert cust; 
       //location
       Location__c location = new Location__c(Name = 'Test', Account__c=cust.id); 
       insert location;
        //asset
          ATS_Asset__c Truck = new ATS_Asset__c(name = 'Truck', RecordTypeId='0122M000001cvDpQAI',
                                               ATS_Location__c = location.id,Asset_Type__c= 'Pickup (PU)'); 
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
    
    @isTest
    static void repApp(){
                UserRole r = new UserRole(DeveloperName = 'MyCustomRole', Name = 'My Role');
		insert r;
 
 		User u = new User(
         ProfileId = [SELECT Id FROM Profile WHERE Name = 'System Administrator'].Id,
         LastName = 'last',
         Email = 'puser000@amamama.com',
         Username = 'puser000@amamama.com' + System.currentTimeMillis(),
         CompanyName = 'TEST',
         Title = 'title',
         Alias = 'alias',
         TimeZoneSidKey = 'America/Los_Angeles',
         EmailEncodingKey = 'UTF-8',
         LanguageLocaleKey = 'en_US',
         LocaleSidKey = 'en_US',
         UserRoleId = r.Id
    );
        insert u; 
        system.runAs(u){
        //account
        string rid = [select id from recordtype where description like 'Parent/Company Account'].id;
        Account cust = new Account();
        cust.name = 'Golf Course';
        cust.RecordTypeId = rid;
        cust.Customer_Name__c = '123-Golf Course';
       insert cust; 
       //location
       Location__c location = new Location__c(Name = 'Test', Account__c=cust.id); 
       insert location; 
            
        Sales_Rep__c sr = new Sales_Rep__c(Name='Rep', Sales_Rep_Num__c='12', ownerId = u.Id, Active__c = True);
    	insert sr;
        
        ATS_Asset__c Truck = new ATS_Asset__c(name = 'Truck', RecordTypeId='0122M000001cvI6QAI',
                                              Asset_Type__c='Sales Rep Pickup (SRPU)', Sales_Rep__c = sr.Id,
                                             ATS_Location__c = location.id ); 
          insert Truck; 
        //this is for the file test
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

        Test.startTest();
       	 Ats_Asset__c veh = assetAdminController.getHeader(u.Id);
         List<ContentDocument> assetLink = assetAdminController.salesAssetFiles(u.Id);
        Test.stopTest();
            System.assertEquals('Truck', veh.Name);
            System.assertEquals(1, assetLink.size()); 
        }
    }
}