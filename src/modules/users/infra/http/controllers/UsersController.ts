// --------------------------------------------------------------
// segundo a metodologia restfull, na questão de APIs,
// o controller deve ter no máximo 5 métodos
// index, show, create, update, delete
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';
import CreateUserService from '@modules/users/services/CreateUserService'

// --------------------------------------------------------------
export default class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {

    const { name, email, password } = request.body;

    // Cria uma instancia do repositório (CRUD etc)
    /*const userRepository = new UsersRepository();

    // Cria uma instancia do serviço de criação do usuário.
    const createUser = new CreateUserService(userRepository);
    */

    const createUser = container.resolve(CreateUserService);

    const user = await createUser.execute({
      name,
      email,
      password,
    });

    //delete user.password;
    user.password = '';

    return response.json(classToClass(user));

  }

}
