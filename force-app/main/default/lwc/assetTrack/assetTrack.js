/* eslint-disable no-console */
import { LightningElement, track, wire, api } from 'lwc';
//import {getRecord, getFieldValue} from 'lightning/uiRecordApi'; 
import getAsset from '@salesforce/apex/atsAsset.getAsset';

//const fields = [NEXT_SERVICE, MILEAGE];
export default class AssetTrack extends LightningElement {
    @api recordId; 
    @track build;
    @track miles;
    @track service
    @track left; 
    @track pastDue;
     id = this.recordId;
    // connectedCallback(){
    //     console.log(this.recordId + ' id')
    //     this.id = this.recordId;

    // }
    @wire(getAsset, {recordId: '$recordId'})
        wiredMethod({error, data}){
            if(error){
                console.log(this.recordId);
                this.error = error; 
                this.build = undefined;
                console.log(this.error);
                
            }else if(data){
               // console.log('data');
                this.service = data.Next_Service__c;
                this.miles = data.Latest_Mileage__c;
                this.error = undefined;
                //console.log(data);
                this.proBar(this.miles, this.service);
                //warnning message
               this.pastDue = ((this.service-this.miles < 0)? true:false);
               console.log(this.pastDue);
               
                this.away(this.service, this.miles)
            }
        }
        proBar(x, y){
            this.build = (x/y)*100; 
            return this.build; 
        }
        away= (a,b)=>{ this.left =  a - b;} 

}