// --------------------------------------------------------------------------------
import { inject, injectable } from 'tsyringe';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import Appointment from '../infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import { classToClass } from 'class-transformer';

// --------------------------------------------------------------------------------
interface IRequest {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}

// --------------------------------------------------------------------------------
@injectable()
class ListProviderAppointmentsService {

  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) { }

  // método para listar a disponibilidade do mês do provedor.
  public async execute({ provider_id, day, month, year }: IRequest): Promise<Appointment[]> {

    // Chave de acesso ao cache dos cagendamentos do prestador naquele dia/data.
    const cacheKey = `provider-appointments:${provider_id}:${year}-${month}-${day}`;

    // busca os agendamentos do prestador no cache.
    let appointments = await this.cacheProvider.recover<Appointment[]>(
      cacheKey,
    );


    // se não existir cache, efetua busca no banco de dados.
    if (!appointments) {
      appointments = await this.appointmentsRepository.findAllInDayFromProvider({
        provider_id,
        year,
        month,
        day,
      });

      //console.log('Queery executada.!!!');

      // Salva o cache de agendamentos do prestador
      await this.cacheProvider.save(
        cacheKey,
        classToClass(appointments),
      );
    }

    return appointments;

  }
}
export default ListProviderAppointmentsService;
