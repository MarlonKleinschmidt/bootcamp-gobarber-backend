import {
  ObjectID,
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ObjectIdColumn
} from "typeorm";


@Entity('notifications')
class Notification {

  @ObjectIdColumn()
  id: ObjectID; // padrao do formato de armazenamento de index(id) do mongodb

  @Column()
  content: string;

  @Column('uuid')
  recipient_id: string;

  @Column({ default: false })
  read: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

}

export default Notification;
