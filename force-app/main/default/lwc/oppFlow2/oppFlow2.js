import { LightningElement,api, track, wire } from 'lwc';
import getOps from '@salesforce/apex/quipMultiQuote.getOps'; 
import { FlowNavigationNextEvent} from 'lightning/flowSupport';

export default class OppFlow2 extends LightningElement {
    @track selectedOps = []; 
    @api ops = []; 
    multiName; 
    connectedCallback(){
        this.copy = this.ops;
        // this.copy.forEach(element => {
        //     console.log(element);    
        // });

    }
    @api
    get qName(){
        return this.multiName;
    }
    set qName(x){
        console.log('x '+x);
        
        this.multiName = x || 'not given';
    }
        //next page
        handleNext(){
            let ops = JSON.stringify(this.selectedOps)
            console.log('in next '+ this.multiName);
            
            getOps({ops: ops, quoteName: this.multiName})
            const nextNav = new FlowNavigationNextEvent();
            this.dispatchEvent(nextNav);
        }
    //adds the targets to be shared with the flow
//if there selected ops Id is already in the array then dump
 //wont work on browser IE <11 because of .find()S
 //commented out are from when we were pushing multiple lines from the opp to the flow. 
 //Now we are just taking the id and sending it to apex. Apex sets the multi_quote__c true then the quip doc report will run off that field.   
    handleClick(e){
        console.log('target name '+e.target.name)
        let boxList = this.template.querySelectorAll('.btn')
        console.log('boxList '+boxList.length);
        
        //see if the value is already in the array
        let add = this.selectedOps.find(x => x === e.currentTarget.name);
        console.log(add, 1);
        if(add === undefined){
            //let opp = this.copy.find(x => x.Id === e.currentTarget.name)
            
            this.selectedOps.push(e.target.name)
            
        }else if(add != undefined){
            //find index then splice
            //let remove = this.selectedOps.findIndex(el => el.Id === e.currentTarget.name)
            let remove = this.selectedOps.findIndex(el => el === e.currentTarget.name);
            this.selectedOps.splice(remove,1)
            //console.log(2, this.selectedOps.findIndex(el => el === e.currentTarget.name));
            
        }
        //console.log(this.selectedOps);
        //turn array to string for sending multiple fields to flow
           // this.selectedOpsString = JSON.stringify(this.selectedOps); 
        


    }
}