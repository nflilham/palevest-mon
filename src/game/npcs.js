/**
 * Palevest Mon — NPC Catalog, Daily Quests & Village Social System
 * Contains 8 village NPCs, their shops, dialogues, schedules, and friendship logic.
 */

export const NPC_CATALOG = [
  {
    id: 'mayor_bram',
    name: 'Mayor Bram',
    job: 'Kepala Desa (Village Mayor)',
    buildingId: 'town_hall',
    buildingName: 'Balai Desa Palevest',
    areaName: 'Alun-Alun Utara',
    homeTile: { x: 35, y: 11 },
    patrolRadius: 3,
    bio: 'Pemimpin bijaksana yang menjaga harmoni dan tradisi Lembah Palevest selama tiga dekade.',
    favoriteGift: 'Labu Emas & Teh Chamomile',
    favoriteGiftIds: ['pumpkin', 'chamomile_tea', 'pumpkin_pie'],
    palette: {
      skin: '#f4c7a1',
      hair: '#d9dde2',
      shirt: '#7c2d12',
      pants: '#1e293b',
      accent: '#eab308',
    },
    greetings: {
      morning: 'Selamat pagi! Udara Lembah Palevest pagi ini begitu segar untuk memulai hari di ladang.',
      afternoon: 'Selamat siang, warga muda! Semoga jerih payahmu di kebun membawa berkah berlimpah.',
      evening: 'Selamat malam. Jangan lupa beristirahat agar esok kembali bugar membangun desa kita.',
    },
    dialogues: [
      'Tiga puluh tahun lalu, kakekmu ikut menanam pohon ek pertama di tengah Alun-Alun Palevest ini.',
      'Kesejahteraan desa berawal dari tanah yang dirawat dengan sabar dan warga yang saling peduli.',
      'Jika kamu butuh dorongan semangat atau ingin mempererat persahabatan warga, mampirlah ke Balai Desa.',
      'Setiap hasil panen yang kamu kirim dari kebunmu membuat nama Lembah Palevest kian harum.',
    ],
    shopTitle: 'Layanan Balai Desa & Piagam Kemakmuran',
    shopItems: [
      {
        id: 'village_blessing',
        name: 'Berkah Semangat Desa',
        price: 80,
        type: 'service',
        energyRestore: 100,
        description: 'Memulihkan stamina penuh dan memberi semangat warga.',
      },
      {
        id: 'farm_title_upgrade',
        name: 'Piagam Sahabat Lembah',
        price: 300,
        type: 'friendship_boost',
        bonusFriendship: 15,
        description: 'Meningkatkan keakraban dengan seluruh warga desa (+15 Hati).',
      },
    ],
  },
  {
    id: 'hana',
    name: 'Hana',
    job: 'Penjaga Toko Bibit (Botanist)',
    buildingId: 'seed_shop',
    buildingName: 'Toko Bibit Hijau Daun',
    areaName: 'Distrik Barat Alun-Alun',
    homeTile: { x: 22, y: 21 },
    patrolRadius: 3,
    bio: 'Gadis pencinta tanaman yang merawat bibit organik terbaik di seluruh lembah.',
    favoriteGift: 'Stroberi Segar',
    favoriteGiftIds: ['strawberry', 'herb', 'chamomile_tea'],
    palette: {
      skin: '#f7d3b5',
      hair: '#92400e',
      shirt: '#15803d',
      pants: '#78350f',
      accent: '#f43f5e',
    },
    greetings: {
      morning: 'Pagi yang cerah! Embun pagi ini sangat bagus untuk tunas lobak dan stroberi.',
      afternoon: 'Siang! Sudahkah kamu menyiram tanamanmu hari ini? Tanah yang lembap membuat bibit cepat tumbuh.',
      evening: 'Malam yang tenang. Tanaman juga butuh tidur nyenyak setelah menyerap sinar matahari seharian.',
    },
    dialogues: [
      'Bibit lobak tumbuh hanya dalam 2 hari, cocok sekali untuk modal awal kebunmu!',
      'Kalau kamu ingin keuntungan besar, bibit labu lembah memang butuh 5 hari, tapi hasilnya luar biasa.',
      'Rahasia tanaman subur itu sederhana: cangkul tanahnya, tanam bibitnya, dan jangan lupa disiram setiap hari.',
      'Aku selalu menyimpan stok bibit baru di Toko Bibit Hijau Daun. Silakan pilih yang kamu suka!',
    ],
    shopTitle: 'Toko Bibit Hijau Daun',
    shopItems: [
      {
        id: 'turnip_seed',
        name: 'Bibit Lobak (Turnip)',
        price: 20,
        type: 'seed',
        cropId: 'turnip',
        description: 'Tumbuh cepat dalam 2 hari. Harga jual panen: 55G.',
      },
      {
        id: 'strawberry_seed',
        name: 'Bibit Stroberi Manis',
        price: 40,
        type: 'seed',
        cropId: 'strawberry',
        description: 'Buah merah manis, tumbuh dalam 3 hari. Harga jual panen: 110G.',
      },
      {
        id: 'corn_seed',
        name: 'Bibit Jagung Madu',
        price: 60,
        type: 'seed',
        cropId: 'corn',
        description: 'Jagung keemasan, tumbuh dalam 4 hari. Harga jual panen: 165G.',
      },
      {
        id: 'pumpkin_seed',
        name: 'Bibit Labu Lembah',
        price: 90,
        type: 'seed',
        cropId: 'pumpkin',
        description: 'Hasil panen bernilai tinggi, tumbuh 5 hari. Harga jual panen: 260G.',
      },
    ],
  },
  {
    id: 'garrick',
    name: 'Garrick',
    job: 'Pandai Besi (Blacksmith)',
    buildingId: 'blacksmith',
    buildingName: 'Bengkel Tempa Besi',
    areaName: 'Distrik Timur Alun-Alun',
    homeTile: { x: 48, y: 21 },
    patrolRadius: 2,
    bio: 'Pengrajin logam bertangan dingin yang menempa perkakas pertanian tahan seumur hidup.',
    favoriteGift: 'Kopi Hitam & Roti Madu',
    favoriteGiftIds: ['honey_bread', 'corn', 'mushroom'],
    palette: {
      skin: '#e0ac8b',
      hair: '#27272a',
      shirt: '#475569',
      pants: '#18181b',
      accent: '#f97316',
    },
    greetings: {
      morning: 'Dentang palu pagi hari adalah musik terbaik! Ada perkakas yang perlu kutempa?',
      afternoon: 'Panas tungku siang ini pas sekali untuk mengeraskan baja dan tembaga.',
      evening: 'Bara tungku mulai redup. Pastikan perkakasmu bersih sebelum disimpan malam ini.',
    },
    dialogues: [
      'Cangkul yang tumpul hanya menguras tenagamu. Tempa dengan tembaga agar kerjamu jauh lebih ringan.',
      'Penyiram perak buatanku mampu menampung air lebih banyak dan seimbang di tangan.',
      'Kapten Tio memesan mata kail dan pancingan serat bambu dariku. Ikan kakap merah takkan sanggup lepas!',
      'Besi tidak pernah berbohong, semakin tekun ditempa, semakin kuat ia menahan beban.',
    ],
    shopTitle: 'Tempa & Upgrade Perkakas',
    shopItems: [
      {
        id: 'upgrade_hoe',
        name: 'Tempa Cangkul Tembaga',
        price: 180,
        type: 'tool_upgrade',
        toolTarget: 'hoe',
        description: 'Mengurangi konsumsi energi saat mencangkul tanah.',
      },
      {
        id: 'upgrade_watering',
        name: 'Tempa Penyiram Perak',
        price: 200,
        type: 'tool_upgrade',
        toolTarget: 'watering_can',
        description: 'Kapasitas air lebih besar dan hemat stamina saat menyiram.',
      },
      {
        id: 'upgrade_rod',
        name: 'Pancingan Serat Bambu',
        price: 220,
        type: 'tool_upgrade',
        toolTarget: 'fishing_rod',
        description: 'Meningkatkan peluang mendapat ikan kakap merah di pantai.',
      },
    ],
  },
  {
    id: 'pak_darto',
    name: 'Pak Darto',
    job: 'Peternak (Rancher)',
    buildingId: 'ranch_barn',
    buildingName: 'Peternakan Padang Hijau',
    areaName: 'Peternakan Timur Laut',
    homeTile: { x: 58, y: 11 },
    patrolRadius: 3,
    bio: 'Peternak ramah yang menganggap setiap sapi, domba, dan ayam sebagai keluarganya sendiri.',
    favoriteGift: 'Jagung Madu',
    favoriteGiftIds: ['corn', 'milk', 'egg'],
    palette: {
      skin: '#eab68c',
      hair: '#57534e',
      shirt: '#b45309',
      pants: '#1d4ed8',
      accent: '#facc15',
    },
    greetings: {
      morning: 'Selamat pagi! Ayam-ayam sudah berkokok dan sapi di padang rumput siap diperah.',
      afternoon: 'Siang, Nak! Lihat domba-domba itu, bulunya tampak mengembang di bawah sinar matahari.',
      evening: 'Sore menjelang malam, saatnya menggiring ternak beristirahat dengan perut kenyang.',
    },
    dialogues: [
      'Eluslah hewan ternakmu dengan alat Tangan setiap hari untuk mengambil susu segar, wol halus, dan telur.',
      'Kalau kamu memberi mereka Pakan Ternak Rumput Segar, mereka akan langsung gembira dan produktif!',
      'Sapi Mooi dan Domba Awan sangat suka kalau ada warga yang berkunjung ke padang rumput timur laut.',
      'Ingin menambah keramaian di peternakan? Kamu bisa mengadopsi ayam atau domba baru dariku.',
    ],
    shopTitle: 'Kebutuhan Peternakan Padang Hijau',
    shopItems: [
      {
        id: 'animal_feed',
        name: 'Pakan Ternak Rumput Segar',
        price: 25,
        type: 'item',
        description: 'Berikan pada hewan ternak agar menghasilkan susu, wol, dan telur.',
      },
      {
        id: 'adopt_chicken',
        name: 'Adopsi Ayam Kampung Baru',
        price: 150,
        type: 'adopt_animal',
        animalType: 'chicken',
        description: 'Menambah 1 ayam penghasil telur di padang peternakan.',
      },
      {
        id: 'adopt_sheep',
        name: 'Adopsi Domba Berbulu Halus',
        price: 280,
        type: 'adopt_animal',
        animalType: 'sheep',
        description: 'Menambah 1 domba penghasil wol di padang peternakan.',
      },
    ],
  },
  {
    id: 'kapten_tio',
    name: 'Kapten Tio',
    job: 'Nelayan (Fisherman)',
    buildingId: 'fisher_shack',
    buildingName: 'Pondok Pancing Dermaga',
    areaName: 'Pantai Selatan',
    homeTile: { x: 40, y: 47 },
    patrolRadius: 3,
    bio: 'Pelaut tua penuh cerita yang mengenal setiap arus ombak dan rahasia teluk selatan.',
    favoriteGift: 'Sup Ikan & Teh Hangat',
    favoriteGiftIds: ['fish_snapper', 'fish_carp', 'chamomile_tea'],
    palette: {
      skin: '#d99b72',
      hair: '#e2e8f0',
      shirt: '#0369a1',
      pants: '#0f172a',
      accent: '#38bdf8',
    },
    greetings: {
      morning: 'Ahoy, pagi yang tenang! Air laut sedang pasang, waktu terbaik melempar kail dari dermaga.',
      afternoon: 'Angin laut siang ini membawa aroma garam dan tangkapan segar!',
      evening: 'Debur ombak malam di Pantai Selatan selalu menenangkan hati para pelaut.',
    },
    dialogues: [
      'Arahkan pancinganmu ke air sungai atau tepi dermaga pantai untuk menangkap ikan segar.',
      'Ikan Kakap Merah hanya muncul di perairan Pantai Selatan dan harganya sangat bagus di pasar!',
      'Jangan lupa memungut kerang mutiara yang terdampar di pasir pantai setiap pagi.',
      'Kalau lapar sehabis memancing, cicipi Ikan Bakar Bumbu Pesisir racikanku di pondok.',
    ],
    shopTitle: 'Pondok Pancing & Hasil Laut',
    shopItems: [
      {
        id: 'fish_carp',
        name: 'Ikan Mas Sungai Segar',
        price: 45,
        type: 'item',
        description: 'Ikan air tawar segar tangkapan pagi.',
      },
      {
        id: 'grilled_fish_meal',
        name: 'Ikan Bakar Bumbu Pesisir',
        price: 50,
        type: 'food',
        energyRestore: 45,
        description: 'Santapan hangat tepi pantai (+45 Energi).',
      },
    ],
  },
  {
    id: 'chef_liora',
    name: 'Chef Liora',
    job: 'Koki & Pembuat Roti (Baker & Chef)',
    buildingId: 'bakery_cafe',
    buildingName: 'Kedai Hangat & Roti',
    areaName: 'Alun-Alun Selatan',
    homeTile: { x: 29, y: 32 },
    patrolRadius: 3,
    bio: 'Pemilik kedai roti yang selalu menyalakan oven sejak fajar demi menghangatkan hati warga.',
    favoriteGift: 'Susu Segar & Telur',
    favoriteGiftIds: ['milk', 'egg', 'strawberry'],
    palette: {
      skin: '#f7d5b8',
      hair: '#7c2d12',
      shirt: '#be123c',
      pants: '#334155',
      accent: '#fef08a',
    },
    greetings: {
      morning: 'Selamat pagi! Roti gandum madu baru saja keluar dari oven, aromanya harum sekali!',
      afternoon: 'Istirahatlah sejenak dari ladang, secangkir teh chamomile hangat sudah menantimu.',
      evening: 'Malam yang dingin paling pas ditemani sepotong pai labu manis di Kedai Hangat.',
    },
    dialogues: [
      'Bekerja di ladang membutuhkan banyak stamina. Selalu bawa roti madu di sakumu!',
      'Susu segar dari peternakan Pak Darto dan labu dari bibit Hana adalah rahasia kelezatan Pai Labuku.',
      'Makanan yang dimasak dengan tulus tidak hanya mengenyangkan perut, tapi juga memulihkan semangat.',
      'Mampirlah kapan saja kamu lelah, pintu Kedai Hangat & Roti selalu terbuka untukmu.',
    ],
    shopTitle: 'Menu Kedai Hangat & Roti',
    shopItems: [
      {
        id: 'honey_bread',
        name: 'Roti Gandum Madu',
        price: 35,
        type: 'food',
        energyRestore: 35,
        description: 'Roti lembut manis dari oven (+35 Energi).',
      },
      {
        id: 'chamomile_tea',
        name: 'Teh Chamomile Lembah',
        price: 30,
        type: 'food',
        energyRestore: 30,
        description: 'Minuman hangat penenang pikiran (+30 Energi).',
      },
      {
        id: 'pumpkin_pie',
        name: 'Pai Labu Spesial Liora',
        price: 75,
        type: 'food',
        energyRestore: 80,
        description: 'Hidangan penutup kaya rasa (+80 Energi).',
      },
    ],
  },
  {
    id: 'dr_elian',
    name: 'Dr. Elian',
    job: 'Tabib & Apoteker Herbal (Herbalist)',
    buildingId: 'herbal_clinic',
    buildingName: 'Klinik Herbal Lembah',
    areaName: 'Tepi Hutan Barat',
    homeTile: { x: 15, y: 31 },
    patrolRadius: 2,
    bio: 'Tabib lembut yang memadukan ilmu medis modern dengan ramuan tanaman hutan.',
    favoriteGift: 'Daun Herbal & Jamur Hutan',
    favoriteGiftIds: ['herb', 'mushroom', 'chamomile_tea'],
    palette: {
      skin: '#f5d0b5',
      hair: '#1e3a8a',
      shirt: '#0f766e',
      pants: '#1e293b',
      accent: '#99f6e4',
    },
    greetings: {
      morning: 'Selamat pagi. Jangan memforsir tubuhmu saat mencangkul, jaga irama napasmu.',
      afternoon: 'Siang yang hangat. Ingat untuk minum cukup air dan memulihkan staminamu.',
      evening: 'Selamat malam. Tidur tepat waktu adalah obat pemulih terbaik bagi petani.',
    },
    dialogues: [
      'Di Hutan Bisik sebelah barat, tumbuh daun herbal dan jamur liar yang kaya khasiat setiap hari.',
      'Tonik Stamina Hutan buatanku diekstrak dari embun pagi dan daun herbal pilihan.',
      'Jika staminamu hampir habis di tengah hari, datanglah ke klinik untuk terapi pemulihan.',
      'Kesehatan warga Palevest adalah kebahagiaan terbesar bagi seorang tabib.',
    ],
    shopTitle: 'Klinik & Apotek Herbal',
    shopItems: [
      {
        id: 'herbal_tonic',
        name: 'Tonik Stamina Hutan',
        price: 45,
        type: 'food',
        energyRestore: 55,
        description: 'Ekstrak herbal alami pemulih tenaga (+55 Energi).',
      },
      {
        id: 'clinic_checkup',
        name: 'Terapi Relaksasi & Pemulihan',
        price: 60,
        type: 'service',
        energyRestore: 100,
        description: 'Memulihkan energi hingga 100% seketika.',
      },
    ],
  },
  {
    id: 'nadia',
    name: 'Nadia',
    job: 'Pengrajin Kayu & Pustakawan (Artisan & Librarian)',
    buildingId: 'wood_library',
    buildingName: 'Studio Kayu & Pustaka',
    areaName: 'Tenggara Alun-Alun',
    homeTile: { x: 46, y: 32 },
    patrolRadius: 3,
    bio: 'Seniman kayu dan penjaga arsip desa yang merancang furnitur serta mencatat kisah lembah.',
    favoriteGift: 'Wol Halus & Kerang Pantai',
    favoriteGiftIds: ['wool', 'seashell', 'turnip'],
    palette: {
      skin: '#f1c29b',
      hair: '#4c1d95',
      shirt: '#6d28d9',
      pants: '#312e81',
      accent: '#f59e0b',
    },
    greetings: {
      morning: 'Pagi! Aroma serutan kayu pinus dan lembaran buku tua selalu membangkitkan inspirasi.',
      afternoon: 'Selamat siang! Sedang mencari catatan sejarah lembah atau kerajinan tangan baru?',
      evening: 'Malam yang syahdu untuk membaca kisah para pendiri Lembah Palevest di bawah lampu lentera.',
    },
    dialogues: [
      'Setiap serat kayu menyimpan memori musim yang telah dilaluinya, persis seperti buku sejarah desa kita.',
      'Aku mengukir Jimat Kayu Ek Rindang yang dipercaya menambah daya tahan dan batas stamina pemakainya.',
      'Kerang pantai dan wol domba dari peternakan sangat cocok dijadikan hiasan bingkai di pustaka.',
      'Keranjang Panen Anyaman buatanku sering dibagikan sebagai tanda kasih sayang antarwarga.',
    ],
    shopTitle: 'Studio Kayu & Koleksi Pustaka',
    shopItems: [
      {
        id: 'max_energy_charm',
        name: 'Jimat Kayu Ek Rindang',
        price: 240,
        type: 'max_energy_upgrade',
        bonusEnergy: 25,
        description: 'Meningkatkan batas Maksimum Stamina pemain secara permanen (+25 Max Energi).',
      },
      {
        id: 'artisan_basket',
        name: 'Keranjang Panen Anyaman',
        price: 120,
        type: 'friendship_boost',
        bonusFriendship: 10,
        description: 'Hadiah kerajinan untuk warga (+10 Hati ke semua NPC).',
      },
    ],
  },
];

