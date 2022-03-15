// -----------------------------------------------------------------------------------
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

// -----------------------------------------------------------------------------------
let fakeAppointmentsRespository: FakeAppointmentsRepository;
let listProviderAppointments: ListProviderAppointmentsService;
let fakeCacheProvider: FakeCacheProvider;
// -----------------------------------------------------------------------------------
describe('ListProviderAppointments', () => {

  beforeEach(() => {
    fakeAppointmentsRespository = new FakeAppointmentsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    listProviderAppointments = new ListProviderAppointmentsService(
      fakeAppointmentsRespository,
      fakeCacheProvider,
    );
  })

  // -----------------------------------------------------
  // Teste deve ser capaz de listar a disponibilidade do mês do provedor.
  it('should be able to list the appointment on a specific day ', async () => {

    // criar agendamento
    const appointment1 = await fakeAppointmentsRespository.create({
      provider_id: 'provider',
      user_id: 'user',
      //             ano mes dia hr min seg
      date: new Date(2020, 4, 20, 14, 0, 0),
    });

    // criar agendamento
    const appointment2 = await fakeAppointmentsRespository.create({
      provider_id: 'provider',
      user_id: 'user',
      //             ano mes dia hr min seg
      date: new Date(2020, 4, 20, 15, 0, 0),
    });

    const appointmens = await listProviderAppointments.execute({
      provider_id: 'provider',
      year: 2020,
      month: 5,
      day: 20,
    });

    expect(appointmens).toEqual([
      appointment1,
      appointment2,
    ]);
  });

});
