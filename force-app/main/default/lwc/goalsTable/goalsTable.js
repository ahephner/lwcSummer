/* eslint-disable no-console */
import { LightningElement, track, wire } from 'lwc';
import Id from '@salesforce/user/Id'
import getGoals from '@salesforce/apex/getGoalsController.getGoals'
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import ID_FIELD from '@salesforce/schema/Sales_Goal__c.Id';
import Updates_FIELD from '@salesforce/schema/Sales_Goal__c.Updates__c'; 
import Forecast_FIELD from '@salesforce/schema/Sales_Goal__c.Forecast_Amount__c'
const columns = [
    {label: 'Sales Goal Name', fieldName: 'Name'},
    {label: 'Customer', fieldName: 'Customer_Name__c'},
    {label: 'April 2020', fieldName: 'Prev_Month_Rep_Forecast__c', type:'currency'},
    {label: 'May 2019', fieldName: 'Current_Month_Prev_Year__c', type:'currency'},
    {label: 'Forecast', fieldName:'Forecast_Amount__c', type:'currency', editable: true},
    {label: 'Comment', fieldName:'Updates__c', type:'text', editable:true }, 
]
export default class GoalsTable extends LightningElement {
    userId = Id; 
    @track columns = columns; 
    @track error; 
    @track data =[]; 
    @track draftValues = []; 
    connectedCallback(){
       console.log('callBack '+this.userId);
       getGoals({userId: this.userId})
        .then(r => {
            
            this.data = r;
        })
       
    }

    handleSave(event){
        const recordInputs =  event.detail.draftValues.slice().map(draft => {
            const fields = Object.assign({}, draft);
            return { fields };
        });
    console.log(event.detail.draftValues);
    
        const promises = recordInputs.map(recordInput => updateRecord(recordInput));
        Promise.all(promises).then(goals => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Goals updated',
                    variant: 'success'
                })
            );
             // Clear all draft values
             this.draftValues = [];
    
             // Display fresh data in the datatable
            return refreshApex(this.getGoals);
        }).catch(error => {
            // Handle error
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error saving record',
                    message: 'error',
                    variant: 'error'
                })
            )
        });
        
        // updateRecord(recordInput)
        // .then(() => {
        //     this.dispatchEvent(
        //         new ShowToastEvent({
        //             title: 'Success',
        //             message: 'Contact updated',
        //             variant: 'success'
        //         })
        //     );
        //     // Clear all draft values
        //     this.draftValues = [];

        //     // Display fresh data in the datatable
        //    // return refreshApex(this.getGoals({userId: this.userId}));
        // }).catch(error => {
        //     this.dispatchEvent(
        //         new ShowToastEvent({
        //             title: 'Error creating record',
        //             message: error.body.message,
        //             variant: 'error'
        //         })
        //     );
        // });

        
    }
    // @wire(getGoals)
    // wiredGoals({error, data}){
    //     if(data){
    //         console.log(data);
            
    //         this.data = data;
    //     }else if(error){
    //         this.error= error; 
    //     }
    // }

    //Need to make sure apex is pointed toward rep not you
    click(){
        console.log('userId '+ this.userId + ' '+ Id);
    }
    // getGoals({userId: this.userId})
    //     .then(r => {
            
    //         this.data = r;
    //     })
    // }

}

        
    
  
