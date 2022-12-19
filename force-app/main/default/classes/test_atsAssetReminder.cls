@isTest
public class test_atsAssetReminder {
    // Dummy CRON expression: midnight on March 15.
    // Because this is a test, job executes
    // immediately after Test.stopTest().
    public static String CRON_EXP = '0 0 0 15 3 ? 2022';
    @isTest
    static void testScheduledJob(){
        Test.startTest();
        string jobId = System.schedule('ScheduledApexTest', CRON_EXP, new ATSAssetMileageReminder());
        Test.stopTest();
    }
    @isTest
    static void testAssetMileageCheck(){
        Date badDate = System.today() - 50; 
        Account cust = new Account(Name = 'Test123456',RecordTypeId = '01241000001Dy5zAAC',Customer_Name__c = 'Test Customer 123456');
        insert cust;
        Sales_Rep__c sr = new Sales_Rep__c(Name='Rep', Sales_Rep_Num__c='12', Active__c = true, email__c = 'ahephner+apextest@advancedturf.com');
    	insert sr; 
        Location__c location = new Location__c(Name = 'Test', Account__c=cust.id); 
        insert location; 
        
        ATS_Asset__c ta = new ATS_Asset__c(name = 'test', ATS_Location__c= location.id, 
                                           tires__c = 0,P_M__c=0,Repair__c=0,Tolls__c = 0,
                                           Miscellaneous__c= 0, Asset_Type__c='Sales Rep Pickup (SRPU)',
                                           Sales_Rep__c = sr.Id, sold__c = false, recordtypeid = '0122M000001cvI6QAI',
                                           Last_Mileage_Entry_Date__c = badDate
                                          );
        insert ta; 
        
        Test.StartTest();
        ATSAssetMileageCheck.emailAssets();
        Test.StopTest();
    }
}