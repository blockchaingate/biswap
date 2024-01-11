import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-top-tokens',
  templateUrl: './top-tokens.component.html',
  styleUrls: ['./top-tokens.component.scss']
})
export class TopTokensComponent implements OnInit {
  @Input() tokens: any;
  constructor() { }

  ngOnInit(): void {
  }

}
