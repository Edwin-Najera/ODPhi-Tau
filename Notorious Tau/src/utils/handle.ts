import { deleteDoc, doc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { db, storage } from "../firebase";

export const useDelete = async (collectionName: string, eventId: string, imagePath?: string) => {
    //Deleteing images from database
    const imageRef = ref(storage, imagePath);
        await deleteObject(imageRef);
    
        //Deleting Firestore document
        await deleteDoc(doc(db, collectionName, eventId));
}

