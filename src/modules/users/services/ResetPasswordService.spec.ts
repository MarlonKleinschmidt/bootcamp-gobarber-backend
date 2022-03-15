// -----------------------------------------------------------------------------------
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokenRepository from '../repositories/fakes/FakeUserTokensRepository';
import ResetPasswordService from './ResetPasswordService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AppError from '@shared/errors/AppError';

// -----------------------------------------------------------------------------------
let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokenRepository: FakeUserTokenRepository;
let resetPassword: ResetPasswordService;
let fakeHashProvider: FakeHashProvider;

// -----------------------------------------------------------------------------------
describe('ResetPasswordService', () => {

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokenRepository = new FakeUserTokenRepository();
    fakeHashProvider = new FakeHashProvider();
    resetPassword = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokenRepository,
      fakeHashProvider,
    );
  });

  // -----------------------------------------------------
  // Este teste deve ser capaz de resetar a senha usando e-mail
  it('should be able to reset the passaword', async () => {

    // criar usuário para recuperar a senha dele
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const { token } = await fakeUserTokenRepository.generate(user.id);

    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash')
      ;
    await resetPassword.execute({
      password: '123123',
      token,
    })

    const updateUser = await fakeUsersRepository.findById(user.id);

    expect(generateHash).toHaveBeenCalledWith('123123');
    expect(updateUser?.password).toBe('123123');

  });

  // Teste deve rejeitar a tentativa de resert de password sem o token existir
  it('should not be able to reset the passaword with non-existing token', async () => {
    await expect(
      resetPassword.execute({
        token: 'non-existing-token',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });


  // Teste deve rejeitar a tentativa de resert de password sem usuário existir
  it('should not be able to reset the passaword with non-existing user', async () => {

    const { token } = await fakeUserTokenRepository.generate(
      'non-existinguser',
    );

    await expect(
      resetPassword.execute({
        token,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  // Teste deve rejeitar a tentativa de resert de password após duas horas da criação do token
  it('should not be able to reset password if passed more than 2 hours ', async () => {

    // criar usuário para recuperar a senha dele
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const { token } = await fakeUserTokenRepository.generate(user.id);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const custonDate = new Date();
      return custonDate.setHours(custonDate.getHours() + 3);
    });


    await expect(resetPassword.execute({
      password: '123123',
      token,
    }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

