// --------------------------------------------------------------------------------
import { inject, injectable } from 'tsyringe';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import { getDaysInMonth, getDate, isAfter } from 'date-fns';

// --------------------------------------------------------------------------------
interface IRequest {
  provider_id: string;
  month: number;
  year: number;
}

type IResponse = Array<{
  day: number;
  available: boolean;
}>;

// --------------------------------------------------------------------------------
@injectable()
class ListProviderMonthAvailabilityService {

  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

  ) { }

  // método para listar a disponibilidade do mês do provedor.
  public async execute({ provider_id, month, year }: IRequest): Promise<IResponse> {

    // buscar todos os agendamentos.
    const appointments = await this.appointmentsRepository.findAllInMonthFromProvider(
      {
        provider_id,
        month,
        year,
      },
    );

    // Pega o número de dias do mes informado.
    const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1));

    // monta um array de 1 até o numero de dias numberOfDaysInMonth
    const eachDayArray = Array.from(
      { length: numberOfDaysInMonth },
      (_, index) => index + 1,
    );

    // Filtra os dias que existem disponibilidade, comparando o array de dias, com o array de agendamentos,
    // se os dias forem iguais monta mapeia no array. E no final retorna os dias e sua disponibilidade.
    const availability = eachDayArray.map(day => {

      // atribui o último horário de um dia para comparar.
      const compareDate = new Date(year, month - 1, day, 23, 59, 59);

      const appointmentsInDay = appointments.filter(appointment => {
        return getDate(appointment.date) === day;
      });

      return {
        day,
        available: isAfter(compareDate, new Date()) && appointmentsInDay.length < 10,
      };
    });

    return availability;

  }
}
export default ListProviderMonthAvailabilityService;
