import { Component } from '@angular/core';
import Web3 from 'web3';
import { KanbanService } from './services/kanban.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'biSwap';

  constructor(
    private kanbanService: KanbanService
  ) {
    this.kanbanService.getTokenList();
  }

}
