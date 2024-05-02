import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DepartmentService } from '../../core/services/department.service';
import { CreateUpdateDeleteAPIResponseType, Department, EmployeeData, FindAllAPIResponseType } from '../../core/models/API.Model';
import { CommonModule } from '@angular/common';
import { NaPipe } from "../../shared/pipes/na.pipe";
import { EmployeeService } from './../../core/services/employee.service';
import { Observable, firstValueFrom } from 'rxjs';
import { TicketService } from '../../core/services/ticket.service';


@Component({
  selector: 'app-department',
  standalone: true,
  templateUrl: './department.component.html',
  styleUrl: './department.component.css',
  imports: [FormsModule, CommonModule, NaPipe]
})

export class DepartmentComponent implements OnInit {

  allDepartmentDetails: any;
  oldDepartmentObj: any;
  allEmployeeDetails: any;
  allTickets: any;
  employeesOnly: any;
  userInputDepartmentName: string = '';
  userInputDepartmentId: number = 0;
  userInputDepartmentHeadId: number = 0;
  departmentNameExists: boolean = false;
  departmentIdExists: boolean = false;
  editClicked: boolean = false;

  constructor(private deptService: DepartmentService, private employeeService: EmployeeService, private ticketService: TicketService) {
    // this.employeeObservable = this.employeeService.GetAllEmployeesArray();
    this.employeeService.GetAllEmployees().subscribe((response: FindAllAPIResponseType) => {
      if (response.status === 'success') {
        this.allEmployeeDetails = response.data;
      }
      else {
        alert("GetAllEmployees Service API Error: " + response.status);
      }
    })
  }

  ngOnInit(): void {
    this.loadDepartment();
  }

  sortDepartment(dept: any) {
    return dept.sort((a: any, b: any) => {
      if (a.deptName.toUpperCase() < b.deptName.toUpperCase()) {
        return -1;
      }
      if (a.deptName.toUpperCase() > b.deptName.toUpperCase()) {
        return 1;
      }
      return 0;
    })
  }
  loadDepartment() {
    this.deptService.getAllDepartments().subscribe((response: FindAllAPIResponseType) => {
      this.allDepartmentDetails = this.sortDepartment(response.data);
    })
  }

  openDepartmentForm() {
    const form = document.getElementById('deptForm');
    if (form != null) {
      form.style.display = 'block';
    }

  }

  closeDepartmentForm() {
    const form = document.getElementById('deptForm');
    if (form != null) {
      form.style.display = 'none';
    }
    this.resetFormData();
  }

  resetFormData() {
    this.userInputDepartmentName = '';
    this.userInputDepartmentId = 0;
    this.userInputDepartmentHeadId = 0;
    this.editClicked = false;
    this.departmentIdExists = false;
    this.departmentNameExists = false;
    this.editClicked = false;
  }

  checkDepartmentName() {
    if (this.editClicked) {
      const temp = this.allDepartmentDetails.filter((dept: any) => dept !== this.oldDepartmentObj);
      console.log("temp: ", temp);
      this.departmentNameExists = temp.some((dept: any) => dept.deptName.toLowerCase() === this.userInputDepartmentName.toLowerCase());
    } else {
      this.departmentNameExists = this.allDepartmentDetails.some((dept: any) => dept.deptName.toLowerCase() === this.userInputDepartmentName.toLowerCase())
    }

  }

  checkDepartmentId() {
    if (this.userInputDepartmentId > 1 && this.userInputDepartmentId < 1000) {
      if (this.editClicked) {
        const temp = this.allDepartmentDetails.filter((dept: any) => dept !== this.oldDepartmentObj);
        console.log("temp: ", temp);
        this.departmentIdExists = temp.some((dept: any) => dept.deptId === this.userInputDepartmentId)
      }
      else {
        this.departmentIdExists = this.allDepartmentDetails.some((dept: any) => dept.deptId === this.userInputDepartmentId)
      }
    }
    else {
      this.departmentIdExists = true;
    }

  }

  checkAllRequiredFields() {
    if (this.userInputDepartmentId == 0 || this.userInputDepartmentName === "") {
      return false;
    }
    else {
      return true;
    }
  }

  async createDeptAPICall(dept: any) {
    const responseCreateDept = await firstValueFrom(this.deptService.createNewDepartment(dept));
    if (responseCreateDept.status == 'success') {
      console.log("Department Created Successfully");
    } else {
      alert("Create Department API call failed in department component.");
    }
  }

