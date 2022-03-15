// --------------------------------------------------------------------------------
import { getMongoRepository, MongoRepository } from 'typeorm';
import Notification from '../schemas/Notification';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';

// --------------------------------------------------------------------------------
class NotificatiosRepository implements INotificationsRepository {

  // Coloca a TIPAGEM no repositótio
  private ormRepository: MongoRepository<Notification>;

  // método construtor
  constructor() {
    // Função getRepository CRIA o repositório
    this.ormRepository = getMongoRepository(Notification, 'mongo');
    // agora o this.ormRepository possui todos os métodos do typeOrm
  }

  // método create()
  public async create({ content, recipient_id }: ICreateNotificationDTO): Promise<Notification> {

    // cria a notification com as informações recebidas.
    const notification = this.ormRepository.create({
      content,
      recipient_id
    });

    // salva a notification.
    await this.ormRepository.save(notification);

    // retorna a notification.
    return notification;
  }

}
export default NotificatiosRepository;
