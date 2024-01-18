import { Component, OnInit} from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private dataService:DataStorageService){

  }
  ngOnInit(): void {
    //throw new Error('Method not implemented.');
  }

  onSaveData(){
    this.dataService.storeRecipes().subscribe(resObj=>{
      console.log("Data Saved Successfully");
      console.log(resObj);
    });
  }

  onFetchData(){
    this.dataService.retreiveRecipes().subscribe(resObj=>{
      console.log(resObj);
  });
  }
}
