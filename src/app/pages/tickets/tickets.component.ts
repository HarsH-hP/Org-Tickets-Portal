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
  selector: 'app-tickets',
  standalone: true,
  imports: [FormsModule, CommonModule, NaPipe],
  templateUrl: './tickets.component.html',
  styleUrl: './tickets.component.css'
})
export class TicketsComponent implements OnInit {



  allTicketDetails: any;
  allDepartmentDetails: any;
  allEmployeeDetails: any;
  selectedDeptEmpList: any;
  loggedInUser: any;
  oldTicketObj: any;

  assignClicked: boolean = false;
  editClicked: boolean = false;


  formTicketId: string = '';
  formCreatedByEmployeeName: string = '';
  formCreatedByDeptName: string = '';
  formSelectedAssignToEmployee: string = '';
  formAssignedDeptName: string = '';
  formSeverity: string = '';
  formState: string = '';
  formCustomerName:string ='';
  formCustomerContactNo: number = 0;
  formCustomerEmail: string='';
  formTicketCreatedDate: string = '';
  formTicketUpdatedDate: string = '';
  formTicketDetails: string = '';

  formCreatedByEmployeeId: string = '';
  formCreatedByDeptId: string = '';
  formSelectedAssignToEmployeeId: string = '';
  formAssignedDeptId: string = '';

  constructor(private employeeService: EmployeeService, private deptService: DepartmentService, private ticketService: TicketService) {
    // this.employeeObservable = this.employeeService.GetAllEmployeesArray();
    this.employeeService.GetAllEmployees().subscribe((response: FindAllAPIResponseType)=>{
      if(response.status ==='success'){
        this.allEmployeeDetails = response.data;
      }
      else{
        alert("GetAllEmployees Service API Error in tickets: " + response.status);
      }
    })
    this.deptService.getAllDepartments().subscribe((response: FindAllAPIResponseType) => {
      if (response.status === 'success') {
        this.allDepartmentDetails = response.data;
        // this.loggedDepartmentList = this.loggedInUser.role.toUpperCase() !== 'ADMIN'? this.allDepartmentDetails.filter((dept:any)=> dept.deptId !== 100):this.allDepartmentDetails;
        // console.log('loggedDepartmentList: ', this.loggedDepartmentList);
      }
      else {
        alert("GetAllDepartment Service API Error in tickets: " + response.status);
      }
    })
  }

  sortTicketsData(data: any) {
    const statePriority: { [key: string]: number } = {'UNASSIGNED': 1, 'ASSIGNED': 2, 'CLOSED': 3};
    const severityPriority: { [key: string]: number } = {'HIGH': 1, 'MEDIUM': 2, 'LOW': 3};
    return data.sort((a: any, b: any) => {
      const stateComparison = statePriority[a.state] - statePriority[b.state];
        if (stateComparison !== 0) {
            return stateComparison;
        }
        // If states are the same, compare by severity
        return severityPriority[a.severity] - severityPriority[b.severity];
    });

  }

  async loadTickets() {
    //Calling API to fetch all the tickets
    const response = await firstValueFrom(this.ticketService.getAllTickets());
    console.log("API Response: ", response);
    if (response.status == 'success') {
      console.log("Tickets Fetched Successfully");
      if(this.loggedInUser.role.toUpperCase() === 'EMPLOYEE'){
        const tickets = response.data.filter((ticket:any) => ticket.assignedEmp === this.loggedInUser.employeeId || ticket.createdByEmp === this.loggedInUser.employeeId);
        this.allTicketDetails = this.sortTicketsData(tickets);
      }
      else if(this.loggedInUser.role.toUpperCase() === 'DEPARTMENT HEAD'){
        const tickets = response.data.filter((ticket:any) => ticket.assignedDept === this.loggedInUser.deptId || ticket.createdByDept === this.loggedInUser.deptId);
        this.allTicketDetails = this.sortTicketsData(tickets);
      }
      else{
        this.allTicketDetails = this.sortTicketsData(response.data);
      }
    } else {
      alert("Get Ticket API call failed in tickets component.");
    }
    console.log("allTicketDetails: ", this.allTicketDetails);
  }

  ngOnInit(): void {
    //Getting information of the loggedin User
    const localStorageEmployeeData = localStorage.getItem('EmployeeData');
    if (localStorageEmployeeData != null) {
      this.loggedInUser = JSON.parse(localStorageEmployeeData);
      this.loggedInUser.role = this.loggedInUser.role.toUpperCase();
    }
    // Loading the tickets based on the LoggedIn User
    this.loadTickets();
  }

  getEmployeeNameById(empId:any){
    if(empId){
      const emp =  this.allEmployeeDetails.find((emp:any)=> emp.employeeId === empId.toString());
      if(emp){
        return emp.employeeName;
      }
    }
    return "";
  }

  getDeptNameById(deptId:any){
    if(deptId){
      const dept = this.allDepartmentDetails.find((dept:any) => dept.deptId.toString() === deptId.toString());
      if(dept){
        return dept.deptName;
      }
    }
    return "";
  }

  setAssignedEmployeeMenu(){
    const selectedDeptEmps = this.allEmployeeDetails.filter((emp: any) => emp.deptId === this.oldTicketObj.assignedDept);
    if(selectedDeptEmps){
      this.selectedDeptEmpList = selectedDeptEmps;
    }
    else{
      console.log('No employees Found for the Assigned Department. Please add Employees in the Assigned Department.');
    }
  }

