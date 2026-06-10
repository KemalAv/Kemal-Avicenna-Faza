/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Project, SocialLink, Dream, BlogPost, Profile } from './types';

export const profile: Profile = {
  name: "Kemal Avicenna Faza",
  birthDate: "17 Mei 2008",
  description: "Halo, nama saya Kemal Avicenna Faza. Saya adalah seorang Mahasiswa yang suka berkreasi di dunia digital!",
  currentFocus: "Berkuliah di Universitas Dipenogoro",
  roles: ["Kreator Konten", "Pengembang Web", "Penggiat Teknologi"]
};

export const works: Project[] = [
  {
    title: "Octavia Piano 🎹",
    description: "Platform web interaktif seputar piano.",
    link: "https://octaviapiano.com",
    type: "work"
  },
  {
    title: "Custom Web Background 🌐",
    description: "Ekstensi Google Chrome untuk mengubah latar belakang web sesuai keinginan.",
    link: "https://chromewebstore.google.com/detail/khcclkconpfiinfefklbgiadmboljdga?utm_source=item-share-cb",
    type: "work"
  }
];

export const apps: Project[] = [
  {
    title: "Bikin Kuis Materi",
    description: "Ubah materi belajar jadi kartu hafalan atau kuis pilihan ganda dengan cepat.",
    link: "#",
    type: "app"
  },
  {
    title: "Belajar Al-Qur'an",
    description: "Aplikasi untuk bantu hafalan dan baca Al-Qur'an secara mandiri.",
    link: "#",
    type: "app"
  },
  {
    title: "Bandingkan Skor Ujian",
    description: "Cek perbandingan skor akademikmu dengan benchmark seru lainnya.",
    link: "#",
    type: "app"
  }
];

export const socials: SocialLink[] = [
  {
    platform: "YouTube - Main",
    handle: "@kemalavicennafaza8985",
    link: "https://youtube.com/@kemalavicennafaza8985",
    icon: "Youtube"
  },
  {
    platform: "YouTube - Piano",
    handle: "@kemalavpiano4002",
    link: "https://youtube.com/@kemalavpiano4002",
    icon: "Music"
  },
  {
    platform: "Instagram",
    handle: "@kemalav_",
    link: "https://www.instagram.com/kemalav_/",
    icon: "Instagram"
  },
  {
    platform: "Instagram - Piano",
    handle: "@kemal_av_piano",
    link: "https://www.instagram.com/kemal_av_piano/",
    icon: "Instagram"
  },
  {
    platform: "GitHub",
    handle: "@KemalAv",
    link: "https://github.com/KemalAv",
    icon: "Github"
  },
  {
    platform: "TikTok",
    handle: "@kemalav_",
    link: "https://tiktok.com/@kemalav_",
    icon: "Music2"
  }
];

export const dreams: Dream[] = [
  { title: "Membangun komunitas teknologi global", status: "planned" },
  { title: "Menguasai Full-stack Development", status: "in-progress" },
  { title: "Membuat alat pendidikan berbasis AI", status: "planned" }
];

export const articles: BlogPost[] = [
  {
    title: "Memulai Perjalanan Web Dev",
    summary: "Berbagi pengalaman pertama saya mengenal dunia pemrograman dan kenapa saya menyukainya.",
    date: "2024-03-20"
  },
  {
    title: "Pentingnya Konsistensi di YouTube",
    summary: "Tips bagi kreator konten muda untuk tetap konsisten dalam membuat karya.",
    date: "2024-04-15"
  }
];
