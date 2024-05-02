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
  selector: 'app-employee',
  standalone: true,
  imports: [FormsModule, CommonModule, NaPipe],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css'
})
export class EmployeeComponent implements OnInit {

  userInputEmployeeId: number = 0;
  userInputEmployeeName: string = '';
  userSelectedDepartmentId: number = 0;
  userSelectedDepartmentName: string = '';
  userInputContactNo: number = 0;
  userSelectedRole: string = '';
  userInputEmailAddress: string = '';

  allDepartmentDetails: any;
  loggedDepartmentList: any;
  allEmployeeDetails: any;
  allTickets: any;
  befEditEmpObj: any;
  aftEditEmpObj: any;

  employeeIdExists: boolean = false;
  contactNoError: boolean = false;
  emailError: boolean = false;
  departmentNameExists: boolean = false;
  departmentIdExists: boolean = false;
  editClicked: boolean = false;

  loggedInUser: any;


  constructor(private employeeService: EmployeeService, private deptService: DepartmentService, private ticketService: TicketService) {
    // this.employeeObservable = this.employeeService.GetAllEmployeesArray();
    this.deptService.getAllDepartments().subscribe((response: FindAllAPIResponseType) => {
      if (response.status === 'success') {
        this.allDepartmentDetails = response.data;
        this.loggedDepartmentList = this.loggedInUser.role.toUpperCase() !== 'ADMIN'? this.allDepartmentDetails.filter((dept:any)=> dept.deptId !== 100):this.allDepartmentDetails;
        console.log('ssdf: ', this.loggedDepartmentList);
      }
      else {
        alert("GetAllDepartment Service API Error: " + response.status);
      }
    })
  }

  ngOnInit(): void {
    const localStorageEmployeeData = localStorage.getItem('EmployeeData');
    if (localStorageEmployeeData != null) {
      this.loggedInUser = JSON.parse(localStorageEmployeeData);
      this.loggedInUser.role = this.loggedInUser.role.toUpperCase();
    }
    this.loadEmployees();
  }

  sortEmployeesData(data: any) {
    return data.sort((a: any, b: any) => {
      // Prioritize 'Admin' role above all
      if (a.role.toUpperCase() === "ADMIN" && b.role.toUpperCase() !== "ADMIN") {
        return -1;
      }
      if (a.role.toUpperCase() !== "ADMIN" && b.role.toUpperCase() === "ADMIN") {
        return 1;
      }

      // When roles are not 'Admin', sort alphabetically by department name
      if (a.deptName.toUpperCase() < b.deptName.toUpperCase()) {
        return -1;
      }
      if (a.deptName.toUpperCase() > b.deptName.toUpperCase()) {
        return 1;
      }

      // Within the same department, prioritize 'Department Head' over 'Employee'
      if (a.role.toUpperCase() === "DEPARTMENT HEAD" && b.role.toUpperCase() !== "DEPARTMENT HEAD") {
        return -1;
      }
      if (a.role.toUpperCase() !== "DEPARTMENT HEAD" && b.role.toUpperCase() === "DEPARTMENT HEAD") {
        return 1;
      }

      // If same department and same role or roles are neither 'Department Head' nor 'Admin'
      return 0;
    });

  }

  loadEmployees() {
    this.employeeService.GetAllEmployees().subscribe((response: FindAllAPIResponseType) => {
      if(this.loggedInUser.role.toUpperCase() !== 'ADMIN'){
        const employees = response.data.filter((employee:any) => employee.deptId === this.loggedInUser.deptId);
        this.allEmployeeDetails = this.sortEmployeesData(employees);
      }
      else{
        this.allEmployeeDetails = this.sortEmployeesData(response.data);
      }
    })
  }

  openEmployeeForm(){
    const empForm = document.getElementById('employeeForm');
    if(empForm !== null){
      empForm.style.display = 'block';
    }
  }

  closeEmployeeForm(){
    const empForm = document.getElementById('employeeForm');
    if(empForm !== null){
      empForm.style.display = 'none';
    }
    this.resetFormData();
  }

  setDepartmentName() {
    if (this.userSelectedDepartmentId) {
      this.userSelectedDepartmentName = this.allDepartmentDetails.find((dept: any) => dept.deptId === +this.userSelectedDepartmentId).deptName.toUpperCase();
      console.log(this.userSelectedDepartmentName)
    }
  }

