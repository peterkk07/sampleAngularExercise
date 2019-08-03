import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import { Subscription } from 'rxjs';
import { CountryService } from '../country.service';
import { UserService } from '../user.service';
import { Country } from '../country.model';
import { User } from '../user.model';
import { global } from '../shared/constants';

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.sass'],
  providers: [CountryService]
})

export class UserDataComponent implements OnInit, OnDestroy {

  userForm: FormGroup;
  message: string = '';
  loadedCountries: Country[] = [];
  user: User[] = [];

  private errorSub: Subscription;
  private fetchCountriesSub: Subscription;
  private updateMessageSub: Subscription;

  constructor(private http: HttpClient, private countryService: CountryService, private userService: UserService) { }

  ngOnInit() {
    this.userForm = new FormGroup ({
    'username': new FormControl(null, [Validators.required, Validators.pattern(global.userNamePattern)]),
    'surname': new FormControl(null, [Validators.required, Validators.pattern(global.userNamePattern)]),
    'country': new FormControl(null, Validators.required),
    'birthday': new FormControl(null, Validators.required)     
    });
    
    this.fetchData();

    this.updateMessageSub = this.userService.updateMessageEmitter.subscribe(user => 
      this.message = this.userService.setMessage(user).message);
  }

  fetchData() {
    this.fetchCountriesSub = this.countryService.fetchCountries().subscribe(countries => {
      this.loadedCountries = countries;
    })
  }
  onSubmit() {
    var event = new Date(this.userForm.value['birthday']);
    let date = JSON.stringify(event);
    date = date.slice(1,11)
    
    const user: User = { 
      name: this.userForm.value['username'],
      surName: this.userForm.value['surname'], 
      country: this.userForm.value['country'], 
      birthday: new Date(this.userForm.value['birthday']).toISOString().slice(0, 10) 
    };

    let userResponse = this.userService.setMessage(user);
    this.message = userResponse.message;
    
    if (userResponse.validAge) {
      this.saveLocalStorage(user);
      this.userService.updateUsersEmitter.next();
     }

    this.userForm.reset(this.userForm);
  }

  saveLocalStorage(user) {
    var oldItems = JSON.parse(localStorage.getItem("user"));
    oldItems.push(user);
    localStorage.setItem("user", JSON.stringify(oldItems));
  }

  ngOnDestroy():void {
    this.fetchCountriesSub.unsubscribe();
    this.updateMessageSub.unsubscribe();
  }
}
