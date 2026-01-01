import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss']
})
export class PrivacyComponent {
  lan = 'en';

  constructor(private localSt: StorageService) {
    localSt.getLanguage().subscribe((lan: any) => {
      if (lan) {
        this.lan = lan;
      }
    });
  }
}