export const DAILY_QUESTS = [
  {
    id: 'quest_turnip_harvest',
    title: 'Pesanan Lobak Segar Hana',
    giverId: 'hana',
    giverName: 'Hana',
    description: 'Hana membutuhkan 2 Lobak segar hasil kebunmu untuk contoh bibit unggulan di tokonya.',
    targetItem: 'turnip',
    targetItemName: 'Lobak Segar',
    targetCount: 2,
    rewardGold: 140,
    rewardFriendship: 15,
  },
  {
    id: 'quest_fresh_milk',
    title: 'Bahan Krim Roti Chef Liora',
    giverId: 'chef_liora',
    giverName: 'Chef Liora',
    description: 'Antarkan 1 botol Susu Sapi Segar dari peternakan untuk adonan kue pagi Chef Liora.',
    targetItem: 'milk',
    targetItemName: 'Susu Sapi Segar',
    targetCount: 1,
    rewardGold: 120,
    rewardFriendship: 15,
  },
  {
    id: 'quest_forest_herbs',
    title: 'Racikan Herbal Dr. Elian',
    giverId: 'dr_elian',
    giverName: 'Dr. Elian',
    description: 'Kumpulkan 2 Daun Herbal Hutan di Hutan Bisik Barat untuk persediaan tonik klinik.',
    targetItem: 'herb',
    targetItemName: 'Daun Herbal Hutan',
    targetCount: 2,
    rewardGold: 110,
    rewardFriendship: 15,
  },
  {
    id: 'quest_river_fish',
    title: 'Santapan Pesisir Kapten Tio',
    giverId: 'kapten_tio',
    giverName: 'Kapten Tio',
    description: 'Pancing 1 Ikan Mas Sungai untuk dimasak bersama Kapten Tio di Pondok Dermaga.',
    targetItem: 'fish_carp',
    targetItemName: 'Ikan Mas Sungai',
    targetCount: 1,
    rewardGold: 130,
    rewardFriendship: 15,
  },
  {
    id: 'quest_beach_shells',
    title: 'Ornamen Pustaka Nadia',
    giverId: 'nadia',
    giverName: 'Nadia',
    description: 'Temukan 2 Kerang Mutiara di pasir Pantai Selatan untuk kerajinan bingkai kayu Nadia.',
    targetItem: 'seashell',
    targetItemName: 'Kerang Mutiara Pantai',
    targetCount: 2,
    rewardGold: 125,
    rewardFriendship: 15,
  },
  {
    id: 'quest_golden_pumpkin',
    title: 'Persembahan Panen Mayor Bram',
    giverId: 'mayor_bram',
    giverName: 'Mayor Bram',
    description: 'Hasilkan 1 Labu Lembah berkualitas terbaik untuk pameran kemakmuran Balai Desa.',
    targetItem: 'pumpkin',
    targetItemName: 'Labu Lembah',
    targetCount: 1,
    rewardGold: 320,
    rewardFriendship: 25,
  },
];

