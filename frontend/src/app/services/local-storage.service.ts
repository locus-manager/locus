import { Injectable } from '@angular/core';
import { User } from '../models/app.model';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private readonly USER = 'user';

  setInStorage(user: User) {
    console.log('user', user);
    localStorage.setItem(this.USER, JSON.stringify(user));
  }

  getInStorage(): User {
    const user = localStorage.getItem(this.USER);
    return user ? JSON.parse(user) : null;
  }
}
