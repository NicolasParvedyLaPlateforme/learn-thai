export interface AlphabetItem {
  letter: string;
  type: 'consonant' | 'vowel';
  exampleWord: string;
  exampleTranslation: string;
  pronunciation: string; // The pronunciation of the example word, e.g. "ko kai"
}

export const THAI_ALPHABET: AlphabetItem[] = [
  // Consonants (Selection of most common ones for a start, but we can list all 44)
  { letter: "ก", type: "consonant", exampleWord: "ก ไก่", exampleTranslation: "Poulet", pronunciation: "kɔɔ kài" },
  { letter: "ข", type: "consonant", exampleWord: "ข ไข่", exampleTranslation: "Œuf", pronunciation: "khɔ̌ɔ khài" },
  { letter: "ค", type: "consonant", exampleWord: "ค ควาย", exampleTranslation: "Buffle", pronunciation: "khɔɔ khwaai" },
  { letter: "ง", type: "consonant", exampleWord: "ง งู", exampleTranslation: "Serpent", pronunciation: "ngɔɔ nguu" },
  { letter: "จ", type: "consonant", exampleWord: "จ จาน", exampleTranslation: "Assiette", pronunciation: "jɔɔ jaan" },
  { letter: "ฉ", type: "consonant", exampleWord: "ฉ ฉิ่ง", exampleTranslation: "Cymbales", pronunciation: "chɔ̌ɔ chìng" },
  { letter: "ช", type: "consonant", exampleWord: "ช ช้าง", exampleTranslation: "Éléphant", pronunciation: "chɔɔ cháang" },
  { letter: "ซ", type: "consonant", exampleWord: "ซ โซ่", exampleTranslation: "Chaîne", pronunciation: "sɔɔ sôo" },
  { letter: "ญ", type: "consonant", exampleWord: "ญ หญิง", exampleTranslation: "Femme", pronunciation: "yɔɔ yǐng" },
  { letter: "ด", type: "consonant", exampleWord: "ด เด็ก", exampleTranslation: "Enfant", pronunciation: "dɔɔ dèk" },
  { letter: "ต", type: "consonant", exampleWord: "ต เต่า", exampleTranslation: "Tortue", pronunciation: "dtɔɔ dtào" },
  { letter: "ถ", type: "consonant", exampleWord: "ถ ถุง", exampleTranslation: "Sac", pronunciation: "thɔ̌ɔ thǔng" },
  { letter: "ท", type: "consonant", exampleWord: "ท ทหาร", exampleTranslation: "Soldat", pronunciation: "thɔɔ thá-haan" },
  { letter: "ธ", type: "consonant", exampleWord: "ธ ธง", exampleTranslation: "Drapeau", pronunciation: "thɔɔ thong" },
  { letter: "น", type: "consonant", exampleWord: "น หนู", exampleTranslation: "Souris", pronunciation: "nɔɔ nǔu" },
  { letter: "บ", type: "consonant", exampleWord: "บ ใบไม้", exampleTranslation: "Feuille", pronunciation: "bɔɔ bai-máai" },
  { letter: "ป", type: "consonant", exampleWord: "ป ปลา", exampleTranslation: "Poisson", pronunciation: "bpɔɔ bplaa" },
  { letter: "ผ", type: "consonant", exampleWord: "ผ ผึ้ง", exampleTranslation: "Abeille", pronunciation: "phɔ̌ɔ phueng" },
  { letter: "ฝ", type: "consonant", exampleWord: "ฝ ฝา", exampleTranslation: "Couvercle", pronunciation: "fɔ̌ɔ fǎa" },
  { letter: "พ", type: "consonant", exampleWord: "พ พาน", exampleTranslation: "Plateau", pronunciation: "phɔɔ phaan" },
  { letter: "ฟ", type: "consonant", exampleWord: "ฟ ฟัน", exampleTranslation: "Dent", pronunciation: "fɔɔ fan" },
  { letter: "ภ", type: "consonant", exampleWord: "ภ สำเภา", exampleTranslation: "Jonque", pronunciation: "phɔɔ sǎm-phao" },
  { letter: "ม", type: "consonant", exampleWord: "ม ม้า", exampleTranslation: "Cheval", pronunciation: "mɔɔ máa" },
  { letter: "ย", type: "consonant", exampleWord: "ย ยักษ์", exampleTranslation: "Géant", pronunciation: "yɔɔ yák" },
  { letter: "ร", type: "consonant", exampleWord: "ร เรือ", exampleTranslation: "Bateau", pronunciation: "rɔɔ ruea" },
  { letter: "ล", type: "consonant", exampleWord: "ล ลิง", exampleTranslation: "Singe", pronunciation: "lɔɔ ling" },
  { letter: "ว", type: "consonant", exampleWord: "ว แหวน", exampleTranslation: "Bague", pronunciation: "wɔɔ wǎen" },
  { letter: "ศ", type: "consonant", exampleWord: "ศ ศาลา", exampleTranslation: "Pavillon", pronunciation: "sɔ̌ɔ sǎa-laa" },
  { letter: "ษ", type: "consonant", exampleWord: "ษ ฤๅษี", exampleTranslation: "Ermite", pronunciation: "sɔ̌ɔ rǔe-sǐi" },
  { letter: "ส", type: "consonant", exampleWord: "ส เสือ", exampleTranslation: "Tigre", pronunciation: "sɔ̌ɔ sǔea" },
  { letter: "ห", type: "consonant", exampleWord: "ห หีบ", exampleTranslation: "Coffre", pronunciation: "hɔ̌ɔ hìip" },
  { letter: "ฬ", type: "consonant", exampleWord: "ฬ จุฬา", exampleTranslation: "Cerf-volant", pronunciation: "lɔɔ jù-laa" },
  { letter: "อ", type: "consonant", exampleWord: "อ อ่าง", exampleTranslation: "Bassine", pronunciation: "ɔɔ àang" },
  { letter: "ฮ", type: "consonant", exampleWord: "ฮ นกฮูก", exampleTranslation: "Hibou", pronunciation: "hɔɔ nók-hûuk" },

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
