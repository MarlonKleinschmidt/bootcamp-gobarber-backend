// -----------------------------------------------------------------------------------
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderDayAvailabilityService from './ListProviderDayAvailabilityService';
import AppError from '@shared/errors/AppError';
import usersRouter from '@modules/users/infra/http/routes/users.routes';

let fakeAppointmentsRespository: FakeAppointmentsRepository;
let listProviderDayAvailability: ListProviderDayAvailabilityService;


// -----------------------------------------------------------------------------------
describe('ListProviderDayAvailability', () => {

  beforeEach(() => {
    fakeAppointmentsRespository = new FakeAppointmentsRepository();
    listProviderDayAvailability = new ListProviderDayAvailabilityService(fakeAppointmentsRespository);
  })

  // -----------------------------------------------------
  // Teste deve ser capaz de listar a disponibilidade do dia/mês do provedor.
  it('should be able to list the day availability from provider', async () => {

    // criar agendamento as 14hr
    await fakeAppointmentsRespository.create({
      provider_id: 'user',
      user_id: '123456',
      //             ano mes dia hr min seg
      date: new Date(2020, 4, 20, 14, 0, 0),
    });

    // criar agendamento as 10hr
    await fakeAppointmentsRespository.create({
      provider_id: 'user',
      user_id: '123456',
      //             ano mes dia hr min seg
      date: new Date(2020, 4, 20, 15, 0, 0),
    });

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 20, 11).getTime();
    });

    const availability = await listProviderDayAvailability.execute({
      provider_id: 'user',
      year: 2020,
      month: 5,
      day: 20,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { hour: 8, available: false },
        { hour: 9, available: false },
        { hour: 10, available: false },
        { hour: 13, available: true },
        { hour: 14, available: false },
        { hour: 15, available: false },
        { hour: 16, available: true },
      ]),
    );




  });



});
