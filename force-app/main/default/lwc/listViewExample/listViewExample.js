/* eslint-disable no-console */
import { LightningElement, track, wire } from 'lwc';
import Id from '@salesforce/user/Id'
import {getListUi}from 'lightning/uiListApi'
import SALES_GOAL_OBJ from '@salesforce/schema/Sales_Goal__c'; 
const columns = [
    {label: 'Sales Goal Name', field: 'Name'},
    //{label: 'Customer', field: 'Customer__c'},
    //{label: 'April 2020', field: 'Prev_Month_Rep_Forecast__c', type:'currency'},
    //{label: 'May 2019', field: 'Current_Month_Prev_Year__c', type:'currency'},
   // {label: 'Forecast', field:'Forecast_Amount__c', type:'currency', editable: true},
    //{label: 'Comment', field:'Updates__c', type:'text', editable:true }, 
]
export default class ListViewExample extends LightningElement {
    userId = Id; 
    @track columns = columns; 
    @track error; 
    @track data =[]; 
    //this is how you call a list view api. Not really built out right your supposed to call just the fields you want to return
    //because if someone changes the listview layout it changes everything here too because of the listViewId. 
    //super heavy lift too. if running console.log the return you will see everything that is brougth back. 
    //didnt find an easy way to store in an array to use like a datatable 
    @wire(getListUi, {objectApiName: SALES_GOAL_OBJ, listViewId: '00B2h000000zIC1EAM'})
            wiredList(result){
                if(result.data){
                   console.log(result.data.records.records);
                    this.data = result.data.records.records
                }else if(result.error){
                    this.error = result.error
                    console.log(this.error);
                    
                }
            }
        }