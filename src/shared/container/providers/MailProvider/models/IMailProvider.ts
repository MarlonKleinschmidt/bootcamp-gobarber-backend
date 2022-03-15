// ----------------------------------------------------
import ISendMailDTO from '../dtos/ISendMailDTO';

// métodos para serem implementados
export default interface IMailProvider {
  sendMail(data: ISendMailDTO): Promise<void>;
}
