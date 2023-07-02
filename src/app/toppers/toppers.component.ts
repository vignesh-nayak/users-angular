import { user } from '../user';
import { Component } from '@angular/core';
import { getDatabase, onValue, ref, remove, set } from 'firebase/database';

@Component({
  selector: 'app-toppers',
  templateUrl: './toppers.component.html',
  styleUrls: ['./toppers.component.css'],
})
export class ToppersComponent {
  users: user[] = [];
  database = getDatabase();
  displayedColumns: string[] = ['name', 'age', 'score'];

  ngOnInit() {}

  constructor() {
    this.getAllUsers();
  }

  getAllUsers(): void {
    const toppersRef = ref(this.database, 'users');
    onValue(toppersRef, (snapshot) => {
      const data = snapshot.val();
      if (data === null) this.users = [];
      else
        this.users = data.filter(
          (user: user) => user.name !== undefined && user.score > 90
        );
    });
  }
}
