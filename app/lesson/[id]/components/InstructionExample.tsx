import React from 'react';
import { Check } from 'lucide-react';

export default function InstructionExample({ typeKey, language }: { typeKey: string | null, language: string }) {
  if (typeKey === 'word-match') {
    return (
      <div className="flex flex-col items-center w-full gap-4 sm:gap-6">
        <div className="text-xl font-medium text-slate-700">
           {language === 'en' ? 'cat' : 'chat'}
        </div>
        <div className="grid grid-cols-2 gap-3 w-full">
           <div className="p-3 sm:p-4 rounded-2xl border-2 border-slate-200 text-slate-400 flex items-center justify-center bg-white shadow-sm">
             <span className="font-thai text-xl">หมา</span>
           </div>
           <div className="p-3 sm:p-4 rounded-2xl border-b-4 border-2 border-emerald-500 text-emerald-600 bg-emerald-50 flex flex-col items-center justify-center relative transform -translate-y-1">
             <span className="font-thai text-xl font-bold">แมว</span>
             <div className="absolute -top-3 -right-3 bg-emerald-500 text-white rounded-full p-1 shadow-sm">
               <Check size={16} strokeWidth={4} />
             </div>
           </div>
           <div className="p-3 sm:p-4 rounded-2xl border-2 border-slate-200 text-slate-400 flex items-center justify-center bg-white shadow-sm">
             <span className="font-thai text-xl">นก</span>
           </div>
           <div className="p-3 sm:p-4 rounded-2xl border-2 border-slate-200 text-slate-400 flex items-center justify-center bg-white shadow-sm">
             <span className="font-thai text-xl">ปลา</span>
           </div>
        </div>
      </div>
    );
  }

  if (typeKey === 'sentence-builder') {
    return (
      <div className="flex flex-col items-center w-full gap-4 sm:gap-6">
        <div className="text-xl font-medium text-slate-700">
           {language === 'en' ? 'I eat rice' : 'Je mange du riz'}
        </div>
        
        {/* Selected options area */}
        <div className="flex flex-wrap gap-2 min-h-[3rem] p-3 border-b-2 border-slate-200 w-full justify-center relative">
            <div className="px-3 sm:px-4 py-2 bg-emerald-50 border-2 border-emerald-500 text-emerald-600 rounded-xl font-thai text-lg font-bold">ฉัน</div>
            <div className="px-3 sm:px-4 py-2 bg-emerald-50 border-2 border-emerald-500 text-emerald-600 rounded-xl font-thai text-lg font-bold shadow-[0_0_0_2px_rgba(16,185,129,0.2)]">กิน</div>
            <div className="px-3 sm:px-4 py-2 bg-emerald-50 border-2 border-emerald-500 text-emerald-600 rounded-xl font-thai text-lg font-bold">ข้าว</div>
            <div className="absolute top-0 right-0 sm:right-4 bg-emerald-500 text-white rounded-full p-1 transform translate-x-2 -translate-y-2 shadow-sm">
               <Check size={16} strokeWidth={4} />
            </div>
        </div>

        {/* Options pool */}
        <div className="flex flex-wrap gap-2 justify-center mt-2 opacity-50">
            <div className="px-3 sm:px-4 py-2 bg-slate-100 border-2 border-slate-200 rounded-xl text-transparent">กิน</div>
            <div className="px-3 sm:px-4 py-2 bg-white border-2 border-slate-300 text-slate-600 shadow-sm rounded-xl font-thai text-lg">น้ำ</div>
            <div className="px-3 sm:px-4 py-2 bg-slate-100 border-2 border-slate-200 rounded-xl text-transparent">ข้าว</div>
        </div>
      </div>
    );
  }

  if (typeKey === 'pair-matching') {
     return (
       <div className="w-full flex flex-col gap-4">
          <div className="flex justify-between items-center w-full max-w-xs mx-auto gap-4">
             <div className="flex-1 p-3 rounded-xl border-2 border-emerald-500 bg-emerald-50 text-emerald-700 font-medium text-center relative tracking-wide">
                {language === 'en' ? 'cat' : 'chat'}
             </div>
             <div className="flex-1 p-3 rounded-xl border-2 border-emerald-500 bg-emerald-50 text-emerald-700 font-thai text-xl text-center font-bold relative">
                แมว
                <div className="absolute -top-3 -right-3 bg-emerald-500 text-white rounded-full p-1 shadow-sm">
                   <Check size={16} strokeWidth={4} />
                </div>
             </div>
          </div>
          <div className="flex justify-between items-center w-full max-w-xs mx-auto gap-4">
             <div className="flex-1 p-3 rounded-xl border-2 border-slate-200 bg-white text-slate-500 font-medium text-center tracking-wide">
                {language === 'en' ? 'dog' : 'chien'}
             </div>
             <div className="flex-1 p-3 rounded-xl border-2 border-slate-200 bg-white text-slate-500 font-thai text-xl text-center">
                หมา
             </div>
          </div>
       </div>
     )
  }

  if (typeKey === 'writing' || typeKey === 'writing-blind') {
     return (
      <div className="flex flex-col items-center w-full gap-4 sm:gap-6">
        <div className="text-xl font-medium text-slate-700">
           {language === 'en' ? 'I eat.' : 'Je mange.'}
        </div>
        
        <div className="flex flex-row justify-center gap-1 sm:gap-2 w-full mt-4 flex-wrap">
			<div className="w-8 sm:w-10 h-12 sm:h-14 border-b-4 border-emerald-500 bg-emerald-50 rounded-md flex items-center justify-center font-thai text-xl font-bold text-emerald-600">ฉ</div>
			<div className="w-8 sm:w-10 h-12 sm:h-14 border-b-4 border-emerald-500 bg-emerald-50 rounded-md flex items-center justify-center font-thai text-xl font-bold text-emerald-600">ั</div>
			<div className="w-8 sm:w-10 h-12 sm:h-14 border-b-4 border-emerald-500 bg-emerald-50 rounded-md flex items-center justify-center font-thai text-xl font-bold text-emerald-600">น</div>
			<div className="w-2 sm:w-4 h-12 sm:h-14"></div>
			<div className="w-8 sm:w-10 h-12 sm:h-14 border-b-4 border-emerald-500 bg-emerald-50 rounded-md flex items-center justify-center font-thai text-xl font-bold text-emerald-600 relative">
                ก
                <div className="absolute -top-3 -right-3 bg-emerald-500 text-white rounded-full p-1 shadow-sm">
                   <Check size={14} strokeWidth={4} />
                </div>
            </div>
            {/* The rest is blank empty or placeholder */}
			<div className="w-8 sm:w-10 h-12 sm:h-14 border-b-4 border-slate-200 bg-slate-100 rounded-md flex items-center justify-center"></div>
			<div className="w-8 sm:w-10 h-12 sm:h-14 border-b-4 border-slate-200 bg-slate-100 rounded-md flex items-center justify-center"></div>
        </div>
      </div>
     )
  }
  
  if (typeKey === 'free-typing') {
      return (
      <div className="flex flex-col items-center w-full gap-4 sm:gap-6">
        <div className="text-xl font-medium text-slate-700">
           {language === 'en' ? 'cat' : 'chat'}
        </div>
        
        <div className="w-full relative">
            <div className="w-full p-4 rounded-2xl border-2 border-emerald-500 bg-emerald-50 text-emerald-700 font-thai text-2xl text-center font-bold outline-none ring-2 ring-emerald-200 ring-offset-2">
                แมว
            </div>
            <div className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-emerald-500 text-white rounded-full p-1">
               <Check size={20} strokeWidth={3} />
            </div>
        </div>
      </div>
      );
  }

  // Fallback
  return null;
}
