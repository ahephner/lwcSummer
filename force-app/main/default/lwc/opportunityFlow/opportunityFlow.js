/* eslint-disable no-console */
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
    look(search){
        this.copy = this.ops; 
        this.query = search.detail.value.toLowerCase(); 
        this.copy = this.copy.filter(x=> x.Name.toLowerCase().includes(this.query));
        
    }
//adds the targets to be shared with the flow
//if there selected ops Id is already in the array then dump
 //wont work on browser IE <11 because of .find()S   
    handleClick(e){
        console.log(e.currentTarget.name);
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

