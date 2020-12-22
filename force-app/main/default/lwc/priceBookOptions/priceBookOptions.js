import { LightningElement, api,wire } from 'lwc';
import getBooks from '@salesforce/apex/PriceBookInfo.getBooks';
import addEntry from '@salesforce/apex/PriceBookInfo.addEntry';

const actions =[
    {label: 'Add', name:'add'}
]
const columns = [
    {label: 'Available Books', fieldName: 'Name'},
    {
        type: 'action',
        typeAttributes: { rowActions: actions },
    },
]

export default class PriceBookOptions extends LightningElement {
    @api productNum; 
    @api recordId
    books; 
    inBooks; 
    columns = columns; 
  
    @wire(getBooks, {code: '$productNum'})
    wiredBooks({error, data}){
        if(data){
            this.books = data;
            this.error = undefined
        }else{
            this.error = error;
            this.books = undefined;
            
        }
    }

    handleRowAction(event) {
        console.log(this.recordId, 1)
        const actionName = event.detail.action.name;
        const row = event.detail.row.Id;
        console.log('handleRow '+ event.detail.row.Id)
        switch (actionName) {
            case 'add':
                this.add(row, this.recordId);
                break;;
            default:
        }
    }

    add(row){
        let bookId = row; 
        addEntry({bookId: bookId, recordId:this.recordId, productCode: this.productNum})
        .then(result => {
            console.log(result); 
        })
        .catch(error => {
            this.error = error;
        });
    }
   

}