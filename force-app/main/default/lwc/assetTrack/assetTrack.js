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
     id = this.recordId;
    // connectedCallback(){
    //     console.log(this.recordId + ' id')
    //     this.id = this.recordId;

    // }
    @wire(getAsset, {recordId: '$id'})
        wiredMethod({error, data}){
            console.log('running js');
            console.log(this.id)
            if(error){
                console.log('error?');
                
                this.error = error; 
                this.build = undefined;
            }else if(data){
                console.log('data');
                
                this.build = data;
                this.error = undefined;
                console.log(this.build);
                
            }
        }
}