import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogContent, MatDialogActions, MatDialogClose, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent {
  title = '';
  message: any;
  choice = false;
  cancelChoice = '';
  proceedChoice = '';

  constructor(private dialogRef: MatDialogRef<DialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.title = data.title;
    if (data.message.includes('\n')) {
      this.message = data.message.split('\n', 3);;
    } else {
      this.message = data.message;
    }
    this.choice = data.choice;
    this.cancelChoice = data.cancelChoice;
    this.proceedChoice = data?.proceedChoice;
  }

  onNoClick() {
    this.dialogRef.close();
  }

  isArray() {
    return typeof this.message !== 'string';
  }

}
