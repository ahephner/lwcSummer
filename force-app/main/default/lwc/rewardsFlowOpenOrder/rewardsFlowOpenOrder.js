import { LightningElement,api } from 'lwc';
import getOpen from '@salesforce/apex/rewardsListView.getOpen';
import { FlowNavigationNextEvent,FlowNavigationBackEvent , FlowAttributeChangeEvent } from 'lightning/flowSupport';

const columns = [
    {label:'Sales Order', fieldName:'Name'},
    {label:'Doc Date', fieldName:'Doc_Date__c', sortable: true,},
    {label:'Product Amount', fieldName:'Product_Only__c'}, 
    {label:'PO', fieldName:'Cust_PO__c'}
]

export default class RewardsFlowOpenOrder extends LightningElement {
    @api accountId; 
    @api docTotal = 0;
    @api docName = 'Open Orders ';
    startDate;
    endDate;
    data;
    error;
    columns = columns; 
    defaultSortDirection = 'desc';
    sortDirection = 'desc';
    sortedBy;

    handleStart(e){
        this.startDate = e.target.value.slice(0,10);
    }

    handleEnd(x){
        this.endDate = x.target.value.slice(0,10);
    }
//get docs
getDocs(){
    if(this.startDate === undefined|| this.endDate === undefined){
        alert('Please select 2 dates');
        return; 
    }
    getOpen({accountId:this.accountId, fDate:this.startDate, sDate:this.endDate})
        .then(res=>{
        this.data = res
        //console.log(this.data);    
})
.catch(err =>{
    this.error = err;
    console.log(this.error);
})
}

handleClick(e){
    let row = this.template.querySelector('lightning-datatable').getSelectedRows();
  
    if(row.length<1 || row === undefined){
        alert('Please select min 1 doc');
        return;
    }
    row.forEach(x =>{
        this.docName += x.Name+', ';
        this.docTotal += x.Product_Only__c
    })
    const attributeChange= new FlowAttributeChangeEvent('docName', this.docName);
    const attributeChange2 = new FlowAttributeChangeEvent('docTotal',this.docTotal)
    this.dispatchEvent(attributeChange);
    this.dispatchEvent(attributeChange2);
    this.handleNext();        
}
//move the flow forward
handleNext(){
    const nextNav = new FlowNavigationNextEvent();
    this.dispatchEvent(nextNav);
}
//sorting function of the table
    sortBy(field, reverse, primer) {
        const key = primer
            ? function (x) {
                  return primer(x[field]);
              }
            : function (x) {
                  return x[field];
              };
    
        return function (a, b) {
            a = key(a);
            b = key(b);
            return reverse * ((a > b) - (b > a));
        };
    }
    
    //sorting functions
    onHandleSort(event) {
        const { fieldName: sortedBy, sortDirection } = event.detail;
        const cloneData = [...this.data];
    
        cloneData.sort(this.sortBy(sortedBy, sortDirection === 'desc' ? 1 : -1));
        this.data = cloneData;
        this.sortDirection = sortDirection;
        this.sortedBy = sortedBy;
    }
}