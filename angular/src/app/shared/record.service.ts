import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs/Observable';
import {Record} from './record';
import {Radar} from './radar';
import {WeeklyRecord} from './weekly-record';
import {MeasurementWeek} from './measurement-week';
import {DailyRecord} from './daily-record';


@Injectable()
export class RecordService {

  api = environment.api + 'record/';

  constructor(
    private http: HttpClient
  ) {
  }

  getRecords(): Observable<Record[]> {
    return this.http.get<Record[]>(this.api);
  }

  getRecord(id: number): Observable<Record> {
    return this.http.get<Record>(this.api + id);
  }

  getMeasurementWeeks(radarId: number, direction: number): Observable<MeasurementWeek[]> {
    return this.http.get<MeasurementWeek[]>(this.api + `measurementWeeks?radarId=${radarId}&direction=${direction}`);
  }

  addRecords(records: { id: number, text: string }): Observable<any> {
    return this.http.post<{ id: number, text: string }>(this.api + 'addRecords', records);
  }

  getRecordsForWeeklyView(radarId: number, direction: number, startDay: string, endDay: string): Observable<WeeklyRecord[]> {
    return this.http.get<WeeklyRecord[]>(this.api + `recordForWeeklyView?radarId=${radarId}&direction=${direction}&startDay=${startDay}&endDay=${endDay}`);
  }

  getRecordsForDailyView(radarId: number, direction: number, startDay: string, endDay: string): Observable<DailyRecord[]> {
    return this.http.get<DailyRecord[]>(this.api + `recordForDailyView?radarId=${radarId}&direction=${direction}&startDay=${startDay}&endDay=${endDay}`);
  }

  updateRecord(record: any): Observable<Record> {
    return this.http.patch<Record>(this.api + record.id, record);
  }

  deleteRecord(record: any): Observable<Record> {
    return this.http.delete<Record>(this.api + record.id);
  }
}
