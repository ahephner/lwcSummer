import { LightningElement, track } from 'lwc';
import Id from '@salesforce/user/Id';
import getGoals from '@salesforce/apex/getGoalsController.getGoals'; 
const columns = [
    {label: 'Sales Goal Name', field: 'Name'},
    {label: 'Customer', field: 'Customer__c'},
    //{label: 'April 2020', field: 'Prev_Month_Rep_Forecast__c', type:'currency'},
    //{label: 'May 2019', field: 'Current_Month_Prev_Year__c', type:'currency'},
    {label: 'Forecast', field:'Forecast_Amount__c', type:'currency', editable: true},
    {label: 'Comment', field:'Updates__c', type:'text', editable:true }, 
]
export default class GoalsTable extends LightningElement {
    userId = Id; 
    @track columns = columns; 
    @track data; 
    @track error; 
    
    connectedCallback(){
        console.log('userId ' +Id)
        getGoals()
        .then(result =>{
            //const x = result.json();
            console.log(this.result);
            console.log(this.result.data);
            
            
            
            
            
        }).catch(error=>{
            this.error = error;
        }).finally(()=>{
            console.log(this.data)
        });
    }
}