  resetFormData(){
    this.formTicketId = '';
    this.formCreatedByEmployeeName = '';
    this.formCreatedByDeptName = '';
    this.formSelectedAssignToEmployee = '';
    this.formAssignedDeptName= '';
    this.formSeverity = '';
    this.formState = '';
    this.formCustomerName ='';
    this.formCustomerContactNo = 0;
    this.formCustomerEmail='';
    this.formTicketCreatedDate = '';
    this.formTicketUpdatedDate = '';
    this.formTicketDetails = '';

    this.formCreatedByEmployeeId = '';
    this.formCreatedByDeptId = '';
    this.formSelectedAssignToEmployeeId = '';
    this.formAssignedDeptId = '';

  }

  async openTicketForm(){
    const ticketsDiv = document.getElementById('ticketListDiv');
    const ticketForm = document.getElementById('TicketForm')
    if(ticketsDiv !== null && ticketForm !== null){
      ticketsDiv.style.display = 'none';
      ticketForm.style.display = 'block';
    }
  }

  closeTicketForm(){
    const ticketsDiv = document.getElementById('ticketListDiv');
    const ticketForm = document.getElementById('TicketForm')
    if(ticketsDiv !== null && ticketForm !== null){
      ticketsDiv.style.display = 'block';
      ticketForm.style.display = 'none';
    }
    this.resetFormData();
  }


  async updateTicketAPICall(ticket: any) {
    const response = await firstValueFrom(this.ticketService.updateTicket(ticket._id, ticket));
    if (response.status == 'success') {
      console.log("Ticket Updated Successfully");
    } else {
      alert("Update Ticket API call failed in tickets component.");
    }
  }



  async deleteTicketAPICall(ticket: any) {
    const response = await firstValueFrom(this.ticketService.deleteTicket(ticket._id));
    if (response.status == 'success') {
      console.log("Employee Deleted Successfully");
    } else {
      alert("Delete Employee API call failed in employee component.");
    }
  }



  async onStartClicked(ticket:any){
    ticket.state = "IN-PROGRESS";
    ticket.updatedDate = new Date();
    await this.updateTicketAPICall(ticket);
    this.loadTickets();
  }

  async onCloseClicked(ticket:any){
    ticket.state = "CLOSE";
    ticket.updatedDate = new Date();
    await this.updateTicketAPICall(ticket);
    this.loadTickets();
  }

  async onDeleteClicked(ticketObj: any) {
    if(ticketObj.state.toUpperCase() !== 'CLOSE'){
      alert('Please Close the ticket first and then Delete it.');
      return;
    }
    await this.deleteTicketAPICall(ticketObj);
    this.loadTickets();
  }

  onAssignClicked(ticket:any){
    this.assignClicked = true;
    this.loadTickets();
  }

  missingRequiredFields(){
    if(
      this.formTicketId === '' ||
    this.formCreatedByEmployeeId === ''||
    this.formCreatedByDeptName === '' ||
    this.formSelectedAssignToEmployeeId === '' ||
    this.formAssignedDeptName === '' ||
    this.formSeverity === '' ||
    this.formState === '' ||
    this.formCustomerName === '' ||
    this.formCustomerContactNo == 0 ||
    this.formCustomerEmail === '' ||
    this.formTicketCreatedDate === '' ||
    this.formTicketUpdatedDate === '' ||
    this.formTicketDetails === ''
    ){
      return true;
    }
    return false;
  }

  async onEditClicked(ticketObj: any) {
    //Setting up the Edit Form
    this.oldTicketObj = ticketObj;
    this.editClicked = true;
    await this.openTicketForm();

    this.formTicketId = ticketObj.ticketId;
    this.formCreatedByEmployeeName = this.getEmployeeNameById(ticketObj.createdByEmp);
    this.formCreatedByEmployeeId = ticketObj.createdByEmp;
    this.formCreatedByDeptName = this.getDeptNameById(ticketObj.createdByDept);
    this.formCreatedByDeptId = ticketObj.createdByDept;
    this.formSelectedAssignToEmployee = this.getEmployeeNameById(ticketObj.assignedEmp);
    this.formSelectedAssignToEmployeeId = ticketObj.assignedEmp;
    this.formAssignedDeptName= this.getDeptNameById(ticketObj.assignedDept);
    this.formAssignedDeptId = ticketObj.assignedDept;
    this.formSeverity = ticketObj.severity;
    this.setAssignedEmployeeMenu();
    if(ticketObj.state === 'UNASSIGNED'){
      this.formState = 'ASSIGNED';
    }else{
      this.formState = ticketObj.state;
    }
    // this.formState = ticketObj.state;
    this.formCustomerName = ticketObj.customerName;
    this.formCustomerContactNo = ticketObj.customerContactNo;
    this.formCustomerEmail = ticketObj.customerEmail;
    this.formTicketCreatedDate = ticketObj.createdDate;
    this.formTicketUpdatedDate = ticketObj.updatedDate;
    this.formTicketDetails = ticketObj.ticketDetails;

    console.log()
  }

  async onUpdateClicked(){

    const updatedTicket = {
      ticketId : this.formTicketId,
      createdByEmp : this.formCreatedByEmployeeId,
      createdByDept : this.formCreatedByDeptId,
      customerName : this.formCustomerName,
      customerContactNo : this.formCustomerContactNo,
      customerEmail : this.formCustomerEmail,
      severity : this.formSeverity,
      assignedEmp : this.formSelectedAssignToEmployeeId,
      assignedDept : this.formAssignedDeptId,
      ticketDetails : this.formTicketDetails,
      state : this.formState,
      createdDate : this.formTicketCreatedDate,
      updatedDate : this.formTicketUpdatedDate,
      _id : this.oldTicketObj._id
    }

    console.log('updatedTicket : ', updatedTicket);

    if(this.missingRequiredFields()){
      alert ("All fields are required.");
      return;
    }

    await this.updateTicketAPICall(updatedTicket);

    this.loadTickets();
    this.closeTicketForm();
  }



}








