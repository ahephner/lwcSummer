@isTest()
public class test_rewardsListView {
    private static testmethod void rewardsListViewTest(){
                //account
       
        Account cust = new Account();
        cust.Name = 'Test123456';
        cust.RecordTypeId = '01241000001Dy64AAC';
        cust.Customer_Name__c = 'Test Customer 123456';
        	insert cust;
    	//Sales Rep
    	Sales_Rep__c sr = new Sales_Rep__c(Name='Rep', Sales_Rep_Num__c='12');
    	insert sr; 

        //date and pricebook don't know if you need it just incase 
        Date myDate = Date.newInstance(2040, 1, 4);

        //sales doc
        Sales_Document__c head = new Sales_Document__c(name = 'test name', customer__c = cust.id, Doc_Type__c = 'Invoice', 
                                                       Sales_Doc_Num__c = '12345',Sales_Rep__c= sr.Id,
                                                       Doc_Date__c = myDate, Doc_Amount__c=1.00,Payment_Terms__c = 'SEE SPLIT TERMS' );
        
        list<sales_document__c> selected = new list<sales_document__c>();
        selected.add(head);
        test.startTest();
        //the actual visualforce page
        	PageReference pageRef = Page.salesDocRewardsListView;
        	Test.setCurrentPage(pageRef);
        	ApexPages.StandardSetController stdSetController = new ApexPages.StandardSetController(selected);
        	stdSetController.setSelected(selected);
            rewardsListView ext = new rewardsListView(stdSetController); 
        test.stopTest();
    }

    private static testmethod void rebateMobileTest(){
        Account cust = new Account();
        cust.Name = 'Test123456';
        cust.RecordTypeId = '01241000001Dy64AAC';
        cust.Customer_Name__c = 'Test Customer 123456';
        	insert cust;
    	//Sales Rep
    	Sales_Rep__c sr = new Sales_Rep__c(Name='Rep', Sales_Rep_Num__c='12');
    	insert sr; 

        //date and pricebook don't know if you need it just incase 
        Date myDate = Date.newInstance(2040, 1, 4);

        //sales doc
        Sales_Document__c docOne = new Sales_Document__c(name = 'SO123', customer__c = cust.id, Doc_Type__c = 'Invoice', 
                                                       Sales_Doc_Num__c = '12345',Sales_Rep__c= sr.Id,
                                                       Doc_Date__c = myDate, Doc_Amount__c=1.00,Payment_Terms__c = 'SEE SPLIT TERMS' );
        
        Sales_Document__c docTwo = new Sales_Document__c(name = 'SO321', customer__c = cust.id, Doc_Type__c = 'Invoice', 
                                                       Sales_Doc_Num__c = '5412',Sales_Rep__c= sr.Id,
                                                       Doc_Date__c = myDate, Doc_Amount__c=1.00,Payment_Terms__c = 'SEE SPLIT TERMS' );
        insert docOne;
        insert docTwo;
        
        Test.startTest();
        	String searchTerm = 'SO';
        	List<Sales_Document__c> testDocs = rewardsListView.getDocs(cust.Id, searchTerm);
        Test.stopTest();
        system.assertEquals(2, testDocs.size());	
    }
    private static testmethod void rebateMobile2(){
                Account cust = new Account();
        cust.Name = 'Test123456';
        cust.RecordTypeId = '01241000001Dy64AAC';
        cust.Customer_Name__c = 'Test Customer 123456';
        	insert cust;
    	//Sales Rep
    	Sales_Rep__c sr = new Sales_Rep__c(Name='Rep', Sales_Rep_Num__c='12');
    	insert sr; 

        //date and pricebook don't know if you need it just incase 
        Date myDate = Date.newInstance(2040, 1, 4);

        //sales doc
        Sales_Document__c docOne = new Sales_Document__c(name = 'SO123', customer__c = cust.id, Doc_Type__c = 'Invoice', 
                                                       Sales_Doc_Num__c = '12345',Sales_Rep__c= sr.Id,
                                                       Doc_Date__c = myDate, Doc_Amount__c=1.00,Payment_Terms__c = 'SEE SPLIT TERMS' );
        
        Sales_Document__c docTwo = new Sales_Document__c(name = 'SO321', customer__c = cust.id, Doc_Type__c = 'Invoice', 
                                                       Sales_Doc_Num__c = '5412',Sales_Rep__c= sr.Id,
                                                       Doc_Date__c = myDate, Doc_Amount__c=1.00,Payment_Terms__c = 'SEE SPLIT TERMS' );
        insert docOne;
        insert docTwo;
        
        Test.startTest();
        String accountId = cust.Id;
        string fDate = '2039-12-31';
        string sDate = '2040-01-06';
        	List<Sales_Document__c> li = rewardsListView.getDocTable(accountId,fDate, sDate );
        Test.stopTest(); 
        
        system.assertEquals(2, li.size()); 
            
    }
    
}