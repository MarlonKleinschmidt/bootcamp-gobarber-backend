// --------------------------------------------------------------------------------
import { uuid } from 'uuidv4';
import User from '../../infra/typeorm/entities/User';
import IUserRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO'

// --------------------------------------------------------------------------------
class FakeUsersRepository implements IUserRepository {

  private users: User[] = [];

  // método procura usuário pelo id.
  public async findById(id: string): Promise<User | undefined> {
    const findUser = this.users.find(user => user.id === id);
    return findUser;
  }

  // método procura usuário pelo email.
  public async findByEmail(email: string): Promise<User | undefined> {
    const findUser = this.users.find(user => user.email === email);
    return findUser;
  }

  // Procura todos os usuarios menos o do except_user_id.
  public async findAllProviders({ except_user_id }: IFindAllProvidersDTO): Promise<User[]> {
    let { users } = this;

    if (except_user_id) {
      users = this.users.filter(user => user.id !== except_user_id);
    }
    return users;
  }

  // método que cria um novo usuário e o salva.
  public async create(userData: ICreateUserDTO): Promise<User> {

    // crio um novo objeto User
    const user = new User();

    // para preencher o objeto utilizar o Object.assign()
    Object.assign(user, { id: uuid() }, userData);

    //
    this.users.push(user);

    // retorna o usuário.
    return user;
  } // ...

  // método para salvar o usuario.
  public async save(user: User): Promise<User> {

    const findIndex = this.users.findIndex(findUser => findUser.id === user.id);

    this.users[findIndex] = user;

    return user;
  }

  // ---------------------------------------------------------
  /* public async findByDate(date: Date): Promise<Appointment | undefined> {
     const findAppointment = await this.ormRepository.findOne({
       where: { date },
     });

     return findAppointment;
   } // ...*/

}
// ...

export default FakeUsersRepository;
