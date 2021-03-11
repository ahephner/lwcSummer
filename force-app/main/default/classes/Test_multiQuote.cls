@isTest
private class Test_quipMultiQuote {
    @istest
    static void Test_quipMultiQuote(){
    	Date myDate = Date.newInstance(2040, 1, 4);
        //create test customer
        Account cust = new Account();
        cust.Name = 'Test123456';
        cust.Type = 'Customer';
        cust.Customer_Name__c = 'Test Customer 123456';
        insert cust;
        //product creation
        Id pricebookId = Test.getStandardPricebookId();
        
        //create product2 
        product2 prod = new product2(name ='product', IsActive= True); 
        insert prod; 
        
        PricebookEntry pbe = new PricebookEntry(Pricebook2Id = pricebookId, Product2Id=prod.id,
                                                 unitprice=4, IsActive = True, UseStandardPrice=False);
        insert pbe; 
        //create test opportunity
        opportunity opp = new opportunity(name = 'test name', accountID= cust.id, pricebook2id = pricebookId,
                                         stagename='Estimate(10%)', job_type__c = 'Construction', closedate = myDate);
       
        //insert w/o synced quote
        insert opp; 
       
//opportunitylineitem
        opportunitylineitem li = new opportunitylineitem(opportunityid = opp.id, product2id = prod.Id, PricebookEntryId=pbe.id,
                                                         unitprice= 4, quantity= 3); 
        insert li;
        
        list<opportunity> listOps = [select id from opportunity];
        list<id> ops = new list<id>(); 
        for(opportunity x : listOps){
            ops.add(x.id); 
        }
        
        string name = 'test';
        //quipMultiQuote method = new quipMultiQuote();
        Test.startTest();
            //method.getOps(ops); 
            list<opportunity> y = quipMultiQuote.getOps(ops, name); 
        	
        Test.stopTest();
    }
}