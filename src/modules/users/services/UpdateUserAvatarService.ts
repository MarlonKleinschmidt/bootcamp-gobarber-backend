// --------------------------------------------------------------------------------
import path from 'path';
import fs from 'fs';
import { inject, injectable } from 'tsyringe';
import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvide';

// --------------------------------------------------------------------------------
interface IRequest {
  user_id: string;
  avatarFilename: string;
}

// --------------------------------------------------------------------------------
@injectable()
class UpdateUserAvatarService {

  // Metodo vai receber como parâmetro o repositótio
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {
  }

  // método para enviar o avatar do usuário.
  public async execute({ user_id, avatarFilename }: IRequest): Promise<User> {

    // método para buscar um usuário por id.
    const user = await this.usersRepository.findById(user_id);

    // se não encontrou dispara o erro com a mensagem.
    if (!user) {
      throw new AppError('Only authenticated users can change avatar.', 401);
    }

    // se encontrou usuário.
    if (user.avatar) {
      // deletar o avatar anterior.
      await this.storageProvider.deleteFile(user.avatar);
    }

    // salva o novo avatar (faz upload e retorna o nome do arquivo)
    const filename = await this.storageProvider.saveFile(avatarFilename);

    user.avatar = filename;

    await this.usersRepository.save(user);

    return user;
  }

} // ...

export default UpdateUserAvatarService;
