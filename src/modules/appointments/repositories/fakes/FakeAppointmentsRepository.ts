// -------------------------------------------------------------------------------------------------------------------
import { uuid } from 'uuidv4';
import { isEqual, getMonth, getYear, getDate } from 'date-fns';
import Appointment from '../../infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';

// -------------------------------------------------------------------------------------------------------------------
class AppointmentsRepository implements IAppointmentsRepository {

  // variavel appointments substitui o banco de dados,
  // contem um array de appointments utilizado para salvar as informações.
  private appointments: Appointment[] = [];

  // ---------------------------------------------------------
  // método findByDate() para buscar um agendamento por data.
  public async findByDate(date: Date, provider_id: string): Promise<Appointment | undefined> {

    // Percorre o array(tabela) de agendamentos e procura pela data.
    const findAppointment = this.appointments.find(
      appointment =>
        isEqual(appointment.date, date) &&
        appointment.provider_id === provider_id,
    );

    return findAppointment;

  }


  // método findAllInMonthFromProvider() para buscar um agendamento por mes/prestador.
  public async findAllInMonthFromProvider({ provider_id, month, year }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {

    // Percorre o array(tabela) de agendamentos e filtra pelo id,mes,ano.
    const appointments = this.appointments.filter(appointment =>
      appointment.provider_id === provider_id &&
      getMonth(appointment.date) + 1 === month &&
      getYear(appointment.date) === year
    );
    return appointments;
  }

  // método findAllInDayFromProvider() para buscar as horas agendamento por dia/mes/prestador.
  public async findAllInDayFromProvider({ provider_id, day, month, year }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {

    // Percorre o array(tabela) de agendamentos e filtra pelo id,mes,ano.
    const appointments = this.appointments.filter(appointment =>
      appointment.provider_id === provider_id &&
      getDate(appointment.date) === day &&
      getMonth(appointment.date) + 1 === month &&
      getYear(appointment.date) === year
    );
    return appointments;
  }


  // ---------------------------------------------------------
  // método create() para criar um novo agendamento...
  public async create({ provider_id, user_id, date, }: ICreateAppointmentDTO): Promise<Appointment> {

    // ---------------------------------------------------------
    // criar appointment com o new, pois nao temos o metodo crate do typeorm.
    const appointment = new Appointment();

    // ---------------------------------------------------------
    // Preencher as informações provider_id e date do agendamento.
    // Maneiras de atribuir os valores para o objeto Appointment.
    //   Primeira forma, mais verbosa.
    //      appointment.id = uuid();
    //      appointment.date = date;
    //      appointment.provider_id = provider_id;
    //  OU
    //    Segunda forma, clean code.
    //  Object.assign(appointment, { id: uuid(), date, provider_id });
    Object.assign(appointment, { id: uuid(), date, provider_id, user_id });

    // salvar as informações no array(banco) de agendamentos.
    this.appointments.push(appointment);

    // no fim da criação do agendamento, retorna o agendamento.
    // por causa do retorno do método. Promise<Appointment>
    return appointment;

  }

}

export default AppointmentsRepository;
