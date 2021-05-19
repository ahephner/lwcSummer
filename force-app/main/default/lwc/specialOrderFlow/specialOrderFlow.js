import { LightningElement, api, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
//wait 300 ms after user stops typing
const SEARCH_DELAY = 1000; 
const ERROR_TITLE = 'Error Saving'
const ERROR_MSG = 'Please make sure there is a Product Selected and QTY. If using manual lines description must be at least 5 chars'
import searchProd from '@salesforce/apex/lookUpFlow.searchProd';
const REGEX_SOSL_RESERVED = /(\?|&|\||!|\{|\}|\[|\]|\(|\)|\^|~|\*|:|"|\+|-|\\)/g;
export default class SpecialOrderFlow extends LightningElement {
    //tracking Importing
    @api orderId; 
    @track results; 
    @track selectedIds=[]; 
    //control what is shown
    loading = false; 
//local vars
    minSearchTerm = 3; 
    queryTerm; 
    searchTimeOut; 
    productName; 
    prodsId
    showResult = false; 
    @wire(searchProd,{searchTerm:'$queryTerm'})
        wiredList(result){
            if(result.data){
                this.results = result.data;
                this.loading = false;
                this.showResult = true;  
            }else if(result.error){
                console.log(result.error); 
            }
        }
//handle search
    handleKeyUp(searchTerm) {
         if(this.minSearchTerm > searchTerm.target.value.length){
             return; 
           }
        if(this.searchTimeOut){
            clearTimeout(this.searchTimeOut);
        }
            const key = searchTerm.target.value.trim().replace(REGEX_SOSL_RESERVED, '?').toLowerCase();;
        this.searchTimeOut = setTimeout(() =>{
            this.loading = true; 
            this.queryTerm = key; 
            
            this.searchTimeOut = null; 
         
        }, SEARCH_DELAY);          
        
    }
    //item selected from dropdown
    itemSelect(evt){
        this.showResult = false;
        this.productName = evt.target.value;
       // this will be used to pass the values back out to the flow. 
        this.selectedIds = [
            ...this.selectedIds, {
                id: evt.currentTarget.dataset.recordid,
                name: evt.target.value
            }
        ]
      
    }
    handleQty(e){
        this.qty = e.target.value; 
    }
    handleClick(){
       const desc = this.template.querySelector('lightning-input[data-my-id=in3]').value
       console.log('desc '+desc);
       console.log('productName '+this.productName);
       console.log('qty '+this.qty);
       
       
       
        if(this.qty ===undefined || this.qty <1){
            alert('Please make sure there is qty'); 
        } 
        if(this.productName === undefined || this.productName.length<0 || desc === undefined || desc.length<5){
            
            
            alert('Please make sure your are selecting a product')
        }
    }


    get getListBoxClass(){
        return 'slds-listbox slds-listbox_vertical slds-dropdown slds-dropdown_fluid';
    }
}