  resetFormData() {
    this.userInputEmployeeId = 0
    this.userInputEmployeeName = '';
    this.userSelectedDepartmentId = 0;
    this.userInputContactNo = 0;
    this.userSelectedRole = '';
    this.userInputEmailAddress = '';
    this.editClicked = false;
    this.employeeIdExists = false;
    this.contactNoError = false;
    this.emailError = false;
  }

  checkEmployeeId() {
    if (this.userInputEmployeeId > 0 && this.userInputEmployeeId < 1000000) {
      if (this.editClicked) {
        const temp = this.allEmployeeDetails.filter((emp: any) => emp.employeeId !== this.befEditEmpObj.employeeId);
        this.employeeIdExists = temp.some((emp: any) => emp.employeeId == this.userInputEmployeeId)
      }
      else {
        this.employeeIdExists = this.allEmployeeDetails.some((emp: any) => emp.employeeId == this.userInputEmployeeId)
      }
    }
    else {
      this.employeeIdExists = true;
    }
  }

  checkContactNo() {
    if (this.userInputContactNo <= 999999999 || this.userInputContactNo > 9999999999) {
      this.contactNoError = true;
    }
    else {
      this.contactNoError = false;
    }
  }

  checkEmail() {
    const regex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;
    if (regex.test(this.userInputEmailAddress)) {
      if (this.editClicked) {
        const temp = this.allEmployeeDetails.filter((emp: any) => emp.emailId.toLowerCase() !== this.befEditEmpObj.emailId.toLowerCase());
        this.emailError = temp.some((emp: any) => emp.emailId.toLowerCase() === this.userInputEmailAddress.toLowerCase())
      }
      else {
        this.emailError = this.allEmployeeDetails.some((emp: any) => emp.emailId.toLowerCase() === this.userInputEmailAddress.toLowerCase())
      }
    }
    else {
      this.emailError = true;
    }
  }

  checkAllRequiredFields() {
    if (this.userInputEmployeeId == 0 || this.userInputEmployeeName === "" || this.userSelectedDepartmentId == 0 ||
      this.userInputContactNo == 0 || this.userSelectedRole === "" || this.userInputEmailAddress === ""
    ) {
      return false;
    }
    else {
      return true;
    }
  }

  async createEmployeeAPICall(user: any) {
    const responseCreateUser = await firstValueFrom(this.employeeService.createEmployee(user));
    if (responseCreateUser.status == 'success') {
      console.log("Employee Created Successfully");
    } else {
      alert("Create Employee API call failed in employee component.");
    }
  }

  async updateEmployeeAPICall(employee: any) {
    const responseUpdateUser = await firstValueFrom(this.employeeService.updateEmployeeDetails(employee._id, employee));
    if (responseUpdateUser.status == 'success') {
      console.log("Employee Updated Successfully");
    } else {
      alert("Update Employee API call failed in employee component.");
    }
  }

  async deleteEmployeeAPICall(employee: any) {
    const responseUpdateUser = await firstValueFrom(this.employeeService.deleteEmployee(employee._id));
    if (responseUpdateUser.status == 'success') {
      console.log("Employee Deleted Successfully");
    } else {
      alert("Delete Employee API call failed in employee component.");
    }
  }

  async updateDeptAPICall(dept: any) {
    const responseUpdateDept = await firstValueFrom(this.deptService.updateDepartment(dept._id, dept));
    if (responseUpdateDept.status == 'success') {
      console.log("Dept Updated Successfully");
    }
    else {
      alert("Update Department API call failed in employee component.");
    }
  }

