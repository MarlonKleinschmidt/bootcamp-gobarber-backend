// --------------------------------------------------------------
// segundo a metodologia restfull, na questão de APIs,
// o controller deve ter no máximo 5 métodos: index, show, create, update, delete
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ResetPasswordService from '@modules/users/services/ResetPasswordService';


// --------------------------------------------------------------
export default class ResetPasswordController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { password, token } = request.body;

    // Cria uma instancia do serviço
    const resetPassword = container.resolve(ResetPasswordService);

    // Reseta o password
    await resetPassword.execute({
      token,
      password,
    });

    // Retorna o status 204 quando uma resposta tem sucesso mas não possui conteudo nenhum.
    return response.status(204).json();
  }

}
