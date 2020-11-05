import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

@Injectable()
export class UserService {

  private userSubjects: BehaviorSubject<User[]>;

  private dataStore: {
    users: User[];
  };

  constructor(private http: HttpClient) {
    this.dataStore = { users: [] };
    this.userSubjects = new BehaviorSubject<User[]>([]);
  }

  get users(): Observable<User[]> {
    return this.userSubjects.asObservable();
  }

  addUser(user: User): Promise<User> {
    return new Promise((resolver, reject) => {
      user.id = this.dataStore.users.length + 1;
      this.dataStore.users.push(user);
      this.userSubjects.next(Object.assign({}, this.dataStore).users);
      resolver(user);
    });
  }

  userById(id: number): User {
    return this.dataStore.users.find(x => x.id === id);
  }

  loadAll(): Subscription {
    const usersUrl = 'https://angular-material-api.azurewebsites.net/users';

    return this.http.get<User[]>(usersUrl)
      .subscribe(data => {
        this.dataStore.users = data;
        this.userSubjects.next(Object.assign({}, this.dataStore).users);
      }, error => {
        console.log('Failed to fetch users');
      });
  }

}
