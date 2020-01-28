/* eslint-disable no-console */
import { LightningElement, track, wire } from 'lwc';
import Id from '@salesforce/user/Id';
//import {  getFieldValue } from 'lightning/uiRecordApi';
import getMyAccounts from '@salesforce/apex/mapAccounts.getMyAccounts'

import BillingCity from '@salesforce/schema/Account.BillingCity';
import BillingState from '@salesforce/schema/Account.BillingState';
import BillingPostalCode from '@salesforce/schema/Account.BillingPostalCode';
import BillingStreet from '@salesforce/schema/Account.BillingStreet';
//import { getFieldValue } from 'lightning/uiRecordApi';
const fields = [BillingCity, BillingState, BillingPostalCode, BillingStreet]
export default class AccMap extends LightningElement {
    @track listView = 'visible';
    @track mapMarkers; 
    @track center 
    @track test
    @track error; 
    userId = Id; 
    mapMarkers = [];

    center = {
        location: {
            City: 'Fishers',
        },
    };

    zoomLevel = 4;
    markersTitle = 'accounts';
    showFooter = true;


    noList(){
        this.listView = 'hidden'
        console.log('click');
        console.log(this.listView);   
    }
    @wire(getMyAccounts, {userId: '$userId', fields})
     wiredMethod({error, data}){
         if(error){
             this.error = error; 
             console.log(this.error)
         }else if(data){
            data.forEach(item =>{
                this.mapMarkers = [...this.mapMarkers,
                {
                    location: {
                        Street: item.BillingStreet, 
                        City: item.BillingCity,
                        State: item.BillingState,
                        Zip: item.BillingPostalCode,
                        Country: 'USA'
                    }, 
                    icon: 'custom:custom26', 
                    title: item.Name,
                }]
            });
            console.log(this.mapMarkers)
            this.error= undefined;
         }
     }
}