  async onSaveClick() {
    if (this.checkAllRequiredFields()) {
      //fetch selected department details (from the department list)
      const selectedDeptDetails = this.allDepartmentDetails.find((dept: any) => dept.deptId == this.userSelectedDepartmentId);
      const toCreateEmp = {
        employeeId: this.userInputEmployeeId.toString(),
        employeeName: this.userInputEmployeeName,
        deptId: this.userSelectedDepartmentId.toString(),
        deptName: selectedDeptDetails.deptName,
        contactNo: this.userInputContactNo.toString(),
        emailId: this.userInputEmailAddress,
        password: Constant.DEFAULT_PASSWORD,
        role: this.userSelectedRole
      }
      console.log(toCreateEmp);
      if (this.userSelectedRole.toUpperCase() === 'EMPLOYEE' || this.userSelectedRole.toUpperCase() === 'ADMIN') {
        await this.createEmployeeAPICall(toCreateEmp);
      }
      else {
        if (selectedDeptDetails.deptHeadEmpId == 0) {
          await this.createEmployeeAPICall(toCreateEmp);
          selectedDeptDetails.deptHeadEmpId = + toCreateEmp.employeeId;
          selectedDeptDetails.deptHeadName = toCreateEmp.employeeName;
          await this.updateDeptAPICall(selectedDeptDetails);
        }
        else {
          const prevDeptHeadEmployee = this.allEmployeeDetails.find((emp: any) => emp.employeeId == selectedDeptDetails.deptHeadEmpId.toString());
          prevDeptHeadEmployee.role = 'EMPLOYEE';
          await this.updateEmployeeAPICall(prevDeptHeadEmployee);
          await this.createEmployeeAPICall(toCreateEmp);
          selectedDeptDetails.deptHeadEmpId = + toCreateEmp.employeeId;
          selectedDeptDetails.deptHeadName = toCreateEmp.employeeName;
          await this.updateDeptAPICall(selectedDeptDetails);
        }
      }
      this.resetFormData();
      this.loadEmployees();
    }
    else {
      alert('All Fields are required. Please fill up all details.');
      return;
    }
  }

  async updateTicketAPICall(ticket:any){
    const responseUpdateTicket = await firstValueFrom(this.ticketService.updateTicket(ticket._id, ticket));
    if(responseUpdateTicket.status === 'success'){
      console.log("Ticket Updated Successfully");
    }
    else{
      alert("Update Ticket API call failed in employee component.");
    }
  }

  async updateEmployeeInTickets(oldEmp:any, newEmp:any){
    const response = await firstValueFrom(this.ticketService.getAllTickets());
    if(response.status === 'success'){
      this.allTickets = response.data;
    }
    else{
      alert('Get Tickets API Call failed in employee.');
      return;
    }
    const ticketsToUpdate = this.allTickets.filter((ticket:any) => ticket.createdByEmp === oldEmp.employeeId.toString() || ticket.assignedEmp === oldEmp.employeeId.toString());
    if(ticketsToUpdate){
      for(let ticket of ticketsToUpdate){
        if(ticket.createdByEmp === oldEmp.employeeId.toString()){
          ticket.createdByEmp = newEmp.employeeId.toString();
        }
        if(ticket.assignedEmp === oldEmp.employeeId.toString()){
          ticket.assignedEmp = newEmp.employeeId.toString();
        }
        await this.updateTicketAPICall(ticket);
      }
    }

  }

