import { user } from '../user';
import { Component } from '@angular/core';
import { getDatabase, onValue, ref, remove, set } from 'firebase/database';
import { usersData } from '../data';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent {
  users: user[] = [];
  database = getDatabase();
  displayedColumns: string[] = ['name', 'score', 'actions'];

  ngOnInit() {}

  constructor(private dialog: MatDialog) {
    this.getAllUsers();
  }

  addAllUsers(): void {
    usersData.forEach((user) => {
      user.isWinner = false;
      set(ref(this.database, `users/${user.id}`), user);
    });
  }

  getAllUsers(): void {
    const usersRef = ref(this.database, 'users');
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data === null) {
        this.addAllUsers();
        this.getAllUsers();
      } else
        this.users = data.filter(
          (user: user) => user.name !== undefined && user.age < 21
        );
    });
  }

  addToWinner(user: user): void {
    user.isWinner = true;
    set(ref(this.database, `users/${user.id}`), user);
    const tempUser = {
      name: user.name,
      score: user.score,
    };
    set(ref(this.database, `winners/${user.id}`), tempUser);
  }

  removeFromWinner(user: user): void {
    user.isWinner = false;
    set(ref(this.database, `users/${user.id}`), user);
    remove(ref(this.database, `winners/${user.id}`));
  }

  openDialog(user: user): void {
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: '20vw',
      data: {
        title: 'Confirmation',
        message: 'Are you sure you want to add to Winner?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (user.isWinner) this.removeFromWinner(user);
        else this.addToWinner(user);
      }
    });
  }
}
