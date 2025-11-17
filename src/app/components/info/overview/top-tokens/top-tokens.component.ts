import { Component, Input, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { TokensComponent } from '../../components/tokens/tokens.component';

@Component({
  selector: 'app-top-tokens',
  standalone: true,
  imports: [TranslateModule, TokensComponent],
  templateUrl: './top-tokens.component.html',
  styleUrls: ['./top-tokens.component.scss']
})
export class TopTokensComponent implements OnInit {
  @Input() tokens: any;
  constructor() { }

  ngOnInit(): void {
  }

}
