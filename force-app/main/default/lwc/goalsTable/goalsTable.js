/* eslint-disable no-console */
import { LightningElement, track, wire } from 'lwc';
import Id from '@salesforce/user/Id'
import getGoals from '@salesforce/apex/getGoalsController.getGoals'
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import { fireEvent } from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';

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
    wiredGoalResult

    @wire(CurrentPageReference)pageRef; 
    //load goals pass current user id to class
    @wire(getGoals, {userId: '$userId'})
        goalList(result){
            this.wiredGoalResult = result;
            console.log(result.data)
            if(result.data){
                this.data = result.data; 
                this.error = undefined;
            }else if(result.error){
                this.data = undefined;
                this.error = result.error;
            }
        } 

    handleSave(event){
        const recordInputs =  event.detail.draftValues.slice().map(draft => {
            const fields = Object.assign({}, draft);
            return { fields };
        });
   
    
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
            return refreshApex(this.wiredGoalResult);
        }).catch(error => {
            console.log(error);
            
            // Handle error
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error saving record',
                    message: 'error',
                    variant: 'error'
                })
            )
        });       
    }
 

    //Need to make sure apex is pointed toward rep not you
    refresh(){
       fireEvent(this.pageRef, 'update', this);
       console.log('updating...');
       
    }
    // getGoals({userId: this.userId})
    //     .then(r => {
            
    //         this.data = r;
    //     })
    // }

}

        
    
  
