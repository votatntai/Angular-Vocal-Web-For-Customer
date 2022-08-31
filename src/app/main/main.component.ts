import { Component, OnInit } from '@angular/core';
import CustomScript from 'src/assets/js/main';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    CustomScript();
  }

}
