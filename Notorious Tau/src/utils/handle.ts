import { deleteDoc, doc } from "firebase/firestore";
import { ref, deleteObject, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import type { NavigateFunction } from "react-router-dom";

export const handleLogout = async (navigate: NavigateFunction) => {
    try {
          await signOut(auth);
          navigate("/login");
        } catch (error) {
          console.error("Logout Error:", error);
        }
}

export const uploadImage = async(imageFile: File, path: string) => {
    const imagePath = `${path}/${Date.now()}-${imageFile?.name}`;
    const imageRef = ref(storage, imagePath);
    await uploadBytes(imageRef, imageFile);
    const downloadURL = await getDownloadURL(imageRef);
    return { imagePath, downloadURL };
}

export const showMessage = (
    message: string, 
    setMessage: (msg: string) => void, 
    setShowPopup: (show: boolean) => void
) => {
    setMessage(message);
    setShowPopup(true);
}

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

