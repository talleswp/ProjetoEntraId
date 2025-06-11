import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TenantInfo, GroupInfo, LoginAttempt } from '../models/tenant.model';
import { UserInfo } from '../models/user.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class TenantService {
  private readonly http = inject(HttpClient);

  getTenantInfo(): Observable<ApiResponse<TenantInfo>> {
    return this.http.get<ApiResponse<TenantInfo>>(`${environment.apiUrl}/tenant/info`);
  }

  getTenantUsers(top: number = 50): Observable<ApiResponse<UserInfo[]>> {
    const params = new HttpParams().set('top', top.toString());
    return this.http.get<ApiResponse<UserInfo[]>>(`${environment.apiUrl}/tenant/users`, { params });
  }

  getTenantGroups(top: number = 50): Observable<ApiResponse<GroupInfo[]>> {
    const params = new HttpParams().set('top', top.toString());
    return this.http.get<ApiResponse<GroupInfo[]>>(`${environment.apiUrl}/tenant/groups`, { params });
  }

  getRecentLoginAttempts(top: number = 50): Observable<ApiResponse<LoginAttempt[]>> {
    const params = new HttpParams().set('top', top.toString());
    return this.http.get<ApiResponse<LoginAttempt[]>>(`${environment.apiUrl}/tenant/login-attempts`, { params });
  }

  getCurrentUser(): Observable<ApiResponse<UserInfo>> {
    return this.http.get<ApiResponse<UserInfo>>(`${environment.apiUrl}/auth/user`);
  }

  getAuthStatus(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${environment.apiUrl}/auth/status`);
  }
}