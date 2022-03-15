// --------------------------------------------------------------------------------
import { getHours, isBefore, startOfHour, format } from 'date-fns';
import { injectable, inject } from 'tsyringe';
import Appointment from '../infra/typeorm/entities/Appointment';
import AppError from '@shared/errors/AppError';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { classToClass } from 'class-transformer';

// SOLID => D - Dependeny Inversion

// --------------------------------------------------------------------------------
interface IRequest {
  provider_id: string;
  user_id: string;
  date: Date;
}

// --------------------------------------------------------------------------------
@injectable()
class CreateAppointmentService {

  // Metodo vai receber/injetar a dependencia - como parâmetro o repositótio
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) { }

  // Criar o agendamento
  // Recebe a data, provider_id e user_id.
  // Retorna o agendamento criado.
  public async execute({ date, provider_id, user_id }: IRequest): Promise<Appointment> {

    const appointmentDate = startOfHour(date);

    // procura se já existe um agendamento para a data informada.
    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
      provider_id,
    );

    // se existir o agendamento, dispara um erro e exibe a mensagem.
    if (findAppointmentInSameDate) {
      throw new AppError('This appointment is already booked');
    }

    // se a data do agendamento for antes que agora.
    if (isBefore(appointmentDate, Date.now())) {
      throw new AppError("You can't create an appointment on a past date.")
    }

    // verifica se o usuario é igual ao prestador
    if (user_id === provider_id) {
      throw new AppError("You can't create an appointment with youself.");
    }

    if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
      throw new AppError('You can only create appoitments between 8am and 5pm');
    }

    // caso a data para o agendamento estaja disponível, cria o agendamento.
    const appointment = await this.appointmentsRepository.create({
      provider_id,
      user_id,
      date: appointmentDate,
    });

    // Notificação - formatar a data para colocar no texto da notificação.
    const dateFormatted = format(appointmentDate, "dd/MM/yyyy 'as' HH:mm'h'");

    // Notificação - Cria a notificação para o agendamento.
    await this.notificationsRepository.create({
      recipient_id: provider_id,
      content: `Novo agendamento para o dia ${dateFormatted}`,
    });

    // Cache - deletar/invalidar o cache após a criação do agendamento.
    await this.cacheProvider.invalidate(
      `provider-appointments:${provider_id}:${format(appointmentDate, 'yyyy-M-d')}`
    );

    // retorna o agendamento criado.
    return appointment;

  }

}

export default CreateAppointmentService;
