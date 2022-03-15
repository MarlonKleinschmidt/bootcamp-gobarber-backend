// --------------------------------------------------------------------------------------------------------------------
import IHashProvider from '../models/IHashProvider';

// --------------------------------------------------------------------------------------------------------------------
class FakeHashProvider implements IHashProvider {

  // método para gerar o hash, vai apenas retornar a própria string sem fazer nada.
  public async generateHash(payload: string): Promise<string> {
    return payload;
  }

  // método para comparar o hash, vai apenas comparar a string com o hash, retorna um boolean.
  public async compareHash(payload: string, hashed: string): Promise<boolean> {
    return payload === hashed;
  }

}

export default FakeHashProvider;
