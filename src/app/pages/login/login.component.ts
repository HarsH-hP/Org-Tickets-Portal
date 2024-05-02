import { Component } from '@angular/core';
import { APIResponse, FindAllAPIResponseType, FindOneAPIResponseType, LoginData } from '../../core/models/API.Model';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../core/services/employee.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginObj : LoginData = new LoginData();

  constructor(private empService: EmployeeService, private router: Router){

  }

onLogin(){
  this.empService.GetAllEmployees().subscribe((response: FindAllAPIResponseType) => {
    if(response.status === 'success'){
        const allEmployees =  response.data;
        const currentEmployee = allEmployees.find((employee:any) =>
          employee.emailId === this.loginObj.emailId && (employee.password).toString() === this.loginObj.password
        );
        if(currentEmployee != null){
          localStorage.setItem('EmployeeData', JSON.stringify(currentEmployee));
          this.router.navigateByUrl('/tickets');
        }else{
          alert("User not Found");
        }
    }
    else{
      alert(response.status);
    }
  })
}

resetClicked(){
  alert('\n- Password Reset not permitted here.\n\n- Reset your organization password.');
}

}
