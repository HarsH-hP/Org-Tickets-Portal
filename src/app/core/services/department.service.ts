import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Constant } from '../constant/Constant';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { APIResponse, CreateUpdateDeleteAPIResponseType, Department, FindAllAPIResponseType } from '../models/API.Model';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  constructor(private http: HttpClient) { }

  getAllDepartments () : Observable<FindAllAPIResponseType>{
    return this.http.get<FindAllAPIResponseType>(environment.FIND_ALL_API_URL + Constant.API_END_POINT.DEPARTMENT, {headers: Constant.HEADERS});
  }

  createNewDepartment (object:Department) : Observable<CreateUpdateDeleteAPIResponseType>{
    return this.http.post<CreateUpdateDeleteAPIResponseType>(environment.CREATE_API_URL + Constant.API_END_POINT.DEPARTMENT , object, {headers: Constant.HEADERS});
  }

  //Need to change the below update and delete Department API call because I will need _id of the object which needs to be updated
  updateDepartment (_id: number, object:Department) : Observable<CreateUpdateDeleteAPIResponseType>{
    return this.http.put<CreateUpdateDeleteAPIResponseType>(environment.UPDATE_ONE_API_URL + Constant.API_END_POINT.DEPARTMENT + '/' + _id, object, {headers: Constant.HEADERS});
  }


  deleteDepartment (_id:string) : Observable<CreateUpdateDeleteAPIResponseType>{
    console.log("Delete URL: ", environment.DELETE_ONE_API_URL + Constant.API_END_POINT.DEPARTMENT + '/' + _id);
    return this.http.delete<CreateUpdateDeleteAPIResponseType>(environment.DELETE_ONE_API_URL + Constant.API_END_POINT.DEPARTMENT + '/' + _id, {headers: Constant.HEADERS});
  }
}
