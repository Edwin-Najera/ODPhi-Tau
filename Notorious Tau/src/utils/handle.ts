import { deleteDoc, doc } from "firebase/firestore";
import {
  ref,
  deleteObject,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
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
};

export const handleNavigate = async (
  navigate: NavigateFunction,
  location: string,
  params?: Record<string, string>,
) => {
  const query = params ? `?${new URLSearchParams(params).toString()}` : "";
  navigate(`/${location}${query}`);
};

export const uploadImage = async (imageFile: File, path: string) => {
  const imagePath = `${path}/${Date.now()}-${imageFile?.name}`;
  const imageRef = ref(storage, imagePath);
  await uploadBytes(imageRef, imageFile);
  const downloadURL = await getDownloadURL(imageRef);
  return { imagePath, downloadURL };
};

export const showMessage = (
  message: string,
  type: "save" | "active" | null,
  setPopup: React.Dispatch<
    React.SetStateAction<{
      show: boolean;
      message: string;
      type: "save" | "active" | null;
    }>
  >,
) => {
  setPopup({ show: true, message, type });
};

export const handleDelete = async (
  collectionName: string,
  eventId: string,
  imagePath?: string,
) => {
  //Deleteing images from database
  if (imagePath) {
    const imageRef = ref(storage, imagePath);
    await deleteObject(imageRef);
  }
  //Deleting Firestore document
  await deleteDoc(doc(db, collectionName, eventId));
};

export const handleArrayChange = <T>(
  index: number,
  field: keyof T,
  value: string,
  array: T[],
  setArray: React.Dispatch<React.SetStateAction<T[]>>,
) => {
  const updatedArray = [...array];
  updatedArray[index] = {
    ...updatedArray[index],
    [field]: value,
  };
  setArray(updatedArray);
};

export const handleAddArrayItem = <T>(
  newItem: T,
  array: T[],
  setArray: React.Dispatch<React.SetStateAction<T[]>>,
) => {
  setArray([...array, newItem]);
};

export const handleDeleteArrayItem = <T>(
  index: number,
  array: T[],
  setArray: React.Dispatch<React.SetStateAction<T[]>>,
) => {
  const updatedArray = array.filter((_, i) => i !== index);
  setArray(updatedArray);
};

export const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

export const formatPrice = (value: string | undefined) => {
  if (!value) return "0.00";
  const digits = value.replace(/\D/g, "").replace(/^0+/, "");
  const length = digits.length;
  if (length === 0) return "0.00";
  if (length <= 2) return `0.${digits.padStart(2, "0")}`;
  if (length > 2)
    return `${digits.slice(0, length - 2)}.${digits.slice(length - 2)}`;
};

export const formatPosition = (position: string) => {
  const firstIndex = position.slice(0, 1).toUpperCase();

  return firstIndex + position.slice(1);
};
