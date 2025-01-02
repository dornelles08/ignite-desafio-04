export function generateCPF(formatado: boolean = false): string {
  const calcularDigito = (base: number[]): number => {
    const pesoInicial = base.length + 1;
    const soma = base.reduce((acc, num, index) => acc + num * (pesoInicial - index), 0);
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };

  const numerosBase = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));

  const primeiroDigito = calcularDigito(numerosBase);
  numerosBase.push(primeiroDigito);

  const segundoDigito = calcularDigito(numerosBase);
  numerosBase.push(segundoDigito);

  const cpf = numerosBase.join("");

  return formatado
    ? `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9)}`
    : cpf;
}
