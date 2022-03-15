// --------------------------------------------------------------------------------
import { inject, injectable } from 'tsyringe';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import { getHours, isAfter } from 'date-fns';

// --------------------------------------------------------------------------------
interface IRequest {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}

type IResponse = Array<{
  hour: number;
  available: boolean;
}>;

// --------------------------------------------------------------------------------
@injectable()
class ListProviderDayAvailabilityService {

  // Construtor recebe como parâmetro as injeções de dependencia(repositorios, providers).
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) { }

  // método para listar a disponibilidade do mês do provedor.
  public async execute({ provider_id, year, month, day }: IRequest): Promise<IResponse> {

    const appointments = await this.appointmentsRepository.findAllInDayFromProvider({
      provider_id,
      year,
      month,
      day,
    });

    // seta a hora inicial de atendimento 8, atendimentosdas 8 as 17. 10 horários/dia.]
    const hourStart = 8;

    // monta um array com os 10 horários do dia, iniciando com variável hourStart[8]
    // array de horas fica eachHourArray[8,9,10,11,12,13,14,15,16,17]
    const eachHourArray = Array.from(
      { length: 10 },
      (_, index) => index + hourStart,
    );

    // pega a data e hora atual.
    const currentDate = new Date(Date.now());

    // Filtra as horas nos dias que existem disponibilidade, comparando o array de horas, com o array de agendamentos,
    // se as horas forem iguais monta mapeia no array. E no final retorna a hora e sua disponibilidade.
    const availability = eachHourArray.map(hour => {
      const hasAppointmentInHour = appointments.find(
        appointment => getHours(appointment.date) === hour,
      );
      // monta a data e hora do agendamento para comparação.
      const compareDate = new Date(year, month - 1, day, hour);

      return {
        hour,
        available: !hasAppointmentInHour && isAfter(compareDate, currentDate),
      }
    });

    return availability;

  }
}
export default ListProviderDayAvailabilityService;
