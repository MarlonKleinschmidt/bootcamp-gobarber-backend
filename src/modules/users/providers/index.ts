// --------------------------------------------------------------------------------------------------------------------
import { container } from 'tsyringe';
import IHashProvider from './HashProvider/models/IHashProvider';
import BCryptHashProvider from './HashProvider/implementations/BCryptHashProvider';

// --------------------------------------------------------------------------------------------------------------------
// O registerSingleton, cria uma única instancia do HashProvider na aplicação.
container.registerSingleton<IHashProvider>('HashProvider', BCryptHashProvider);
