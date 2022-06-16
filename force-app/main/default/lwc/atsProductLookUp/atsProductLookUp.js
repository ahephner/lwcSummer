import { LightningElement, track, api, wire } from 'lwc';
import { FlowNavigationBackEvent, FlowNavigationNextEvent, FlowAttributeChangeEvent } from 'lightning/flowSupport';
const SEARCH_DELAY = 750; 
import searchProd from '@salesforce/apex/lookUpFlow.searchProd';
const REGEX_SOSL_RESERVED = /(\?|&|\||!|\{|\}|\[|\]|\(|\)|\^|~|\*|:|"|\+|-|\\)/g;
export default class AtsProductLookUp extends LightningElement{ 
        @track results = [];
        @track back = [];
        @api productId; 
        @api productCode;
        loading = false;
        prodsId
        //local
        minSearchTerm = 3; 
        arrId = 0 
        queryTerm; 
        searchTimeOut; 
        productName; 
        prodCode;
        showResult = false; 
        
        //search 
        @wire(searchProd,{searchTerm:'$queryTerm'})
        wiredList(result){
            if(result.data){
                //this.results = result.data;
                this.results = result.data.map(x=>{

                    let fullName = `${x.Product_Name__c}: ${x.Name}`;
                    return {...x, fullName}
                })
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

        itemSelect(item){
            this.showResult = false;
            this.productName = item.target.value;
            this.prodsId = item.currentTarget.dataset.recordid
            let code =  item.currentTarget.dataset.code;
            this.prodCode =`${this.productName}: ${code}`
            
            
            const attributeChangeEvent = new FlowAttributeChangeEvent('productId', this.prodsId);
            this.dispatchEvent(attributeChangeEvent);

            const attributeChangeEvent2 = new FlowAttributeChangeEvent('productCode', this.prodCode);
            this.dispatchEvent(attributeChangeEvent2);
        }
}