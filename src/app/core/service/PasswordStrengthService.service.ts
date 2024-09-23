import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PasswordStrengthService {

  calculateStrength(password: string): string {
    let strength = 0;
    
    if (password.length >= 8) strength++; 
    if (/[A-Z]/.test(password)) strength++;  
    if (/[a-z]/.test(password)) strength++;  
    if (/[0-9]/.test(password)) strength++; 
    if (/[\W]/.test(password)) strength++;  

    if (strength <= 2) {
      return 'Fraca';
    } else if (strength === 3) {
      return 'Média';
    } else if (strength === 4) {
      return 'Forte';
    } else {
      return 'Muito Forte';
    }
  }
}
