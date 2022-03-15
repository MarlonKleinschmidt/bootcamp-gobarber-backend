// -----------------------------------------------------------------------------------
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUserTokenRepository from '../repositories/fakes/FakeUserTokensRepository';
import SendForgotPasswordEmailServise from './SendForgotPasswordEmailService';
import AppError from '@shared/errors/AppError';

// -----------------------------------------------------------------------------------
let fakeUsersRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokenRepository: FakeUserTokenRepository;
let sendForgotPasswordEmail: SendForgotPasswordEmailServise;

// -----------------------------------------------------------------------------------
describe('SendForgotPasswordEmail', () => {

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokenRepository = new FakeUserTokenRepository();

    sendForgotPasswordEmail = new SendForgotPasswordEmailServise(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUserTokenRepository);

  });

  // -----------------------------------------------------
  // Este teste deve ser capaz de recuperar a senha usando e-mail
  it('should be able to recover the passaword using email', async () => {

    // verifica se disparou o método sendMail no service fakeMailProvider
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    // criar usuário para recuperar a senha dele
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    // recuperar senha passando email de cadastro.
    await sendForgotPasswordEmail.execute({
      email: 'johndoe@example.com',
    });

    // ver se disparou o método sendMail.
    expect(sendMail).toHaveBeenCalled();

  });

  // Este teste deve ser incapaz de recuperar a senha de um usuário inexistente
  it('should not be able to recover a non-existing user password', async () => {

    // teste espera receber um erro do tipo AppError, de usuario inexistente.
    await expect(sendForgotPasswordEmail.execute({
      email: 'johndoe@example.com',
    })).rejects.toBeInstanceOf(AppError);

  });

  // Este teste deve gerar um token de esquecimento de senha.
  it('should generate a forgot password token', async () => {

    // verifica se disparou o método generate no service fakeUserTokenRepository
    const generateToken = jest.spyOn(fakeUserTokenRepository, 'generate');

    // criar usuário para recuperar a senha dele
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    // recuperar senha passando email de cadastro.
    await sendForgotPasswordEmail.execute({
      email: 'johndoe@example.com',
    });

    // ver se disparou o metodo generateToken com o parâmetro user.id
    expect(generateToken).toHaveBeenCalledWith(user.id);
  });

});
