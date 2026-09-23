import { AppState } from '../types';

export const INITIAL_STATE: AppState = {
  personalDetails: {
    name: 'MD FARHAD MIA',
    nameArabic: 'مد فرهد ميا',
    idNumber: '2602801801',
    birthCity: '-',
    birthCountry: 'Bangladesh',
    dateOfBirth: '01/01/1983',
    birthDateHijri: '١٩٨٣/٠١/٠١',
    maritalStatus: 'SINGLE',
    sponsorshipTransfers: '0',
    religion: 'Islam',
    workPermit: 'Valid / Active',
    profession: 'Construction Worker',
    professionArabic: 'عامل انشاءات',
    employerId: '7001596753',
    employerName: 'شركة فرع شركة كالباتارو للمشاريع الدولية المحدودة',
    issuePlace: 'شركة العلم لامن المعلومات',
    workPlace: 'منطقة الرياض',
    expiryDateHijri: '٢٠٢٦/١٠/٠٥',
  },
  documents: [
    {
      id: 'doc-1',
      title: 'Resident ID',
      type: 'resident_id',
      number: '2602801801',
      issuing: '24/04/2025',
      expiry: '05/10/2026',
      extra: {
        version: '1',
      },
    },
    {
      id: 'doc-2',
      title: 'Driving License',
      type: 'license',
      number: 'DL-99203177',
      issuing: '-',
      expiry: '08/09/2026',
    },
    {
      id: 'doc-3',
      title: 'My Passport',
      type: 'passport',
      number: 'A07421900',
      issuing: '04/04/2023',
      expiry: '03/04/2033',
      extra: {
        type: 'Normal',
        issuingCity: 'بنجلادش',
        deposit: 'SAR 0.00',
        status: '-',
      },
    },
    {
      id: 'doc-4',
      title: 'My Visa',
      type: 'visa',
      number: 'VISA-44521',
      issuing: '-',
      expiry: '22/01/2027',
      extra: {
        type: 'Work Visa',
        validity: 'Active',
      },
    },
  ],
  visuals: {
    profilePhoto: '',
    backgroundImage: '',
    loginScreenImage: '',
    headerLogo: '',
    headerLogoScale: 1.5,
    homeDigitalIdImage: '',
  },
  loginConfig: {
    username: '2502740083',
    password: 'Aa123456',
    logoImage: '',
    otpMobile: '*****5773',
  },
};

const STORAGE_KEY = 'absher_native_offline_data_v1';
const IDB_NAME = 'AbsherOfflineDB';
const IDB_STORE = 'app_state_store';
const IDB_KEY = 'current_state';

// Helper to open IndexedDB
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not available'));
      return;
    }
    const request = indexedDB.open(IDB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) {
        db.createObjectStore(IDB_STORE);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Asynchronously save to IndexedDB
export async function saveToIndexedDB(state: AppState): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(IDB_STORE, 'readwrite');
    const store = tx.objectStore(IDB_STORE);
    store.put(state, IDB_KEY);
  } catch (err) {
    console.warn('IndexedDB save failed:', err);
  }
}

// Asynchronously load from IndexedDB
export async function loadFromIndexedDB(): Promise<AppState | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(IDB_STORE, 'readonly');
      const store = tx.objectStore(IDB_STORE);
      const req = store.get(IDB_KEY);
      req.onsuccess = () => {
        resolve(req.result || null);
      };
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

export function loadAppState(): AppState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const loadedLoginConfig = {
        ...INITIAL_STATE.loginConfig,
        ...(parsed.loginConfig || {}),
      };
      // If previous default credentials were present, migrate to the requested defaults
      if (loadedLoginConfig.username === '2602801801') {
        loadedLoginConfig.username = '2502740083';
      }
      if (loadedLoginConfig.password === 'Ayat007007') {
        loadedLoginConfig.password = 'Aa123456';
      }

      return {
        ...INITIAL_STATE,
        ...parsed,
        personalDetails: {
          ...INITIAL_STATE.personalDetails,
          ...(parsed.personalDetails || {}),
        },
        visuals: {
          ...INITIAL_STATE.visuals,
          ...(parsed.visuals || {}),
        },
        loginConfig: loadedLoginConfig,
        documents: parsed.documents && parsed.documents.length > 0 ? parsed.documents : INITIAL_STATE.documents,
      };
    }
  } catch (err) {
    console.error('Failed to load local state:', err);
  }
  return INITIAL_STATE;
}

export function saveAppState(state: AppState): boolean {
  // Always trigger async IndexedDB save for unlimited offline persistence
  saveToIndexedDB(state);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch (err) {
    console.warn('localStorage quota warning (saved safely in IndexedDB):', err);
    // If quota exceeded in localStorage, try saving without heavy image blobs if needed
    try {
      const compactState: AppState = {
        ...state,
        documents: state.documents.map((d) => ({
          ...d,
          // keep image if short or thumbnail
          image: d.image && d.image.length > 300000 ? d.image.slice(0, 50) + '...' : d.image,
        })),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(compactState));
    } catch {
      // Even if localStorage fails completely, IndexedDB has the complete full state
    }
    return true;
  }
}

/**
 * Saves current app state as a JSON file directly into device storage (Downloads / File Manager)
 */
export function exportToDeviceStorage(state: AppState): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
  const downloadAnchor = document.createElement('a');
  const dateStr = new Date().toISOString().split('T')[0];
  const filename = `absher_offline_storage_${dateStr}.json`;
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', filename);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

/**
 * Imports state from a JSON file picked from the device file manager
 */
export function importFromDeviceStorage(file: File): Promise<AppState> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        if (parsed.personalDetails && Array.isArray(parsed.documents)) {
          resolve(parsed as AppState);
        } else {
          reject(new Error('Invalid backup file format'));
        }
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.readAsText(file);
  });
}
