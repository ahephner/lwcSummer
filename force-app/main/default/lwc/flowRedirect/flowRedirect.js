import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation'
export default class FlowRedirect extends NavigationMixin(LightningElement){
    @api recordId;
    @api type; 

   

    move(){
        console.log('id '+this.recordId);
        
        this[NavigationMixin.Navigate]({
            type:'standard__objectPage',
            attributes:{
                objectApiName: 'Order_Request__c',
                recordId: this.recordId, 
                actionName: 'view'
            }
        })
    }
}