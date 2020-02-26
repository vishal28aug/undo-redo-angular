import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { pairwise } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;

  initialFormData = true;
  undoFormData: Array<any> = [];
  redoFormData: Array<any> = [];
  undoLimit: number = 5;
  showUndo: boolean = false;
  showRedo: boolean = false;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.registerForm.valueChanges.pipe(pairwise()).subscribe(([prev, next]) => {
        if (prev) {
          this.undoFormData.push(prev);
          this.showUndo = true;
        }
      });
}

  undo() {
    this.showRedo = true;
    if (this.undoFormData.length != 0) {
      this.redoFormData.push(this.registerForm.value);
      //this.currentFormData.push(this.undoFormData.pop());
      this.registerForm.setValue(this.undoFormData.pop(), { emitEvent: false });
      if (this.undoFormData.length == 0) {
        this.showUndo = false;
      }
    }
  }

  redo() {
    if (this.redoFormData.length != 0) {
      this.undoFormData.push(this.registerForm.value);
      //this.currentFormData.push(this.redoFormData.pop());
      this.registerForm.setValue(this.redoFormData.pop(), { emitEvent: false })
      if (this.redoFormData.length == 0) {
        this.showRedo = false;
      }
    }

    if (this.undoFormData.length > 0) {
      this.showUndo = true;
    } else {
      this.showUndo = false;
    }
  }

  onSubmit() {
    this.submitted = true;

    // stop the process here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    alert('SUCCESS!!');
  }
}