const DIRECTIONS = ['down', 'left', 'right', 'up'];

export class NPCManager {
  constructor() {
    this.npcs = NPC_CATALOG.map((def, idx) => ({
      ...def,
      x: def.homeTile.x,
      y: def.homeTile.y,
      targetX: def.homeTile.x,
      targetY: def.homeTile.y,
      dir: 'down',
      frame: 0,
      animTimer: 0,
      moveTimer: 1.5 + (idx % 4) * 0.6,
      isMoving: false,
      friendship: 20,
      talkedToday: false,
      giftedToday: false,
      dialogueIndex: 0,
    }));
  }

  /**
   * Gently strolls NPCs around their homeTile within patrolRadius
   * so they are always easy to find right in front of their building/shop.
   */
  update(dt, isWalkable) {
    const delta = dt > 10 ? dt / 1000 : dt;
    if (!Number.isFinite(delta) || delta <= 0) return;

    for (const npc of this.npcs) {
      const dx = npc.targetX - npc.x;
      const dy = npc.targetY - npc.y;
      const dist = Math.hypot(dx, dy);

      if (dist > 0.04) {
        npc.isMoving = true;
        const speed = 1.35; // gentle stroll in tiles/sec
        const step = Math.min(dist, speed * delta);
        const nx = npc.x + (dx / dist) * step;
        const ny = npc.y + (dy / dist) * step;

        if (Math.abs(dx) >= Math.abs(dy)) {
          npc.dir = dx > 0 ? 'right' : 'left';
        } else {
          npc.dir = dy > 0 ? 'down' : 'up';
        }

        const canMove =
          typeof isWalkable !== 'function' ||
          isWalkable(Math.round(nx), Math.round(ny));

        if (canMove) {
          npc.x = nx;
          npc.y = ny;
        } else {
          npc.targetX = npc.x;
          npc.targetY = npc.y;
          npc.isMoving = false;
        }

        npc.animTimer += delta;
        if (npc.animTimer >= 0.22) {
          npc.animTimer = 0;
          npc.frame = (npc.frame + 1) % 4;
        }
      } else {
        npc.x = npc.targetX;
        npc.y = npc.targetY;
        npc.isMoving = false;
        npc.frame = 0;
        npc.moveTimer -= delta;

        if (npc.moveTimer <= 0) {
          npc.moveTimer = 2.4 + Math.random() * 2.8;
          // 35% chance to just return to exact homeTile so they stay near their door
          if (Math.random() < 0.35) {
            npc.targetX = npc.homeTile.x;
            npc.targetY = npc.homeTile.y;
            npc.dir = 'down';
          } else {
            const offsetX =
              Math.floor(Math.random() * (npc.patrolRadius * 2 + 1)) -
              npc.patrolRadius;
            const offsetY =
              Math.floor(Math.random() * 3) - 1; // keep mostly along the front path
            const candidateX = npc.homeTile.x + offsetX;
            const candidateY = npc.homeTile.y + offsetY;

            const walkable =
              typeof isWalkable !== 'function' ||
              isWalkable(candidateX, candidateY);

            if (walkable) {
              npc.targetX = candidateX;
              npc.targetY = candidateY;
            } else {
              npc.dir = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
            }
          }
        }
      }
    }
  }

