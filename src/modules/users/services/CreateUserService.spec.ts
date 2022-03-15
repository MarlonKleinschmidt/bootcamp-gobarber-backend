// -----------------------------------------------------------------------------------
import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateUserServise from './CreateUserService';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserServise;
let fakeCacheProvider: FakeCacheProvider;
// -----------------------------------------------------------------------------------
describe('CreateUser', () => {

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();
    createUser = new CreateUserServise(
      fakeUsersRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );
  });

  // -----------------------------------------------------
  // Teste para verificar se criou um usuário.
  it('should be able to create a new user', async () => {

    // preenche o usuário com as informações e cria o usuário.
    const user = await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    // O TESTE espera que exista a propriedade id no usuário,
    // isso garante que ele foi criado.
    expect(user).toHaveProperty('id');

  });

  // Teste para verificar se bloqueou a criação de um usuário com o mesmo email.
  it('should not be able to create a new user with same email from another', async () => {

    // preenche o usuário com as informações e cria o usuário.
    await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    // tenta criar um novo usuário com email já existente, não pode deixar.
    await expect(
      createUser.execute({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);

  });

});
