import { LightningElement, api, wire, track } from 'lwc';
import getDocs from '@salesforce/apex/rewardsController.getDocs';

const SEARCH_DELAY = 500;
const REGEX_SOSL_RESERVED = /(\?|&|\||!|\{|\}|\[|\]|\(|\)|\^|~|\*|:|"|\+|\\)/g;
export default class RewardsFlow extends LightningElement{
    @api accountId; 
    docName; 
    queryTerm;
    //MAKE THIS 5 BEFORE SENDING TO PROD!
    minSearch = 3;
    searchTimeOut;
    @track results;
    @track selectedSO = [];
    loading = true;
    showResult = false;  
    
    @wire(getDocs,{accountId:'$accountId' , searchTerm:'$queryTerm'})
        wiredList(result){
            if(result.data){
                this.results = result.data;
                this.loading = false;
                this.showResult = true;
               // console.log(this.results);  
            }else if(result.error){
                console.log(result.error); 
            }
        }
    handleKeyUp(keyWord){
        
        if(this.minSearch > keyWord.target.value.length){
            this.showResult = 'false'; 
            return; 
        }
        if(this.searchTimeOut){
            clearTimeout(this.searchTimeOut);
        }
        const key = keyWord.target.value.trim().replace(REGEX_SOSL_RESERVED, '?').toLowerCase();
         this.searchTimeOut = setTimeout(()=>{
             this.loading = true;
             this.queryTerm = key; 
             this.searchTimeOut = null; 
             console.log('query '+this.queryTerm);
             console.log('accountID '+ this.accountId);
             
         }, SEARCH_DELAY); 
    }

    itemSelect(x){
        const docId = x.currentTarget.dataset.recordid; 
        const dataName = x.currentTarget.dataset.name;
        
        
        this.selectedSO = [
            ...this.selectedSO, {
                name: docId,
                label: dataName
            }
        ]
        this.docName = ''; 
//!when the input wont clear we could try grabbing the input and setting it to '' 
        this.template.querySelector('lightning-input[data-my-id=in4]').value = '';
        // this.queryTerm = '';
        this.showResult = false; 
        
        
    }
//remove selected SO
    removeSO(x){
        let index = this.selectedSO.findIndex(item => item.name = x.detail)
        console.log('index');
        
        this.selectedSO.splice(index, 1);
        this.selectedSO = [...this.selectedSO]; 
    }
//styling
    get getListBoxClass(){
        return 'slds-listbox slds-listbox_vertical slds-dropdown slds-dropdown_fluid';
    }
}