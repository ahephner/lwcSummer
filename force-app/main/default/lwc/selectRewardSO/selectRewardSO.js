import { LightningElement, api } from 'lwc';

export default class SelectRewardSO extends LightningElement {
    @api selection; 

    removeitem(event){
        const name = event.detail.item.name; 
        
        this.dispatchEvent(new CustomEvent('removeitem',{
            detail: name
        }));
        
    }
}