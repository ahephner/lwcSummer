import { LightningElement, track } from 'lwc';

export default class TouchEvents extends LightningElement {
    showInfo = false;
    @track data =[{
        id: '1',
        name: 'card 1',
        altName: 'back card 1',
        showInfo: false
    },
    {
        id: '2',
        name: 'card 2',
        altName: 'back card 2',
        showInfo: false
    }]
    mouseDown(e){
        let x = e.target.dataset.row;

        console.log(x);
        let index = this.data.findIndex(i=> i.id === x);
        console.log(index); 
        if(this.data[index].showInfo === false){
            this.data[index].showInfo = true;
        }else{
            this.data[index].showInfo = false; 
        }     
    }

    onTouch(event){
        let index = this.data.findIndex(i=> i.id === event.target.id);
        console.log(y); 
        if(this.showInfo === false){
            this.data[index].showInfo = true;
        }else{
            this.data[index].showInfo = false; 
        }     
    }

}