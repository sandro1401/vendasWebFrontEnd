import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function cepValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const cep = control.value;

    // Regex para validar CEP (apenas números, sem vírgulas)
    const cepPattern = /^[0-9]{8}$/;

    if (cep && !cepPattern.test(cep)) {
      return { cepInvalido: true }; // Define o erro
    }

    return null; // Retorna null se o valor for válido
  };
}
