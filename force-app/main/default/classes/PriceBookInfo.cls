public class PriceBookInfo {
    @AuraEnabled(cacheable=True)
    public static list<PriceBook2> getBooks(string code){
        
        //List<string> ids = new List<string>();
        //for(PriceBookEntry pbe:[select pricebook2id from PriceBookEntry where productcode = : code]){
          //      ids.add(pbe.pricebook2id); 
        //}
        list<PriceBook2> books = [SELECT ID, Name from PriceBook2 where isactive = true and 
                                  id not in(Select pricebook2id from pricebookentry where productcode =: code)]; 
        system.debug('getBooks ' +books);
        return books; 
    }
      @AuraEnabled(cacheable=True)
    public static list<PriceBook2> getInBooks(string code){

        list<PriceBook2> books = [SELECT ID, Name from PriceBook2 where isactive = true and 
                                  id in(Select pricebook2id from pricebookentry where productcode =: code)]; 
        system.debug('getInBooks ' +books);
        return books; 
    }
    //insert into product2 table 
    //check if a standard price book entry exists for the product code
    //if no then create and new pricebook entry assing to standard book 
    //then add that product to the new pricebook selected by users 
    @AuraEnabled
    public static pricebookentry addEntry(string bookId, string recordId, string productCode){
        //system.debug('bookId '+bookId+ ' recordId '+recordId + ' productCode '+productCode);
        PriceBookEntry newEntry = new PriceBookEntry();
        PriceBookEntry standEntry = new PriceBookEntry(); 
        Product__c ats = [select id,name,Average_Cost__c, Active__c, Product_Name__c, product_status__c, size__c from product__c where id = :recordId]; 
        ID standardBook = [select id from pricebook2 where name like 'Standard%' ].id;
        List<product2> pId = [Select id from product2 where productcode =: productCode limit 1];
        
        if(!pId.isEmpty()){
           pricebookentry pbeid = [select id from pricebookentry where Product2Id =:pId and Pricebook2Id =:standardBook];
            if(pbeId != null){
                newEntry.Product2Id = pId[0].Id; 
                newEntry.Pricebook2Id = bookId;
                newEntry.IsActive = true; 
                newEntry.UnitPrice = (ats.average_cost__c/0.6); 
            }else{
                standEntry.Pricebook2Id = standardBook;
                standEntry.Product2Id = pId[0].Id;
                standEntry.IsActive = true; 
                standEntry.UnitPrice = (ats.average_cost__c/0.6);
                    insert standEntry;
                newEntry.Product2Id = pId[0].Id; 
                newEntry.Pricebook2Id = bookId;
                newEntry.IsActive = true; 
                newEntry.UnitPrice = (ats.average_cost__c/0.6);
            }
        }else{
            Product2 prod = new Product2(name = ats.Product_Name__c,
                                        Average_Cost__c = ats.Average_Cost__c,
                                        ProductCode = ats.Name,
                                        stockkeepingunit = ats.name,
                                        product_status__c = ats.Product_Status__c,
                                        size__c = ats.Size__c,
                                        isActive = true); 
            insert prod; 
                standEntry.Pricebook2Id = standardBook;
                standEntry.Product2Id = prod.id;
                standEntry.IsActive = true; 
                standEntry.UnitPrice = (ats.average_cost__c/0.6);
                    insert standEntry;
                newEntry.Product2Id = prod.Id; 
                newEntry.Pricebook2Id = bookId;
                newEntry.IsActive = true; 
                newEntry.UnitPrice = (ats.average_cost__c/0.6);
        }
        insert newEntry; 
        return newEntry; 
    }
    
}