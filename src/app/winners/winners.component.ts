import { user } from '../user';
import { Component } from '@angular/core';
import { getDatabase, onValue, ref } from 'firebase/database';

@Component({
  selector: 'app-winners',
  templateUrl: './winners.component.html',
  styleUrls: ['./winners.component.css'],
})
export class WinnersComponent {
  users: user[] = [];
  database = getDatabase();
  displayedColumns: string[] = ['name', 'score'];

  ngOnInit() {}

  constructor() {
    this.getAllUsers();
  }

  getAllUsers(): void {
    const winnersRef = ref(this.database, 'winners');
    onValue(winnersRef, (snapshot) => {
      const data = snapshot.val();
      if (data === null) this.users = [];
      else this.users = Object.values(data);
    });
  }
}
