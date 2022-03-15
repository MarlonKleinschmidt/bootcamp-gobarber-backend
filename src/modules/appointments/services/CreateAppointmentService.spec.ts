// -----------------------------------------------------------------------------------
import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateApointmentServise from './CreateAppointmentService';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

// Forma dentro do JEST de categorizar os testes
// describe() - Cria como se fosse uma categoria
// duas formas de executar os testes:
// 1 - test(), 2 - it() - isso ou isto.

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateApointmentServise;
let fakeNotificationsRepository: FakeNotificationsRepository;
let fakeCacheProvider: FakeCacheProvider;
// -----------------------------------------------------------------------------------
describe('CreateAppointment', () => {

  beforeEach(() => {
    // Instancia um repositório fake de agendamentos (em memória)
    fakeAppointmentsRepository = new FakeAppointmentsRepository();

    fakeNotificationsRepository = new FakeNotificationsRepository();

    fakeCacheProvider = new FakeCacheProvider();

    // Instancia um serviço de agendamento passando o repositório FAKE como parâmetro.
    createAppointment = new CreateApointmentServise(
      fakeAppointmentsRepository,
      fakeNotificationsRepository,
      fakeCacheProvider,
    );

  });

  // -----------------------------------------------------
  // Teste para verificar se criou um agendamento.
  it('should be able to create a new appointment', async () => {

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    // preenche o agendamento com as informações e cria o agendamento.
    const appointment = await createAppointment.execute({
      date: new Date(2020, 4, 10, 13),
      provider_id: 'provider-id',
      user_id: 'user-id',
    });

    // O TESTE espera que exista a propriedade id no agendamento,
    // isso garante que ele foi criado.
    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('provider-id');
  });

  // -----------------------------------------------------
  // Teste para verificar se já existe um agendamento para a data informada.
  it('should not be able to create a new appointment on the same time', async () => {

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 13).getTime();
    });

    // Variável para pereencher o valor da data para o agendamento
    const appointmentDate = new Date(2020, 4, 10, 13);

    // preenche o agendamento com as informações e cria o agendamento.
    await createAppointment.execute({
      date: appointmentDate,
      provider_id: 'provider-id',
      user_id: 'user-id',
    });

    // Tenta criar um novo agendamento com a mesma data, não pode deixar.
    await expect(createAppointment.execute({
      date: appointmentDate,
      provider_id: 'provider-id',
      user_id: 'user-id',
    })).rejects.toBeInstanceOf(AppError);

  });

  it('should not be able to create an appointment on a past date', async () => {

    // Ao disparar a função Date.now() retornaremos da função,
    // a data abaixo 2020, 4, 10, 12).
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });


    // Tenta criar um novo agendamento com a mesma data, não pode deixar.
    await expect(createAppointment.execute({
      date: new Date(2020, 4, 10, 11),
      provider_id: 'provider-id',
      user_id: 'user-id',
    })).rejects.toBeInstanceOf(AppError);

  });

  it('should not be able to create an appointment with same user as provider', async () => {

    // Ao disparar a função Date.now() retornaremos da função,
    // a data abaixo 2020, 4, 10, 12).
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    // Tenta criar um novo agendamento com o usuario e prestador com o mesmo id. com ele mesmo! mesma data, não pode deixar.
    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 10, 13),
        provider_id: 'user-id',
        user_id: 'user-id',
      })).rejects.toBeInstanceOf(AppError);

  });

  it('should not be able to create an appointment before 8am and after 5pm', async () => {

    // Ao disparar a função Date.now() retornaremos da função,
    // a data abaixo 2020, 4, 10, 12).
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 11, 7),
        provider_id: 'provider-id',
        user_id: 'user-id',
      })).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 11, 18),
        provider_id: 'provider-id',
        user_id: 'user-id',
      })).rejects.toBeInstanceOf(AppError);

  });

});
