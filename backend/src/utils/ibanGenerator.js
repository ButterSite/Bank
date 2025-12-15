import iban from 'iban';

export function generateIban() {
  return iban.random();
}