  getNPCs() {
    return this.npcs;
  }

  getNPCById(id) {
    return this.npcs.find((n) => n.id === id) || null;
  }

  getNearbyNPC(playerX, playerY, maxDist = 2.2) {
    let closest = null;
    let bestDist = maxDist;

    for (const npc of this.npcs) {
      const dist = Math.hypot(npc.x - playerX, npc.y - playerY);
      if (dist <= bestDist) {
        bestDist = dist;
        closest = npc;
      }
    }
    return closest;
  }

  addFriendship(npcId, amount) {
    const npc = this.getNPCById(npcId);
    if (!npc) return 0;
    npc.friendship = Math.max(0, Math.min(100, Math.round(npc.friendship + amount)));
    return npc.friendship;
  }

  addFriendshipAll(amount) {
    for (const npc of this.npcs) {
      npc.friendship = Math.max(0, Math.min(100, Math.round(npc.friendship + amount)));
    }
  }

  getTimeGreeting(npcOrId, gameHour = 8) {
    const npc =
      typeof npcOrId === 'string' ? this.getNPCById(npcOrId) : npcOrId;
    if (!npc || !npc.greetings) {
      return 'Selamat datang di Lembah Palevest!';
    }
    if (gameHour < 12) return npc.greetings.morning;
    if (gameHour < 18) return npc.greetings.afternoon;
    return npc.greetings.evening;
  }

