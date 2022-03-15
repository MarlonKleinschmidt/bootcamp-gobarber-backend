// -----------------------------------------------------------------------------------
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import UpdateProfileService from './UpdateProfileService';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

// -----------------------------------------------------------------------------------
describe('UpdateProfile', () => {

  beforeEach(() => {

    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  })

  // -----------------------------------------------------
  // Teste para verificar se alterou o perfil do usuário.
  it('should be able update the profile', async () => {

    // Para alterar o perfil preciso que o usuario já exista.
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    // preenche as informações do usuário
    const updateUser = await updateProfile.execute({
      user_id: user.id,
      name: 'John Trê',
      email: 'johntre@example.com',
    });

    // O TESTE espera que a propriedade name do usuário seja 'John Trê'
    expect(updateUser.name).toBe('John Trê');
    expect(updateUser.email).toBe('johntre@example.com');

  });

  // Teste para verificar se bloqueou a tentativa de usar um email de outro usuario.
  it('should not be able to change to another user email', async () => {

    // Cria o usuario já exista.
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const user = await fakeUsersRepository.create({
      name: 'Test',
      email: 'test@example.com',
      password: '123456',
    });

    // preenche as informações do usuário
    await expect(updateProfile.execute({
      user_id: user.id,
      name: 'John Doe',
      email: 'johndoe@example.com',
    })).rejects.toBeInstanceOf(AppError);



  });

  // Teste para verificar se é possível atualizar a senha.
  it('should be able to update the password', async () => {

    // Para alterar a senha preciso que o usuario já exista.
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    // preenche as informações do usuário
    const updateUser = await updateProfile.execute({
      user_id: user.id,
      name: 'John Trê',
      email: 'johntre@example.com',
      password: '123123',
      old_password: '123456',
    });

    // O TESTE espera que a propriedade password do usuário seja '123123'
    expect(updateUser.password).toBe('123123');


  });

  // Teste para verificar se é possível atualizar a senha .
  it('should not be able to update profile with user non-exists', async () => {

    // Para alterar a senha preciso que o usuario já exista.
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    // O TESTE espera que a propriedade password do usuário seja '123123'
    await expect(updateProfile.execute({
      user_id: '',
      name: 'John Trê',
      email: 'johntre@example.com',
      password: '123123',
      old_password: '123456',
    })).rejects.toBeInstanceOf(AppError);


  });

  // Teste para não permitir atualizar a senha sem informar a senha antiga.
  it('should not be able to update the password without old password', async () => {

    // Para alterar a senha preciso que o usuario já exista.
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });


    await expect(updateProfile.execute({
      user_id: user.id,
      name: 'John Trê',
      email: 'johntre@example.com',
      password: '123123',
    })).rejects.toBeInstanceOf(AppError);

  });

  // Teste para não permitir atualizar a senha com a senha antiga errada.
  it('should not be able to update the password with wrong old password', async () => {

    // Para alterar a senha preciso que o usuario já exista.
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });


    await expect(updateProfile.execute({
      user_id: user.id,
      name: 'John Trê',
      email: 'johntre@example.com',
      password: '123123',
      old_password: 'wrong-old-password',
    })).rejects.toBeInstanceOf(AppError);

  });

});
