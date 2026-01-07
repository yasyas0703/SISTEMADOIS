import { z } from 'zod';

export const cpfSchema = z.string().transform((v) => v.replace(/\D/g, '')).refine((v) => v.length === 11 && cpfValido(v), { message: 'CPF inválido' });
export const cnpjSchema = z.string().transform((v) => v.replace(/\D/g, '')).refine((v) => v.length === 14 && cnpjValido(v), { message: 'CNPJ inválido' });
export const ieSchema = z.string().min(2, 'IE inválida');
export const telefoneSchema = z.string().transform((v) => v.replace(/\D/g, '')).refine((v) => v.length >= 10 && v.length <= 11, { message: 'Telefone inválido' });
export const cepSchema = z.string().transform((v) => v.replace(/\D/g, '')).refine((v) => v.length === 8, { message: 'CEP inválido' });

export const loginSchema = z.object({
  nome: z.string().min(1, 'Informe o usuário'),
  senha: z.string().min(1, 'Informe a senha'),
});

function cpfValido(cpf: string): boolean {
  if (!cpf || cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(cpf.charAt(i)) * (10 - i);
  let rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(cpf.charAt(9))) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(cpf.charAt(i)) * (11 - i);
  rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  return rev === parseInt(cpf.charAt(10));
}

function cnpjValido(cnpj: string): boolean {
  if (!cnpj || cnpj.length !== 14) return false;
  if (/^(\d)\1+$/.test(cnpj)) return false;
  const calc = (x: number) => {
    let n = 0;
    let pos = x - 7;
    for (let i = 0; i < x; i++) n += parseInt(cnpj.charAt(i)) * pos--, pos = pos < 2 ? 9 : pos;
    const r = n % 11;
    return r < 2 ? 0 : 11 - r;
  };
  const d1 = calc(12);
  const d2 = calc(13);
  return d1 === parseInt(cnpj.charAt(12)) && d2 === parseInt(cnpj.charAt(13));
}
