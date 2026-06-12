export interface TierVisualInfo {
  tierId: string;
  name: string;
  background: {
    description: string;
    elements: string[];
  };
  astronaut: {
    physicalState: string;
    pose: string;
    suitCondition: string;
    helmetStatus: string;
    expression: string;
    props: string[];
  };
  ui: {
    themeColor: string;
    hexCode: string; // Active Hex
    neonGlow: string;
    dominantColor: string;
  };
  motion: {
    cameraBehavior: string;
    animationReaction: string;
  };
}

export const TIER_VISUAL_DATA: Record<string, TierVisualInfo> = {
  "150-160": {
    tierId: "150-160",
    name: "Luar Angkasa Jauh",
    background: {
      description: "Ruang angkasa terdalam dengan latar belakang galaksi spiral emas-biru dan black hole yang memicu distorsi ruang.",
      elements: ["Spiral Galaxy", "Black Hole", "Space Distortion", "Cosmic Dust"]
    },
    astronaut: {
      physicalState: "Floating / God Pose",
      pose: "Melayang bebas dengan pose agung (god pose), tanpa tali penambat",
      suitCondition: "Baju astronot putih mengilap bersih (immaculate)",
      helmetStatus: "Visor aktif dengan pantulan galaksi",
      expression: "Mata menyala biru melalui visor",
      props: ["Piala Emas Raksasa"]
    },
    ui: {
      themeColor: "Sian Kosmis",
      hexCode: "#00F0FF",
      dominantColor: "#0D001F",
      neonGlow: "0 0 25px #00F0FF, 0 0 40px #BF00FF",
    },
    motion: {
      cameraBehavior: "Pergerakan kamera sangat tenang dan megah",
      animationReaction: "Pulsa cahaya kosmis yang menyebar perlahan"
    }
  },
  "140–149": {
    tierId: "140–149",
    name: "Sabuk Satelit",
    background: {
      description: "Sabuk tata surya dengan latar belakang planet Saturnus yang megah dan komet yang melintas.",
      elements: ["Saturn", "Icy Rings", "Passing Comets", "Solar Wind"]
    },
    astronaut: {
      physicalState: "Relaxed / Superior",
      pose: "Duduk bersila di atas meteor yang meluncur cepat",
      suitCondition: "Pristine condition, desain futuristik karbon",
      helmetStatus: "Visor bening transparan",
      expression: "Senyum meremehkan (smirk) penuh percaya diri",
      props: ["Hologram Smartphone / UI Slate"]
    },
    ui: {
      themeColor: "Magenta Neon",
      hexCode: "#BF00FF",
      dominantColor: "#120224",
      neonGlow: "0 0 20px #BF00FF, 0 0 40px #FF00AA",
    },
    motion: {
      cameraBehavior: "Kamera mengikuti meteor dengan getaran halus",
      animationReaction: "Komet melesat cepat di latar belakang"
    }
  },
  "130–139": {
    tierId: "130–139",
    name: "Batas Awal Angkasa",
    background: {
      description: "Batas eksosfer dengan latar belakang lengkungan bumi yang biru dan hujan mikrometeoroid.",
      elements: ["Earth Curve", "Micrometeoroid Rain", "Ionization Tails", "Satellites"]
    },
    astronaut: {
      physicalState: "Vertical Drift",
      pose: "Melayang vertikal dengan tali kabel penambat yang tegang",
      suitCondition: "Baju mengkilap dengan sedikit debu angkasa",
      helmetStatus: "Visor helm reflektif penuh mencerminkan bumi",
      expression: "Gaze serius dan bertekad",
      props: ["Alat Pelacak Sinyal Kosmis"]
    },
    ui: {
      themeColor: "Pink Laser",
      hexCode: "#FF00AA",
      dominantColor: "#160630",
      neonGlow: "0 0 15px #FF00AA, 0 0 30px #00FF66",
    },
    motion: {
      cameraBehavior: "Drift upward lambat dengan hambatan",
      animationReaction: "Hujan meteoroid jatuh secara miring"
    }
  },
  "120–129": {
    tierId: "120–129",
    name: "Orbit Stasiun Luar Angkasa",
    background: {
      description: "Lapisan termosfer dengan latar belakang stasiun luar angkasa (ISS) dan aurora hijau yang menari.",
      elements: ["ISS Modules", "Green Aurora", "Solar Panels", "Orbital Junks"]
    },
    astronaut: {
      physicalState: "Braced / Determined",
      pose: "Berpegangan kuat pada besi satelit atau stasiun ISS",
      suitCondition: "Industrial plating, putih cerah",
      helmetStatus: "Helm dibuka penuh (visor up), wajah terekspos",
      expression: "Muka serius menatap tajam ke atas",
      props: ["Cetak Biru (Blueprint) Kampus"]
    },
    ui: {
      themeColor: "Hijau Aurora",
      hexCode: "#00FF66",
      dominantColor: "#0B133A",
      neonGlow: "0 0 12px #00FF66, 0 0 25px #00CCFF",
    },
    motion: {
      cameraBehavior: "Goncangan kamera saat aurora berdenyut",
      animationReaction: "Efek shimmer aurora di seluruh layar"
    }
  },
  "110–119": {
    tierId: "110–119",
    name: "Tempat Meteor Terbakar",
    background: {
      description: "Lapisan mesosfer dengan latar belakang meteor terbakar dan awan es tipis noctilucent.",
      elements: ["Burning Meteors", "Noctilucent Clouds", "Transition Sky"]
    },
    astronaut: {
      physicalState: "High-speed Entry",
      pose: "Terbang horizontal meluncur cepat ke bawah",
      suitCondition: "Baju ada bekas gesekan baret halus dan singe marks",
      helmetStatus: "Visor gelap dengan HUD peringatan suhu",
      expression: "Ekspresi fokus penuh perhitungan",
      props: ["Navigation Wrist Device"]
    },
    ui: {
      themeColor: "Sian Elektrik",
      hexCode: "#00CCFF",
      dominantColor: "#0E1C4E",
      neonGlow: "0 0 18px #00CCFF, 0 0 35px #FFFF00",
    },
    motion: {
      cameraBehavior: "Vibrasi frekuensi tinggi pada layar",
      animationReaction: "Garis-garis angin melintas sangat cepat"
    }
  },
  "100–109": {
    tierId: "100–109",
    name: "Jalur Pesawat Jet",
    background: {
      description: "Lapisan stratosfer dengan latar belakang hamparan awan putih tebal yang luas dan jet tempur.",
      elements: ["Thick Cloud Sea", "Fighter Jets", "Condensation Trails", "Ultra Blue Sky"]
    },
    astronaut: {
      physicalState: "Skydiving / Freefall",
      pose: "Pose terjun bebas (skydiving) yang ekstrem",
      suitCondition: "Bergetar hebat karena tekanan udara",
      helmetStatus: "Wajah terekspos angin kencang",
      expression: "Muka nyengir ambis dan antusias",
      props: ["Tas punggung isi tumpukan buku tebal dengan kabel baja"]
    },
    ui: {
      themeColor: "Kuning Siber",
      hexCode: "#FFFF00",
      dominantColor: "#1A3B70",
      neonGlow: "0 0 10px #FFFF00, 0 0 25px #FFAA00",
    },
    motion: {
      cameraBehavior: "Pergerakan parallax cepat pada lapisan awan",
      animationReaction: "Efek motion blur pada elemen jet tempur"
    }
  },
  "90–99": {
    tierId: "90–99",
    name: "Zona Awan Tinggi",
    background: {
      description: "Lapisan troposfer bawah dengan latar belakang langit biru cerah dan kawanan burung elang.",
      elements: ["Azure Sky", "Soaring Eagles", "Cumulus Clouds", "Sunbeams"]
    },
    astronaut: {
      physicalState: "Parachute Glide",
      pose: "Meluncur santai menggunakan parasut yang terbuka lebar",
      suitCondition: "Matte finish, bersih terkena angin",
      helmetStatus: "Helm dilepas longgar (neck seal released)",
      expression: "Senyum ambisius menatap ke atas",
      props: ["Teropong (Binoculars) di leher"]
    },
    ui: {
      themeColor: "Amber Hangat",
      hexCode: "#FFAA00",
      dominantColor: "#3A7CA5",
      neonGlow: "0 0 8px #FFAA00, 0 0 20px #FFFFFF",
    },
    motion: {
      cameraBehavior: "Ayunan kamera seperti gantung parasut",
      animationReaction: "Burung elang terbang melintas secara acak"
    }
  },
  "80–89": {
    tierId: "80–89",
    name: "Zona Nyaman Manusia",
    background: {
      description: "Latar belakang lapangan rumput hijau, tiang listrik, sunset sore yang hangat, dan siluet kampus Unnes.",
      elements: ["Green Field", "Power Poles", "Warm Sunset", "Unnes Silhouette", "Fence"]
    },
    astronaut: {
      physicalState: "Casual Hybrid",
      pose: "Berdiri tegak di atas tanah, membumi",
      suitCondition: "Baju astronot bawah, bagian atas memakai hoodie santai",
      helmetStatus: "Helm dilepas (ditenteng di tangan)",
      expression: "Muka datar, lempeng, unbothered",
      props: ["Smartphone (Social Media)", "Es Kopi (Iced Coffee) dengan sedotan"]
    },
    ui: {
      themeColor: "Putih Bersih",
      hexCode: "#FFFFFF",
      dominantColor: "#2E5A44",
      neonGlow: "0 0 12px #FFFFFF, 0 0 20px #A6A6A6",
    },
    motion: {
      cameraBehavior: "Statis, tenang, tanpa guncangan",
      animationReaction: "Efek lens flare sunset yang lembut"
    }
  },
  "70–79": {
    tierId: "70–79",
    name: "Tanah Humus & Pipa Air",
    background: {
      description: "Lapisan tanah atas dengan latar belakang tanah humus cokelat dan akar-akar pohon besar.",
      elements: ["Tree Roots", "Humus Soil", "Worms", "Ancient Fossils"]
    },
    astronaut: {
      physicalState: "Cramped / Sweaty",
      pose: "Jongkok karena atap tanah yang sempit dan rendah",
      suitCondition: "Baju putih penuh bercak tanah cokelat",
      helmetStatus: "Helm dipasang, visor baret kena batu",
      expression: "Muka keringatan dan kelelahan fisik",
      props: ["Sekop (Shovel) di samping badan"]
    },
    ui: {
      themeColor: "Perak Redup",
      hexCode: "#A6A6A6",
      dominantColor: "#4A3525",
      neonGlow: "0 0 10px #A6A6A6, 0 0 20px #808080",
    },
    motion: {
      cameraBehavior: "Getaran tanah sporadis",
      animationReaction: "Efek debu tanah yang berjatuhan"
    }
  },
  "60–69": {
    tierId: "60–69",
    name: "Zona Tambang Dalam & Batu Induk",
    background: {
      description: "Lapisan batu induk (bedrock) dengan latar belakang dinding gua batu sedimen yang padat dan stalaktit kecil.",
      elements: ["Sediment Wall", "Bedrock", "Stalactites", "Stone Layers"]
    },
    astronaut: {
      physicalState: "Narrow Crawl",
      pose: "Merangkak di celah sempit di antara himpitan batu",
      suitCondition: "Baju kotor penuh lumpur dan debu batu abu-abu",
      helmetStatus: "Visor penuh goresan dalam",
      expression: "Muka panik dan nafas tersenggal",
      props: ["Lampu Senter Proyek di pundak (beam tajam)"]
    },
    ui: {
      themeColor: "Besi Tua",
      hexCode: "#808080",
      dominantColor: "#333333",
      neonGlow: "0 0 10px #808080, 0 0 25px #FF5500",
    },
    motion: {
      cameraBehavior: "Gerak perlahan dan sesak di antara celah",
      animationReaction: "Kilatan cahaya senter yang bergoyang"
    }
  },
  "50–59": {
    tierId: "50–59",
    name: "Patahan Lempeng & Lubang Bor",
    background: {
      description: "Lapisan litosfer atas dengan latar belakang retakan lempeng tektonik dan asap belerang.",
      elements: ["Tectonic Cracks", "Sulfur Clouds", "Magma Glow", "Rock Sparks"]
    },
    astronaut: {
      physicalState: "Trapped / Squeezed",
      pose: "Terjepit di celah batu yang sempit",
      suitCondition: "Kain baju tertarik dan tegang, penuh debu vulkanik",
      helmetStatus: "Visor memantulkan strobe darurat",
      expression: "Muka kelelahan luar biasa",
      props: ["Lampu Sirine Merah (kedip)", "Layar Dada Eror"]
    },
    ui: {
      themeColor: "Oranye Magma",
      hexCode: "#FF5500",
      dominantColor: "#26140A",
      neonGlow: "0 0 15px #FF5500, 0 0 35px #FF3300",
    },
    motion: {
      cameraBehavior: "Guncangan tektonik periodik (rumble)",
      animationReaction: "Efek distorsi panas yang mulai muncul"
    }
  },
  "40–49": {
    tierId: "40–49",
    name: "Zona Litosfer Bertekanan Tinggi",
    background: {
      description: "Kerak bumi tengah dengan latar belakang batuan kristal berkilau bawah tekanan tinggi dan nuansa merah tua.",
      elements: ["Glowing Crystals", "Quartz Veins", "Dark Red Rock", "Heat Shimmer"]
    },
    astronaut: {
      physicalState: "Failing / Weak",
      pose: "Bersandarkan lemas di dinding kristal",
      suitCondition: "Baju mulai hangus (singe marks) di beberapa bagian",
      helmetStatus: "Kaca helm retak seribu (spiderweb crack)",
      expression: "Muka cemas di bawah bayangan merah",
      props: ["Sample Extractor yang rusak"]
    },
    ui: {
      themeColor: "Merah Hiper",
      hexCode: "#FF3300",
      dominantColor: "#1F0B02",
      neonGlow: "0 0 20px #FF3300, 0 0 40px #800000",
    },
    motion: {
      cameraBehavior: "Zoom in pelan memberikan kesan sesak",
      animationReaction: "Cahaya kristal berdenyut dalam warna merah"
    }
  },
  "2–39": {
    tierId: "2–39",
    name: "Zona Aliran Magma Cair",
    background: {
      description: "Mantel atas dekat magma dengan latar belakang batuan pecah dialiri urat lava merah menyala dan abu vulkanik.",
      elements: ["Lava Veins", "Volcanic Ash", "Shattered Rock", "Intense Ember"]
    },
    astronaut: {
      physicalState: "Defeated / Despair",
      pose: "Berlutut pasrah meratapi nasib",
      suitCondition: "Baju gosong kehitaman, robek, dan mengeluarkan asap",
      helmetStatus: "Helm pecah parah, wajah terekspos panas",
      expression: "Muka nangis meratapi buku-buku yang terbakar",
      props: ["Buku-buku UTBK yang terbakar abu"]
    },
    ui: {
      themeColor: "Merah Darah",
      hexCode: "#800000",
      dominantColor: "#120300",
      neonGlow: "0 0 20px #800000, 0 0 45px #4D0000",
    },
    motion: {
      cameraBehavior: "Distorsi panas hebat (heat waves)",
      animationReaction: "Partikel abu naik memenuhi layar"
    }
  },
  "<2": {
    tierId: "<2",
    name: "Pusat Lava Panas Ekstrem",
    background: {
      description: "Inti bumi / magma cair dengan latar belakang kolam lava mendidih total penuh asap hitam tanpa pijakan.",
      elements: ["Liquid Magma", "Black Fire", "Core Void", "Boiling Lava"]
    },
    astronaut: {
      physicalState: "Absolute Core Sinking",
      pose: "Tenggelam setengah badan di dalam lava cair",
      suitCondition: "Baju hancur meleleh, kabel sirkuit korsleting",
      helmetStatus: "Helm hilang total, wajah terekspos lava",
      expression: "Mata merem pasrah lahir batin",
      props: ["Sisa Puing HUD yang meleleh"]
    },
    ui: {
      themeColor: "Merah Gelap (Eror)",
      hexCode: "#4D0000",
      dominantColor: "#050100",
      neonGlow: "0 0 30px #4D0000, 0 0 60px #260000",
    },
    motion: {
      cameraBehavior: "Slow sinking animation effect",
      animationReaction: "Pesan Error Terminal: [ CRITICAL SYSTEM FAILURE ]"
    }
  }
};