  getNextDialogue(npcOrId) {
    const npc =
      typeof npcOrId === 'string' ? this.getNPCById(npcOrId) : npcOrId;
    if (!npc || !Array.isArray(npc.dialogues) || npc.dialogues.length === 0) {
      return 'Semoga harimu menyenangkan di Lembah Palevest!';
    }
    const line = npc.dialogues[npc.dialogueIndex % npc.dialogues.length];
    npc.dialogueIndex = (npc.dialogueIndex + 1) % npc.dialogues.length;
    if (!npc.talkedToday) {
      npc.talkedToday = true;
      this.addFriendship(npc.id, 2);
    }
    return line;
  }

  resetDailyFlags() {
    for (const npc of this.npcs) {
      npc.talkedToday = false;
      npc.giftedToday = false;
      npc.x = npc.homeTile.x;
      npc.y = npc.homeTile.y;
      npc.targetX = npc.homeTile.x;
      npc.targetY = npc.homeTile.y;
      npc.dir = 'down';
    }
  }

  serialize() {
    return this.npcs.map((npc) => ({
      id: npc.id,
      x: Number(npc.x.toFixed(2)),
      y: Number(npc.y.toFixed(2)),
      dir: npc.dir,
      friendship: npc.friendship,
      talkedToday: Boolean(npc.talkedToday),
      giftedToday: Boolean(npc.giftedToday),
      dialogueIndex: npc.dialogueIndex || 0,
    }));
  }

  deserialize(savedData) {
    if (!Array.isArray(savedData)) return;
    for (const entry of savedData) {
      if (!entry || !entry.id) continue;
      const npc = this.getNPCById(entry.id);
      if (!npc) continue;
      if (typeof entry.x === 'number') {
        npc.x = entry.x;
        npc.targetX = entry.x;
      }
      if (typeof entry.y === 'number') {
        npc.y = entry.y;
        npc.targetY = entry.y;
      }
      if (typeof entry.dir === 'string') npc.dir = entry.dir;
      if (typeof entry.friendship === 'number') {
        npc.friendship = Math.max(0, Math.min(100, entry.friendship));
      }
      npc.talkedToday = Boolean(entry.talkedToday);
      npc.giftedToday = Boolean(entry.giftedToday);
      npc.dialogueIndex = Number(entry.dialogueIndex) || 0;
    }
  }
}
