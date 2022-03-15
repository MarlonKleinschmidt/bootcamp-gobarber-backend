// --------------------------------------------------------------
// segundo a metodologia restfull, na questão de APIs,
// o controller deve ter no máximo 5 métodos: index, show, create, update, delete
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import SendForgotPasswordEmailService from '@modules/users/services/SendForgotPasswordEmailService';

// --------------------------------------------------------------
export default class ForgotPasswordController {

  public async create(request: Request, response: Response): Promise<Response> {
    const { email } = request.body;

    // Cria uma instancia do serviço de autenticação.
    const sendForgotPasswordEmail = container.resolve(SendForgotPasswordEmailService);

    //
    await sendForgotPasswordEmail.execute({
      email,
    });

    // Retorna o status 204 quando uma resposta tem sucesso mas não possui conteudo nenhum.
    return response.status(204).json();
  }

}
