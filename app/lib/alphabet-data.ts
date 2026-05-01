export interface AlphabetItem {
  letter: string;
  type: 'consonant' | 'vowel';
  exampleWord: string;
  exampleTranslation: string;
  pronunciation: string; // The pronunciation of the example word, e.g. "ko kai"
}

export const THAI_ALPHABET: AlphabetItem[] = [
  // Consonants (Selection of most common ones for a start, but we can list all 44)
  { letter: "ก", type: "consonant", exampleWord: "ก ไก่", exampleTranslation: "Poulet", pronunciation: "ko kai" },
  { letter: "ข", type: "consonant", exampleWord: "ข ไข่", exampleTranslation: "Œuf", pronunciation: "kho khai" },
  { letter: "ค", type: "consonant", exampleWord: "ค ควาย", exampleTranslation: "Buffle", pronunciation: "kho khwai" },
  { letter: "ง", type: "consonant", exampleWord: "ง งู", exampleTranslation: "Serpent", pronunciation: "ngo ngu" },
  { letter: "จ", type: "consonant", exampleWord: "จ จาน", exampleTranslation: "Assiette", pronunciation: "cho chan" },
  { letter: "ฉ", type: "consonant", exampleWord: "ฉ ฉิ่ง", exampleTranslation: "Cymbales", pronunciation: "cho ching" },
  { letter: "ช", type: "consonant", exampleWord: "ช ช้าง", exampleTranslation: "Éléphant", pronunciation: "cho chang" },
  { letter: "ซ", type: "consonant", exampleWord: "ซ โซ่", exampleTranslation: "Chaîne", pronunciation: "so so" },
  { letter: "ญ", type: "consonant", exampleWord: "ญ หญิง", exampleTranslation: "Femme", pronunciation: "yo ying" },
  { letter: "ด", type: "consonant", exampleWord: "ด เด็ก", exampleTranslation: "Enfant", pronunciation: "do dek" },
  { letter: "ต", type: "consonant", exampleWord: "ต เต่า", exampleTranslation: "Tortue", pronunciation: "to tao" },
  { letter: "ถ", type: "consonant", exampleWord: "ถ ถุง", exampleTranslation: "Sac", pronunciation: "tho thung" },
  { letter: "ท", type: "consonant", exampleWord: "ท ทหาร", exampleTranslation: "Soldat", pronunciation: "tho thahan" },
  { letter: "ธ", type: "consonant", exampleWord: "ธ ธง", exampleTranslation: "Drapeau", pronunciation: "tho thong" },
  { letter: "น", type: "consonant", exampleWord: "น หนู", exampleTranslation: "Souris", pronunciation: "no nu" },
  { letter: "บ", type: "consonant", exampleWord: "บ ใบไม้", exampleTranslation: "Feuille", pronunciation: "bo baimai" },
  { letter: "ป", type: "consonant", exampleWord: "ป ปลา", exampleTranslation: "Poisson", pronunciation: "po pla" },
  { letter: "ผ", type: "consonant", exampleWord: "ผ ผึ้ง", exampleTranslation: "Abeille", pronunciation: "pho phueng" },
  { letter: "ฝ", type: "consonant", exampleWord: "ฝ ฝา", exampleTranslation: "Couvercle", pronunciation: "fo fa" },
  { letter: "พ", type: "consonant", exampleWord: "พ พาน", exampleTranslation: "Plateau", pronunciation: "pho phan" },
  { letter: "ฟ", type: "consonant", exampleWord: "ฟ ฟัน", exampleTranslation: "Dent", pronunciation: "fo fan" },
  { letter: "ภ", type: "consonant", exampleWord: "ภ สำเภา", exampleTranslation: "Jonque", pronunciation: "pho samphao" },
  { letter: "ม", type: "consonant", exampleWord: "ม ม้า", exampleTranslation: "Cheval", pronunciation: "mo ma" },
  { letter: "ย", type: "consonant", exampleWord: "ย ยักษ์", exampleTranslation: "Géant", pronunciation: "yo yak" },
  { letter: "ร", type: "consonant", exampleWord: "ร เรือ", exampleTranslation: "Bateau", pronunciation: "ro ruea" },
  { letter: "ล", type: "consonant", exampleWord: "ล ลิง", exampleTranslation: "Singe", pronunciation: "lo ling" },
  { letter: "ว", type: "consonant", exampleWord: "ว แหวน", exampleTranslation: "Bague", pronunciation: "wo waen" },
  { letter: "ศ", type: "consonant", exampleWord: "ศ ศาลา", exampleTranslation: "Pavillon", pronunciation: "so sala" },
  { letter: "ษ", type: "consonant", exampleWord: "ษ ฤๅษี", exampleTranslation: "Ermite", pronunciation: "so ruesi" },
  { letter: "ส", type: "consonant", exampleWord: "ส เสือ", exampleTranslation: "Tigre", pronunciation: "so suea" },
  { letter: "ห", type: "consonant", exampleWord: "ห หีบ", exampleTranslation: "Coffre", pronunciation: "ho hip" },
  { letter: "ฬ", type: "consonant", exampleWord: "ฬ จุฬา", exampleTranslation: "Cerf-volant", pronunciation: "lo chula" },
  { letter: "อ", type: "consonant", exampleWord: "อ อ่าง", exampleTranslation: "Bassine", pronunciation: "o ang" },
  { letter: "ฮ", type: "consonant", exampleWord: "ฮ นกฮูก", exampleTranslation: "Hibou", pronunciation: "ho nokhuk" },

  // Vowels
  { letter: "ะ", type: "vowel", exampleWord: "สระ อะ", exampleTranslation: "Vowelle a (courte)", pronunciation: "sara a" },
  { letter: "า", type: "vowel", exampleWord: "สระ อา", exampleTranslation: "Vowelle a (longue)", pronunciation: "sara aa" },
  { letter: "ิ", type: "vowel", exampleWord: "สระ อิ", exampleTranslation: "Vowelle i (courte)", pronunciation: "sara i" },
  { letter: "ี", type: "vowel", exampleWord: "สระ อี", exampleTranslation: "Vowelle i (longue)", pronunciation: "sara ii" },
  { letter: "ึ", type: "vowel", exampleWord: "สระ อึ", exampleTranslation: "Vowelle ue (courte)", pronunciation: "sara ue" },
  { letter: "ื", type: "vowel", exampleWord: "สระ อือ", exampleTranslation: "Vowelle ue (longue)", pronunciation: "sara uee" },
  { letter: "ุ", type: "vowel", exampleWord: "สระ อุ", exampleTranslation: "Vowelle u (courte)", pronunciation: "sara u" },
  { letter: "ู", type: "vowel", exampleWord: "สระ อู", exampleTranslation: "Vowelle u (longue)", pronunciation: "sara uu" },
  { letter: "เ", type: "vowel", exampleWord: "สระ เอ", exampleTranslation: "Vowelle e", pronunciation: "sara e" },
  { letter: "แ", type: "vowel", exampleWord: "สระ แอ", exampleTranslation: "Vowelle ae", pronunciation: "sara ae" },
  { letter: "โ", type: "vowel", exampleWord: "สระ โอ", exampleTranslation: "Vowelle o", pronunciation: "sara o" },
  { letter: "ไ", type: "vowel", exampleWord: "สระ ไอ", exampleTranslation: "Vowelle ai (maimai)", pronunciation: "sara ai" },
  { letter: "ใ", type: "vowel", exampleWord: "สระ ใอ", exampleTranslation: "Vowelle ai (maimuan)", pronunciation: "sara ai" }
];
