import {ApplicationRef, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {Radar} from "../../shared/radar";
import { Record } from "../../shared/record";
import {DataService} from "../../shared/data-service.service";
import { RecordService } from '../../shared/record.service';
declare const $: any;
import * as moment from 'moment';
import {LoadingModalComponent} from "../../shared/loading-modal/loading-modal.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {WeeklyRecord} from "../../shared/weekly-record";
import {MeasurementWeek} from "../../shared/measurement-week";

@Component({
  selector: 'app-map-detail',
  templateUrl: './map-detail.component.html',
  styleUrls: ['./map-detail.component.css']
})
export class MapDetailComponent implements OnInit {

  @ViewChild(LoadingModalComponent) loadingModalComponent: LoadingModalComponent;

  graphData: WeeklyRecord[];
  measurements: MeasurementWeek[];
  selectedMeasurement: MeasurementWeek;
  radar: Radar;
  groupBy: string = 'days';
  visible: boolean = false;
  loading: boolean = true;
  header: string = "";
  currentWeek: WeeklyRecord[];
  directionOne: boolean = true;

  constructor(
    private dataService: DataService,
    private recordService: RecordService,
    private ref: ApplicationRef,
  ) { }

  ngOnInit() {
  }

  open(radar: Radar) {
    this.visible = true;
    this.header = radar.streetName;
    this.radar = radar;
    // document.getElementById('map-detail').scrollIntoView();
    // we need this because the action is called from leaflet.
    // and leaflet has a bug that it'doesn't trigger update circle after changes
    this.getMeasurementWeeks();
  }

  getMeasurementWeeks() {
    this.loading = true;
    let direction;
    (this.directionOne) ? direction = 1 : direction = 2;
    this.recordService.getMeasurementWeeks(this.radar.id, direction).subscribe(data => {
      this.measurements = data;
      this.selectMesaurement(this.measurements[0]);
      this.loading = false;
    });
  }

  selectMesaurement(measurement: MeasurementWeek) {
    this.loading = true;
    this.selectedMeasurement = measurement;
    this.recordService.getRecordsForDetailView(this.radar).subscribe(data => {
      this.currentWeek = data;
      this.loading = false;
      this.ref.tick();
    });
  }

  tick() {
    this.ref.tick();
  }
}
