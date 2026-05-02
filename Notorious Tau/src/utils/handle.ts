import { deleteDoc, doc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { db, storage } from "../firebase";

export const handleDelete = async (collectionName: string, eventId: string, imagePath?: string) => {
    //Deleteing images from database
    if (imagePath) {
        const imageRef = ref(storage, imagePath);
        await deleteObject(imageRef);
    }
    //Deleting Firestore document
    await deleteDoc(doc(db, collectionName, eventId));
}

export const handleArrayChange = <T,>(
    index: number,
    field: keyof T,
    value: string,
    array: T[],
    setArray: React.Dispatch<React.SetStateAction<T[]>>
) => {
    const updatedArray = [...array];
    updatedArray[index] = {
        ...updatedArray[index],
        [field]: value,
    };
    setArray(updatedArray);
}

export const handleAddArrayItem = <T,>(
  newItem: T,
  array: T[],
  setArray: React.Dispatch<React.SetStateAction<T[]>>
) => {
  setArray([...array, newItem]);
};

export const handleDeleteArrayItem = <T,>(
    index: number, 
    array: T[], 
    setArray: React.Dispatch<React.SetStateAction<T[]>>
) => {
    const updatedArray = array.filter((_, i) => i !== index);
    setArray(updatedArray);
}

