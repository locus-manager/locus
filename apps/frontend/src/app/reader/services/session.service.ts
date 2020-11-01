import { Injectable } from '@angular/core';
import { Place, SessionData } from '../models/app.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  verifyActiveCheckin(email: string, placeId: string) {
    return this.httpClient.get(`${this.apiUrl}/sessions/${email}&${placeId}`);
  }

  getPlace(code: string): Observable<Place> {
    return this.httpClient.get<Place>(`${this.apiUrl}/places/${code}`);
  }

  createSession(session: SessionData) {
    return this.httpClient.post(`${this.apiUrl}/sessions`, session);
  }
}
