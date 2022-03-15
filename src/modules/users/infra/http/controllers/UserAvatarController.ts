// --------------------------------------------------------------
// segundo a metodologia restfull, na questão de APIs,
// o controller deve ter no máximo 5 métodos
// index, show, create, update, delete
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';

// --------------------------------------------------------------
export default class UserAvatarController {
  public async update(request: Request, response: Response): Promise<Response> {

    // Cria uma instancia do repositório (CRUD etc)
    /*const userRepository = new UsersRepository();

    // Cria uma instancia do serviço de upload de arquivo do usuario.
    const updateUserAvatar = new UpdateUserAvatarService(userRepository);
    */
    const updateUserAvatar = container.resolve(UpdateUserAvatarService);

    const user = await updateUserAvatar.execute({
      user_id: request.user.id,
      avatarFilename: request.file.filename,
    });

    return response.json(classToClass(user));


  }

}
