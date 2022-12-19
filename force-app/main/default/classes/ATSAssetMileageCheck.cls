public class ATSAssetMileageCheck {
    public static void emailAssets(){
        Date lateDate = System.today() - 30; 
		Set<id> assetId = new Set<id>();
        Set<id> repId = new Set<id>();
        
        List<ats_asset__c> assetCall = [select id, sales_rep__c from ats_asset__c 
                                        where Last_Mileage_Entry_Date__c <=:lateDate and Asset_Type__c = 'Sales Rep Pickup (SRPU)'
                                       and sold__c = false and sales_rep__r.active__c = true and (NOT sales_rep__r.name Like '%(FM)%')
                                       and (NOT sales_rep__r.name Like '(RM)%')];
        system.debug('assetCall Size '+assetCall.size());
        if(assetCall.size() > 0){
            for(ats_asset__c x: assetCall){
                assetId.add(x.id);
                repId.add(x.sales_rep__c);
            }
        }
        Map<id, ats_asset__c> assetMap = new Map<id, ats_asset__c>(
        										[select id, name, Last_Mileage_Entry_Date__c 
                                                 from ats_asset__c where id In :assetId]);
        Map<id, sales_rep__c> repMap = new Map<id, sales_rep__c>(
        										[select id, name,Email__c from sales_rep__c
                                                where id In :repId]);
        List<messaging.SingleEmailMessage> emailList = new List<messaging.SingleEmailMessage>();
        
        
        for(ats_asset__c v:assetCall){
            Ats_asset__c asset = assetMap.get(v.Id);
            Sales_Rep__c rep = repMap.get(v.Sales_Rep__c);
            String prettyDate = asset.Last_Mileage_Entry_Date__c.format(); 
            Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
            mail.setSubject('Overdue mileage for '+ asset.Name);
            mail.setSenderDisplayName('it@advancedturf.com'); 
            List<string> toAddress = new List<String>(); 
            toAddress.add(rep.Email__c);
            mail.setToAddresses(toAddress);
            String emailBody = 'Hello '+ rep.Name + ', <br/><br/>'+
                			    'Your vehicles last mileage entry was on '+ prettyDate +
        						'. Please enter a new mileage at the link below. <br/> <br/>'+
                				'Link: https://advancedturf.lightning.force.com/lightning/n/My_Vehicle'+' <br/><br/>'+
                				'If you need a reminder of how to enter mileage please see the short video below: <br/><br/>'+
                				'https://www.youtube.com/watch?v=ed2bzeh0ly0';
            mail.setHtmlBody(emailBody);
            emailList.add(mail);
        }
        try{
            system.debug('sending message');
            Messaging.sendEmail(emailList, false); 
        }catch(System.Exception ex){
            system.debug(ex);
        }
    }	
}