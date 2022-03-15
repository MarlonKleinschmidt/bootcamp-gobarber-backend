import Redis, { Redis as RedisClient } from 'ioredis';
import cacheConfig from '@config/cache';
import ICacheProvider from '../models/ICacheProvider';

export default class RedisCacheProvider implements ICacheProvider {

  private client: RedisClient;

  constructor() {
    this.client = new Redis(cacheConfig.config.redis);
  }

  // -----------------------------------------------------------
  public async save(key: string, value: any): Promise<void> {
    await this.client.set(key, JSON.stringify(value));
  };

  // -----------------------------------------------------------
  public async recover<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);

    if (!data) {
      return null;
    }

    const parseData = JSON.parse(data) as T;

    return parseData;

  };

  // -----------------------------------------------------------
  public async invalidate(key: string): Promise<void> {
    await this.client.del(key);
  };


  // -----------------------------------------------------------
  public async invalidatePrefix(prefix: string): Promise<void> {

    // busca todos os registros(CHAVES) de cache com a prefixo
    // passado por parâmetro.
    const keys = await this.client.keys(`${prefix}:*`);

    const pipeline = this.client.pipeline();

    // Para cada registro(chave) encontrado, seleciona para deletar.
    keys.forEach(key => {
      pipeline.del(key);
    });

    // executa o comando pipeline para deletar todos os registro de uma vez.
    await pipeline.exec();

  };

}
