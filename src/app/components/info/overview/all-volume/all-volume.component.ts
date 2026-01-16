import { Component, OnInit, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { VolumeComponent } from '../../components/volume/volume.component';

@Component({
  selector: 'app-all-volume',
  standalone: true,
  imports: [TranslateModule, VolumeComponent],
  templateUrl: './all-volume.component.html',
  styleUrls: ['./all-volume.component.scss']
})
export class AllVolumeComponent implements OnInit {
  @Input() items: any;
  constructor() { }

  ngOnInit(): void {
  }

}
