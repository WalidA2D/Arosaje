import { Request, Response } from 'express';
import { ImageInstance } from '../models/Image';
import path from 'path';
import fs from 'fs';
import multer from 'multer';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/images');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  }
});

const upload = multer({ storage });

class ImageController {
  async uploadImage(req: Request, res: Response) {
    upload.single('image')(req, res, async (err: any) => {
      if (err) {
        return res.status(500).json({ msg: 'Erreur lors du téléchargement de l\'image', err });
      }

      try {
        if (!req.file) {
          return res.status(400).json({ msg: 'Aucun fichier sélectionné' });
        }

        const { title, idPost } = req.body;
        const url = req.file.path;

        const existingImages = await ImageInstance.findAll({ where: { idPost } });
        if (existingImages.length >= 5) {
          return res.status(400).json({ msg: 'Limite de 5 images par post atteinte' });
        }

        const newImage = await ImageInstance.create({ title, url, idPost });
        return res.status(201).json({ msg: 'Image téléchargée avec succès', image: newImage });
      } catch (e) {
        return res.status(500).json({ msg: 'Erreur lors de l\'enregistrement de l\'image', err: e });
      }
    });
  }

  async getImagesByPost(req: Request, res: Response) {
    try {
      const { postId } = req.params;
      const images = await ImageInstance.findAll({ where: { idPost: postId } });
      if (!images.length) {
        return res.status(404).json({ msg: 'Aucune image trouvée pour ce post' });
      }
      return res.status(200).json({ images });
    } catch (e) {
      return res.status(500).json({ msg: 'Erreur lors de la récupération des images', err: e });
    }
  }

  async getImageById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const image = await ImageInstance.findByPk(id);
      if (!image) {
        return res.status(404).json({ msg: 'Image non trouvée' });
      }
      return res.status(200).json({ image });
    } catch (e) {
      return res.status(500).json({ msg: 'Erreur lors de la récupération de l\'image', err: e });
    }
  }

  async deleteImage(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const image = await ImageInstance.findByPk(id);
      if (!image) {
        return res.status(404).json({ msg: 'Image non trouvée' });
      }

      fs.unlink(image.dataValues.url, (err) => {
        if (err) {
          console.error('Erreur lors de la suppression du fichier', err);
        }
      });

      await image.destroy();
      return res.status(200).json({ msg: 'Image supprimée avec succès' });
    } catch (e) {
      return res.status(500).json({ msg: 'Erreur lors de la suppression de l\'image', err: e });
    }
  }
}

export default new ImageController();
