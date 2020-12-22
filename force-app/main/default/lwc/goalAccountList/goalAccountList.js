import { LightningElement, api } from 'lwc';

export default class GoalAccountList extends LightningElement {
    @api prods; 

    handleSelect(event){
        //prevent default behavoir of a tag
        event.preventDefault();
        console.log('clicked')
        const selectEvent = new CustomEvent('accountselect', {
            bubbles: true
            
        }); 
        

        
        this.dispatchEvent(selectEvent); 
    }
}