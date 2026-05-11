import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import seedData from '../data/seed.json';

const COLLECTIONS = ['emissionFactors', 'glossaryTerms', 'quizQuestions', 'usefulLinks'] as const;

async function isCollectionEmpty(col: string): Promise<boolean> {
  const snap = await getDocs(collection(db, col));
  return snap.empty;
}

async function seedCollection(col: string, items: Record<string, unknown>[]): Promise<void> {
  for (const item of items) {
    await addDoc(collection(db, col), item);
  }
  console.log(`Seeded ${items.length} items to ${col}`);
}

export async function seedFirestore(): Promise<void> {
  if (!isFirebaseConfigured()) {
    console.info('Firebase not configured — using local seed data only');
    return;
  }

  try {
    const seed = seedData as Record<string, Record<string, unknown>[]>;

    for (const col of COLLECTIONS) {
      const empty = await isCollectionEmpty(col);
      if (empty && seed[col] && seed[col].length > 0) {
        await seedCollection(col, seed[col]);
      }
    }
  } catch (err) {
    console.warn('Seed failed (non-critical):', err);
  }
}
