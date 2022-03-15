// --------------------------------------------------------------------------------
import { inject, injectable } from 'tsyringe';
import { classToClass } from 'class-transformer';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import User from '@modules/users/infra/typeorm/entities/User';


// --------------------------------------------------------------------------------
interface IRequest {
  user_id: string;
}

// --------------------------------------------------------------------------------
@injectable()
class ListProvidersService {

  // Metodo vai receber como parâmetro o repositório
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,

  ) { }

  // método para exibir todos os usuarios menos o do except_user_id
  public async execute({ user_id }: IRequest): Promise<User[]> {

    //let users = '';

    // tenta procurar os usuarios dentro do cache
    let users = await this.cacheProvider.recover<User[]>(
      `providers-list:${user_id}`,
    );


    // se não existe cache, faz a busca no banco de dados.
    if (!users) {
      users = await this.usersRepository.findAllProviders({
        except_user_id: user_id,
      });

      //console.log('A query foi feita!');

      // armazena a query de usuarios no cache.
      await this.cacheProvider.save(
        `providers-list:${user_id}`,
        classToClass(users),
      );
    }

    return users;
  }
}
export default ListProvidersService;
