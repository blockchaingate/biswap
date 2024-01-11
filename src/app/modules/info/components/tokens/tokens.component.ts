import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-tokens',
  templateUrl: './tokens.component.html',
  styleUrls: ['./tokens.component.scss']
})
export class TokensComponent implements OnInit {
  @Input() tokens: any;
  constructor() { }

  ngOnInit(): void {
  }

}
