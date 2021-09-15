import { LightningElement,api } from 'lwc';
import { FlowNavigationNextEvent,FlowNavigationBackEvent , FlowAttributeChangeEvent } from 'lightning/flowSupport';
import getDocTable from '@salesforce/apex/rewardsListView.getDocTable';

// const columns = [
//     {label:'Sales Order', fieldName:'Name', initialWidth:120},
//     {label:'Doc Date', fieldName:'Doc_Date__c', initialWidth:120},
//     {label:'Product Amount', fieldName:'Product_Sub_Total__c', initialWidth:120}, 
//     {label:'PO', fieldName:'Cust_PO_Num__c', initialWidth:150}
// ]

const columns = [
        {label:'Sales Order', fieldName:'Name'},
        {label:'Doc Date', fieldName:'Doc_Date__c', sortable: true,},
        {label:'Product Amount', fieldName:'Product_Sub_Total__c'}, 
        {label:'PO', fieldName:'Cust_PO_Num__c'}
    ]
export default class RewardsFlow2 extends LightningElement {
    @api accountId; 
    @api docTotal = 0;
    @api docName = '';
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
       // console.log('start '+this.startDate);
    }

    handleEnd(x){
        this.endDate = x.target.value.slice(0,10);
        //console.log('end '+this.endDate);  
    }
    handleClick(e){
        let row = this.template.querySelector('lightning-datatable').getSelectedRows();
       console.log(row);
        if(row.length<1 || row === undefined){
            alert('Please select min 1 doc');
            return;
        }
        row.forEach(x =>{
            this.docName += x.Name+', ';
            this.docTotal += x.Product_Sub_Total__c
        })
        const attributeChange= new FlowAttributeChangeEvent('docName', this.docName);
        const attributeChange2 = new FlowAttributeChangeEvent('docTotal',this.docTotal)
        this.dispatchEvent(attributeChange);
        this.dispatchEvent(attributeChange2);
        this.handleNext();        
    }
    handleNext(){
        const nextNav = new FlowNavigationNextEvent();
        this.dispatchEvent(nextNav);
    }
    handleBack(){
        const backNav = new FlowNavigationBackEvent();
        this.dispatchEvent(backNav);
    }
    getDocs(){
        getDocTable({accountId:this.accountId, fDate:this.startDate, sDate:this.endDate})
            .then(res=>{
            this.data = res
            //console.log(this.data);    
    })
    .catch(err =>{
        this.error = err;
        console.log(this.error);
    })
 }
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