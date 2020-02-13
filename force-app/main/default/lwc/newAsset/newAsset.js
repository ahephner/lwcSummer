/* eslint-disable no-console */
import { LightningElement,track, api, wire} from 'lwc';
//import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import Stage from '@salesforce/schema/ATS_Asset__c.Asset_Stage__c'
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
//import LNAME_FIELD from '@salesforce/schema/ATS_Asset__c.Long_Name__c'
const fields=[Stage, 'ATS_Asset__c.Long_Name__c', 'ATS_Asset__c.VIN_Num__c']; 
export default class NewAsset extends LightningElement {
    @api recordId; 
    @api objectApiName;
    @track last; 
    //stages 
    @track curStage; 
    @track Purchased = false;
    @track Holding = false;
    @track Details = true; 
    @track Registered = false;
    @track Installed = false;
    
    @track next
    @wire(getRecord, {recordId: '$recordId', fields}) 
        asset
    
    get assetStage(){
        console.log(1,getFieldValue(this.asset.data, Stage) );
        this.curStage = getFieldValue(this.asset.data, Stage); 
        this.whatStage(this.curStage); 
        return getFieldValue(this.asset.data, Stage); 
    }
    whatStage(stageName){
       if(stageName === 'Purchased'){
           this.Purchased = true;
           this.Holding = false;
           this.Details = false;
           this.Registered = false;
           this.Installed = false; 
       }else if(stageName === 'Holding'){
           this.Purchased = false;
           this.Holding = true;
           this.Details = false;
           this.Registered = false;
           this.Installed = false; 
           
       }else if (stageName === 'Details'){
           this.Purchased = false;
           this.Holding = false;
           this.Details = true;
           this.Registered = false;
           this.Installed = false; 
       }else if(stageName === 'Registered'){
           this.Purchased = false;
           this.Holding = false;
           this.Details = false;
           this.Registered = true;
           this.Installed = false; 
       }else if(stageName === 'Installed'){
           this.Purchased = false;
           this.Holding = false;
           this.Details = false;
           this.Registered = false;
           this.Installed = true; 
       }
        }
        success(){
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message:'Questions Recorded',
                    variant: 'success'
                })
            )
        }
        
    }
    // wiredMethod({data, error}){
    //         if(data){
    //             console.log(data);
    //             console.log(data.fields);
    //            // this.asset = data; 
    //            // console.log(this.asset.fields.Long_Name__c.value);
    //             this.last = getFieldValue(data, LNAME_FIELD) 
                 
    //             //console.log(this.asset, 1);
                
    //         }else if(error){
    //             console.log(error);
                
    //         }
    //     }
        

//}
