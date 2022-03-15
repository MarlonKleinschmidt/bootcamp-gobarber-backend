// --------------------------------------------------------------------------------
import { getRepository, Repository } from 'typeorm';
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import UserToken from '../entities/UserToken';

// --------------------------------------------------------------------------------
class UserTokensRepository implements IUserTokensRepository {

  // Coloca a TIPAGEM no repositótio
  private ormRepository: Repository<UserToken>;

  // método construtor
  constructor() {
    // Função getRepository CRIA o repositório
    this.ormRepository = getRepository(UserToken)
    // agora o this.ormRepository possui todos os métodos do typeOrm
  } // ...

  // método procura userToken pelo token.
  public async findByToken(token: string): Promise<UserToken | undefined> {
    const userToken = await this.ormRepository.findOne({
      where: { token },
    });
    return userToken;
  }

  public async generate(user_id: string): Promise<UserToken> {

    const userToken = this.ormRepository.create({
      user_id,
    })

    await this.ormRepository.save(userToken);
    return userToken;
  }
}
export default UserTokensRepository;
