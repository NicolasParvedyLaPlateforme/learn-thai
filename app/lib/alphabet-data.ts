export interface AlphabetItem {
  letter: string;
  type: 'consonant' | 'vowel';
  exampleWord: string;
  exampleTranslation: string;
  exampleTranslationEn?: string;
  pronunciation: string; // The pronunciation of the example word, e.g. "ko kai"
}

export const THAI_ALPHABET: AlphabetItem[] = [
  // Consonants (Selection of most common ones for a start, but we can list all 44)
  { letter: "ก", type: "consonant", exampleWord: "ก ไก่", exampleTranslation: "Poulet", exampleTranslationEn: "Chicken", pronunciation: "kɔɔ kài" },
  { letter: "ข", type: "consonant", exampleWord: "ข ไข่", exampleTranslation: "Œuf", exampleTranslationEn: "Egg", pronunciation: "khɔ̌ɔ khài" },
  { letter: "ค", type: "consonant", exampleWord: "ค ควาย", exampleTranslation: "Buffle", exampleTranslationEn: "Buffalo", pronunciation: "khɔɔ khwaai" },
  { letter: "ง", type: "consonant", exampleWord: "ง งู", exampleTranslation: "Serpent", exampleTranslationEn: "Snake", pronunciation: "ngɔɔ nguu" },
  { letter: "จ", type: "consonant", exampleWord: "จ จาน", exampleTranslation: "Assiette", exampleTranslationEn: "Plate", pronunciation: "jɔɔ jaan" },
  { letter: "ฉ", type: "consonant", exampleWord: "ฉ ฉิ่ง", exampleTranslation: "Cymbales", exampleTranslationEn: "Cymbals", pronunciation: "chɔ̌ɔ chìng" },
  { letter: "ช", type: "consonant", exampleWord: "ช ช้าง", exampleTranslation: "Éléphant", exampleTranslationEn: "Elephant", pronunciation: "chɔɔ cháang" },
  { letter: "ซ", type: "consonant", exampleWord: "ซ โซ่", exampleTranslation: "Chaîne", exampleTranslationEn: "Chain", pronunciation: "sɔɔ sôo" },
  { letter: "ญ", type: "consonant", exampleWord: "ญ หญิง", exampleTranslation: "Femme", exampleTranslationEn: "Woman", pronunciation: "yɔɔ yǐng" },
  { letter: "ด", type: "consonant", exampleWord: "ด เด็ก", exampleTranslation: "Enfant", exampleTranslationEn: "Child", pronunciation: "dɔɔ dèk" },
  { letter: "ต", type: "consonant", exampleWord: "ต เต่า", exampleTranslation: "Tortue", exampleTranslationEn: "Turtle", pronunciation: "dtɔɔ dtào" },
  { letter: "ถ", type: "consonant", exampleWord: "ถ ถุง", exampleTranslation: "Sac", exampleTranslationEn: "Sack", pronunciation: "thɔ̌ɔ thǔng" },
  { letter: "ท", type: "consonant", exampleWord: "ท ทหาร", exampleTranslation: "Soldat", exampleTranslationEn: "Soldier", pronunciation: "thɔɔ thá-haan" },
  { letter: "ธ", type: "consonant", exampleWord: "ธ ธง", exampleTranslation: "Drapeau", exampleTranslationEn: "Flag", pronunciation: "thɔɔ thong" },
  { letter: "น", type: "consonant", exampleWord: "น หนู", exampleTranslation: "Souris", exampleTranslationEn: "Mouse", pronunciation: "nɔɔ nǔu" },
  { letter: "บ", type: "consonant", exampleWord: "บ ใบไม้", exampleTranslation: "Feuille", exampleTranslationEn: "Leaf", pronunciation: "bɔɔ bai-máai" },
  { letter: "ป", type: "consonant", exampleWord: "ป ปลา", exampleTranslation: "Poisson", exampleTranslationEn: "Fish", pronunciation: "bpɔɔ bplaa" },
  { letter: "ผ", type: "consonant", exampleWord: "ผ ผึ้ง", exampleTranslation: "Abeille", exampleTranslationEn: "Bee", pronunciation: "phɔ̌ɔ phueng" },
  { letter: "ฝ", type: "consonant", exampleWord: "ฝ ฝา", exampleTranslation: "Couvercle", exampleTranslationEn: "Lid", pronunciation: "fɔ̌ɔ fǎa" },
  { letter: "พ", type: "consonant", exampleWord: "พ พาน", exampleTranslation: "Plateau", exampleTranslationEn: "Tray", pronunciation: "phɔɔ phaan" },
  { letter: "ฟ", type: "consonant", exampleWord: "ฟ ฟัน", exampleTranslation: "Dent", exampleTranslationEn: "Tooth", pronunciation: "fɔɔ fan" },
  { letter: "ภ", type: "consonant", exampleWord: "ภ สำเภา", exampleTranslation: "Jonque", exampleTranslationEn: "Junk", pronunciation: "phɔɔ sǎm-phao" },
  { letter: "ม", type: "consonant", exampleWord: "ม ม้า", exampleTranslation: "Cheval", exampleTranslationEn: "Horse", pronunciation: "mɔɔ máa" },
  { letter: "ย", type: "consonant", exampleWord: "ย ยักษ์", exampleTranslation: "Géant", exampleTranslationEn: "Giant", pronunciation: "yɔɔ yák" },
  { letter: "ร", type: "consonant", exampleWord: "ร เรือ", exampleTranslation: "Bateau", exampleTranslationEn: "Boat", pronunciation: "rɔɔ ruea" },
  { letter: "ล", type: "consonant", exampleWord: "ล ลิง", exampleTranslation: "Singe", exampleTranslationEn: "Monkey", pronunciation: "lɔɔ ling" },
  { letter: "ว", type: "consonant", exampleWord: "ว แหวน", exampleTranslation: "Bague", exampleTranslationEn: "Ring", pronunciation: "wɔɔ wǎen" },
  { letter: "ศ", type: "consonant", exampleWord: "ศ ศาลา", exampleTranslation: "Pavillon", exampleTranslationEn: "Pavilion", pronunciation: "sɔ̌ɔ sǎa-laa" },
  { letter: "ษ", type: "consonant", exampleWord: "ษ ฤๅษี", exampleTranslation: "Ermite", exampleTranslationEn: "Hermit", pronunciation: "sɔ̌ɔ rǔe-sǐi" },
  { letter: "ส", type: "consonant", exampleWord: "ส เสือ", exampleTranslation: "Tigre", exampleTranslationEn: "Tiger", pronunciation: "sɔ̌ɔ sǔea" },
  { letter: "ห", type: "consonant", exampleWord: "ห หีบ", exampleTranslation: "Coffre", exampleTranslationEn: "Chest", pronunciation: "hɔ̌ɔ hìip" },
  { letter: "ฬ", type: "consonant", exampleWord: "ฬ จุฬา", exampleTranslation: "Cerf-volant", exampleTranslationEn: "Kite", pronunciation: "lɔɔ jù-laa" },
  { letter: "อ", type: "consonant", exampleWord: "อ อ่าง", exampleTranslation: "Bassine", exampleTranslationEn: "Basin", pronunciation: "ɔɔ àang" },
  { letter: "ฮ", type: "consonant", exampleWord: "ฮ นกฮูก", exampleTranslation: "Hibou", exampleTranslationEn: "Owl", pronunciation: "hɔɔ nók-hûuk" },

  // Vowels
  { letter: "ะ", type: "vowel", exampleWord: "สระ อะ", exampleTranslation: "Vowelle a (courte)", exampleTranslationEn: "Vowel a (short)", pronunciation: "sara a" },
  { letter: "า", type: "vowel", exampleWord: "สระ อา", exampleTranslation: "Vowelle a (longue)", exampleTranslationEn: "Vowel a (long)", pronunciation: "sara aa" },
  { letter: "ิ", type: "vowel", exampleWord: "สระ อิ", exampleTranslation: "Vowelle i (courte)", exampleTranslationEn: "Vowel i (short)", pronunciation: "sara i" },
  { letter: "ี", type: "vowel", exampleWord: "สระ อี", exampleTranslation: "Vowelle i (longue)", exampleTranslationEn: "Vowel i (long)", pronunciation: "sara ii" },
  { letter: "ึ", type: "vowel", exampleWord: "สระ อึ", exampleTranslation: "Vowelle ue (courte)", exampleTranslationEn: "Vowel ue (short)", pronunciation: "sara ue" },
  { letter: "ื", type: "vowel", exampleWord: "สระ อือ", exampleTranslation: "Vowelle ue (longue)", exampleTranslationEn: "Vowel ue (long)", pronunciation: "sara uee" },
  { letter: "ุ", type: "vowel", exampleWord: "สระ อุ", exampleTranslation: "Vowelle u (courte)", exampleTranslationEn: "Vowel u (short)", pronunciation: "sara u" },
  { letter: "ู", type: "vowel", exampleWord: "สระ อู", exampleTranslation: "Vowelle u (longue)", exampleTranslationEn: "Vowel u (long)", pronunciation: "sara uu" },
  { letter: "เ", type: "vowel", exampleWord: "สระ เอ", exampleTranslation: "Vowelle e", exampleTranslationEn: "Vowel e", pronunciation: "sara e" },
  { letter: "แ", type: "vowel", exampleWord: "สระ แอ", exampleTranslation: "Vowelle ae", exampleTranslationEn: "Vowel ae", pronunciation: "sara ae" },
  { letter: "โ", type: "vowel", exampleWord: "สระ โอ", exampleTranslation: "Vowelle o", exampleTranslationEn: "Vowel o", pronunciation: "sara o" },
  { letter: "ไ", type: "vowel", exampleWord: "สระ ไอ", exampleTranslation: "Vowelle ai (maimai)", exampleTranslationEn: "Vowel ai (maimai)", pronunciation: "sara ai" },
  { letter: "ใ", type: "vowel", exampleWord: "สระ ใอ", exampleTranslation: "Vowelle ai (maimuan)", exampleTranslationEn: "Vowel ai (maimuan)", pronunciation: "sara ai" }
];
