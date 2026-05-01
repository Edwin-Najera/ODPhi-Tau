import { useState, useEffect, Fragment } from "react";
import { db, storage } from "../../../firebase";
import {
  collection,
  deleteDoc,
  updateDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import type {
  EventItem,
  Awards,
  Event,
  Knights,
  Countdown,
} from "../../EventsFolder/eventData";
import "../../global.css";
import CountdownDisplay from "../CountdownFolder/CountdownDisplay";

type PopupProps = {
  message: string;
  onClose: () => void;
  collectionName: string;
  autoClose?: boolean;
  showCloseButton?: boolean;
  duration?: number;
  showGallery?: boolean;
  hasDate?: boolean;
  hasItems?: boolean;
  activeHouse?: boolean;
};

function Popup({
  message,
  onClose,
  collectionName,
  autoClose = false,
  duration = 1000,
  showGallery = false,
  hasDate = false,
  hasItems = false,
  activeHouse = false,
}: PopupProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingCountdownId, setEditingCountdownId] = useState<string | null>(
    null,
  );
  const [editingKnightId, setEditingKnightId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDate, setEditDate] = useState<string>("");
  const [editTime, setEditTime] = useState<string>("");
  const [editItems, setEditItems] = useState<{ name: string; price: string }[]>(
    [],
  );
  const [editType, setEditType] = useState("");
  const [editName, setEditName] = useState("");
  const [editPosition, setEditPosition] = useState("");
  const [editAwards, setEditAwards] = useState<
    { title: string; year: string }[]
  >([]);
  const [editCountdownEvents, setEditCountdownEvents] = useState<
    {
      title: string;
      date: string;
      location: string;
      startTime: string;
      endTime: string;
    }[]
  >([]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    if (autoClose) {
      timer = setTimeout(() => {
        onClose();
      }, duration);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [autoClose, duration, onClose, collectionName, showGallery]);

  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <p>{message}</p>
      </div>
    </div>
  );
}

export default Popup;
