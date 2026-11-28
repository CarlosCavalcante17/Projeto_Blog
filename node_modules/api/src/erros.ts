// Erro com status HTTP: o middleware global transforma em resposta { mensagem }
export class ErroHttp extends Error {
  status: number;

  constructor(status: number, mensagem: string) {
    super(mensagem);
    this.status = status;
  }
}
