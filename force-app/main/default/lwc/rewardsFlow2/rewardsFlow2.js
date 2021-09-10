import { LightningElement,api } from 'lwc';
import { FlowNavigationNextEvent,FlowAttributeChangeEvent } from 'lightning/flowSupport';
import getDocTable from '@salesforce/apex/rewardsListView.getDocTable';

const columns = [
    {label:'Sales Order', fieldName:'Name'},
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

    handleStart(e){
        this.startDate = e.target.value.slice(0,10);
        console.log('start '+this.startDate);
    }

    handleEnd(x){
        this.endDate = x.target.value.slice(0,10);
        console.log('end '+this.endDate);  
    }

    getDocs(){
        getDocTable({accountId:this.accountId, fDate:this.startDate, sDate:this.endDate})
            .then(res=>{
            this.data = res
            console.log(this.data);
            
    })
    .catch(err =>{
        this.error = err;
        console.log(this.error);
    })
}
}