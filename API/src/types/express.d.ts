import { UserInstance, UserAttributes } from "../models/user";
import { File } from "multer"

declare global {
  namespace Express {
    interface Request {
      user?: UserAttributes;
      file?: File;
      files?: File[];
    }
  }
}
