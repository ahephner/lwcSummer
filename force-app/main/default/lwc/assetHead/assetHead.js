import { LightningElement, wire } from 'lwc';
import userId from '@salesforce/user/Id';
import getHeader from '@salesforce/apex/assetAdminController.getHeader';
export default class AssetHead extends LightningElement {
    userId = userId;
    name;
    type;
    license;
    workMiles; 
    personalMiles;

    helpText = '*Current Calendar Year'
    
    @wire(getHeader,{user:'$userId'})
        wiredMethod({error,data}){
            if(data){
                this.name = data.Name;
                this.type = data.Asset_Type__c;
                this.license = data.License_Plate__c;
                this.workMiles = data.Total_Work_Miles__c;
                this.personalMiles = data.Total_Personal_Miles__c
            }else if(error){
                console.log('error '+error);
                
            }
        }
}