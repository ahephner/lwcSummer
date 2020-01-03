/* eslint-disable no-console */
import { LightningElement,track,api } from 'lwc';
import { FlowNavigationNextEvent, FlowAttributeChangeEvent} from 'lightning/flowSupport';
//import { FlowNavigationNextEvent} from 'lightning/flowSupport';

export default class FlowEquipExpense extends LightningElement {
    ///!!!!NO ARROW FUNCTIONS IN FLOW SCREENS!!!
    @api expType;
    @api expDate;
    @api expNote; 
    @api recordId;
    @api expAmount;
    @track note
    //next page
    handleNext(){
        const nextNav = new FlowNavigationNextEvent();
        this.dispatchEvent(nextNav);
    }
@api get expNoteVal(){
    return this.expNote
}
 set expNoteVal(val){
     console.log('new note ');
     
    this.expNote = val; 
}
    get equipType(){
        return [
            {label: 'PM', value: 'PM'},
            {label: 'Tires', value: 'Tires'},
            {label: 'Repair', value: 'Repair'}
        ]
    }

    newType(e){
        this.expType = e.detail.value; 

    }

    newAmount(c){
        this.expAmount = c.detail.value
        console.log(this.expAmount);
        
          const attributeChange = new FlowAttributeChangeEvent('expAmount', this.expAmount);
          this.dispatchEvent(attributeChange); 
    }

    newDate(d){
        this.expDate = d.detail.value;
        const dateChange = new FlowAttributeChangeEvent('expDate', this.expDate);
        
        this.dispatchEvent(dateChange)
    }

    newNote(n){
        window.clearTimeout(this.delayTimeout);
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.delayTimeout = setTimeout(()=>{
            this.expNote = n.detail.value; 
            const attributeChange = new FlowAttributeChangeEvent('expNote', this.expNote);
             this.dispatchEvent(attributeChange); 
        },400); 
      
    }
}