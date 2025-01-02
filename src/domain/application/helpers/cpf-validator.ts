export function cpfValidator(cpf: string): boolean {
  const cpfLimpo = cpf.replace(/[^\d]/g, "");

  if (cpfLimpo.length !== 11) return false;

  if (/^(\d)\1+$/.test(cpfLimpo)) return false;

  const calcularDigito = (base: string, pesoInicial: number): number => {
    const soma = base
      .split("")
      .reduce((acc, num, index) => acc + parseInt(num) * (pesoInicial - index), 0);
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };

  const primeiroDigito = calcularDigito(cpfLimpo.slice(0, 9), 10);
  const segundoDigito = calcularDigito(cpfLimpo.slice(0, 10), 11);

  return (
    primeiroDigito === parseInt(cpfLimpo.charAt(9)) &&
    segundoDigito === parseInt(cpfLimpo.charAt(10))
  );
}
