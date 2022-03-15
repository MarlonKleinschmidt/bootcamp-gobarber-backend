// --------------------------------------------------------------------------------
import { sign } from 'jsonwebtoken';
import { injectable, inject } from 'tsyringe';
import authConfig from '@config/auth';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import User from '../infra/typeorm/entities/User';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';


// --------------------------------------------------------------------------------
interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: User;
  token: string;
}

// --------------------------------------------------------------------------------
@injectable()
class AuthenticateUserService {

  // Metodo vai receber como parâmetro o repositótio
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {
  }

  // metodo execute recebe o email e senha e devolve o usuário autenticado;
  // user e token.
  public async execute({ email, password }: IRequest): Promise<IResponse> {

    // metodo para encontrar o usuário por email.
    const user = await this.usersRepository.findByEmail(email);

    // se não encontrou nenhum usuário retorna mensagem.
    if (!user) {
      throw new AppError('Incorrect email/password combination.', 401);
    }

    // método para comparar as senhas.
    const passwordMatched = await this.hashProvider.compareHash(password, user.password);

    // se a senha não for igual.
    if (!passwordMatched) {
      throw new AppError('Incorrect email/password combination.', 401);
    }

    // usuário autenticado
    const { secret, expiresIn } = authConfig.jwt;
    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    return {
      user,
      token,
    };
  }

} // ...

export default AuthenticateUserService;
