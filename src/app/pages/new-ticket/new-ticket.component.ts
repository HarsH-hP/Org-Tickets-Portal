import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DepartmentService } from '../../core/services/department.service';
import { CreateUpdateDeleteAPIResponseType, Department, EmployeeData, FindAllAPIResponseType } from '../../core/models/API.Model';
import { CommonModule } from '@angular/common';
import { NaPipe } from "../../shared/pipes/na.pipe";
import { EmployeeService } from './../../core/services/employee.service';
import { Observable, firstValueFrom } from 'rxjs';
import { Constant } from '../../core/constant/Constant';
import { TicketService } from '../../core/services/ticket.service';

@Component({
  selector: 'app-new-ticket',
  standalone: true,
  imports: [FormsModule, CommonModule, NaPipe],
  templateUrl: './new-ticket.component.html',
  styleUrl: './new-ticket.component.css'
})
export class NewTicketComponent implements OnInit {

  employeeId: number = 0;
  employeeName: string = '';
  userInputCustomerName: string = '';
  userInputCustomerContactNo: number = 0;
  userInputCustomerEmailAddress: string = '';
  userSelectedSeverity: string = '';
  userSelectedDepartmentId: number = 0;
  userSelectedDepartmentName: string = '';
  userInputTicketDetails: string = '';

  allDepartmentDetails: any;
  allTickets: any;

  contactNoError: boolean = false;
  emailError: boolean = false;

  loggedInUser: any;


  constructor(private employeeService: EmployeeService, private deptService: DepartmentService, private ticketService: TicketService) {
    // this.employeeObservable = this.employeeService.GetAllEmployeesArray();
    this.deptService.getAllDepartments().subscribe((response: FindAllAPIResponseType) => {
      if (response.status === 'success') {
        this.allDepartmentDetails = response.data;
      }
      else {
        alert("GetAllDepartment Service API Error: " + response.status);
      }
    })
    this.ticketService.getAllTickets().subscribe((response: FindAllAPIResponseType) => {
      if (response.status === 'success') {
        this.allTickets = response.data;
      }
      else {
        alert("getAllTickets Service API Error: " + response.status);
      }
    })
  }

  ngOnInit(): void {
    const localStorageEmployeeData = localStorage.getItem('EmployeeData');
    if (localStorageEmployeeData != null) {
      this.loggedInUser = JSON.parse(localStorageEmployeeData);
      this.loggedInUser.role = this.loggedInUser.role.toUpperCase();
      this.employeeId = this.loggedInUser.employeeId;
      this.employeeName = this.loggedInUser.employeeName;
    }
    else{
      alert('Could not found LoggedIn User Data.');
    }
  }


  setDepartmentName() {
    if (this.userSelectedDepartmentId) {
      this.userSelectedDepartmentName = this.allDepartmentDetails.find((dept: any) => dept.deptId === +this.userSelectedDepartmentId).deptName.toUpperCase();
      console.log(this.userSelectedDepartmentName)
    }
  }

  checkContactNo() {
    if (this.userInputCustomerContactNo <= 999999999 || this.userInputCustomerContactNo > 9999999999) {
      this.contactNoError = true;
    }
    else {
      this.contactNoError = false;
    }
  }

  checkEmail() {
    const regex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;
    if (regex.test(this.userInputCustomerEmailAddress)) {
      this.emailError = false;
    }
    else {
      this.emailError = true;
    }
  }

  checkAllRequiredFields() {
    if (this.employeeId == 0 || this.employeeName === "" || this.userInputCustomerName === "" || this.userInputCustomerContactNo == 0  || this.userInputCustomerEmailAddress === "" ||
       this.userSelectedSeverity === "" || this.userSelectedDepartmentId == 0 || this.userInputTicketDetails === ""
    ) {
      return false;
    }
    else {
      return true;
    }
  }

  resetFormData() {
    this.userInputCustomerName = '';
    this.userInputCustomerContactNo = 0;
    this.userInputCustomerEmailAddress = '';
    this.userSelectedSeverity = '';
    this.userSelectedDepartmentId = 0;
    this.userSelectedDepartmentName = '';
    this.userInputTicketDetails = '';
    this.contactNoError = false;
    this.emailError = false;

  }

  getRandomInt(min: number, max: number): number {
    // The maximum is inclusive and the minimum is inclusive
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  generateTicketId(){
    let generatedTicketId = this.getRandomInt(1, Number.MAX_SAFE_INTEGER);
    if(this.allTickets){
      let flag = true;
      while(flag){
        const found = this.allTickets.some((t:any) => t.ticketId === generatedTicketId.toString());
        generatedTicketId = this.getRandomInt(1, Number.MAX_SAFE_INTEGER);
        if(!found){
          flag = false;
        }
      }
    }
    console.log("generatedTicketId: ", generatedTicketId);
    return generatedTicketId.toString();
  }

  async onSaveClick() {
    if(!this.checkAllRequiredFields()){
      alert('All Fields are required. Please fill all the details.');
      return;
    }
    const createTicket = {
      ticketId : this.generateTicketId(),
      createdByEmp: this.employeeId.toString(),
      createdByDept: this.loggedInUser.deptId,
      customerName: this.userInputCustomerName,
      customerContactNo: this.userInputCustomerContactNo.toString(),
      customerEmail: this.userInputCustomerEmailAddress,
      severity: this.userSelectedSeverity,
      assignedEmp: "",
      assignedDept: this.userSelectedDepartmentId,
      ticketDetails: this.userInputTicketDetails,
      state: "UNASSIGNED",
      createdDate: new Date(),
      updatedDate: new Date()
    }
    const responseCreateTicket = await firstValueFrom(this.ticketService.createTicket(createTicket));
    if (responseCreateTicket.status == 'success') {
      alert('Ticket Created Successfully');
      console.log("Ticket Created Successfully");
    } else {
      alert("Create Ticket API call failed in new-ticket component.");
    }
    this.resetFormData();
  }

}








