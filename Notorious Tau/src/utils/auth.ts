import { useEffect, useState } from "react";
import { query, collection, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import type {
  Knights,
  BaseDocument,
  Countdown,
} from "../components/EventsFolder/eventData";

interface CollectionOptions {
  collectionName: string;
  activeHouse?: boolean;
  onlyPhotos?: boolean;
}

const getUserRole = (callback: (role: string | null) => void) => {
  return auth.onAuthStateChanged(async (user) => {
    if (!user) {
      callback(null);
      return;
    }

    const tokenResult = await user.getIdTokenResult();
    callback(tokenResult.claims.role as string);
  });
};

export const useAuthRole = () => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setUserRole(null);
        setEmail(null);
        return;
      }

      setEmail(user.email);

      getUserRole((role) => setUserRole(role || "none"));
    });

    return () => unsubscribe();
  }, []);

  return { userRole, email };
};

export const useCollection = ({
  collectionName,
  activeHouse,
  onlyPhotos,
}: CollectionOptions) => {
  const [documents, setDocuments] = useState<any[]>([]);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    if (!collectionName) return;

    const q = query(
      collection(db, collectionName),
      orderBy("createdAt", "desc"),
    );

    unsubscribe = onSnapshot(q, (snapshot) => {
      if (activeHouse) {
        setDocuments(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<Knights, "id">),
          })),
        );
      } else if (collectionName === "countdown") {
        setDocuments(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<Countdown, "id">),
          })),
        );
      } else {
        const eventsList: BaseDocument[] = snapshot.docs.map((doc) => {
          const rawData = doc.data();

          return {
            id: doc.id,
            ...rawData,
            date: rawData.date?.toDate ? rawData.date.toDate() : rawData.date,
          } as BaseDocument;
        });

        if (onlyPhotos) {
          setDocuments(
            eventsList.filter(
              (event) =>
                event.id.startsWith("alumni_") ||
                event.id.startsWith("gallery_"),
            ),
          );
        } else {
          setDocuments(eventsList);
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [collectionName]);

  return documents;
};
