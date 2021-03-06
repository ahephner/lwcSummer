import { LightningElement, track, wire } from 'lwc';
import { registerListener, unregisterAllListeners, fireEvent } from 'c/pubsub';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { CurrentPageReference } from 'lightning/navigation';
import { createRecord } from 'lightning/uiRecordApi';
import searchAccount from '@salesforce/apex/getGoalsController.searchAccount'; 
import { NavigationMixin } from 'lightning/navigation';

import SALES_GOAL from '@salesforce/schema/sales_goal__c'; 
import BUDGET_TYPE from '@salesforce/schema/sales_goal__c.Budget_Type__c'
import FORECAST_AMOUNT from '@salesforce/schema/sales_goal__c.Forecast_Amount__c'
import START_DATE from '@salesforce/schema/sales_goal__c.Date__c';
import END_DATE from '@salesforce/schema/sales_goal__c.End_Date__c';
import SALES_REP from '@salesforce/schema/sales_goal__c.Sales_Rep__c';
import ACCOUNT_ID from '@salesforce/schema/sales_goal__c.Customer__c'; 
import UPDATES from '@salesforce/schema/sales_goal__c.Updates__c';
export default class SalesGoalNewGoalModal extends NavigationMixin(LightningElement) {
        //Boolean tracked variable to indicate if modal is open or not default value is false as modal is closed when page is loaded 
        @track isModalOpen = false;
         searchKey = ''; 
        @track prod; 
        @track setAccount = false; 
        @track show; 
        @track noResult;
        forecast = '';
        comment = ''; 
        @track accountId; 
        @track startDate;
        @track endDate;
        @track repId; 
        @track showSpinner = false; 
         
        //need pageRef for pub/sub
        @wire(CurrentPageReference)pageRef; 
        @track error;
        leadId = '0122h0000001yGFAAY'; 
//may need to reroute the call backs will embed this into the main table soon 
        connectedCallback(){
            registerListener('open', this.open, this)
        }
        disconnectedCallback(){
            unregisterAllListeners(this)
        }
        //open modal and set repId. repId is passed on the call from goaltable
        open(x){
            this.isModalOpen = true; 
            if(this.repId ===undefined){
                this.repId = x; 
            }
        }
        closeModal() {
            // to close modal set isModalOpen tarck value as false
            this.isModalOpen = false;
            this.searchKey = '';
            this.show= false; 
            this.noResult = false;
        }

        //summer 20 new release to track field values don't need @track anymore
        //use the field name to grab which field set value this way
        handleChange(e){
            const field = e.target.name;
            if(field === 'forecast'){
                this.forecast = e.target.value;
                console.log('new forecast '+this.forecast);
                
            } else if(field === 'comment'){
                this.comment = e.target.value; 
            }
        }

    //send search to apex
    //working on getting the nothing returned now mostly need to fix html so the if true makes sense
    //think wrapping entire output template in another template would stop from starting with nothing shown
    @wire(searchAccount, {searchKey: '$searchKey'})
    loadProd({error, data}){        
        if(data && this.setAccount === false){
            this.prod= data;
            this.error = undefined;
            this.showWhat(this.prod.length);
            
        }
        else if (error){
            this.error = error;
            this.data = undefined;
            console.log(this.error);
            
        }

    }
    //this takes the lenght of data and if its more that one show the list otherwise show link for lead
        showWhat(x){
            if(x> 0){
                console.log('here is x ' + x);
                this.noResult = false; 
                this.show = true; 
            }else if(x <=0){
                console.log('x '+x);
                this.noResult = true; 
                this.show = false; 
                
            }
        }
        //search for account
        //if the search is empty then show nothing
        search(event){
            this.setAccount = false; 
            window.clearTimeout(this.delayTimeout);
            const searchKey = event.target.value; 
             if(searchKey ===''){
                 this.noResult = false;
                 this.show = false; 
             }else{
            // eslint-disable-next-line @lwc/lwc/no-async-operation
            this.delayTimeout = setTimeout(() =>{
                this.searchKey = searchKey;
                    
            }, 400);
            
         }  
        }

        handleAccountSelect(event){
            console.log('selected '+ event.target.prods.Name)
            this.accountId = event.target.prods.Id; 
            this.searchKey = event.target.prods.Name; 
            this.show = false;
            this.noResult = false; 
            this.setAccount = true; 
            
        }

        createLead(){
            console.log('leadID '+ this.leadId);
            
            this[NavigationMixin.Navigate]({
                type: 'standard__objectPage',
                attributes: {
                    objectApiName: 'Account', 
                    actionName: 'new'
                },
                state:{
                    recordTypeId: this.leadId
                }
            }); 
        }

        save() {
            this.showSpinner = true; 
            //set dates
            //6/8/2020 date not working correctly need to have 2020-06-08
            //this is producing 06/01/2020 sf not flexiable
            const date = new Date(); 
            this.startDate = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().slice(0,10);
            this.endDate = new Date(date.getFullYear(), date.getMonth()+1, 0).toISOString().slice(0,10);
            //set field values for new goal
            const fields = {};
            fields[BUDGET_TYPE.fieldApiName] = 'Monthly Sales';
            fields[FORECAST_AMOUNT.fieldApiName] = this.forecast;
            fields[START_DATE.fieldApiName] =  this.startDate;    
            fields[END_DATE.fieldApiName] = this.endDate
           //hardedcoded ID need to get rep id. I think I am going to try and embed this component in the table component since I can get id using
           //the wire there with a user id already. Will need to rerout the dispatch events. Will create record when hardcoded values are passed
            fields[SALES_REP.fieldApiName] = this.repId; 
            fields[UPDATES.fieldApiName] = this.comment;
            fields[ACCOUNT_ID.fieldApiName] = this.accountId;
            console.log(fields);
            
            const recordInput = { apiName: SALES_GOAL.objectApiName, fields }; 
            //create record close modal or show error
            createRecord(recordInput)
            .then(goal => {
                //send to goal table
                fireEvent(this.pageRef, 'updateTable', goal.id)
                
                this.showSpinner = false; 
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
                this.showSpinner = false;
                this.isModalOpen = false; 
            });
            
        }
}
