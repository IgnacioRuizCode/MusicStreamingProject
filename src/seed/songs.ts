
import { type Song } from '../types/types';

import midnightDrive from '../assets/audioplaylist/Midnight Drive.mp3';
import lunaDePlata from '../assets/audioplaylist/La Garfield - Luna de Plata (Video Oficial).mp3';
import basslineDrop from '../assets/audioplaylist/Payin Top Dolla - Bassline Drop.mp3';
import deepBlue from '../assets/audioplaylist/Deep Blue - Giulio Cercato.mp3';
import goldenHour from '../assets/audioplaylist/JVKE - golden hour (official music video).mp3';

export const SEED_SONGS: Song[] = [
  { id: 'song-1', title: 'Midnight Drive', artistId: 'art-1', cover: 'https://picsum.photos/seed/s1/300/300', url: midnightDrive, duration: 214 },
  { id: 'song-2', title: 'Luna de Plata', artistId: 'art-1', cover: 'https://picsum.photos/seed/s2/300/300', url: lunaDePlata, duration: 350 },
  { id: 'song-3', title: 'Synth Dreams', artistId: 'art-1', cover: 'https://picsum.photos/seed/s3/300/300', url: basslineDrop, duration: 235 },
  { id: 'song-4', title: 'City Lights', artistId: 'art-1', cover: 'https://picsum.photos/seed/s4/300/300', url: deepBlue, duration: 189 },
  { id: 'song-5', title: 'Silver Moon', artistId: 'art-2', cover: 'https://picsum.photos/seed/s5/300/300', url: goldenHour, duration: 205 },

  { id: 'song-6', title: 'Whispering Pines', artistId: 'art-2', cover: 'https://picsum.photos/seed/s6/300/300', url: '/audio/sample.mp3', duration: 242 },
  { id: 'song-7', title: 'Stardust', artistId: 'art-2', cover: 'https://picsum.photos/seed/s7/300/300', url: '/audio/sample.mp3', duration: 195 },
  { id: 'song-8', title: 'Gravity Falls', artistId: 'art-2', cover: 'https://picsum.photos/seed/s8/300/300', url: '/audio/sample.mp3', duration: 221 },

  { id: 'song-9', title: 'Broken Strings', artistId: 'art-3', cover: 'https://picsum.photos/seed/s9/300/300', url: '/audio/sample.mp3', duration: 184 },
  { id: 'song-10', title: 'Static Noise', artistId: 'art-3', cover: 'https://picsum.photos/seed/s10/300/300', url: '/audio/sample.mp3', duration: 201 },
  { id: 'song-11', title: 'Rebel Heart', artistId: 'art-3', cover: 'https://picsum.photos/seed/s11/300/300', url: '/audio/sample.mp3', duration: 228 },
  { id: 'song-12', title: 'Underground', artistId: 'art-3', cover: 'https://picsum.photos/seed/s12/300/300', url: '/audio/sample.mp3', duration: 192 },

  { id: 'song-13', title: 'Golden Hour', artistId: 'art-4', cover: 'https://picsum.photos/seed/s13/300/300', url: goldenHour, duration: 231 },
  { id: 'song-14', title: 'Ocean Breeze', artistId: 'art-4', cover: 'https://picsum.photos/seed/s14/300/300', url: '/audio/sample.mp3', duration: 230 },
  { id: 'song-15', title: 'Summer Haze', artistId: 'art-4', cover: 'https://picsum.photos/seed/s15/300/300', url: '/audio/sample.mp3', duration: 187 },
  { id: 'song-16', title: 'Warm Sand', artistId: 'art-4', cover: 'https://picsum.photos/seed/s16/300/300', url: '/audio/sample.mp3', duration: 215 },

  { id: 'song-17', title: 'Bassline Drop', artistId: 'art-5', cover: 'https://picsum.photos/seed/s17/300/300', url: basslineDrop, duration: 192 },
  { id: 'song-18', title: 'Night Clubbing', artistId: 'art-5', cover: 'https://picsum.photos/seed/s18/300/300', url: '/audio/sample.mp3', duration: 204 },
  { id: 'song-19', title: 'Pulse Check', artistId: 'art-5', cover: 'https://picsum.photos/seed/s19/300/300', url: '/audio/sample.mp3', duration: 190 },
  { id: 'song-20', title: 'After Hours', artistId: 'art-5', cover: 'https://picsum.photos/seed/s20/300/300', url: '/audio/sample.mp3', duration: 225 },

  { id: 'song-21', title: 'Rainy Window', artistId: 'art-6', cover: 'https://picsum.photos/seed/s21/300/300', url: '/audio/sample.mp3', duration: 248 },
  { id: 'song-22', title: 'Coffee & Lo-Fi', artistId: 'art-6', cover: 'https://picsum.photos/seed/s22/300/300', url: '/audio/sample.mp3', duration: 165 },
  { id: 'song-23', title: 'Quiet Morning', artistId: 'art-6', cover: 'https://picsum.photos/seed/s23/300/300', url: '/audio/sample.mp3', duration: 193 },
  { id: 'song-24', title: 'Cloud Nine', artistId: 'art-6', cover: 'https://picsum.photos/seed/s24/300/300', url: '/audio/sample.mp3', duration: 211 },

  { id: 'song-25', title: 'Red Planet', artistId: 'art-7', cover: 'https://picsum.photos/seed/s25/300/300', url: '/audio/sample.mp3', duration: 256 },
  { id: 'song-26', title: 'Zero Gravity', artistId: 'art-7', cover: 'https://picsum.photos/seed/s26/300/300', url: '/audio/sample.mp3', duration: 234 },
  { id: 'song-27', title: 'Orbit', artistId: 'art-7', cover: 'https://picsum.photos/seed/s27/300/300', url: '/audio/sample.mp3', duration: 199 },
  { id: 'song-28', title: 'Solar Wind', artistId: 'art-7', cover: 'https://picsum.photos/seed/s28/300/300', url: '/audio/sample.mp3', duration: 218 },

  { id: 'song-29', title: 'Deep Blue', artistId: 'art-8', cover: 'https://picsum.photos/seed/s29/300/300', url: deepBlue, duration: 138 },
  { id: 'song-30', title: 'Tidal Force', artistId: 'art-8', cover: 'https://picsum.photos/seed/s30/300/300', url: '/audio/sample.mp3', duration: 195 },
  { id: 'song-31', title: 'Neon Tide', artistId: 'art-8', cover: 'https://picsum.photos/seed/s31/300/300', url: '/audio/sample.mp3', duration: 222 },
  { id: 'song-32', title: 'Last Sunset', artistId: 'art-8', cover: 'https://picsum.photos/seed/s32/300/300', url: '/audio/sample.mp3', duration: 240 },
];
