//-------------------------------------------------------------------------------
import fs from 'fs';
import path from 'path';
import uploadConfig from '@config/upload';
import IStorageProvider from '../models/IStorageProvide';

//-------------------------------------------------------------------------------
class DiskStorageProvider implements IStorageProvider {

  // método para salvar o arquivo na pasta tmp e passa para a pasta uploads.
  public async saveFile(file: string): Promise<string> {

    await fs.promises.rename(
      path.resolve(uploadConfig.tmpFolder, file),
      path.resolve(uploadConfig.uploadsFolder, file),
    );

    return file;

  }

  // método para excluir o arquivo da pasta uploads.
  public async deleteFile(file: string): Promise<void> {

    const filePath = path.resolve(uploadConfig.uploadsFolder, file);

    try {
      await fs.promises.stat(filePath);
    } catch {
      return;
    }

    await fs.promises.unlink(filePath);
  }
}

export default DiskStorageProvider;

