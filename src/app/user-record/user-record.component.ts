import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-record',
  templateUrl: './user-record.component.html',
  styleUrls: ['./user-record.component.sass']
})

export class UserRecordComponent implements OnInit, OnDestroy {
  users: User[] = [];
  headElements = ['Name', 'Country', 'Birthday'];
  config: any;
  private updateUsersSub: Subscription;

  constructor(private userService: UserService) { 
    this.config = {
      itemsPerPage: 10,
      currentPage: 1,
      totalItems: this.users.length
    };
  }

  ngOnInit() {
    this. updateUsersSub = this.userService.updateUsersEmitter.subscribe(updateUser => {
      this.users = this.userService.getLocalStorage();
    });
    this.users = this.userService.getLocalStorage();
   
  }

  pageChanged(event){
    this.config.currentPage = event;
  }

  onUser (userName, surName, userCountry, userBirthDay) {
    const user: User = { 
      name: userName,
      surName: surName, 
      country: userCountry, 
      birthday: new Date(userBirthDay).toISOString().slice(0, 10)   
    };
    this.userService.updateMessageEmitter.next(user);
  }
  ngOnDestroy():void {
    this.updateUsersSub.unsubscribe();
  }
}
