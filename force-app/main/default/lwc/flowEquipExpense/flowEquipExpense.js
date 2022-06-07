/* eslint-disable no-console */
import { LightningElement,track,api } from 'lwc';
import { FlowNavigationNextEvent, FlowNavigationBackEvent, FlowAttributeChangeEvent} from 'lightning/flowSupport';
//import { FlowNavigationNextEvent} from 'lightning/flowSupport';

export default class FlowEquipExpense extends LightningElement {
    ///!!!!NO ARROW FUNCTIONS IN FLOW SCREENS!!!
    @api expType;
    @api expDate;
    @api expNote; 
    @api recordId;
    @api expAmount;
    @track note
    @api maint
    @api fuel; 
    @api gallons
    @api fuelCost
    @api defGallon
    @api defCost
    
    connectedCallback(){
        console.log(this.maint + ' maint');
        console.log('record id '+this.recordId)
    }
    //next page
    handleNext(){
        const nextNav = new FlowNavigationNextEvent();
        this.dispatchEvent(nextNav);
    }
    handleBack(){
        const backNav = new FlowNavigationBackEvent();
        this.dispatchEvent(backNav); 
    }
    @api validate(){
        if(this.maint === true && this.expAmount !== undefined && this.expType !== undefined){ 
            console.log(this.maint, this.fuel, this.expAmount, this.expType);
            
            return {isValid: true}
        }else if(this.fuel === true && this.fuelCost !== undefined && this.gallons !== undefined && this.expDate !== undefined){
            return {isValid: true}
        }
        return{
            isValid: false,
            errorMessage:'You must enter required fields'
        }
    
    }
    // @api get maint(){
    //   // console.log('this.maint -> '+this.maint + ' this._maint -> ' + this._maint);
        
    //     return this._maint 
    // }

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
            {label: 'Repair', value: 'Repair'},
            {label: 'Miscellaneous', value:'Miscellaneous'},
            {label: 'Tolls', value: 'Tolls'}
        ]
        
    }

    newType(e){
        this.expType = e.detail.value; 
        console.log(this.expType);         
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

//Fuel Info
    newGallon(g){
        this.gallons = g.detail.value;
        console.log(this.gallons);
        const galChange = new FlowAttributeChangeEvent('gallons', this.gallons);
        this.dispatchEvent(galChange)
    }
    newFuelCost(g){
        this.fuelCost = g.detail.value;
        console.log(this.fuelCost);
        
        const fuelChange = new FlowAttributeChangeEvent('fuelCost', this.fuelCost);
        
        this.dispatchEvent(fuelChange)
    }
    newDefGallon(g){
        this.defGallon = g.detail.value;
        const defGalChange = new FlowAttributeChangeEvent('defGallon', this.defGallon);
        
        this.dispatchEvent(defGalChange)
    }
    newDefCost(g){
        this.defCost = g.detail.value;
        const defCostChange = new FlowAttributeChangeEvent('defCost', this.defCost);
        
        this.dispatchEvent(defCostChange)
    }
}