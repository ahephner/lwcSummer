import { LightningElement, track, wire, api } from 'lwc';
import { registerListener, unregisterAllListeners } from 'c/pubsub';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { CurrentPageReference } from 'lightning/navigation';
import { createRecord } from 'lightning/uiRecordApi';
import searchAccount from '@salesforce/apex/getGoalsController.searchAccount'; 

import SALES_GOAL from '@salesforce/schema/sales_goal__c'; 
import BUDGET_TYPE from '@salesforce/schema/sales_goal__c.Budget_Type__c'
import FORECAST_AMOUNT from '@salesforce/schema/sales_goal__c.Forecast_Amount__c'
import START_DATE from '@salesforce/schema/sales_goal__c.Date__c';
import END_DATE from '@salesforce/schema/sales_goal__c.End_Date__c';
import SALES_REP from '@salesforce/schema/sales_goal__c.Sales_Rep__c';
import ACCOUNT_ID from '@salesforce/schema/sales_goal__c.Customer__c'; 
import UPDATES from '@salesforce/schema/sales_goal__c.Updates__c';
export default class SalesGoalNewGoalModal extends LightningElement {
        //Boolean tracked variable to indicate if modal is open or not default value is false as modal is closed when page is loaded 
        @track isModalOpen = false;
         searchKey = ''; 
        @track prod; 
        @track none; 
        @track show; 
        @track forecast;
        @track comment; 
        @track accountId; 
        @track startDate;
        @track endDate;
        @api repId; 
        @track date; 
        //need pageRef for pub/sub
        @wire(CurrentPageReference)pageRef; 
        @track error;

        dateChange(event){
            this.date = event.detail.value; 
        }

        connectedCallback(){
            registerListener('open', this.open, this)
        }
        disconnectedCallback(){
            unregisterAllListeners(this)
        }
        //open modal
        open(){
            this.isModalOpen = true; 
            console.log('api this rep' +this.repId);
            
        }
        closeModal() {
            // to close modal set isModalOpen tarck value as false
            this.isModalOpen = false;
        }

    //send search to apex
    @wire(searchAccount, {searchKey: '$searchKey'})
    loadProd({error, data}){
        if(data){
            this.prod= data;
            this.error = undefined;
            
            this.showWhat(this.prod.length);
            
        }else if (error){
            this.error = error;
            this.data = undefined;
            console.log(this.error);
            
        }

    }
        showWhat(x){
            if(x> 0){
                this.show = true; 
            }
        }
        //search for account
        search(event){
            window.clearTimeout(this.delayTimeout);
            const searchKey = event.target.value; 
            // eslint-disable-next-line @lwc/lwc/no-async-operation
            this.delayTimeout = setTimeout(() =>{
                this.searchKey = searchKey;
                
            }, 400);
            
            
        }

        newForecast(event){
            this.forecast = event.detail.value; 
        }

        newComment(e){
            this.comment = e.detail.value; 
               console.log(e.detail.value)
               
           }

        handleAccountSelect(event){
            console.log('selected '+ event.target.prods.Name)
            this.accountId = event.target.prods.Id; 
            this.searchKey = event.target.prods.Name; 
            this.show = false;
        }

        save() {
            //set dates
            const date = new Date(); 
            const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
            const lastDay = new Date(date.getFullYear(), date.getMonth()+1, 0)
            this.startDate = firstDay.toLocaleDateString();
            this.endDate = lastDay.toLocaleDateString();
            //set field values for new goal
            const fields = {};
            fields[BUDGET_TYPE.fieldApiName] = 'Monthly Sales';
            fields[FORECAST_AMOUNT.fieldApiName] = this.forecast;
            fields[START_DATE.fieldApiName] =  this.date;    
           // fields[END_DATE.fieldApiName] = '2020-06-08' //this.endDate
            fields[SALES_REP.fieldApiName] = 'a002h000000wF99AAE' //this.repId; 
            fields[UPDATES.fieldApiName] = this.comment;
            fields[ACCOUNT_ID.fieldApiName] = this.accountId;
            console.log(fields);
            
            const recordInput = { apiName: SALES_GOAL.objectApiName, fields }; 
            //create record close modal or show error
            createRecord(recordInput)
            .then(goal => {
                this.isModalOpen = false;
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Account created',
                        variant: 'success',
                    }),
                );
            }).catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error creating record',
                        message: error.body.message,
                        variant: 'error',
                    }),
                );
            });
            
        }
}