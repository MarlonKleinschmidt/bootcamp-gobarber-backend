// --------------------------------------------------------------------------------
import { getRepository, Repository, Raw } from 'typeorm';
import Appointment from '../entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';
// --------------------------------------------------------------------------------
// NOTA: ao fazer os extends Repository<Appointment>, essa classe recebe todos os
// metodos de forma automática, create() save(), métodos que o proprio
// typeOrm cria.
// Vamos remover o extends Repository<Appointment>, para não mais um reositório do typeOrm
// para criar nosso próprio repositótio, criando todos os metodos create() save()
// para ficar mais facil a manutenção.
class AppointmentsRepository implements IAppointmentsRepository {

  // Coloca a TIPAGEM no repositótio
  private ormRepository: Repository<Appointment>;

  // método construtor
  constructor() {
    // Função getRepository CRIA o repositório
    this.ormRepository = getRepository(Appointment);
    // agora o this.ormRepository possui todos os métodos do typeOrm
  } // ...

  // método create()
  public async create({ provider_id, user_id, date, }: ICreateAppointmentDTO): Promise<Appointment> {

    // cria o appointmente com as informações recebidas.
    const appointment = this.ormRepository.create({ provider_id, user_id, date });

    // salva o appointmente.
    await this.ormRepository.save(appointment);

    // retorna o appointment.
    return appointment;
  } // ...

  // método busca agendamento por data.
  public async findByDate(date: Date, provider_id: string): Promise<Appointment | undefined> {
    const findAppointment = await this.ormRepository.findOne({
      where: { date, provider_id },
    });

    return findAppointment;
  } // ...

  // método findAllInMonthFromProvider() para buscar um agendamento por dia/mes/prestador.
  public async findAllInDayFromProvider({ provider_id, day, month, year }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
    const parsedDay = String(day).padStart(2, '0');
    const parsedMonth = String(month).padStart(2, '0');

    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(dateFieldName =>
          `to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`,
        ),
      },
      relations: ['user'],
    });
    return appointments;
  }

  // método findAllInDayFromProvider() para buscar um agendamento por mes/prestador.
  public async findAllInMonthFromProvider({ provider_id, month, year }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
    const parsedMonth = String(month).padStart(2, '0');

    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(dateFieldName =>
          `to_char(${dateFieldName}, 'MM-YYYY') = '${parsedMonth}-${year}'`,
        ),
      }
    });
    return appointments;
  }

}
// ...

export default AppointmentsRepository;
