/* eslint-disable no-console */
//https://salesforce.stackexchange.com/questions/264976/re-evaulating-selected-rows-in-lightning-datatable-when-data-changed
import { LightningElement,api, track } from 'lwc';
//import { FlowNavigationNextEvent, FlowNavigationBackEvent, FlowAttributeChangeEvent} from 'lightning/flowSupport';

export default class OpportunityFlow extends LightningElement {
    @api recordId; 
    @api selectedOps =[];
    @api selectedOpsString
    @api ops =[]; 
    @track query; 
    @track copy; 
    
    connectedCallback(){
        this.copy = this.ops; 
        // this.copy.forEach(element => {
        //     console.log(element);
            
        // });
        
    }
    //not hooked up right now. It's overwritting the table and not saving the check value
    //to start make sure the html is uncommented. 
    //playground link is https://developer.salesforce.com/docs/component-library/tools/playground/44Ya9dqV7/5/edit
    look(search){
        this.copy = this.ops; 
        this.query = search.detail.value.toLowerCase(); 
        this.copy = this.copy.filter(x=> x.Name.toLowerCase().includes(this.query));
        
    }
    selectAll(){
        let i; 
        let checkboxes = this.template.querySelectorAll('[data-id="checkbox"]')
        for(i=0; i<checkboxes.length; i++) {
            checkboxes[i].checked = e.currentTarget.checked;
        }
    }
//adds the targets to be shared with the flow
//if there selected ops Id is already in the array then dump
 //wont work on browser IE <11 because of .find()S   
    handleClick(e){
        console.log('target name '+e.target.name)
        let boxList = this.template.querySelectorAll('.btn')
        console.log('boxList '+boxList.length);
        
        //see if the value is already in the array
        let add = this.selectedOps.find(x => x.Id === e.currentTarget.name);
        console.log(add, 1);
        if(add === undefined){
            let opp = this.copy.find(x => x.Id === e.currentTarget.name)
            this.selectedOps.push(opp)
            
        }else if(add != undefined){
            //find index then splice
            let remove = this.selectedOps.findIndex(el => el.Id === e.currentTarget.name)
            this.selectedOps.splice(remove,1)
        }
        //turn array to string 
            this.selectedOpsString = JSON.stringify(this.selectedOps); 



    }
}

