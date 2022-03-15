// -----------------------------------------------------------------------------------
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ListProvidersService from './ListProvidersService';

import AppError from '@shared/errors/AppError';
import usersRouter from '@modules/users/infra/http/routes/users.routes';

// -----------------------------------------------------------------
let fakeUsersRepository: FakeUsersRepository;
let listProviders: ListProvidersService;
let fakeCacheProvider: FakeCacheProvider;


// -----------------------------------------------------------------------------------
describe('ListProviderMonthAvailability', () => {

  beforeEach(() => {

    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();
    listProviders = new ListProvidersService(
      fakeUsersRepository,
      fakeCacheProvider,
    );
  })

  // -----------------------------------------------------
  // Teste para verificar se listou os usuários.
  it('should not be able to list the providers', async () => {

    // Para listar os usuários preciso criar alguns para o teste.
    const user1 = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const user2 = await fakeUsersRepository.create({
      name: 'John Trê',
      email: 'johntre@example.com',
      password: '123456',
    });

    // criar o usuário logado.
    const loggedUser = await fakeUsersRepository.create({
      name: 'John Qua',
      email: 'johnqua@example.com',
      password: '123456',
    });

    // carrega os usuários
    const providers = await listProviders.execute({
      user_id: loggedUser.id
    });

    // O TESTE espera que a propriedade name do usuário seja 'John Trê'
    expect(providers).toEqual([user1, user2]);


  });



});
