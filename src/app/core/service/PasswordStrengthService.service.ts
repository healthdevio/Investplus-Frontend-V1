import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PasswordStrengthService {

  calculateStrength(password: string): { level: string, score: number, suggestions: string[] } {
    let score = 0;
    const suggestions: string[] = [];

    if (password.length >= 8) {
      score++;
    } else {
      suggestions.push('A senha deve ter pelo menos 8 caracteres.');
    }

    if (/[A-Z]/.test(password)) {
      score++;
    } else {
      suggestions.push('Adicione ao menos uma letra maiúscula.');
    }

    if (/[a-z]/.test(password)) {
      score++;
    } else {
      suggestions.push('Adicione ao menos uma letra minúscula.');
    }

    if (/[0-9]/.test(password)) {
      score++;
    } else {
      suggestions.push('Inclua ao menos um número.');
    }

    if (/[\W]/.test(password)) {
      score++;
    } else {
      suggestions.push('Adicione caracteres especiais (ex: @, #, $, etc).');
    }

    let level: string;
    if (score <= 2) {
      level = 'Fraca';
    } else if (score === 3) {
      level = 'Média';
    } else if (score === 4) {
      level = 'Forte';
    } else {
      level = 'Muito Forte';
    }

    return { level, score, suggestions };
  }
}
