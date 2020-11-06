import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Subject} from 'rxjs';


import {CompareData} from './compare-data.model';
import {AuthService} from '../user/auth.service';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {map} from 'rxjs/operators';


@Injectable()
export class CompareService {
  dataEdited = new BehaviorSubject<boolean>(false);
  dataIsLoading = new BehaviorSubject<boolean>(false);
  dataLoaded = new Subject<CompareData[]>();
  dataLoadFailed = new Subject<boolean>();
  userData: CompareData;

  constructor(private http: HttpClient,
              private authService: AuthService) {
  }

  onStoreData(data: CompareData) {
    this.dataLoadFailed.next(false);
    this.dataIsLoading.next(true);
    this.dataEdited.next(false);
    this.userData = data;
    this.authService.getAuthenticatedUser().getSession((err, session) => {
      if (err) {
        return;
      }
      this.http.post('https://5d6l784bz5.execute-api.us-west-2.amazonaws.com/dev/compare-yourself', data, {
        headers: new HttpHeaders({Authorization: session.getIdToken().getJwtToken()})
      })
        .subscribe(
          (result) => {
            this.dataLoadFailed.next(false);
            this.dataIsLoading.next(false);
            this.dataEdited.next(true);
          },
          (error) => {
            this.dataIsLoading.next(false);
            this.dataLoadFailed.next(true);
            this.dataEdited.next(false);
          }
        );
    });
  }

  onRetrieveData(all = true) {
    this.dataLoaded.next(null);
    this.dataLoadFailed.next(false);
    this.authService.getAuthenticatedUser().getSession((err, session) => {
      const queryParam = 'accessToken=' + session.getAccessToken().getJwtToken();
      let urlParam = 'all';
      if (!all) {
        urlParam = 'single';
      }
      this.http.get('https://5d6l784bz5.execute-api.us-west-2.amazonaws.com/dev/compare-yourself/' + urlParam, {
        headers: new HttpHeaders({Authorization: session.getIdToken().getJwtToken()}),
        params: new HttpParams({fromString: queryParam})
      })
        .pipe(map(
          (response: Response) => response
        ))
        .subscribe(
          async (data) => {
            if (all) {
              // @ts-ignore
              this.dataLoaded.next(await data);
            } else {
              if (!data) {
                this.dataLoadFailed.next(true);
                return;
              }
              this.userData = data[0];
              this.dataEdited.next(true);
            }
          },
          (error) => {
            console.log(error);
            this.dataLoadFailed.next(true);
            this.dataLoaded.next(null);
          }
        );
    });
  }

  onDeleteData() {

    this.dataLoadFailed.next(false);
    this.authService.getAuthenticatedUser().getSession((err, session) => {
      this.http.delete('https://5d6l784bz5.execute-api.us-west-2.amazonaws.com/dev/compare-yourself/?accessToken=XXX', {
        headers: new HttpHeaders({Authorization: session.getIdToken().getJwtToken(), 'Access-Control-Allow-Origin' : '*'})
      })
        .subscribe(
          (data) => {
            console.log(data);
          },
          (error) => {
            console.log(error);
            this.dataLoadFailed.next(true);
          }
        );
    });
  }
}
