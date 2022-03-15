// -----------------------------------------------------------------------------------
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';
import AppError from '@shared/errors/AppError';
import usersRouter from '@modules/users/infra/http/routes/users.routes';

let fakeAppointmentsRespository: FakeAppointmentsRepository;
let listProviderMonthAvailability: ListProviderMonthAvailabilityService;


// -----------------------------------------------------------------------------------
describe('ListProviderMonthAvailability', () => {

  beforeEach(() => {
    fakeAppointmentsRespository = new FakeAppointmentsRepository();
    listProviderMonthAvailability = new ListProviderMonthAvailabilityService(fakeAppointmentsRespository);
  })

  // -----------------------------------------------------
  // Teste deve ser capaz de listar a disponibilidade do mês do provedor.
  it('should be able to list the month availability from provider', async () => {

    // criar agendamento
    await fakeAppointmentsRespository.create({
      provider_id: 'user',
      user_id: '123456',
      //             ano mes dia hr min seg
      date: new Date(2020, 3, 20, 8, 0, 0),
    });

    // criar agendamento
    await fakeAppointmentsRespository.create({
      provider_id: 'user',
      user_id: '123456',
      //             ano mes dia hr min seg
      date: new Date(2020, 4, 20, 8, 0, 0),
    });

    // criar agendamento
    await fakeAppointmentsRespository.create({
      provider_id: 'user',
      user_id: '123456',
      //             ano mes dia hr min seg
      date: new Date(2020, 4, 20, 9, 0, 0),
    });

    // criar agendamento
    await fakeAppointmentsRespository.create({
      provider_id: 'user',
      user_id: '123456',
      date: new Date(2020, 4, 20, 10, 0, 0),
    });

    // criar agendamento
    await fakeAppointmentsRespository.create({
      provider_id: 'user',
      user_id: '123456',
      //             ano mes dia hr min seg
      date: new Date(2020, 4, 20, 11, 0, 0),
    });

    // criar agendamento
    await fakeAppointmentsRespository.create({
      provider_id: 'user',
      user_id: '123456',
      //             ano mes dia hr min seg
      date: new Date(2020, 4, 20, 12, 0, 0),
    });

    // criar agendamento
    await fakeAppointmentsRespository.create({
      provider_id: 'user',
      user_id: '123456',
      //             ano mes dia hr min seg
      date: new Date(2020, 4, 20, 13, 0, 0),
    });
    // criar agendamento
    await fakeAppointmentsRespository.create({
      provider_id: 'user',
      user_id: '123456',
      //             ano mes dia hr min seg
      date: new Date(2020, 4, 20, 14, 0, 0),
    });
    // criar agendamento
    await fakeAppointmentsRespository.create({
      provider_id: 'user',
      user_id: '123456',
      //             ano mes dia hr min seg
      date: new Date(2020, 4, 20, 15, 0, 0),
    });
    // criar agendamento
    await fakeAppointmentsRespository.create({
      provider_id: 'user',
      user_id: '123456',
      //             ano mes dia hr min seg
      date: new Date(2020, 4, 20, 16, 0, 0),
    });
    // criar agendamento
    await fakeAppointmentsRespository.create({
      provider_id: 'user',
      user_id: '123456',
      //             ano mes dia hr min seg
      date: new Date(2020, 4, 20, 17, 0, 0),
    });

    // criar agendamento
    await fakeAppointmentsRespository.create({
      provider_id: 'user',
      user_id: '123456',
      date: new Date(2020, 4, 21, 10, 0, 0),
    });

    const availability = await listProviderMonthAvailability.execute({
      provider_id: 'user',
      year: 2020,
      month: 5,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { day: 19, available: true },
        { day: 20, available: false },
        { day: 21, available: true },
        { day: 22, available: true },
      ]),
    );

  });



});
