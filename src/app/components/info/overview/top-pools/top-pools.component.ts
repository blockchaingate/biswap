import { Component, Input, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PoolsComponent } from '../../components/pools/pools.component';

@Component({
  selector: 'app-top-pools',
  standalone: true,
  imports: [TranslateModule, PoolsComponent],
  templateUrl: './top-pools.component.html',
  styleUrls: ['./top-pools.component.scss']
})
export class TopPoolsComponent implements OnInit {
  @Input() pairs: any;
  constructor() { }

  ngOnInit(): void {
  }

}