  async onUpdateClick() {
    if (!this.checkAllRequiredFields()) {
      alert('All Fields are required. Please fill up all details.\n ');
      return;
    }
    const emp = { ...this.befEditEmpObj };
    let tempOldEmp = {...emp};
    const empDept = this.allDepartmentDetails.find((dept: any) => dept.deptId === +emp.deptId);
    const updatedEmpDept = this.allDepartmentDetails.find((dept: any) => dept.deptId === +this.userSelectedDepartmentId);
    const updatedEmp = { ...emp };
    updatedEmp.employeeId = this.userInputEmployeeId.toString();
    updatedEmp.employeeName = this.userInputEmployeeName;
    updatedEmp.deptId = updatedEmpDept.deptId.toString();
    updatedEmp.deptName = updatedEmpDept.deptName;
    updatedEmp.contactNo = this.userInputContactNo.toString();
    updatedEmp.emailId = this.userInputEmailAddress;
    updatedEmp.role = this.userSelectedRole.toUpperCase();

    console.log("emp: ", emp);
    console.log("updatedEmp: ", updatedEmp);
    console.log("empDept: ", empDept);
    console.log("updatedEmpDept: ", updatedEmpDept);
    console.log(JSON.stringify(emp) === JSON.stringify(updatedEmp));
    const noUpdate = JSON.stringify(emp) === JSON.stringify(updatedEmp);
    if (noUpdate) { this.resetFormData(); return; }
    //CASE:1: Changing Role from Employee to DEPARTMENT HEAD
    if (emp.role.toUpperCase() === 'EMPLOYEE' && updatedEmp.role === 'DEPARTMENT HEAD') {
      const previousHead = this.allEmployeeDetails.find((emp: any) => emp.deptId == updatedEmp.deptId && emp.role.toUpperCase() === "DEPARTMENT HEAD");
      const deptTemp = this.allDepartmentDetails.find((dept: any) => dept.deptHeadEmpId.toString() == previousHead.employeeId);
      // debugger;
      console.log("deptTemp : ", deptTemp);
      if (previousHead) {
        previousHead.role = "EMPLOYEE";
        console.log("previousHead updated:", previousHead);
        await this.updateEmployeeAPICall(previousHead);
      }
      tempOldEmp = updatedEmp;
      console.log("updatedEmp :", tempOldEmp);
      await this.updateEmployeeAPICall(updatedEmp);
      if (deptTemp) {
        deptTemp.deptHeadEmpId = + updatedEmp.employeeId;
        deptTemp.deptHeadName = updatedEmp.employeeName;
        console.log("updatedDeptTemp: ", deptTemp);
        await this.updateDeptAPICall(deptTemp);
      }

    }
    //CASE-2: Changing Role from DEPARTMENT HEAD to EMPLOYEE
    if (emp.role.toUpperCase() === 'DEPARTMENT HEAD' && updatedEmp.role === 'EMPLOYEE') {
      const deptTemp = this.allDepartmentDetails.find((dept: any) => dept.deptHeadEmpId.toString() == emp.employeeId);
      console.log("deptTemp : ", deptTemp);
      if (deptTemp) {
        deptTemp.deptHeadEmpId = 0;
        deptTemp.deptHeadName = '';
        console.log("updatedDeptTemp: ", deptTemp);
        await this.updateDeptAPICall(deptTemp);
      }
      tempOldEmp = updatedEmp;
      console.log("updatedEmp :", tempOldEmp);
      await this.updateEmployeeAPICall(updatedEmp);

    }
    //CASE-3: Changing Department of the User
    if (empDept.deptId !== updatedEmpDept.deptId) {
      //CASE-3.1: Change from ADMIN to any other department
      //If employee was a Head, handling department updates in
      if (emp.employeeId == empDept.deptHeadEmpId.toString()) {
        const dept = { ...empDept };
        dept.deptHeadEmpId = 0;
        dept.deptHeadName = '';
        console.log("empDept update: ", dept);
        await this.updateDeptAPICall(dept);
      }
      if (updatedEmp.role.toUpperCase() == "DEPARTMENT HEAD") {
        const dept = { ...updatedEmpDept };
        dept.deptHeadEmpId = +updatedEmp.employeeId;
        dept.deptHeadName = updatedEmp.employeeName;
        console.log("updatedEmpDept: ", dept);
        await this.updateDeptAPICall(dept);
        const previousHead = this.allEmployeeDetails.find((emp: any) => emp.deptId == updatedEmp.deptId && emp.role.toUpperCase() === "DEPARTMENT HEAD");
        if (previousHead) {
          previousHead.role = 'EMPLOYEE';
          console.log("previousHead updated: ", previousHead);
          await this.updateEmployeeAPICall(previousHead);
        }

      }
      tempOldEmp = updatedEmp;
      console.log("updatedEmp :", tempOldEmp);
      await this.updateEmployeeAPICall(updatedEmp);

    }
    //CASE-4: Changing the EmployeeID and Employee Name (tepOldEmp is used here because in previous update logic we are already updating employee)
    // This logic is created if only employeeId or employeeName was update
    if (tempOldEmp.employeeId != updatedEmp.employeeId || tempOldEmp.employeeName != updatedEmp.employeeName) {
      const presentInDept = this.allDepartmentDetails.find((dept: any) => dept.deptHeadEmpId.toString() == tempOldEmp.employeeId);
      if (presentInDept) {
        presentInDept.deptHeadEmpId = + updatedEmp.employeeId;
        presentInDept.deptHeadName = updatedEmp.employeeName;
        console.log("presentInDept updated: ", presentInDept);
        await this.updateDeptAPICall(presentInDept);
      }
      console.log("updatedEmp: ", updatedEmp);
      await this.updateEmployeeAPICall(updatedEmp);
    }
    // Updating Local Storage Data if logged in user data is changed
    if(this.loggedInUser.employeeId === this.befEditEmpObj.employeeId){
      try{
        localStorage.setItem('EmployeeData', updatedEmp);
        console.log("Successfully Updated LocalStorage Data: ", localStorage.getItem('EmployeeData'));
      }
      catch(e){
        console.error("Error updating LocalStorage Data: ", e);
      }
    }
    //Handling employeeId update in the Tickets data
    if(this.befEditEmpObj.employeeId.toString() !== updatedEmp.employeeId.toString()){
      await this.updateEmployeeInTickets(this.befEditEmpObj,updatedEmp);
    }

    // Reload Employee Data
    this.loadEmployees();
    this.resetFormData();
  }

