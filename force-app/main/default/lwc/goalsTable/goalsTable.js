/* eslint-disable no-console */
import { LightningElement, track, wire,api } from 'lwc';
import Id from '@salesforce/user/Id'
import getGoals from '@salesforce/apex/getGoalsController.getGoals'
import getRepId from '@salesforce/apex/getGoalsController.getRepId';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import { fireEvent } from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';

const columns = [
    //{label: 'Sales Goal Name', fieldName: 'Name'},
    {label: 'Goal', fieldName: 'nameURL', type:'url', typeAttributes: {label: {fieldName: 'Name'}}, target: '_blank'},
    {label: 'Customer', fieldName: 'Customer_Name__c'},
    {label: 'April 2020', fieldName: 'Prev_Month_Rep_Forecast__c', type:'currency'},
    {label: 'May 2019', fieldName: 'Current_Month_Prev_Year__c', type:'currency'},
    {label: 'Forecast', fieldName:'Forecast_Amount__c', type:'currency', editable: true},
    {label: 'Comment', fieldName:'Updates__c', type:'text', editable:true }, 
]
export default class GoalsTable extends LightningElement {
    userId = Id; 
    phone = Phone; 
    @track columns = columns; 
    @track error; 
    @track data =[]; 
    @track draftValues = []; 
    @api repId
    wiredGoalResult

    @wire(CurrentPageReference)pageRef; 

            
    //load goals pass current user id to class
    //map over data and set the name to contain a url to the record page
    @wire(getGoals, {userId: '$userId'})
        goalList(result){
            this.wiredGoalResult = result;
            console.log(result.data)
            if(result.data){
                let nameURL; 
                this.data = result.data.map(row=>{
                    nameURL = `/${row.Id}`;
                    return {...row, nameURL}

                }); 
                this.error = undefined;
            }else if(result.error){
                this.data = undefined;
                this.error = result.error;
            }
        } 
                //load rep id
                @wire(getRepId, {userId: '$userId'})
                loadRep({error, data}){
                    if(data){
                        this.repId = data;
                        console.log(data + '  rep');
                        
                    }else if(error){
                        alert('There is an issue please call IT')
                        console.log(error);
                        
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
    loadMore(event){

    }
    // to open modal set isModalOpen tarck value as true
    openModal() {
        fireEvent(this.pageRef, 'open', this.repId)
    }

}

        
    
  