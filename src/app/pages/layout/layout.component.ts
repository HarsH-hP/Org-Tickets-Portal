import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { EmployeeData } from '../../core/models/API.Model';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

  loggedEmployeeData: EmployeeData = new EmployeeData();

  constructor(){
    const localStorageEmployeeData = localStorage.getItem('EmployeeData');
    if(localStorageEmployeeData != null){
      this.loggedEmployeeData = JSON.parse(localStorageEmployeeData);
      this.loggedEmployeeData.role = this.loggedEmployeeData.role.toUpperCase();
    }
  }

  signOutClicked(){
    localStorage.removeItem('EmployeeData');
  }

}
