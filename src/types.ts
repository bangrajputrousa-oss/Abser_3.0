export interface UserPersonalDetails {
  name: string;
  nameArabic: string;
  idNumber: string;
  birthCity: string;
  birthCountry: string;
  dateOfBirth: string;
  maritalStatus: string;
  sponsorshipTransfers: string;
  religion: string;
  workPermit: string;
  profession: string;
  professionArabic: string;
  employerId: string;
  employerName: string;
  issuePlace: string;
  workPlace: string;
  expiryDateHijri: string;
  birthDateHijri: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  number: string;
  issuing: string;
  expiry: string;
  image?: string; // base64 or URL
  type?: 'resident_id' | 'license' | 'passport' | 'visa' | 'custom';
  extra?: Record<string, string>;
}

export interface VisualSettings {
  profilePhoto: string;
  backgroundImage: string;
  loginScreenImage: string;
  headerLogo?: string;
  headerLogoScale?: number; // 1.0, 1.5 (1x bigger), or 2.0
  homeDigitalIdImage?: string; // Dedicated directly uploaded Home Page Digital ID card
}

export interface LoginConfig {
  username: string; // Required ID Number or Username
  password: string; // Required Password
  logoImage?: string; // Logo uploaded in Control Panel (white marked area)
  otpMobile?: string; // Masked mobile displayed on OTP screen (e.g. '*****5773')
}

export interface AppState {
  personalDetails: UserPersonalDetails;
  documents: DocumentItem[];
  visuals: VisualSettings;
  loginConfig?: LoginConfig;
}

export type ScreenType =
  | 'home'
  | 'profile'
  | 'personal_details'
  | 'passport'
  | 'resident_id'
  | 'license'
  | 'visa'
  | 'control_panel'
  | 'services'
  | 'family'
  | 'workers'
  | 'other';

export type TabType = 'home' | 'services' | 'family' | 'workers' | 'other';
