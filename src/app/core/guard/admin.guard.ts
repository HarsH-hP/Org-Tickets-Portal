import { inject } from '@angular/core';
import { CanActivateFn,Router } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  let loggedData = localStorage.getItem('EmployeeData');
  if (loggedData != null) {
    const data = JSON.parse(loggedData);
    if(data && data.role.toUpperCase() === 'ADMIN'){
      return true;
    }
  }
  else{
    router.navigateByUrl('/login');
    return false;
  }
  return false;
};
