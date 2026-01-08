import { Component, inject } from '@angular/core';
import { Auth } from '../../service/auth';

@Component({
  selector: 'app-dummy',
  imports: [],
  templateUrl: './dummy.html',
  styleUrl: './dummy.css',
})
export class Dummy {
  auth = inject(Auth);

  test() {
    console.log('test() triggered');
    this.auth.test();
  }
}
