/* eslint-disable no-console */
import { LightningElement, track, wire } from 'lwc';
import Id from '@salesforce/user/Id';
import getMonthlyGoals from '@salesforce/apex/managerGoal.getMonthlyGoals'

//without type on #cols nothing is 
const columns = [
    {label: 'Month', fieldName: 'Month_Name__c', cellAttributes: { alignment: 'center' }},
    {label: 'Manager Goal', fieldName: 'Total_Budget_Amount__c', type:'currency', cellAttributes: { alignment: 'center' }}, 
    {label: 'Actuals*', fieldName: 'Progress_Amount__c', type:'currency', cellAttributes: { alignment: 'center' }},
]; 
export default class MyMonthlyBudgets extends LightningElement {
    @track error
    @track data
    @track columns = columns;
    userId = Id;
    link = 'https://advancedturf.lightning.force.com/lightning/r/Report/00O2M000009JmKoUAK/view?queryScope=userFolders'
    title = 'My Monthly Budget History'
   
    @wire(getMonthlyGoals, {userId: '$userId'})
    wiredMethod({error,data}){
        if(error){
            this.error = error;
            // eslint-disable-next-line no-console
            console.log(this.error);
            

            this.goal = undefined;
        }else if(data){
            this.data = data
            console.log(this.data)
            this.error= undefined;
        }
    }

}