export interface APIResponse{
  message: string;
  result: boolean;
  data: any;
}

export interface FindAllAPIResponseType{
  status: string;
  data: any;
}

export interface CreateUpdateDeleteAPIResponseType{
  status: string;
  message: string;
}

export interface FindOneAPIResponseType{
  status: string;
}

export class Department {
  deptId: number;
  deptName: string;
  deptHeadEmpId: number;
  deptHeadName: string;
  createdDate: Date;

  constructor(){
    this.deptId = 0;
    this.deptName = "";
    this.deptHeadEmpId = 0;
    this.deptHeadName = "";
    this.createdDate = new Date();
  }
}

export class LoginData {
  emailId: string;
  password: string;

  constructor(){
    this.emailId = "";
    this.password = "";
  }
}

export class EmployeeData{
  employeeId: string;
  employeeName: string;
  deptId: string;
  deptName: string;
  contactNo: string;
  emailId: string;
  role: string;

  constructor(){
    this.employeeId = "";
    this.employeeName = "";
    this.deptId = "";
    this.deptName = "";
    this.contactNo = "";
    this.emailId = "";
    this.role = "";
  }
}
