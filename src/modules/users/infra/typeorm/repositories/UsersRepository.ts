// --------------------------------------------------------------------------------
import { getRepository, Not, Repository } from 'typeorm';
import User from '../entities/User';
import IUserRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO';

// --------------------------------------------------------------------------------
// NOTA: ao fazer os extends Repository<User>, essa classe recebe todos os
// metodos de forma automática, create() save(), métodos que o proprio
// typeOrm cria.
// Vamos remover o extends Repository<User>, para não mais um repositório do
// typeOrm para criar nosso próprio repositótio, criando todos os metodos create()
// save() para ficar mais facil a manutenção.

// --------------------------------------------------------------------------------
class UsersRepository implements IUserRepository {

  // Coloca a TIPAGEM no repositótio
  private ormRepository: Repository<User>;

  // método construtor
  constructor() {
    // Função getRepository CRIA o repositório
    this.ormRepository = getRepository(User)
    // agora o this.ormRepository possui todos os métodos do typeOrm
  } // ...

  // método procura usuário pelo id.
  public async findById(id: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne(id);
    return user;
  }

  // método procura usuário pelo email.
  public async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({
      where: { email },
    });
    return user;
  }

  // Procura todos os usuarios menos o do except_user_id.
  public async findAllProviders({ except_user_id }: IFindAllProvidersDTO): Promise<User[]> {
    let users: User[];

    if (except_user_id) {
      users = await this.ormRepository.find({
        where: {
          id: Not(except_user_id),
        }
      });
    } else {
      users = await this.ormRepository.find();
    }
    return users;
  }

  // método que cria um novo usuário e o salva.
  public async create(userData: ICreateUserDTO): Promise<User> {

    // cria o user com as informações recebidas.
    const user = this.ormRepository.create(userData);

    // salva o user.
    await this.ormRepository.save(user);

    // retorna o usuário.
    return user;
  } // ...

  // método para salvar o usuario.
  public async save(user: User): Promise<User> {
    return this.ormRepository.save(user);
  }

}
// ...

export default UsersRepository;
