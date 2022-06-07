//name, product name, product code, original order, returned amount
import { LightningElement, api, track, wire } from 'lwc';
import getDetails from  '@salesforce/apex/getReturnDetails.getDets';

const columns = [
    {label:'Return Request Detail Name', 'fieldName':'urlName', type:'url', typeAttributes:{label:{fieldName:'Name'}},target:'_blank' },
    {label:'Product Name', 'fieldName':'Product_Name__c', type:'text',  cellAttributes:{alignment: 'left'}, "initialWidth": 450  },
    {label:'Product Code', 'fieldName':'Product_Code__c', type:'text', cellAttributes:{alignment: 'center'} },    
    {label:'Original Order Quantity', 'fieldName':'Original_Order_Quantity__c', type:'number', cellAttributes:{alignment: 'center'}  },
    {label:'Return Quantity', 'fieldName':'Return_Quantity__c', type:'number',   cellAttributes:{alignment: 'center'} }
    
]

export default class ReturnRequestTable extends LightningElement {
    @api recordId;
    isLoading = true;
    @api prop1; 
    columns = columns; 
    @track items; 
    requestItems
    isReturnRequest

    @wire(getDetails, {recordId: '$recordId'})
    wiredResult(result){
    this.requestItems = result;
    if(result.data){
        let urlName;
        this.items = result.data.map(row =>{
            urlName = `/${row.Id}`;
            return {...row, urlName}   
        })
        this.isReturnRequest = this.items.length > 1 ? true : false 
        this.isLoading = false; 
    }else if(result.error){
        console.log(result.error)
    }
    }

}