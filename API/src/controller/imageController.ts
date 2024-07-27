import { Request, Response } from 'express';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { ImageInstance } from '../models/Image';

class ImageController {
  async uploadImage(req: Request, res: Response) {
  }
}

export default new ImageController();
