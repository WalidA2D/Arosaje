declare module "firebase/storage" {
  import { Storage, Ref, UploadMetadata } from "firebase/storage";

  export function getStorage(): Storage;
  export function ref(storage: Storage, path: string): Ref;
  export function uploadBytesResumable(ref: Ref, data: any, metadata?: UploadMetadata): Promise<any>;
  export function getDownloadURL(ref: Ref): Promise<string>;
  export function deleteObject(ref: Ref): Promise<void>;
}
