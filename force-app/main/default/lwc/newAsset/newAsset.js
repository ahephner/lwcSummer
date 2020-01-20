/* eslint-disable no-console */
import { LightningElement,track, api, wire} from 'lwc';
//import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import Stage from '@salesforce/schema/ATS_Asset__c.Asset_Stage__c'
import LNAME_FIELD from '@salesforce/schema/ATS_Asset__c.Long_Name__c'
const fields=[Stage, LNAME_FIELD]; 
export default class NewAsset extends LightningElement {
    @api recordId; 
    @api objectApiName;
    @track last; 
    @track asset; 
    @wire(getRecord, {recordId: '$recordId', fields}) 
    wiredMethod({data, error}){
            if(data){
                console.log(data);
                console.log(data.fields);
               // this.asset = data; 
               // console.log(this.asset.fields.Long_Name__c.value);
                this.last = getFieldValue(data, LNAME_FIELD) 
                 
                //console.log(this.asset, 1);
                
            }else if(error){
                console.log(error);
                
            }
        }
        

}