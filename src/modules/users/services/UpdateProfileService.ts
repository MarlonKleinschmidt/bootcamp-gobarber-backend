// --------------------------------------------------------------------------------
import { inject, injectable } from 'tsyringe';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import User from '../infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';

// --------------------------------------------------------------------------------
interface IRequest {
  user_id: string;
  name: string;
  email: string;
  old_password?: string;
  password?: string;
}

// --------------------------------------------------------------------------------
@injectable()
class UpdateProfileService {

  // Metodo vai receber como parâmetro o repositório
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) { }

  // método para atualizar o perfil do usuário.
  public async execute({ user_id, name, email, password, old_password }: IRequest): Promise<User> {

    const user = await this.usersRepository.findById(user_id);

    // verifica se o uruário existe.
    if (!user) {
      throw new AppError('User not found');
    }

    // verifica se existe o email na base de dados.
    const userWithUpdateEmail = await this.usersRepository.findByEmail(email);

    // verifica se achou email utilizado por outro usuário.
    if (userWithUpdateEmail && userWithUpdateEmail.id !== user_id) {
      throw new AppError('E-mail already in use.')
    }

    // Atualiza nome e email
    user.name = name;
    user.email = email;

    // verifica se informou a senha antiga.
    if (password && !old_password) {
      throw new AppError('You nedd to inform the old passaword to set a new password.')
    }

    // Compara a senha antiga está correta.
    if (password && old_password) {
      const checkOldPassword = await this.hashProvider.compareHash(
        old_password,
        user.password);

      if (!checkOldPassword) {
        throw new AppError('Old password does not match.');
      }

      // se a senha antiga estiver correta atualiza a nova senha.
      user.password = await this.hashProvider.generateHash(password);

    }

    return this.usersRepository.save(user);
  }
}
export default UpdateProfileService;
