/* eslint-disable no-console */
import { LightningElement, track, wire } from 'lwc';
import Id from '@salesforce/user/Id'
import getGoals from '@salesforce/apex/getGoalsController.getGoals'
const columns = [
    {label: 'Sales Goal Name', fieldName: 'Name'},
    {label: 'Customer', fieldName: 'Customer__c'},
    {label: 'April 2020', field: 'Prev_Month_Rep_Forecast__c', type:'currency'},
    {label: 'May 2019', field: 'Current_Month_Prev_Year__c', type:'currency'},
    {label: 'Forecast', fieldName:'Forecast_Amount__c', type:'currency', editable: true},
    {label: 'Comment', fieldName:'Updates__c', type:'text', editable:true }, 
]
export default class GoalsTable extends LightningElement {
    userId = Id; 
    @track columns = columns; 
    @track error; 
    @track data =[]; 
    connectedCallback(){
       console.log('callBack');
       
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
        
    getGoals({userId: this.userId})
        .then(r => {
            console.log(r);
            
            this.data = r;
        })
    }
}

        
    
  
