import { 
  getFirebaseStorage, 
  isFirebaseClientConfigured 
} from "./client";
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  type FirebaseStorage,
  type StorageReference
} from "firebase/storage";

export function getCmsStorage(): FirebaseStorage | null {
  return getFirebaseStorage();
}

export function isCmsStorageAvailable(): boolean {
  return isFirebaseClientConfigured() && getFirebaseStorage() != null;
}

/**
 * Uploads a file to Firebase Storage and returns its download URL.
 * path: The path within the bucket (e.g., 'cms/heroes/post-id/image.jpg')
 */
export async function uploadCmsFile(file: File, path: string): Promise<string> {
  const storage = getCmsStorage();
  if (!storage) throw new Error("Firebase Storage not configured.");

  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
}

/**
 * Gets a reference to a path in storage.
 */
export function getStorageRef(path: string): StorageReference {
  const storage = getCmsStorage();
  if (!storage) throw new Error("Firebase Storage not configured.");
  return ref(storage, path);
}
