// --------------------------------------------------------------------------------
import { ObjectID } from 'mongodb';
import Notification from '../../infra/typeorm/schemas/Notification';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';

// --------------------------------------------------------------------------------
class NotificatiosRepository implements INotificationsRepository {

  // salvar varias notificações no array de notificaçõs.
  private notifications: Notification[] = [];


  // método create()
  public async create({ content, recipient_id }: ICreateNotificationDTO): Promise<Notification> {

    // cria uma instancia dp objeto notification.
    const notification = new Notification();

    // adiciona no objeto as informações recebidas.
    Object.assign(notification, { id: new ObjectID(), content, recipient_id });

    // salva a notification.
    this.notifications.push(notification);

    // retorna a notification.
    return notification;
  }

}
export default NotificatiosRepository;
