// --------------------------------------------------------------
// segundo a metodologia restfull, na questão de APIs,
// o controller deve ter no máximo 5 métodos
// index, show, create, update, delete
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';
import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';

// --------------------------------------------------------------
export default class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    // Cria uma instancia do serviço de autenticação.
    const authenticateUser = container.resolve(AuthenticateUserService);

    // recebe o retorno do usuário autenticado em user e token.
    const { user, token } = await authenticateUser.execute({
      email,
      password,
    });

    return response.json({ user: classToClass(user), token });
  }

}
