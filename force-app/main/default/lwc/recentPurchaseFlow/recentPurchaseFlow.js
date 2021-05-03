import { LightningElement,api, track } from 'lwc';

const columns = [
    //{label:'Doc', fieldName:'Sales_Document__c', type:'url', typeAttributes: {label: {fieldName: 'Name'}}, target: '_blank'},
    {label:'Date', fieldName:'Doc_Date__c', type:'date'},
    {label:'QTY', fieldName:'Qty__c', type:'number',cellAttributes: { alignment: 'center' },},
    {label: 'Unit Price', fieldName:'Unit_Price__c', type:'currency', cellAttributes: { alignment: 'center' },}
]
export default class RecentPurchaseFlow extends LightningElement {
    @api prodName
    found= false;
    @track data; 
    columns = columns;
    //defaultSortDirection = 'asc';

    @api
    get docs(){
        return this.data; 
    }
    set docs(value){
        this.data = [...value]
    }
connectedCallback(){
    if(this.data.length> 0 || this.data === undefined){
        this.found = true; 
        this.sort(this.data)    
    }
    console.log('foudn '+this.found);
    
}
    sort(list){
        //sort the data and only keep top 5 transactions
        let sorted = list.sort((a, b)=> a.Doc_Date__c - b.Doc_Date__c);
        sorted = sorted.splice(0,5)    
    
//here will manipulate the data to display to the user
        // this.data = sorted.map(i=>{
        //                 console.log(i.Qty) i.Doc_Date__c})
        // console.log('docs ' +this.docs);
        this.data = sorted; 
         
    }
}