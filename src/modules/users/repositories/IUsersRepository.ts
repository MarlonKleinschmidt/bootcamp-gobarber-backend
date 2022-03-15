// --------------------------------------------------------------------------------
import User from '../infra/typeorm/entities/User';
import ICreateUserDTO from '../dtos/ICreateUserDTO';
import IFindAllProvidersDTO from '../dtos/IFindAllProvidersDTO';
// --------------------------------------------------------------------------------
// Declarar quais metodos o repositório de users terá.
// Indo nos services e ver quais metodos são utilizados.

// --------------------------------------------------------------------------------
export default interface IUsersRepository {

  findAllProviders(data: IFindAllProvidersDTO): Promise<User[]>;

  // método recebe o id e retorna o usuario ou indefenido se não encontrar.
  findById(id: string): Promise<User | undefined>

  // método recebe o email e retorna o usuario ou indefenido se não encontrar.
  findByEmail(email: string): Promise<User | undefined>

  // método create, como vai receber todas as informações do usuário utilizar um DTO
  // Date Transfer Object.
  create(data: ICreateUserDTO): Promise<User>;

  save(user: User): Promise<User>;

}
