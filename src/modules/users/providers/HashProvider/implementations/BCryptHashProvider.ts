// ----------------------------------------------------------------------------
import { hash, compare } from 'bcryptjs';
import IHashProvider from '../models/IHashProvider';

class BCryptHashProvider implements IHashProvider {

  // método para gerar o hash da senha
  public async generateHash(payload: string): Promise<string> {
    return hash(payload, 8);
  }

  // método para comparar o hash da senha
  public async compareHash(payload: string, hashed: string): Promise<boolean> {
    return compare(payload, hashed);
  }

}

export default BCryptHashProvider;
