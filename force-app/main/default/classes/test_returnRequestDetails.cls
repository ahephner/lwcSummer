@isTest
private class test_returnRequestDetails {
    @isTest
    static void test_getDets(){
		User user1 = [SELECT Id FROM User WHERE Alias='DGarl'];
        User userMan = [select ID from User WHERE Alias = 'DWint']; 
        system.debug(user1); 
        //Bare min to insert return request if anyother required fields are added make sure to add them here first
        //account
        Account cust = new Account();
        cust.Name = 'Test123456';
        cust.Type = 'Customer';
        cust.Customer_Name__c = 'Test Customer 123456';
        cust.RecordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByName().get('Customer').getRecordTypeId();
        
        insert cust;
        
        //products 
        Product__c prod = new Product__c(name='AL123=50G',Product_Name__c='Bug Juice' );
        insert prod;
        //Create Sales Doc
        Sales_Document__c sd = new Sales_Document__c();
        sd.name = 'test from sf';
        sd.sales_Doc_num__c = '454';
        //get new account recordid
        sd.Customer__c = cust.id;
        sd.Doc_Type__c = 'Invoice';
        sd.Sales_Manager__c = user1.id; 
        insert sd;
        
        Return_Request__c head = new Return_Request__c(Sales_Doc_Num__c='SO321',Customer__c = cust.id, Sales_Document__c= sd.id,Sales_Manager__c= userMan.Id);
        insert head; 
        
        Return_Request_Detail__c details = new Return_Request_Detail__c(name='product', Return_Request__c=head.id,Product__c=prod.id );
        insert details; 
        
// Create an approval request for the account
        Approval.ProcessSubmitRequest req1 = 
            new Approval.ProcessSubmitRequest();
        req1.setComments('Submitting request for approval.');
        req1.setObjectId(head.id);
        // Submit on behalf of a specific submitter
        req1.setSubmitterId(user1.Id); 
        
        // Submit the record to specific process and skip the criteria evaluation
        req1.setProcessDefinitionNameOrId('Sales_Doc_Return_Over_250_Fee_Inc');
        req1.setSkipEntryCriteria(true);
        
                // Submit the approval request for the account
        Approval.ProcessResult result = Approval.process(req1);
        
        // Verify that it works
        System.assert(result.isSuccess());
        
        //get teh id of the created apporval
        List<Id> newWorkItemIds = result.getNewWorkitemIds();
        
        // Instantiate the new ProcessWorkitemRequest object and populate it
        Approval.ProcessWorkitemRequest req2 = 
            new Approval.ProcessWorkitemRequest();
        req2.setComments('Approving request.');
        req2.setAction('Approve');
        req2.setNextApproverIds(new Id[] {UserInfo.getUserId()});
        
        // Use the ID from the newly created item to specify the item to be worked
        req2.setWorkitemId(newWorkItemIds.get(0));
        test.startTest();
        	getReturnDetails.getDets(req2.getWorkitemId());
        //req2.getWorkitemId();
        test.stopTest();

    }
}