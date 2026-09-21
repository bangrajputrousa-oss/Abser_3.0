import React from 'react';
import { UserPersonalDetails } from '../types';
import { UserAvatar } from './UserAvatar';
import { toArabicNumerals } from '../utils/arabic';
import { QrCode } from 'lucide-react';

interface DigitalIdCardProps {
  personalDetails: UserPersonalDetails;
  customCardImage?: string;
  avatarUrl?: string;
  onCardClick?: () => void;
}

export const DigitalIdCard: React.FC<DigitalIdCardProps> = ({
  personalDetails,
  customCardImage,
  avatarUrl,
  onCardClick,
}) => {
  if (customCardImage && customCardImage.trim() !== '') {
    return (
      <div
        id="digital-resident-id-custom"
        onClick={onCardClick}
        className="w-full rounded-2xl overflow-hidden shadow-xl border border-neutral-700/60 cursor-pointer transition-transform active:scale-[0.99] max-h-[200px] sm:max-h-[220px] flex items-center justify-center bg-[#211F1F]"
      >
        <img
          src={customCardImage}
          alt="Resident ID Card"
          className="w-full h-auto max-h-[200px] sm:max-h-[220px] object-contain rounded-xl"
        />
      </div>
    );
  }

  const idArabic = toArabicNumerals(personalDetails.idNumber);
  const expiryArabic = toArabicNumerals(personalDetails.expiryDateHijri || '2026/10/05');
  const dobArabic = toArabicNumerals(personalDetails.birthDateHijri || '1983/01/01');
  const employerIdArabic = toArabicNumerals(personalDetails.employerId || '7001596753');

  return (
    <div
      id="digital-resident-id-card"
      onClick={onCardClick}
      className="relative w-full rounded-2xl overflow-hidden shadow-2xl border border-neutral-300/40 bg-[#fbf9f4] text-[#1e1e1e] p-3 sm:p-4 select-none cursor-pointer transition-all duration-200 hover:shadow-emerald-950/40 active:scale-[0.995]"
      style={{
        fontFamily: "'Cairo', 'Plus Jakarta Sans', system-ui, sans-serif",
      }}
    >
      {/* Intricate security background pattern & watermark */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.07] bg-[radial-gradient(#006838_1px,transparent_1px)] [background-size:12px_12px]" />
      
      {/* Center Saudi emblem watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.11]">
        <svg viewBox="0 0 200 200" className="w-56 h-56 text-[#006838]" fill="currentColor">
          <path d="M100 20 C102 40 108 55 120 65 C112 68 105 70 100 80 C95 70 88 68 80 65 C92 55 98 40 100 20 Z" />
          <path d="M70 45 C80 52 90 60 95 75 C85 75 75 68 70 45 Z" />
          <path d="M130 45 C120 52 110 60 105 75 C115 75 125 68 130 45 Z" />
          <path d="M60 95 L140 145 L135 155 L55 105 Z" fill="#8d7426" />
          <path d="M140 95 L60 145 L65 155 L145 105 Z" fill="#8d7426" />
        </svg>
      </div>

      {/* Card Header */}
      <div className="relative z-10 flex items-start justify-between border-b border-[#006838]/15 pb-2 mb-2.5">
        {/* Left: هوية مقيم / رقم النسخة */}
        <div className="text-left">
          <div className="text-[#007a3d] font-bold text-sm sm:text-base leading-tight">
            هوية مقيم
          </div>
          <div className="text-[#007a3d] text-[11px] sm:text-xs font-semibold">
            رقم النسخة ١
          </div>
        </div>

        {/* Right: المملكة العربية السعودية / وزارة الداخلية */}
        <div className="flex items-center gap-1.5 text-right">
          <div className="text-right">
            <div className="text-[#8c7428] font-bold text-xs sm:text-sm leading-tight">
              المملكة العربية السعودية
            </div>
            <div className="text-[#8c7428] text-[10px] sm:text-xs font-semibold">
              وزارة الداخلية
            </div>
          </div>
          {/* Saudi Golden Crest */}
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#8c7428]/40 flex items-center justify-center bg-[#fdfaf3] text-[#8c7428] shrink-0">
            <span className="text-[10px] font-black">🇸🇦</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="relative z-10 grid grid-cols-12 gap-2 sm:gap-3 items-start">
        {/* Left Column: Photo + QR Code + Barcode */}
        <div className="col-span-4 sm:col-span-3 flex flex-col items-center gap-1.5">
          {/* Portrait Photo with authentic look */}
          <div className="w-full aspect-[3/4] max-h-32 rounded-lg overflow-hidden border border-neutral-400/80 shadow-sm bg-neutral-200">
            <UserAvatar
              src={avatarUrl}
              name={personalDetails.name}
              size="card"
              className="w-full h-full rounded-none"
            />
          </div>

          {/* QR Code section */}
          <div className="w-full bg-white p-1 rounded border border-neutral-300 flex flex-col items-center">
            <div className="w-9 h-9 bg-neutral-900 rounded flex items-center justify-center p-0.5 text-white">
              <QrCode className="w-7 h-7" />
            </div>
            <div className="text-[7px] leading-[9px] text-center text-neutral-600 font-medium mt-0.5" dir="rtl">
              يجب التحقق من الرمز السريع قبل اعتماد التعامل مع الهوية
            </div>
          </div>

          {/* Barcode lines */}
          <div className="w-full flex items-center justify-center h-4 gap-[2px] overflow-hidden opacity-85 px-1">
            {Array.from({ length: 28 }).map((_, i) => (
              <div
                key={i}
                className="h-full bg-black"
                style={{
                  width: i % 4 === 0 ? '2.5px' : i % 3 === 0 ? '1.5px' : '1px',
                  opacity: i % 2 === 0 ? 1 : 0.85,
                }}
              />
            ))}
          </div>
        </div>

        {/* Right Column: Bilingual Arabic/English Records */}
        <div className="col-span-8 sm:col-span-9 flex flex-col justify-between" dir="rtl">
          {/* Names Header */}
          <div className="border-b border-neutral-300/50 pb-1 mb-1.5">
            <div className="text-xs sm:text-sm font-bold text-neutral-900 leading-tight">
              {personalDetails.nameArabic || 'مد فرهد ميا'}
            </div>
            <div className="text-[11px] sm:text-xs font-bold text-neutral-800 tracking-wide font-sans text-left" dir="ltr">
              {personalDetails.name}
            </div>
          </div>

          {/* Details Table in 2 Mini Columns */}
          <div className="grid grid-cols-2 gap-x-1.5 gap-y-1 text-[9px] sm:text-[10px] leading-tight text-neutral-900">
            {/* ID Number */}
            <div>
              <span className="text-neutral-500 font-medium">رقم الهوية: </span>
              <span className="font-bold text-neutral-900">{idArabic}</span>
            </div>
            {/* Expiry Date */}
            <div>
              <span className="text-neutral-500 font-medium">تاريخ الانتهاء: </span>
              <span className="font-bold text-neutral-900">{expiryArabic}</span>
            </div>

            {/* Date of Birth */}
            <div>
              <span className="text-neutral-500 font-medium">تاريخ الميلاد: </span>
              <span className="font-semibold">{dobArabic}</span>
            </div>
            {/* Birth Place */}
            <div>
              <span className="text-neutral-500 font-medium">مكان الميلاد: </span>
              <span className="font-semibold">{personalDetails.birthCountry === 'Bangladesh' ? 'بنجلاديش' : personalDetails.birthCountry}</span>
            </div>

            {/* Nationality */}
            <div>
              <span className="text-neutral-500 font-medium">الجنسية: </span>
              <span className="font-semibold">{personalDetails.birthCountry === 'Bangladesh' ? 'بنجلاديش' : personalDetails.birthCountry}</span>
            </div>
            {/* Religion */}
            <div>
              <span className="text-neutral-500 font-medium">الديانة: </span>
              <span className="font-semibold">{personalDetails.religion === 'Islam' ? 'الاسلام' : personalDetails.religion}</span>
            </div>

            {/* Profession */}
            <div className="col-span-2">
              <span className="text-neutral-500 font-medium">المهنة: </span>
              <span className="font-semibold">{personalDetails.professionArabic || 'عامل انشاءات'}</span>
            </div>

            {/* Employer ID */}
            <div className="col-span-2">
              <span className="text-neutral-500 font-medium">هوية صاحب العمل: </span>
              <span className="font-semibold">{employerIdArabic}</span>
            </div>

            {/* Place of Issue */}
            <div className="col-span-2">
              <span className="text-neutral-500 font-medium">مكان الإصدار: </span>
              <span className="font-semibold">{personalDetails.issuePlace || 'شركة العلم لامن المعلومات'}</span>
            </div>

            {/* Work Place */}
            <div className="col-span-2">
              <span className="text-neutral-500 font-medium">مكان العمل: </span>
              <span className="font-semibold">{personalDetails.workPlace || 'منطقة الرياض'}</span>
            </div>

            {/* Employer Name */}
            <div className="col-span-2 truncate">
              <span className="text-neutral-500 font-medium">اسم صاحب العمل: </span>
              <span className="font-semibold text-[8.5px] sm:text-[9.5px]">
                {personalDetails.employerName || 'شركة فرع شركة كالباتارو للمشاريع الدولية المحدودة'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
