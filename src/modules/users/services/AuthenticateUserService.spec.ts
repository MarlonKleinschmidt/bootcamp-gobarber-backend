// -----------------------------------------------------------------------------------
import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserServise from './AuthenticateUserService';
import CreateUserService from './CreateUserService';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

// -----------------------------------------------------------------------------------
let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let authenticateUser: AuthenticateUserServise;
let fakeCacheProvider: FakeCacheProvider;

// -----------------------------------------------------------------------------------
describe('AuthenticateUser', () => {

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();
    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider, fakeCacheProvider);
    authenticateUser = new AuthenticateUserServise(fakeUsersRepository, fakeHashProvider);
  });

  // Teste para verificar se o usuário autenticou.
  it('should be able to authenticate', async () => {

    // cria um novo usuario
    const user = await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    // preenche o email e senha do usuário
    const response = await authenticateUser.execute({
      email: 'johndoe@example.com',
      password: '123456',
    });

    // O TESTE espera que exista a propriedade id no usuário,
    // isso garante que ele foi criado.
    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);

  });

  // Teste para verificar caso o usuário não exista.
  it('should not be able authenticate with non existing user', async () => {

    // O TESTE espera que retorne um erro do tipo AppError.
    await expect(authenticateUser.execute({
      email: 'johndoe@example.com',
      password: '123456',
    })).rejects.toBeInstanceOf(AppError);
  });

  // Teste para verificar caso o usuário tenha informado a senha errada.
  it('should not be able to authenticate with wrong password', async () => {

    // cria um novo usuario
    await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    // O TESTE espera que retorne um erro do tipo AppError,
    // pois envia o password diferente do usuario criado acima.
    await expect(authenticateUser.execute({
      email: 'johndoe@example.com',
      password: 'wrong-password',
    })).rejects.toBeInstanceOf(AppError);

  });

});

