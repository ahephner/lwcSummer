/* eslint-disable no-console */
import { LightningElement, track, wire, api } from 'lwc';
import {getRecord} from 'lightning/uiRecordApi' 
//import NEXT_SERVICE from '@salesforce/schema/ATS_Asset__c.Next_Service__c'
//import MILEAGE from '@salesforce/schema/ATS_Asset__c.Mileage_YTD__c'

//const Fields = [NEXT_SERVICE, MILEAGE];
export default class AssetTrack extends LightningElement {
    @api recordId; 
    @track build;
    @track miles;
    @track service
    @wire(getRecord, {recordID: '$recordId', fields:
                                                    ['ATS_Assets__c.Next_Service__c ', 'ATS_Asset__c.Mileage_YTD__c']})
        assetLoad({error, data}){
            if(error){
                console.log('error : ', error.body.errorCode, error.body.message)
            } else if(data){
                console.log(data);
                
                    this.build = data.fields.Next_Service__c.value;
                    this.miles = data.fields.Mileage_YTD__c.value; 
            }
        } 
    
        
}