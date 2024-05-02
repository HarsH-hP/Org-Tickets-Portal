import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APIResponse, CreateUpdateDeleteAPIResponseType, EmployeeData, FindAllAPIResponseType, FindOneAPIResponseType, LoginData } from '../models/API.Model';
import { Constant } from '../constant/Constant';
import { environment } from '../../../environments/environment.development';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http: HttpClient) {
   }

  GetAllEmployees(): Observable<FindAllAPIResponseType> {
    return this.http.get<FindAllAPIResponseType>(environment.FIND_ALL_API_URL + Constant.API_END_POINT.USER, {headers: Constant.HEADERS});
  }

  GetAllEmployeesArray(): Observable<EmployeeData[]> {
    return this.http.get<EmployeeData[]>(environment.FIND_ALL_API_URL + Constant.API_END_POINT.USER, {headers: Constant.HEADERS}).pipe(map((response:any)=>{
      return response.data;
    }));
  }

  createEmployee (object:any) : Observable<CreateUpdateDeleteAPIResponseType>{
    return this.http.post<CreateUpdateDeleteAPIResponseType>(environment.CREATE_API_URL + Constant.API_END_POINT.USER , object, {headers: Constant.HEADERS});
  }

  updateEmployeeDetails (_id: string, object:any) : Observable<CreateUpdateDeleteAPIResponseType>{
    console.log("UpEmployee URL: ", environment.UPDATE_ONE_API_URL + Constant.API_END_POINT.USER + '/' + _id);
    console.log("user Object: ", object)
    return this.http.put<CreateUpdateDeleteAPIResponseType>(environment.UPDATE_ONE_API_URL + Constant.API_END_POINT.USER + '/' + _id, object, {headers: Constant.HEADERS});
  }

  deleteEmployee (_id:string) : Observable<CreateUpdateDeleteAPIResponseType>{
    console.log("Delete Employee URL: ", environment.DELETE_ONE_API_URL + Constant.API_END_POINT.DEPARTMENT + '/' + _id);
    return this.http.delete<CreateUpdateDeleteAPIResponseType>(environment.DELETE_ONE_API_URL + Constant.API_END_POINT.USER + '/' + _id, {headers: Constant.HEADERS});
  }


  // LoggingIn (object:LoginData) : Observable<FindOneAPIResponseType>{
  //   return this.http.post<FindOneAPIResponseType>(environment.FIND_ONE_API_URL + Constant.API_END_POINT.USER, {headers: Constant.HEADERS});
  // }

}
