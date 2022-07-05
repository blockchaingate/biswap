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

  showName(tokenId: string) {
    const id = parseInt(tokenId, 16);
    console.log('id=', id);
    return id;
  }
}
