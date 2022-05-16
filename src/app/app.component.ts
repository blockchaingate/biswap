import { Component } from '@angular/core';
import { KanbanService } from './services/kanban.service';
import { StorageService } from './services/storage.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'biSwap';

  constructor(
    private kanbanService: KanbanService,
    private storageService: StorageService,
  ) {
    this.kanbanService.getTokenList();
    this.storageService.removeWalletSession();
  }

}