  onEditClicked(empObj: any) {
    //Setting up the Edit Form
    this.editClicked = true;
    this.befEditEmpObj = { ...empObj };
    this.userInputEmployeeId = empObj.employeeId;
    this.userInputEmployeeName = empObj.employeeName;
    this.userSelectedDepartmentId = empObj.deptId;
    this.userInputContactNo = empObj.contactNo;
    this.userSelectedRole = empObj.role.toUpperCase();
    this.userInputEmailAddress = empObj.emailId;

    this.userSelectedDepartmentName = this.allDepartmentDetails.find((dept: any) => dept.deptId === +this.userSelectedDepartmentId).deptName.toUpperCase();
    console.log(this.userSelectedDepartmentName)
    this.openEmployeeForm();

  }

  async ticketsPresentForDeletingDept(deleteEmp: any) {
    const response = await firstValueFrom(this.ticketService.getAllTickets());
    if (response.status === 'success') {
      this.allTickets = response.data;
      console.log('allTickets: ', this.allTickets);
      const deletingDeptTickets = this.allTickets.filter((ticket: any) => ticket.createdByEmp === deleteEmp.employeeId.toString() ||
        ticket.assignedEmp === deleteEmp.employeeId.toString());
      console.log('deleting Depart Tickets: ', deletingDeptTickets);
      return deletingDeptTickets;
      }
    else {
      alert("getAllTickets Service API Error in department: " + response.status);
    }
    return false;

  }

  async onDeleteClicked(empObj: any) {
    if(this.loggedInUser.employeeId === empObj.employeeId){
      alert('Deletion of your own data is not permitted.');
      return;
    }
    const toDelEmp = empObj;
    //Check if employee has any tickets, if yes then restrict from deleting
    const ticketsFound = await this.ticketsPresentForDeletingDept(empObj);
    console.log('ticketsfound length: ', ticketsFound.length);
    if (ticketsFound.length != 0) {
      alert('\n- Tickets found for the Deleting Department.\n- Please remove all tickets created and assigned to Department and then delete.');
      return;
    }
    //Delete Selected Employee
    await this.deleteEmployeeAPICall(toDelEmp);
    //Update Department Details if Deleted Employee found in Department Data
    if (toDelEmp.role.toUpperCase() === "DEPARTMENT HEAD") {
      const toUpdateDept = this.allDepartmentDetails.find((dept: any) => dept.deptId.toString() == toDelEmp.deptId)
      console.log("toUpdateDept: ", toUpdateDept);
      toUpdateDept.deptHeadEmpId = 0;
      toUpdateDept.deptHeadName = '';
      await this.updateDeptAPICall(toUpdateDept);
    }
    if (toDelEmp.role.toUpperCase() === "Admin") {
      const adminDept = this.allDepartmentDetails.find((dept: any) => dept.deptId.toString() == toDelEmp.deptId)
      if (adminDept.deptHeadEmpId.toString() == toDelEmp.employeeId) {
        adminDept.deptHeadEmpId = 0;
        adminDept.deptHeadName = "";
        await this.updateDeptAPICall(adminDept);
      }
    }
    this.loadEmployees();
    this.resetFormData();
  }

}




