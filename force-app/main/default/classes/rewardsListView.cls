public class rewardsListView {
    public ApexPages.StandardSetController setCon;
public List<Sales_Document__c> LstSelectedDocs {
        get;
        private set;
    }
    public string accountId {
        get;
        set; 
    }
     //List View Controller
    public  rewardsListView(ApexPages.StandardSetController listcontroller){
        //setCon = listcontroller; 
        Set <Id> selectedDocs = new set <Id>();
        LstSelectedDocs = new List<Sales_Document__c>();
        
         
        for(Sales_Document__c x :(Sales_Document__c[]) listcontroller.getSelected()){
            selectedDocs.add(x.id);
            
        }
        LstSelectedDocs = [select id, name, Product_Sub_Total__c, Customer__c from sales_document__c where id in:selectedDocs]; 
        if(LstSelectedDocs.size()>=1){
            system.debug('run');
            accountId = lstSelectedDocs[0].Customer__c;
        }
        //accountId = lstSelectedDocs[0].Customer__c;
        //system.debug('accountID '+lstSelectedDocs[0].Customer__c	);
    }
  
        //used in flow to search for sales docs to add to the reward section. 
    @AuraEnabled(cacheable=true)
    public static list<Sales_Document__c> getDocs(string accountId, string searchTerm){
        string key = '%'+searchTerm+'%';
        system.debug('key '+key);
        system.debug('accountId	 '+accountId);
        List<Sales_Document__c> docList = [select id, name, Product_Sub_Total__c from sales_document__c
                                          where customer__c =:accountId and name like :key and Doc_Type__c = 'Invoice'];
        //system.debug('size '+ docList.size());
        return docList; 
    }
    
    @AuraEnabled(cacheable=true)
    public static list<Sales_Document__c> getDocTable(string accountId, string fDate, string sDate){
        //system.debug('sDate '+sDate);
        Date startDate = date.valueOf(fDate); 
        date endDate = date.valueOf(sDate); 
      //system.debug('dates f '+fDate+' s '+sDate);
        List<Sales_Document__c> docList = [select id, name, Product_Sub_Total__c, Cust_PO_Num__c, doc_date__c from sales_document__c
                                          where customer__c =:accountId and Doc_Type__c = 'Invoice'
                                          and doc_date__c >= :startDate and doc_date__c <= :endDate];
        return docList; 
    }
    @AuraEnabled(cacheable=true)
    public static list<Open_Order__c> getOpen(string accountId, string fDate, string sDate){
        Date startDate = date.valueOf(fDate);
        Date endDate = date.valueOf(sDate);
        
        list<Open_Order__c> orders = [select id, Name, Product_Only__c,doc_date__c, Cust_PO__c
                                      from Open_Order__c where customer__c =:accountId
                                      and doc_date__c >= :startDate and doc_date__c <= :endDate];
        
        return orders;
    }
}