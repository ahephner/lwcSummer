/* eslint-disable no-console */
import { LightningElement, track, wire,api } from 'lwc';
import Id from '@salesforce/user/Id'
import getGoals from '@salesforce/apex/getGoalsController.getGoals'
import getRepId from '@salesforce/apex/getGoalsController.getRepId';
import { updateRecord, getRecord, deleteRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import { fireEvent, registerListener, unregisterAllListeners } from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';
import { NavigationMixin } from 'lightning/navigation';

import GOAL_NAME from '@salesforce/schema/Sales_Goal__c.Name';
import GOAL_FORECAST from '@salesforce/schema/Sales_Goal__c.Forecast_Amount__c';
import GOAL_COMMENT from '@salesforce/schema/Sales_Goal__c.Updates__c'; 

const actions = [
    {label:'Edit', name:'edit'},
    {label:'Delete', name:'delete'}
]
const columns = [
    //{label: 'Sales Goal Name', fieldName: 'Name'},
    {label: 'Goal', fieldName: 'nameURL', type:'url', typeAttributes: {label: {fieldName: 'Name'}}, target: '_blank'},
    {label: 'Customer', fieldName: 'Customer_Name__c', sortable:true},
    {label: 'April 2020', fieldName: 'Prev_Month_Rep_Forecast__c', type:'currency', cellAttributes: { alignment: 'center' },},
    {label: 'May 2019', fieldName: 'Current_Month_Prev_Year__c', type:'currency', cellAttributes: { alignment: 'center' },},
    {label: 'Forecast', fieldName:'Forecast_Amount__c', type:'currency', editable: true, cellAttributes: { alignment: 'center' },},
    {label: 'Comment', fieldName:'Updates__c', type:'text', editable:true }, 
    {type:'action', typeAttributes:{rowActions: actions}}
]
const GOAL_FIELDS = [GOAL_NAME, GOAL_FORECAST, GOAL_COMMENT]; 
export default class GoalsTable extends NavigationMixin(LightningElement) {
    userId = Id;  
    @track columns = columns; 
    @track error; 
    @track data =[]; 
    @track draftValues = []; 
    @track spin; 
    @api repId
    wiredGoalResult
    newGoalId
    wiredNewGoal
    //sorting
    defaultSortDirection = 'asc'; 
    sortDirection = 'asc';
    sortedBy; 

    @wire(CurrentPageReference)pageRef; 

    connectedCallback(){
        registerListener('updateTable', this.refresh, this)
    }
            
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
        this.spin = true; 
        
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
        })
        .then(()=>{
            console.log('second .then()');
            
            fireEvent(this.pageRef, 'update', this)
        })
        .catch(error => {
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
        this.spin = false; 

               
    }
 

    //Need to make sure apex is pointed toward rep not you
    //is used for getting the most recent goals 
    // @wire(getRecord, {recordId: '$newGoalId'})
    //     appendGoal(result){
    //         this.wiredNewGoal = result;
    //         if(result.data){
    //             console.log('result '+ result.data.Updates__c);
    //             console.log('wiredNewGoal '+ this.wiredNewGoal);
    //    this.data.unshift({
    //        Id:'1234',
    //        Name: 'Unshift Goal',
    //        Customer_Name__c: 'Aj unshift',
    //        Forecast_Amount: 0,
    //        Updates: '',

    // })
                
    //         }else if(result.error){
    //             this.data = undefined;
    //             this.error = result.error;
    //         }
    //     }
    refresh(){
      // fireEvent(this.pageRef, 'update', this);
    // this.newGoalId = x;
    return refreshApex(this.wiredGoalResult);
    
    }
    //wire a get record method pass the above var in
    //need to get fields in the return unshift and spread ... value to data

    // to open modal set isModalOpen tarck value as true
    openModal() {
        fireEvent(this.pageRef, 'open', this.repId)
    }
    //row actions like delete
    handleRowAction(event){
        const actionName = event.detail.action.name;;
        const row = event.detail.row.Id;
        console.log(actionName);
        console.log(row);
        
        switch(actionName){
            case 'delete':{
                console.log('delete');
                
                let cf = confirm('Do you want to delete this goal')
                if(cf === true){
                    deleteRecord(row)
                        .then(()=>{
                            this.dispatchEvent(
                                new ShowToastEvent({
                                    title: 'Success',
                                    message: 'Goal Deleted',
                                    variant: 'success'
                                })
                            )
                            return refreshApex(this.goalList)
                        }).catch(error=>{
                            this.dispatchEvent(
                                new ShowToastEvent({
                                    title: 'Error Deleting Record',
                                    message: error.body.message,
                                    variant: 'error'
                                })
                            )
                        })
                }              
        }
        break; 
        case 'edit': 
        this[NavigationMixin.Navigate]({
            type:'standard__objectPage',
            attributes:{
                objectApiName: 'Sales_Goal__c',
                recordId: row, 
                actionName: 'view'
            }
        })
    }  
    }
    //sort table
    sortBy(field, reverse, primer) {
        const key = primer
            ? function(x) {
                  return primer(x[field]);
              }
            : function(x) {
                  return x[field];
              };

        return function(a, b) {
            a = key(a);
            b = key(b);
            return reverse * ((a > b) - (b > a));
        };
    }

    onHandleSort(event) {
        const { fieldName: sortedBy, sortDirection } = event.detail;
        const cloneData = [...this.data];

        cloneData.sort(this.sortBy(sortedBy, sortDirection === 'asc' ? 1 : -1));
        this.data = cloneData;
        this.sortDirection = sortDirection;
        this.sortedBy = sortedBy;
    }

}

        
    
  