export interface BisindoLetter {
  letter: string;
  description: string;
  category: 'One Hand' | 'Two Hands';
  steps: string[];
  tips: string;
  imagePath: string; // Added image path
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
    description: 'Telapak tangan kiri terbuka tegak, telapak tangan kanan menempel rata di depannya.',
    category: 'Two Hands',
    steps: [
      'Buka telapak tangan kiri tegak lurus menghadap ke kanan.',
      'Buka telapak tangan kanan tegak lurus menghadap ke kiri.',
      'Tempelkan telapak tangan kanan ke telapak tangan kiri.'
    ],
    tips: 'Ini menyerupai bentuk perut huruf B yang menempel pada garis tegak.',
    imagePath: '/images/bisindo/b.jpg'
  },
  'C': {
    letter: 'C',
    description: 'Tangan dominan membentuk lengkungan huruf C.',
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
    description: 'Telunjuk kiri menunjuk ke atas, telunjuk dan jempol kanan membentuk lingkaran yang menempel pada telunjuk kiri.',
    category: 'Two Hands',
    steps: [
      'Tangan kiri: Angkat telunjuk tegak ke atas.',
      'Tangan kanan: Pertemukan ujung jempol and telunjuk membentuk lingkaran.',
      'Tempelkan lingkaran tangan kanan ke batang telunjuk kiri.'
    ],
    tips: 'Bentuk ini secara visual menyerupai huruf d kecil.',
    imagePath: '/images/bisindo/d.jpg'
  },
  'E': {
    letter: 'E',
    description: 'Jari-jari menekuk sedikit ke depan menyerupai bentuk e kecil.',
    category: 'One Hand',
    steps: [
      'Gunakan tangan kanan.',
      'Tekuk semua jari ke arah telapak tangan namun jangan mengepal rapat.',
      'Posisikan jempol melintang di bawah jari-jari yang menekuk.'
    ],
    tips: 'Bayangkan Anda sedang memegang benda kecil berbentuk bulat.',
    imagePath: '/images/bisindo/e.jpg'
  },
  'F': {
    letter: 'F',
    description: 'Telunjuk dan jari tengah kiri menunjuk ke atas, telunjuk dan jari tengah kanan diletakkan melintang di atasnya.',
    category: 'Two Hands',
    steps: [
      'Tangan kiri: Angkat telunjuk dan jari tengah tegak ke atas.',
      'Tangan kanan: Angkat telunjuk dan jari tengah, lalu letakkan melintang di atas jari-jari kiri.',
      'Pastikan posisi tangan kanan berada di bagian atas jari kiri.'
    ],
    tips: 'Bentuk ini menyerupai dua garis horizontal pada huruf F.',
    imagePath: '/images/bisindo/f.jpg'
  },
  'G': {
    letter: 'G',
    description: 'Kedua tangan mengepal dan ditumpuk (tangan kanan di atas tangan kiri).',
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
    description: 'Telapak tangan kiri terbuka menghadap atas, telunjuk dan jari tengah kanan diletakkan di atas telapak kiri.',
    category: 'Two Hands',
    steps: [
      'Buka telapak tangan kiri mendatar menghadap ke atas.',
      'Gunakan telunjuk dan jari tengah kanan, letakkan mendatar di atas telapak kiri.'
    ],
    tips: 'Posisi jari kanan tegak lurus dengan telapak kiri.',
    imagePath: '/images/bisindo/h.jpg'
  },
  'I': {
    letter: 'I',
    description: 'Jari kelingking menunjuk tegak ke atas.',
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
    description: 'Jari kelingking "menggambar" bentuk kail huruf J di udara.',
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
    description: 'Telunjuk kiri menunjuk ke atas, telunjuk kanan menempel miring di tengah telunjuk kiri.',
    category: 'Two Hands',
    steps: [
      'Tangan kiri: Angkat telunjuk tegak ke atas.',
      'Tangan kanan: Arahkan telunjuk kanan miring and tempelkan ujungnya ke bagian tengah telunjuk kiri.'
    ],
    tips: 'Visualisasikan garis tegak and garis miring pada huruf K.',
    imagePath: '/images/bisindo/k.jpg'
  },
  'L': {
    letter: 'L',
    description: 'Jempol and telunjuk membentuk sudut 90 derajat (huruf L).',
    category: 'One Hand',
    steps: [
      'Gunakan tangan kanan.',
      'Rentangkan jempol ke samping and telunjuk ke atas.',
      'Tekuk jari lainnya ke dalam telapak tangan.'
    ],
    tips: 'Pastikan sudut antara jempol and telunjuk membentuk siku-siku.',
    imagePath: '/images/bisindo/l.jpg'
  },
  'M': {
    letter: 'M',
    description: 'Telapak tangan kiri terbuka menghadap bawah, tiga jari kanan diletakkan di punggung tangan kiri.',
    category: 'Two Hands',
    steps: [
      'Buka telapak tangan kiri mendatar menghadap ke bawah.',
      'Letakkan ujung jari telunjuk, tengah, dan manis tangan kanan di atas punggung tangan kiri.'
    ],
    tips: 'Tiga jari melambangkan tiga kaki pada huruf M.',
    imagePath: '/images/bisindo/m.jpg'
  },
  'N': {
    letter: 'N',
    description: 'Telapak tangan kiri terbuka menghadap bawah, dua jari kanan diletakkan di punggung tangan kiri.',
    category: 'Two Hands',
    steps: [
      'Buka telapak tangan kiri mendatar menghadap ke bawah.',
      'Letakkan ujung jari telunjuk dan tengah tangan kanan di atas punggung tangan kiri.'
    ],
    tips: 'Dua jari melambangkan dua kaki pada huruf N.',
    imagePath: '/images/bisindo/n.jpg'
  },
  'O': {
    letter: 'O',
    description: 'Jari-jari membentuk lingkaran sempurna.',
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
    description: 'Telunjuk kiri menunjuk ke atas, telunjuk dan jempol kanan membentuk lingkaran yang menempel di ujung atas telunjuk kiri.',
    category: 'Two Hands',
    steps: [
      'Tangan kiri: Angkat telunjuk tegak ke atas.',
      'Tangan kanan: Pertemukan ujung jempol and telunjuk membentuk lingkaran.',
      'Tempelkan lingkaran tersebut di bagian atas telunjuk kiri.'
    ],
    tips: 'Mirip dengan huruf D, tapi lingkaran berada di posisi atas (menyerupai P kapital).',
    imagePath: '/images/bisindo/p.jpg'
  },
  'Q': {
    letter: 'Q',
    description: 'Kebalikan dari P, lingkaran telunjuk dan jempol kanan menempel di bagian bawah telunjuk kiri.',
    category: 'Two Hands',
    steps: [
      'Tangan kiri: Angkat telunjuk tegak ke atas.',
      'Tangan kanan: Pertemukan ujung jempol and telunjuk membentuk lingkaran.',
      'Tempelkan lingkaran tersebut di bagian bawah telunjuk kiri.'
    ],
    tips: 'Visualisasikan ekor pada huruf Q yang berada di bawah.',
    imagePath: '/images/bisindo/q.jpg'
  },
  'R': {
    letter: 'R',
    description: 'Jari telunjuk dan jari tengah disilangkan (fingers crossed).',
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
    description: 'Jari kelingking kanan dan kiri saling mengait (seperti janji kelingking).',
    category: 'Two Hands',
    steps: [
      'Angkat kedua tangan.',
      'Kaitkan jari kelingking kanan dengan jari kelingking kiri.'
    ],
    tips: 'Ini melambangkan lekukan huruf S yang saling menyambung.',
    imagePath: '/images/bisindo/s.jpg'
  },
  'T': {
    letter: 'T',
    description: 'Telunjuk kiri menunjuk ke atas, telunjuk kanan menempel melintang di tengah telunjuk kiri.',
    category: 'Two Hands',
    steps: [
      'Tangan kiri: Angkat telunjuk tegak ke atas.',
      'Tangan kanan: Letakkan telunjuk kanan secara horizontal (mendatar) di tengah-tengah telunjuk kiri.'
    ],
    tips: 'Membentuk tanda tambah (+) atau huruf T kecil.',
    imagePath: '/images/bisindo/t.jpg'
  },
  'U': {
    letter: 'U',
    description: 'Jari telunjuk dan jari tengah menunjuk ke atas secara rapat.',
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
    description: 'Jari telunjuk dan jari tengah membentuk huruf V (simbol peace).',
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
    description: 'Kedua tangan saling mengaitkan jari-jari membentuk pola W.',
    category: 'Two Hands',
    steps: [
      'Angkat kedua tangan dengan telapak menghadap ke depan.',
      'Silangkan jari telunjuk, tengah, dan manis kedua tangan sehingga membentuk pola zig-zag W.'
    ],
    tips: 'Gunakan tiga jari utama dari masing-masing tangan.',
    imagePath: '/images/bisindo/w.jpg'
  },
  'X': {
    letter: 'X',
    description: 'Kedua jari telunjuk disilangkan membentuk tanda silang.',
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
    description: 'Jempol and kelingking direntangkan, jari lainnya menekuk (simbol shaka).',
    category: 'One Hand',
    steps: [
      'Gunakan tangan kanan.',
      'Rentangkan jempol and kelingking sejauh mungkin.',
      'Tekuk tiga jari tengah ke arah telapak tangan.'
    ],
    tips: 'Bentuk ini menyerupai percabangan pada huruf Y.',
    imagePath: '/images/bisindo/y.jpg'
  },
  'Z': {
    letter: 'Z',
    description: 'Jari telunjuk menggambar pola zig-zag huruf Z di udara.',
    category: 'One Hand',
    steps: [
      'Angkat jari telunjuk tangan kanan.',
      'Gerakkan jari membentuk garis horizontal ke kanan, lalu diagonal ke kiri bawah, dan horizontal ke kanan lagi.'
    ],
    tips: 'Lakukan gerakan dengan tegas agar pola Z terlihat jelas.',
    imagePath: '/images/bisindo/z.jpg'
  }
};
