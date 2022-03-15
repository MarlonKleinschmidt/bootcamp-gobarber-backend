// -----------------------------------------------------------------------------------
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

import ShowProfileService from './ShowProfileService';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfileService;


// -----------------------------------------------------------------------------------
describe('UpdateProfile', () => {

  beforeEach(() => {

    fakeUsersRepository = new FakeUsersRepository();
    showProfile = new ShowProfileService(fakeUsersRepository);
  })

  // -----------------------------------------------------
  // Teste para verificar se exibiu o perfil do usuário.
  it('should be able show the profile', async () => {

    // Para exibir o perfil preciso que o usuario já exista.
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    // exibe as informações do usuário
    const profile = await showProfile.execute({
      user_id: user.id,
    });

    // O TESTE espera que a propriedade name do usuário seja 'John Trê'
    expect(profile.name).toBe('John Doe');
    expect(profile.email).toBe('johndoe@example.com');

  });

  // Teste para verificar se bolqueou a exibiçao de um perfil que nao existe.
  it('should not be able show the profile from non-existing user', async () => {

    // exibe as informações do usuário
    await expect(showProfile.execute({
      user_id: 'non-existing-user-id',
    })).rejects.toBeInstanceOf(AppError);

  });

});
