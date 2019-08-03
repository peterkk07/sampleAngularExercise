import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { User } from './user.model';

@Injectable({ providedIn: 'root' })

export class UserService {
  error = new Subject<string>();
  updateMessageEmitter = new Subject<User>();
  updateUsersEmitter = new Subject<void>();

  constructor(private http: HttpClient) {}

  setMessage(user:User) {
    let dates = this.getAge(user.birthday);
   
    return {
      message: dates.age >= 0 ? `Hello  ${user.name}  from  ${user.country}  on day  ${dates.bday}  of 
      ${dates.bmonth} you will have  ${dates.age}  years` 
      : `The input date is greater than current date`,
      validAge: dates.age >=0 ? true : false
    };
  }

  getAge(date) {
    var today = new Date();
    var birthDate = new Date(date);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
      
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age = age - 1;
    }

    let fullAges = {
      bday: birthDate.getDate(),
      bmonth: birthDate.toLocaleString('default', { month: 'long' }),
      age: age
    };

    return fullAges;
  }

  getLocalStorage() {
    let user = JSON.parse(localStorage.getItem("user"));
    return user;
  }
}
