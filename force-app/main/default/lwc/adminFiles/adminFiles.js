/* eslint-disable no-console */
import { LightningElement, track, api, wire } from 'lwc';
import getFiles from '@salesforce/apex/assetAdminController.getFiles'
import adminID from '@salesforce/apex/assetAdminController.adminID'
import {ShowToastEvent} from 'lightning/platformShowToastEvent';

const columns = [
    { label: 'Title', fieldName: 'Title' },
    { label: 'File Type', fieldName: 'FileType' },
    { label: 'Created Date', fieldName: 'CreatedDate' },
    

];
export default class AdminFiles extends LightningElement {
        @api recordId; 
        @track assetId;
        @track links = [];
        @track final = [];
        @track adminId; 
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
                    //this.links.forEach(x => console.log(x))
                   //console.log(data);
                    
                    this.links.forEach((x)=>{
                        var pair={};
                        pair.Id = x.Id; 
                        pair.Title = x.Title; 
                        pair.FileType = x.FileType;
                        //this is for sandbox need to change the route for production
                        //pair.link = 'https://advancedturf--summer19.lightning.force.com/lightning/r/Admin_File__c/'+ x.Id +'/view'
                        pair.link = 'https://advancedturf.lightning.force.com/lightning/r/Admin_File__c/'+ x.Id +'/view'
                        pair.CreatedDate = x.CreatedDate;
                        this.final.push(pair);
                        return pair
                      })
                      //console.log(this.final)
                }else if(error){
                    this.error = error; 
                    this.links = undefined;
                }
            }

        @wire(adminID, {assetId: '$assetId'})
            wiredAID({error,data}){
                if(data){
                    this.adminId = data;
                    this.error = undefined;
                    console.log('This Admin ID '+this.adminId)
                }else if(error){
                    this.error = error; 
                    this.adminID = undefined;
                }
            }
            

            //whitelist for file types accepted for upload
            get acceptFormat(){
                return ['.pdf', '.jpg', '.jpeg', '.csv', '.xlsx']
            } 
            handleUploadFinish(e){
                let strFileNames = '';
                // Get the list of uploaded files
                const uploadedFiles = e.detail.files;
        
                for(let i = 0; i < uploadedFiles.length; i++) {
                    strFileNames += uploadedFiles[i].name + ', ';
                }
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success!!',
                        message: strFileNames + ' Files uploaded Successfully! Please refresh page',
                        variant: 'success',
                    }),
                );

            }
}