  async updateEmployeeAPICall(employee: any) {
    const responseUpdateUser = await firstValueFrom(this.employeeService.updateEmployeeDetails(employee._id, employee));
    if (responseUpdateUser.status == 'success') {
      console.log("Employee Updated Successfully");
    } else {
      alert("Update Employee API call failed in department component.");
    }
  }

  async updateDeptAPICall(dept: any) {
    const responseDeleteDept = await firstValueFrom(this.deptService.updateDepartment(dept._id, dept));
    if (responseDeleteDept.status == 'success') {
      console.log("Department Updated Successfully");
    } else {
      alert("Update Department API call failed in department component.");
    }
  }

  async deleteDeptAPICall(dept: any) {
    const responseDeleteDept = await firstValueFrom(this.deptService.deleteDepartment(dept._id));
    if (responseDeleteDept.status == 'success') {
      console.log("Department Deleted Successfully");
    } else {
      alert("Delete Department API call failed in department component.");
    }
  }

  async onSaveClick() {
    if (this.checkAllRequiredFields()) {
      const toCreateDept = {
        deptId: this.userInputDepartmentId,
        deptName: this.userInputDepartmentName.toUpperCase(),
        deptHeadEmpId: this.userInputDepartmentHeadId,
        deptHeadName: '',
        createdDate: new Date()
      }
      await this.createDeptAPICall(toCreateDept);
    }
    else {
      alert('All Fields are required. Please fill up all details.');
      return;
    }
    this.loadDepartment();
    this.resetFormData();
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

  async updateDepartmentInTickets(oldDeptObj: any, newDeptId: any) {
    const response = await firstValueFrom(this.ticketService.getAllTickets());
    console.log('newDeptId: ', newDeptId);
    if (response.status === 'success') {
      this.allTickets = response.data;
    }
    else {
      alert('Get Tickets API Call failed in department.');
      return;
    }
    const ticketsToUpdate = this.allTickets.filter((ticket: any) => ticket.createdByDept === oldDeptObj.deptId.toString() || ticket.assignedDept === oldDeptObj.deptId.toString());
    if (ticketsToUpdate) {
      for (let ticket of ticketsToUpdate) {
        if (ticket.createdByDept === oldDeptObj.deptId.toString()) {
          ticket.createdByDept = newDeptId.toString();
        }
        if (ticket.assignedDept === oldDeptObj.deptId.toString()) {
          ticket.assignedDept = newDeptId.toString();
        }
        await this.updateTicketAPICall(ticket);
      }
    }

  }

  async onUpdateClick() {
    if (this.checkAllRequiredFields() && this.userInputDepartmentHeadId != 0) {
      console.log(this.oldDepartmentObj);
      const oldUserDetails = this.allEmployeeDetails.find((employee: any) => employee.employeeId === (this.oldDepartmentObj.deptHeadEmpId).toString());
      const newUserDetails = this.allEmployeeDetails.find((employee: any) => employee.employeeId === (this.userInputDepartmentHeadId).toString());
      console.log("oldUserDetails: ", oldUserDetails);
      console.log("newUserDetails: ", newUserDetails);
      //If oldEmployee is not equal to newEmployee
      if (oldUserDetails !== newUserDetails) {
        if (oldUserDetails) {
          if (oldUserDetails.role.toUpperCase() !== "ADMIN") {
            oldUserDetails.role = "EMPLOYEE";
          }
          await this.updateEmployeeAPICall(oldUserDetails);
        }
        if (newUserDetails.role.toUpperCase() !== "ADMIN") {
          newUserDetails.role = 'DEPARTMENT HEAD';
        }
        await this.updateEmployeeAPICall(newUserDetails);
      }
      //Update localStorage deptId if same present
      const localStorageEmployeeData = localStorage.getItem('EmployeeData');
      if (localStorageEmployeeData != null) {
        const localData = JSON.parse(localStorageEmployeeData);
        if (localData.deptId === this.oldDepartmentObj.deptId.toString()) {
          localData.deptId = this.userInputDepartmentId.toString();
          localStorage.setItem('EmployeeData', localData);
        }
      }
      else {
        alert('Error updating Local Storage Data. Please SignOut and Login again.');
      }
      //Details not updated then reset form
      if (this.oldDepartmentObj.deptId === this.userInputDepartmentId && this.oldDepartmentObj.deptName === this.userInputDepartmentName && this.oldDepartmentObj.deptHeadEmpId === +this.userInputDepartmentHeadId) {
        this.resetFormData();
        return;
      }
      // Handling the remaining data updates of the Employee and its respective data in Department Data as well
      else {
        const toUpdateDepartment = {
          deptId: this.userInputDepartmentId,
          deptName: this.userInputDepartmentName,
          deptHeadEmpId: +newUserDetails.employeeId,
          deptHeadName: newUserDetails.employeeName,
          createdDate: this.oldDepartmentObj ? this.oldDepartmentObj.createdDate : new Date(),
          _id: this.oldDepartmentObj._id
        }
        //update all users details under that department with updated deptId and deptName
        if (this.oldDepartmentObj.deptId !== this.userInputDepartmentId || this.oldDepartmentObj.deptName !== this.userInputDepartmentName) {
          const employeesInDept = this.allEmployeeDetails.filter((emp: any) => emp.deptId == this.oldDepartmentObj.deptId.toString());
          console.log("usersInDept: ", employeesInDept);
          for (let emp of employeesInDept) {
            emp.deptId = this.userInputDepartmentId.toString();
            emp.deptName = this.userInputDepartmentName;
            await this.updateEmployeeAPICall(emp);
          }
        }
        await this.updateDeptAPICall(toUpdateDepartment);

      }
      // Update Tickets only if deptId is updated
      if (this.oldDepartmentObj.deptId !== this.userInputDepartmentId) {
        console.log('UserInputDepartmentId: ', this.userInputDepartmentId);
        await this.updateDepartmentInTickets(this.oldDepartmentObj, this.userInputDepartmentId);
      }
      this.loadDepartment();
      this.resetFormData();
    }
    else {
      if (this.userInputDepartmentHeadId == 0) {
        alert("Problem: \n-Department doesn't have any employee.\n\nSolution: \n-Please add employee first under this department.");
      } else {
        alert('All Fields are required. Please fill up all details.\n ');
      }
      // this.resetFormData();
      return;
    }
  }

  onEditClicked(obj: Department) {
    this.editClicked = true;
    this.oldDepartmentObj = { ...obj };
    this.userInputDepartmentId = obj.deptId;
    this.userInputDepartmentName = obj.deptName;
    this.userInputDepartmentHeadId = obj.deptHeadEmpId;
    this.employeesOnly = this.allEmployeeDetails.filter((emp: any) => (emp.role.toUpperCase() === 'EMPLOYEE' ||
      emp.role.toUpperCase() === 'DEPARTMENT HEAD' || emp.role.toUpperCase() === 'ADMIN') &&
      emp.deptName.toUpperCase() === this.userInputDepartmentName.toUpperCase())
    this.openDepartmentForm();
  }

  async ticketsPresentForDeletingDept(deleteDept: any) {
    const response = await firstValueFrom(this.ticketService.getAllTickets());
    if (response.status === 'success') {
      this.allTickets = response.data;
      console.log('allTickets: ', this.allTickets);
      const deletingDeptTickets = this.allTickets.filter((ticket: any) => ticket.createdByDept === deleteDept.deptId.toString() ||
        ticket.assignedDept === deleteDept.deptId.toString());
      console.log('deleting Depart Tickets: ', deletingDeptTickets);
      return deletingDeptTickets;
    }
    else {
      alert("getAllTickets Service API Error in department: " + response.status);
    }
    return false;

  }

  async onDeleteClicked(deptObj: Department) {
    this.oldDepartmentObj = deptObj;
    const deptHeadDetails = this.allEmployeeDetails.find((employee: any) => employee.employeeId === (this.oldDepartmentObj.deptHeadEmpId).toString());
    console.log('user details: ', deptHeadDetails);

    //Check Employees present in the department, if yes then restrict deletion
    const employeesInDept = this.allEmployeeDetails.filter((employee: any) => employee.deptId === this.oldDepartmentObj.deptId.toString());
    console.log('oldDepartmentObj: ', this.oldDepartmentObj);
    console.log('employeesinDept: ', employeesInDept);
    if (employeesInDept.length != 0) {
      alert('\n- Employees present in this department. \n- Please remove all employees from the department and then delete.');
      return;
    }

    //Check Tickets present for the department, if yes then restrict deletion
    const ticketsFound = await this.ticketsPresentForDeletingDept(this.oldDepartmentObj);
    console.log('ticketsfound length: ', ticketsFound.length);
    if (ticketsFound.length != 0) {
      alert('\n- Tickets found for the Deleting Department.\n- Please remove all tickets created and assigned to Department and then delete.');
      return;
    }
    if (deptHeadDetails) {
      if (deptHeadDetails.role.toUpperCase() !== "ADMIN") {
        deptHeadDetails.role = "EMPLOYEE";
      }
      await this.updateEmployeeAPICall(deptHeadDetails);
    }
    await this.deleteDeptAPICall(this.oldDepartmentObj);

    //Handling reset form data and reloading the updated department data
    this.resetFormData();
    this.loadDepartment();
  }


}

