// --------------------------------------------------------------------------------
// SOLID - L - Conceito de Liskov
// Interface IAppointmentsRepository
// Adicionar todos os tipos do parâmtros necessários para a criação.
import Appointment from '../infra/typeorm/entities/Appointment';
import ICreateAppointmentDTO from '../dtos/ICreateAppointmentDTO';
import IFindAllInMonthFromProviderDTO from '../dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '../dtos/IFindAllInDayFromProviderDTO';

// --------------------------------------------------------------------------------
export default interface IAppointmentsRepository {

  // método create() precisa receber alguns parametros e retornar
  // o appointment criado. Utiliza Promisse pois vai criar e salvar

  // Conceito DTOS (date transfer objects):
  // Sempre que presisar tipar uma informação composta utilizada para
  // criar, listar, etc utiliza-se um DTO.
  create(data: ICreateAppointmentDTO): Promise<Appointment>;
  // Procura um appointment pela data recebida no parâmtro
  findByDate(date: Date, provider_id: string): Promise<Appointment | undefined>;
  findAllInMonthFromProvider(data: IFindAllInMonthFromProviderDTO): Promise<Appointment[]>;
  findAllInDayFromProvider(data: IFindAllInDayFromProviderDTO): Promise<Appointment[]>;

}
