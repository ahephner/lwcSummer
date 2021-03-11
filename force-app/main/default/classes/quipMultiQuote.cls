public class quipMultiQuote {
    @AuraEnabled//(cacheable=true)
      public static list<opportunity> getOps(list<id> ops, string quoteName){
          //system.debug('quoteName '+ quoteName);
          string name = ' '+quoteName; 
          List<Opportunity> o = [select id, multi_quote__c, run_time__c  from opportunity where  id  In :ops];
          string now = string.valueOf(system.now());   
          //update multiquote
          List<Opportunity> updateOp = new List<Opportunity>();
          for(opportunity x : o){
              x.multi_quote__c = true;
              x.Run_Time__c += name; 
              updateOp.add(x);
          }
          //system.debug(updateOp);
          try{
             update updateOp;
          }catch(exception e){
             system.debug('error '+ e.getCause());
          }
          
          return null; 
      }
  }