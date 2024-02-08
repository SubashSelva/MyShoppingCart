import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit, OnDestroy {

  userSub: Subscription;
  isAuthenticated: boolean = false;
  constructor(private dataService: DataStorageService, private authService: AuthService) {
  }

  ngOnInit(): void {
    this.userSub = this.authService.userInfo.subscribe(user => {
      this.isAuthenticated = !user ? false : true;
    });
  }

  ngOnDestroy(): void {
    this.isAuthenticated = false;
  }

  onSaveData() {
    this.dataService.storeItems().subscribe(resObj => {
      console.log("Data Saved Successfully");
      console.log(resObj);
    });
  }

  onFetchData() {
    this.dataService.retriveItems().subscribe(resObj => {
      console.log(resObj);
    });
  }

  async onLogout() {
    await this.authService.signOut();
  }
}
