import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';

import NAME_FIELD from '@salesforce/schema/Product__c.Name';

export default class PriceBookParent extends LightningElement {
    @api recordId;
    productNum; 

    @wire(getRecord, {recordId: '$recordId', fields: [NAME_FIELD]})
    record; 

    get name(){
        return this.record.data ? getFieldValue(this.record.data, NAME_FIELD) : '';
    }
}