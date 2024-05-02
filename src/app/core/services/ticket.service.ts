import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constant } from '../constant/Constant';
import { environment } from '../../../environments/environment.development';
import { CreateUpdateDeleteAPIResponseType, FindAllAPIResponseType } from '../models/API.Model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  constructor(private http: HttpClient) {

  }

  getAllTickets () : Observable<FindAllAPIResponseType>{
    console.log('Tickets fetch URL: ',  environment.FIND_ALL_API_URL + Constant.API_END_POINT.TICKET);
    return this.http.get<FindAllAPIResponseType>(environment.FIND_ALL_API_URL + Constant.API_END_POINT.TICKET, {headers: Constant.HEADERS});
  }

  createTicket (ticket:any) : Observable<CreateUpdateDeleteAPIResponseType>{
    console.log("creating Ticket: ", ticket);
    return this.http.post<CreateUpdateDeleteAPIResponseType>(environment.CREATE_API_URL + Constant.API_END_POINT.TICKET , ticket, {headers: Constant.HEADERS});
  }

  updateTicket (_id: string, object:any) : Observable<CreateUpdateDeleteAPIResponseType>{
    console.log("UpEmployee URL: ", environment.UPDATE_ONE_API_URL + Constant.API_END_POINT.TICKET + '/' + _id);
    console.log("user Object: ", object)
    return this.http.put<CreateUpdateDeleteAPIResponseType>(environment.UPDATE_ONE_API_URL + Constant.API_END_POINT.TICKET + '/' + _id, object, {headers: Constant.HEADERS});
  }

  deleteTicket (_id:string) : Observable<CreateUpdateDeleteAPIResponseType>{
    console.log("Delete Employee URL: ", environment.DELETE_ONE_API_URL + Constant.API_END_POINT.TICKET + '/' + _id);
    return this.http.delete<CreateUpdateDeleteAPIResponseType>(environment.DELETE_ONE_API_URL + Constant.API_END_POINT.TICKET + '/' + _id, {headers: Constant.HEADERS});
  }

}
