export interface BisindoLetter {
  letter: string;
  description: string;
  category: 'One Hand' | 'Two Hands';
  steps: string[];
  tips: string;
  imagePath: string;
}

export const BISINDO_ALPHABET: Record<string, BisindoLetter> = {
  'A': {
    letter: 'A',
    description: 'Kedua telunjuk bertemu di ujung atas membentuk segitiga (seperti atap rumah).',
    category: 'Two Hands',
    steps: [
      'Angkat kedua tangan di depan dada.',
      'Arahkan kedua jari telunjuk ke atas.',
      'Pertemukan kedua ujung jari telunjuk sehingga membentuk segitiga atau huruf A kapital.'
    ],
    tips: 'Pastikan jari-jari lainnya mengepal agar bentuk segitiga telunjuk terlihat jelas.',
    imagePath: '/images/bisindo/a.jpg'
  },
  'B': {
    letter: 'B',
    description: 'Telunjuk kiri tegak lurus dengan tiga jari horizontal tangan kanan melintang di depannya.',
    category: 'Two Hands',
    steps: [
      'Tangan kiri: Angkat telunjuk tegak lurus ke atas.',
      'Tangan kanan: Rentangkan tiga jari (telunjuk, tengah, manis) secara horizontal.',
      'Letakkan tiga jari tangan kanan melintang di depan telunjuk kiri.'
    ],
    tips: 'Bentuk menyerupai garis vertikal dan tiga garis horizontal pada huruf B.',
    imagePath: '/images/bisindo/b.jpg'
  },
  'C': {
    letter: 'C',
    description: 'Tangan dominan membentuk lengkungan terbuka menyerupai huruf C.',
    category: 'One Hand',
    steps: [
      'Gunakan tangan kanan.',
      'Lengkungkan jempol dan keempat jari lainnya hingga membentuk setengah lingkaran seperti huruf C.'
    ],
    tips: 'Arahkan bukaan lengkungan ke arah kiri (lawan bicara).',
    imagePath: '/images/bisindo/c.png'
  },
  'D': {
    letter: 'D',
    description: 'Telunjuk kiri tegak dengan lengkungan besar tangan kanan menempel di sisi kanannya.',
    category: 'Two Hands',
    steps: [
      'Tangan kiri: Angkat telunjuk tegak lurus ke atas.',
      'Tangan kanan: Bentuk lengkungan besar menyerupai huruf C.',
      'Tempelkan lengkungan tersebut di sisi kanan telunjuk kiri.'
    ],
    tips: 'Lengkungan harus terlihat jelas sebagai bagian bulat huruf D.',
    imagePath: '/images/bisindo/d.jpg'
  },
  'E': {
    letter: 'E',
    description: 'Tiga jari tangan kanan direntangkan secara horizontal untuk melambangkan bentuk E.',
    category: 'One Hand',
    steps: [
      'Gunakan tangan kanan.',
      'Rentangkan tiga jari (telunjuk, tengah, manis) secara horizontal.'
    ],
    tips: 'Tiga garis horizontal melambangkan bentuk huruf E.',
    imagePath: '/images/bisindo/e.jpg'
  },
  'F': {
    letter: 'F',
    description: 'Telunjuk kiri tegak dengan dua jari tangan kanan melintang di bagian atasnya.',
    category: 'Two Hands',
    steps: [
      'Tangan kiri: Angkat telunjuk tegak lurus.',
      'Tangan kanan: Rentangkan telunjuk dan jari tengah secara horizontal.',
      'Letakkan dua jari kanan di bagian atas telunjuk kiri.'
    ],
    tips: 'Membentuk garis atas huruf F.',
    imagePath: '/images/bisindo/f.jpg'
  },
  'G': {
    letter: 'G',
    description: 'Kedua tangan mengepal dan ditumpuk secara vertikal.',
    category: 'Two Hands',
    steps: [
      'Kepalkan kedua tangan.',
      'Letakkan kepalan tangan kanan tepat di atas kepalan tangan kiri.'
    ],
    tips: 'Pastikan kepalan tangan sejajar secara vertikal.',
    imagePath: '/images/bisindo/g.jpg'
  },
  'H': {
    letter: 'H',
    description: 'Dua jari telunjuk ditegakkan sejajar dan berdekatan menghadap ke atas.',
    category: 'Two Hands',
    steps: [
      'Angkat kedua tangan.',
      'Tegakkan kedua telunjuk sejajar dan berdekatan.',
      'Pastikan kedua telunjuk menghadap ke atas.'
    ],
    tips: 'Dua garis vertikal melambangkan huruf H.',
    imagePath: '/images/bisindo/h.jpg'
  },
  'I': {
    letter: 'I',
    description: 'Jari kelingking menunjuk tegak lurus ke atas melambangkan garis lurus.',
    category: 'One Hand',
    steps: [
      'Kepalkan tangan kanan.',
      'Angkat jari kelingking tegak lurus ke atas.'
    ],
    tips: 'Jari kelingking melambangkan garis lurus tipis pada huruf I.',
    imagePath: '/images/bisindo/i.jpg'
  },
  'J': {
    letter: 'J',
    description: 'Jari kelingking mengayun di udara membentuk pola kail huruf J.',
    category: 'One Hand',
    steps: [
      'Mulai dengan posisi huruf I (kelingking atas).',
      'Gerakkan tangan ke bawah lalu melengkung ke kiri atas, membentuk pola huruf J.'
    ],
    tips: 'Gerakan harus luwes mengikuti lekukan huruf J.',
    imagePath: '/images/bisindo/j.jpg'
  },
  'K': {
    letter: 'K',
    description: 'Telunjuk kiri tegak dengan sudut jari tangan kanan menempel di tengahnya.',
    category: 'Two Hands',
    steps: [
      'Tangan kiri: Angkat telunjuk tegak.',
      'Tangan kanan: Rentangkan jempol dan telunjuk membentuk sudut.',
      'Tempelkan sudut tersebut ke tengah telunjuk kiri.'
    ],
    tips: 'Membentuk dua garis miring huruf K.',
    imagePath: '/images/bisindo/k.jpg'
  },
  'L': {
    letter: 'L',
    description: 'Jempol dan telunjuk membentuk sudut siku-siku (90 derajat) menyerupai huruf L.',
    category: 'One Hand',
    steps: [
      'Gunakan tangan kanan.',
      'Rentangkan jempol ke samping dan telunjuk ke atas.',
      'Tekuk jari lainnya ke dalam telapak tangan.'
    ],
    tips: 'Pastikan sudut antara jempol dan telunjuk membentuk siku-siku.',
    imagePath: '/images/bisindo/l.jpg'
  },
  'M': {
    letter: 'M',
    description: 'Dua jari tangan kanan ditempelkan pada telapak kiri yang terbuka untuk membentuk tiga puncak.',
    category: 'Two Hands',
    steps: [
      'Tangan kiri: Buka telapak tangan menghadap depan.',
      'Tangan kanan: Gunakan dua jari (telunjuk dan tengah).',
      'Tempelkan dua jari tersebut di bagian tengah telapak kiri.'
    ],
    tips: 'Visual membentuk tiga puncak huruf M.',
    imagePath: '/images/bisindo/m.jpg'
  },
  'N': {
    letter: 'N',
    description: 'Satu jari telunjuk kanan ditempelkan pada tengah telapak tangan kiri yang terbuka.',
    category: 'Two Hands',
    steps: [
      'Tangan kiri: Buka telapak tangan menghadap depan.',
      'Tangan kanan: Gunakan satu jari (telunjuk).',
      'Tempelkan telunjuk kanan di bagian tengah telapak kiri.'
    ],
    tips: 'Satu garis diagonal melambangkan huruf N.',
    imagePath: '/images/bisindo/n.jpg'
  },
  'O': {
    letter: 'O',
    description: 'Semua ujung jari bertemu membentuk lingkaran sempurna menyerupai huruf O.',
    category: 'One Hand',
    steps: [
      'Gunakan tangan kanan.',
      'Pertemukan semua ujung jari dengan jempol hingga membentuk lingkaran kosong di tengah.'
    ],
    tips: 'Pastikan lubang lingkaran terlihat jelas dari depan.',
    imagePath: '/images/bisindo/o.jpg'
  },
  'P': {
    letter: 'P',
    description: 'Telunjuk kiri tegak dengan lengkungan tangan kanan di bagian atasnya.',
    category: 'Two Hands',
    steps: [
      'Tangan kiri: Angkat telunjuk tegak.',
      'Tangan kanan: Bentuk lengkungan seperti huruf C.',
      'Tempelkan lengkungan di bagian atas telunjuk kiri.'
    ],
    tips: 'Menyerupai huruf P kapital.',
    imagePath: '/images/bisindo/p.jpg'
  },
  'Q': {
    letter: 'Q',
    description: 'Tangan kiri membentuk lingkaran dengan telunjuk kanan masuk ke dalamnya sebagai ekor.',
    category: 'Two Hands',
    steps: [
      'Tangan kiri: Bentuk lengkungan seperti huruf O.',
      'Tangan kanan: Arahkan telunjuk ke dalam lengkungan tersebut.',
      'Tempelkan ujung telunjuk di dalam lengkungan.'
    ],
    tips: 'Menyerupai huruf Q dengan ekor di dalam lingkaran.',
    imagePath: '/images/bisindo/q.jpg'
  },
  'R': {
    letter: 'R',
    description: 'Jari telunjuk dan tengah disilangkan (crossed) untuk melambangkan jalinan huruf R.',
    category: 'One Hand',
    steps: [
      'Gunakan tangan kanan.',
      'Angkat telunjuk dan jari tengah, lalu silangkan jari tengah di belakang jari telunjuk.'
    ],
    tips: 'Bentuk ini melambangkan jalinan atau putaran garis pada huruf R.',
    imagePath: '/images/bisindo/r.jpg'
  },
  'S': {
    letter: 'S',
    description: 'Tangan kanan membentuk lengkungan dinamis yang mengikuti pola lekukan huruf S.',
    category: 'One Hand',
    steps: [
      'Gunakan tangan kanan.',
      'Bentuk tangan melengkung menyerupai huruf C terbalik.',
      'Gerakkan sedikit membentuk pola S.'
    ],
    tips: 'Bentuk harus terlihat seperti lekukan huruf S.',
    imagePath: '/images/bisindo/s.jpg'
  },
  'T': {
    letter: 'T',
    description: 'Telunjuk kiri tegak dengan telunjuk kanan melintang tepat di tengahnya (seperti tanda tambah).',
    category: 'Two Hands',
    steps: [
      'Tangan kiri: Angkat telunjuk tegak lurus ke atas.',
      'Tangan kanan: Letakkan telunjuk kanan secara horizontal (mendatar) di tengah-tengah telunjuk kiri.'
    ],
    tips: 'Membentuk tanda tambah (+) atau huruf T kecil.',
    imagePath: '/images/bisindo/t.jpg'
  },
  'U': {
    letter: 'U',
    description: 'Dua jari (telunjuk dan tengah) ditegakkan rapat menghadap ke atas.',
    category: 'One Hand',
    steps: [
      'Gunakan tangan kanan.',
      'Angkat telunjuk dan jari tengah tegak lurus dan rapatkan keduanya.'
    ],
    tips: 'Menyerupai bentuk wadah atau lengkungan huruf U.',
    imagePath: '/images/bisindo/u.jpg'
  },
  'V': {
    letter: 'V',
    description: 'Dua jari (telunjuk dan tengah) dibuka membentuk sudut menyerupai huruf V.',
    category: 'One Hand',
    steps: [
      'Gunakan tangan kanan.',
      'Angkat telunjuk dan jari tengah, lalu buka keduanya hingga membentuk sudut V.'
    ],
    tips: 'Pastikan jarak antar jari cukup lebar agar terlihat seperti V.',
    imagePath: '/images/bisindo/v.jpg'
  },
  'W': {
    letter: 'W',
    description: 'Kedua tangan mengangkat telunjuk masing-masing dan dibuka sedikit membentuk dua puncak.',
    category: 'Two Hands',
    steps: [
      'Angkat kedua tangan.',
      'Tegakkan telunjuk kanan dan kiri.',
      'Buka sedikit membentuk dua puncak.'
    ],
    tips: 'Dua puncak melambangkan huruf W.',
    imagePath: '/images/bisindo/w.jpg'
  },
  'X': {
    letter: 'X',
    description: 'Kedua jari telunjuk disilangkan tepat di depan dada membentuk tanda silang.',
    category: 'Two Hands',
    steps: [
      'Angkat kedua jari telunjuk.',
      'Silangkan telunjuk kanan di atas telunjuk kiri membentuk huruf X.'
    ],
    tips: 'Posisikan silang tepat di depan dada.',
    imagePath: '/images/bisindo/x.jpg'
  },
  'Y': {
    letter: 'Y',
    description: 'Telunjuk kiri tegak dengan bentuk V tangan kanan didekatkan membentuk percabangan.',
    category: 'Two Hands',
    steps: [
      'Tangan kiri: Angkat telunjuk tegak.',
      'Tangan kanan: Bentuk huruf V (telunjuk dan tengah).',
      'Silangkan atau dekatkan keduanya membentuk huruf Y.'
    ],
    tips: 'Percabangan terlihat jelas seperti huruf Y.',
    imagePath: '/images/bisindo/y.jpg'
  },
  'Z': {
    letter: 'Z',
    description: 'Tangan kanan membentuk sudut tajam statis (seperti angka 7) yang menyerupai bentuk Z.',
    category: 'One Hand',
    steps: [
      'Gunakan tangan kanan.',
      'Bentuk tangan menyerupai sudut tajam seperti angka 7.',
      'Posisikan miring ke kanan.'
    ],
    tips: 'Bentuk statis menyerupai huruf Z.',
    imagePath: '/images/bisindo/z.jpg'
  }
};
