/* eslint-disable no-console */
import { LightningElement, track, api, wire } from 'lwc';
import getFiles from '@salesforce/apex/assetAdminController.getFiles'


const columns = [
    { label: 'Title', fieldName: 'Title' },
    { label: 'File Type', fieldName: 'FileType' },
    { label: 'Created Date', fieldName: 'CreatedDate' },
    

];
export default class AdminFiles extends LightningElement {
        @api recordId; 
        @track assetId;
        @track links = [];
        @track columns = columns;
        connectedCallback(){
            this.assetId = this.recordId; 
            //console.log(this.assetId + ' assetId');
            
        }

        @wire(getFiles, {assetId: '$assetId'})
            wiredMethod({error, data}){
                if(data){
                    this.links = data;
                    this.error = undefined;
                    console.log(this.links)
                }else if(error){
                    this.error = error; 
                    this.links = undefined;
                }
            }
}

// var after = [];
// var x = [{name: 'test', 
//          id: '1243'},
//          {name: 'test2',
//           id: '567'}]

//   x.forEach(i =>{  
//                  var pair = {};
//                   var el =  '<a href='+ i.id+' target="_blank">'+ i.name+'</a>'
//                   pair['name'] = el; 
//                   after.push(pair);
//                   return pair;
//                   })
// console.log(after)
// console.log(x)