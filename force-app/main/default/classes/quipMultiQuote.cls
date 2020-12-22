public class quipMultiQuote {
    @AuraEnabled//(cacheable=true)
      public static list<opportunity> getOps(list<id> ops){
          system.debug('ops '+ ops);
          List<Opportunity> o = [select id, multi_quote__c from opportunity where  id  In :ops];
          //update multiquote
          List<Opportunity> updateOp = new List<Opportunity>();
          for(opportunity x : o){
              x.multi_quote__c = true; 
              updateOp.add(x);
          }
          system.debug(updateOp);
          try{
             update updateOp;
          }catch(exception e){
             system.debug('error '+ e.getCause());
          }
          
          return null; 
      }
  }