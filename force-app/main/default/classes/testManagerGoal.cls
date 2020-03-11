@isTest
private class testManagerGoal {
	@isTest
    Static void insertUser(){
                        //create user
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
    }
    @isTest
    static void testManagerGoal(){
        //need user
        User u1 = [SELECT Id FROM User WHERE Lastname like 'Test%'];
        //sales rep
        sales_rep__c sr = new sales_rep__c(recordtypeid = '01241000001MDnDAAW', 
                                           name='Test', 
                                           Sales_Rep_Num__c='1',
                                          Salesforce_User__c = u1.id,
                                          Active_Monthly_Budget__c= 123);
         
        insert sr;
        Test.startTest();
        sales_rep__c x = managerGoal.getGoal(u1.id);
        system.assertNotEquals(null, x); 
        Test.stopTest();
    }
    @isTest
    static void testRepGoals(){
        User u1 = [SELECT Id FROM User WHERE Lastname like 'Test%']; 
       date t =  date.today();
        sales_rep__c sr = new sales_rep__c(recordtypeid = '01241000001MDnDAAW', 
                                           name='Test', 
                                           Sales_Rep_Num__c='1',
                                          Salesforce_User__c = u1.id,
                                          Active_Monthly_Budget__c= 123);
        insert sr; 
        
        sales_goal__c sg = new sales_goal__c(name = 'test goal',
                                            Budget_Type__c = 'Monthly Sales',
                                            Sales_Rep__c = sr.Id,
                                            Date__c= t); 
        insert sg; 
        test.startTest();
        list<sales_goal__c> x = managerGoal.getMonthlyGoals(u1.id);
        
        system.assertNotEquals(null, x);
        test.stopTest(); 
        
    }
}