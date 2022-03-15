// --------------------------------------------------------------------------------
import { Request, Response } from 'express';
import { parseISO } from 'date-fns'; // Manipulação de datas...
import { container } from 'tsyringe';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

// --------------------------------------------------------------------------------
export default class AppointmentsController {

  // Método create
  // recebe a requisição com os dados do appointment,
  // Cria um novo appointment(agendamento) e retorna o agendamento criado.
  // -----------------------------------------------------
  public async create(request: Request, response: Response): Promise<Response> {

    // pega usuário logado.
    const user_id = request.user.id;

    const { provider_id, date } = request.body;

    /* sem injeção de dependencia ...
    // Instancia um novo repositório
    const appointmentsRepository = new AppointmentsRepository();
    // cria uma instancia do serviço de criação de appointments(agendamentos).
    const createAppointment = new CreateAppointmentService(appointmentsRepository);
    */

    // COM injeção de dependencia ...
    const createAppointment = container.resolve(CreateAppointmentService);

    const appointment = await createAppointment.execute({
      date,
      user_id,
      provider_id,
    });

    return response.json(appointment);
  }
}
