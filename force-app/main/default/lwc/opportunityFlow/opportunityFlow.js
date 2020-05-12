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

    handleClick(e){
        console.log(e.currentTarget.name);
        console.log(e.currentTarget);
        
        
        if(!this.selectedOps.includes(e.currentTarget.name)){
            let opp = this.copy.filter(x => x.Id == e.currentTarget.name )
            this.selectedOps.push(...opp);
            console.log('selected ops ' +this.selectedOps);
        }else{
            for(let i = 0; i < this.selectedOps.length; i++){
                if(e.currentTarget.name === this.selectedOps[i].Id)
                    this.selectedOps.splice(i, 1);
                } 
            }
            this.selectedOpsString = JSON.stringify(this.selectedOps);    
    }
}

