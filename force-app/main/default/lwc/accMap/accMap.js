/* eslint-disable no-console */
import { LightningElement, track, wire } from 'lwc';
import Id from '@salesforce/user/Id';
//import {  getFieldValue } from 'lightning/uiRecordApi';
import getMyAccounts from '@salesforce/apex/mapAccounts.getMyAccounts'

import BillingCity from '@salesforce/schema/Account.BillingCity';
import BillingState from '@salesforce/schema/Account.BillingState';
import BillingPostalCode from '@salesforce/schema/Account.BillingPostalCode';
import BillingStreet from '@salesforce/schema/Account.BillingStreet';
import { getFieldValue } from 'lightning/uiRecordApi';
const fields = [BillingCity, BillingState, BillingPostalCode, BillingStreet]
export default class AccMap extends LightningElement {
    @track listView = 'visible';
    @track mapMarkers; 
    @track center 
    @track test
    userId = Id; 
    mapMarkers = [{
            location: {
                Street: '12955 Ford Dr',
                City: 'Fishers',
                PostalCode: '46038',
                State: 'IN',
                Country: 'USA',
            },

            icon: 'utility:salesforce1',
            title: 'ATS Home',
            description: 'description',
        },
        
    ];

    center = {
        location: {
            City: 'Fishers',
        },
    };

    zoomLevel = 4;
    markersTitle = 'Salesforce locations in United States';
    showFooter = true;


    noList(){
        this.listView = 'hidden'
        console.log('click');
        console.log(this.listView);   
    }
    @wire(getMyAccounts, {userId: '$userId', fields})
     wiredMethod({error, data}){
         if(error){
             this.error = error
             console.log(this.error);
             
             this.data = undefined;
         }else if(data){
             this.error = undefined;
            data.forEach(x => console.log(x.BillingStreet)
            )             
             this.test = [{
                location: {
                    Street: getFieldValue(data, BillingStreet),
                    City:  getFieldValue(data, BillingCity),
                    PostalCode:  getFieldValue(data, BillingPostalCode),
                    State:  getFieldValue(data, BillingState),
                    Country: 'USA',
                },
                
                icon: 'utility:salesforce1',
                title: data.Name,
                description: 'description',
            },
        ];console.log('mapmarkers '+ this.mapMarkers);
        console.log(this.test);
        
    
        this.center = {
            location: {
                City: 'Fishers',
            },
        };
             
         }
     }
}


