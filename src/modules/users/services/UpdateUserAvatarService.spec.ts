// -----------------------------------------------------------------------------------
import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatar: UpdateUserAvatarService;

// -----------------------------------------------------------------------------------
describe('UpdateUserAvatar', () => {

  beforeEach(() => {

    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();
    updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );
  })

  // -----------------------------------------------------
  // Teste para verificar se alterou o avatar do usuário.
  it('should be able to create a new user', async () => {

    // cria um usuario
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    // preenche o avatar do usuário passando o id e executa o upload..
    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'avatar.jpg',
    });

    // O TESTE espera que a propriedade avatar do usuário seja 'avatar.jpg'
    expect(user.avatar).toBe('avatar.jpg');

  });

  // Teste para verificar se o usuário existe, para depois alterar o avatar.
  it('should not be able to update avatar from nom existing user', async () => {

    // O TESTE espera que retorne uma mensagem de erro do tipo AppError
    await expect(updateUserAvatar.execute({
      user_id: 'non-existing-user', // passando usuário sem cadastro
      avatarFilename: 'avatar.jpg',
    })).rejects.toBeInstanceOf(AppError);

  });

  // Teste para verificar se deletou o avatar antigo do usuário quando tiver um novo.
  it('should delete old avatar when updating new one', async () => {

    // retorna a função que deve ser espionada.
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    // preenche o avatar do usuário passando o id e executa o upload..
    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'avatar.jpg',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'avatar2.jpg',
    });

    // O TESTE espera que a propriedade avatar do usuário seja 'avatar.jpg'
    expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');
    expect(user.avatar).toBe('avatar2.jpg');
  });


});

