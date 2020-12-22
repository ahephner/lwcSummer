import { LightningElement, api, wire } from 'lwc';
import getInBooks from '@salesforce/apex/PriceBookInfo.getInBooks';

const columns = [
    {label: 'Found In', fieldName: 'Name'}
]

export default class PriceBookAlreadyIn extends LightningElement {
    @api productNum; 
    inBooks;
    error;
    none
    columns = columns;  
    @wire(getInBooks, {code: '$productNum'})
        wiredInBooks({error, data}){
            
            if(error){
                    this.error = 'Unknown error';
                    if (Array.isArray(error.body)) {
                        this.error = error.body.map(e => e.message).join(', ');
                    } else if (typeof error.body.message === 'string') {
                        this.error = error.body.message;
                    }
            }else if(data){
                this.inBooks = data;
                this.error = undefined;
                
            }
        }

  
}