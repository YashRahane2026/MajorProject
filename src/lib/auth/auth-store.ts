export type UserRole = 'admin' | 'police' | 'court' | 'custodial';

export interface UserAccount {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  badgeNumber: string;
  department: string;
  designation: string;
  station: string;
  createdAt: string;
}

export const SEEDED_ACCOUNTS: UserAccount[] = [
  {
    email: 'admin@crimetrack.gov.in',
    password: 'admin',
    name: 'Admin Officer',
    role: 'admin',
    badgeNumber: 'CT-NGP-001',
    department: 'Nagpur Police Commissionerate',
    designation: 'Superintendent of Police (Admin & Analytics)',
    station: 'Commissionerate HQ, Civil Lines, Nagpur',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    email: 'police@crimetrack.gov.in',
    password: 'police',
    name: 'Senior Inspector',
    role: 'police',
    badgeNumber: 'CT-NGP-104',
    department: 'Nagpur Crime Branch',
    designation: 'Senior Police Inspector (Biometrics Unit)',
    station: 'Sitabuldi Police Station, Nagpur',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    email: 'court@crimetrack.gov.in',
    password: 'court',
    name: 'Public Prosecutor',
    role: 'court',
    badgeNumber: 'CT-NGP-208',
    department: 'Nagpur District & Sessions Court',
    designation: 'Chief Public Prosecutor',
    station: 'District Court Complex, Nagpur',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    email: 'custodial@crimetrack.gov.in',
    password: 'custodial',
    name: 'Jail Superintendent',
    role: 'custodial',
    badgeNumber: 'CT-NGP-312',
    department: 'Nagpur Central Prison',
    designation: 'Superintendent of Custody & Inmate Records',
    station: 'Central Prison, Wardha Road, Nagpur',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    email: 'officer@crimetrack.gov.in',
    password: 'officer',
    name: 'Investigating Officer',
    role: 'police',
    badgeNumber: 'CT-NGP-401',
    department: 'Nagpur Special Task Force',
    designation: 'Investigating Officer',
    station: 'Dhantoli Police Station, Nagpur',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
];

const AUTH_STORAGE_KEY = 'crimetrack_registered_users';
const memoryRegisteredUsers: UserAccount[] = [];

export function getStoredUsers(): UserAccount[] {
  const baseUsers = [...SEEDED_ACCOUNTS, ...memoryRegisteredUsers];
  if (typeof window === 'undefined') return baseUsers;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return baseUsers;
    const parsed = JSON.parse(raw) as UserAccount[];
    if (Array.isArray(parsed)) {
      const emails = new Set(parsed.map((u) => u.email.toLowerCase()));
      const unaddedBase = baseUsers.filter(
        (s) => !emails.has(s.email.toLowerCase())
      );
      return [...parsed, ...unaddedBase];
    }
  } catch (e) {
    console.error('Error reading registered users:', e);
  }
  return baseUsers;
}

export function saveUserToStorage(user: UserAccount) {
  // Always keep in memory (for SSR and tests)
  const existingMemIdx = memoryRegisteredUsers.findIndex(
    (u) => u.email.toLowerCase() === user.email.toLowerCase()
  );
  if (existingMemIdx >= 0) {
    memoryRegisteredUsers[existingMemIdx] = user;
  } else {
    memoryRegisteredUsers.unshift(user);
  }

  if (typeof window === 'undefined') return;
  try {
    const current = getStoredUsers();
    const filtered = current.filter(
      (u) => u.email.toLowerCase() !== user.email.toLowerCase()
    );
    const updated = [user, ...filtered];
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving registered user:', e);
  }
}

export function formatNameFromEmail(email: string): string {
  const localPart = email.split('@')[0] || 'Officer';
  const cleaned = localPart.replace(/[^a-zA-Z._-]/g, ' ');
  const parts = cleaned.split(/[._\s-]+/).filter(Boolean);
  if (parts.length === 0) return 'Officer';
  return parts
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
    .join(' ');
}

export interface AuthResult {
  success: boolean;
  isNew: boolean;
  user?: UserAccount;
  error?: string;
}

export function authenticateOrRegisterUser(
  rawEmail: string,
  rawPassword: string
): AuthResult {
  const email = (rawEmail || '').trim().toLowerCase();
  const password = (rawPassword || '').trim();

  if (!email || !password) {
    return {
      success: false,
      isNew: false,
      error: 'Please enter both an email address and a password.',
    };
  }

  const allUsers = getStoredUsers();
  const existingUser = allUsers.find(
    (u) => u.email.toLowerCase() === email
  );

  if (existingUser) {
    // Check password match (accepts exact match, short variant, or '123' suffix)
    const matchesPassword =
      existingUser.password === password ||
      (existingUser.password + '123') === password ||
      existingUser.password === (password + '123') ||
      (password.length >= 4 && existingUser.password.toLowerCase() === password.toLowerCase());

    if (matchesPassword) {
      activateUserSession(existingUser);
      return {
        success: true,
        isNew: false,
        user: existingUser,
      };
    } else {
      return {
        success: false,
        isNew: false,
        error: `Incorrect password for registered account ${email}. Please check and try again.`,
      };
    }
  }

  // If NO match -> auto-register this person!
  const generatedName = formatNameFromEmail(email);
  let assignedRole: UserRole = 'admin'; // Admin grants full access to suspect management, biometric matching, and lifecycle
  if (email.includes('court') || email.includes('judge') || email.includes('law')) {
    assignedRole = 'court';
  } else if (email.includes('jail') || email.includes('prison') || email.includes('custod')) {
    assignedRole = 'custodial';
  }

  const randomBadgeNum = Math.floor(1000 + Math.random() * 9000);
  const newUser: UserAccount = {
    email,
    password,
    name: generatedName,
    role: assignedRole,
    badgeNumber: `CT-NGP-${randomBadgeNum}`,
    department: 'Nagpur Police Commissionerate',
    designation: 'Special Investigative Officer',
    station: 'Central Division, Nagpur',
    createdAt: new Date().toISOString(),
  };

  saveUserToStorage(newUser);
  activateUserSession(newUser);

  // Sync to server auth API asynchronously
  if (typeof window !== 'undefined') {
    fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    }).catch(() => {});
  }

  return {
    success: true,
    isNew: true,
    user: newUser,
  };
}

export function activateUserSession(user: UserAccount) {
  if (typeof window === 'undefined') return;
  document.cookie = `demo_role=${user.role}; path=/; max-age=86400`;
  document.cookie = `crimetrack_user_email=${encodeURIComponent(user.email)}; path=/; max-age=86400`;
  localStorage.setItem('demo_role', user.role);
  localStorage.setItem('demo_user', user.name);
  localStorage.setItem('auth_email', user.email);
  localStorage.setItem('auth_user_details', JSON.stringify(user));
  window.dispatchEvent(
    new CustomEvent('crimetrack-role-change', {
      detail: { role: user.role, name: user.name, email: user.email },
    })
  );
}
