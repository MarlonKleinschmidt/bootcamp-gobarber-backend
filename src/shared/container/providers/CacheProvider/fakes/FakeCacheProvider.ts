// -------------------------------------------------------------------------------
import ICacheProvider from '../models/ICacheProvider';

interface ICacheData {
  [key: string]: string;
}

// -------------------------------------------------------------------------------
export default class FakeCacheProvider implements ICacheProvider {

  // inicializa o cache como um objeto do tipo ICacheData com o conteúdo vazio.
  private cache: ICacheData = {};

  // -----------------------------------------------------------
  public async save(key: string, value: any): Promise<void> {
    this.cache[key] = JSON.stringify(value);
  };

  // -----------------------------------------------------------
  public async recover<T>(key: string): Promise<T | null> {
    const data = this.cache[key];
    if (!data) {
      return null;
    }
    const parseData = JSON.parse(data) as T;
    return parseData;
  };

  // -----------------------------------------------------------
  public async invalidate(key: string): Promise<void> {
    delete this.cache[key];
  };

  // -----------------------------------------------------------
  public async invalidatePrefix(prefix: string): Promise<void> {
    // buscar todas as chaves do cache, e filtrar o cache com as chaves
    // que começam com o `${prefix}:`
    const keys = Object.keys(this.cache).filter(key =>
      key.startsWith(`${prefix}:`),
    );
    // percore o cache agora só com o resultado do filtro e deleta.
    keys.forEach(key => {
      delete this.cache[key];
    });
  };

}
