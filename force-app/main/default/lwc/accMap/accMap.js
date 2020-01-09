/* eslint-disable no-console */
import { LightningElement, track } from 'lwc';

export default class AccMap extends LightningElement {
    @track listView = 'visible';
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
}


