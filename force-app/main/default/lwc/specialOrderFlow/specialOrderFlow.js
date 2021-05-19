import { LightningElement, api, track, wire } from 'lwc';
//wait 300 ms after user stops typing
const SEARCH_DELAY = 500; 
import searchProd from '@salesforce/apex/lookUpFlow.searchProd';
const REGEX_SOSL_RESERVED = /(\?|&|\||!|\{|\}|\[|\]|\(|\)|\^|~|\*|:|"|\+|-|\\)/g;
export default class SpecialOrderFlow extends LightningElement {
    //tracking Importing
    @api orderId; 
    @track prods=[];
    @track selectedIds=[]; 
    //control what is shown
    loading = false; 
//local vars
    minSearchTerm = 3; 
    queryTerm; 
    searchTimeOut; 
    @wire(searchProd,{searchTerm:'$queryTerm'})
                products; 
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
            this.queryTerm = key; 
            console.log('qt '+this.queryTerm);
            
            this.searchTimeOut = null; 
        }, SEARCH_DELAY);          
        
    }


    handleClick(){
        console.log('clicked');
        
    }
}