// --------------------------------------------------------------------------------
import { inject, injectable } from 'tsyringe';
import IUsersRepository from '../repositories/IUsersRepository';
import User from '../infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';

// --------------------------------------------------------------------------------
interface IRequest {
  user_id: string;
}

// --------------------------------------------------------------------------------
@injectable()
class ShowProfileService {

  // Metodo vai receber como parâmetro o repositório
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) { }

  // método para exibir o perfil do usuário.
  public async execute({ user_id }: IRequest): Promise<User> {

    const user = await this.usersRepository.findById(user_id);

    // verifica se o uruário existe.
    if (!user) {
      throw new AppError('User not found');
    }

    return user;
  }
}
export default ShowProfileService;
