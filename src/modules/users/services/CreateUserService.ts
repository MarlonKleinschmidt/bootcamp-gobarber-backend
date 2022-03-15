// --------------------------------------------------------------------------------

import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

// --------------------------------------------------------------------------------
interface IRequest {
  name: string;
  email: string;
  password: string;
}

// --------------------------------------------------------------------------------
@injectable()
class CreateUserService {

  // Metodo vai receber como parâmetro o repositótio e o hashProvider
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {
  }

  // método execute para criar um usuário.
  public async execute({ name, email, password }: IRequest): Promise<User> {

    // método busca usuário por email
    const checkUserExists = await this.usersRepository.findByEmail(email);

    // se encontrou dispara erro e exibe mensagem.
    if (checkUserExists) {
      throw new AppError('Email addres already used!');
    }

    // criptografa a senha.
    const hashedPassword = await this.hashProvider.generateHash(password);

    // método para criar o usuário.
    const user = await this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    // Após criar um novo usuário, limpar o cache de providers(prestador)
    // invalidar(DELETAR) todos os registros de cache com o profixo 'provider-list'
    await this.cacheProvider.invalidatePrefix('providers-list');

    return user;
  }

} // ...

export default CreateUserService;
