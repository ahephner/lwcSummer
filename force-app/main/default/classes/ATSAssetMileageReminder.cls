public without sharing class ATSAssetMileageReminder implements Schedulable {
    public void execute(SchedulableContext ctx){
         ATSAssetMileageCheck.emailAssets(); 
        
    }

}