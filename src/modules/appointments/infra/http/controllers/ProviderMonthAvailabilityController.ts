// --------------------------------------------------------------------------------
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListProviderMonthAvailabilityService from '@modules/appointments/services/ListProviderMonthAvailabilityService';
// --------------------------------------------------------------------------------
export default class ProviderMonthAvailabilityController {

  // Método index - listagem de todos os usuarios
  // -----------------------------------------------------
  public async index(request: Request, response: Response): Promise<Response> {

    const { provider_id } = request.params;
    const { month, year } = request.query;

    // injeção de dependencia ...
    const listProviderMonthAvailability = container.resolve(
      ListProviderMonthAvailabilityService,
    );

    const availability = await listProviderMonthAvailability.execute({
      provider_id,
      month: Number(month),
      year: Number(year),
    });

    return response.json(availability);
  }
}

