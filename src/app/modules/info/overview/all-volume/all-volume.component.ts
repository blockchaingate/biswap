import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-all-volume',
  templateUrl: './all-volume.component.html',
  styleUrls: ['./all-volume.component.scss']
})
export class AllVolumeComponent implements OnInit {
  @Input() items: any;
  constructor() { }

  ngOnInit(): void {
  }

}
