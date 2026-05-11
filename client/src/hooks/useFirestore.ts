import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  QueryConstraint,
  DocumentData,
  WithFieldValue,
  serverTimestamp,
} from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { db, isFirebaseConfigured } from '../lib/firebase';

export function useCollection<T extends DocumentData>(
  collectionName: string,
  constraints: QueryConstraint[] = []
) {
  const [data, setData] = useState<(T & { id: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setIsLoading(false);
      return;
    }
    const q = query(collection(db, collectionName), ...constraints);
    getDocs(q)
      .then((snap) => {
        setData(snap.docs.map((d) => ({ id: d.id, ...d.data() } as T & { id: string })));
      })
      .catch(setError)
      .finally(() => setIsLoading(false));
  }, [collectionName]);

  return { data, isLoading, error };
}

export function useDocument<T extends DocumentData>(collectionName: string, id: string) {
  const [data, setData] = useState<(T & { id: string }) | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id || !isFirebaseConfigured()) {
      setIsLoading(false);
      return;
    }
    getDoc(doc(db, collectionName, id))
      .then((snap) => {
        setData(snap.exists() ? ({ id: snap.id, ...snap.data() } as T & { id: string }) : null);
      })
      .catch(setError)
      .finally(() => setIsLoading(false));
  }, [collectionName, id]);

  return { data, isLoading, error };
}

export async function addDocument<T extends DocumentData>(
  collectionName: string,
  data: WithFieldValue<T>
): Promise<string> {
  if (!isFirebaseConfigured()) throw new Error('Firebase not configured');
  const ref = await addDoc(collection(db, collectionName), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateDocument(
  collectionName: string,
  id: string,
  data: Partial<DocumentData>
): Promise<void> {
  if (!isFirebaseConfigured()) throw new Error('Firebase not configured');
  await updateDoc(doc(db, collectionName, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteDocument(collectionName: string, id: string): Promise<void> {
  if (!isFirebaseConfigured()) throw new Error('Firebase not configured');
  await deleteDoc(doc(db, collectionName, id));
}

export async function searchDocuments<T extends DocumentData>(
  collectionName: string,
  field: string,
  queryStr: string
): Promise<(T & { id: string })[]> {
  if (!isFirebaseConfigured()) return [];
  const snap = await getDocs(collection(db, collectionName));
  const lower = queryStr.toLowerCase();
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() } as T & { id: string }))
    .filter((item) => {
      const val = (item as Record<string, unknown>)[field];
      return typeof val === 'string' && val.toLowerCase().includes(lower);
    });
}
