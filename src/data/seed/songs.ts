import { type Song } from '../../types/types';

import midnightDrive from '../../assets/audioplaylist/Midnight Drive.mp3';
import lunaDePlata from '../../assets/audioplaylist/La Garfield - Luna de Plata (Video Oficial).mp3';
import basslineDrop from '../../assets/audioplaylist/Payin Top Dolla - Bassline Drop.mp3';
import deepBlue from '../../assets/audioplaylist/Deep Blue - Giulio Cercato.mp3';
import goldenHour from '../../assets/audioplaylist/JVKE - golden hour (official music video).mp3';

export const SEED_SONGS: Song[] = [
  // The Weeknd (art-1)
  { id: 'song-1', title: 'Blinding Lights', artistId: 'art-1', cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80', url: midnightDrive, duration: 200 },
  { id: 'song-2', title: 'Starboy', artistId: 'art-1', cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80', url: basslineDrop, duration: 230 },
  { id: 'song-3', title: 'Save Your Tears', artistId: 'art-1', cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80', url: deepBlue, duration: 215 },
  { id: 'song-4', title: 'Die For You', artistId: 'art-1', cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80', url: goldenHour, duration: 260 },

  // Justin Bieber (art-2)
  { id: 'song-5', title: 'Peaches', artistId: 'art-2', cover: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&q=80', url: goldenHour, duration: 198 },
  { id: 'song-6', title: 'Ghost', artistId: 'art-2', cover: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&q=80', url: lunaDePlata, duration: 153 },
  { id: 'song-7', title: 'Sorry', artistId: 'art-2', cover: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&q=80', url: basslineDrop, duration: 200 },
  { id: 'song-8', title: 'Love Yourself', artistId: 'art-2', cover: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&q=80', url: deepBlue, duration: 233 },

  // Duki (art-3)
  { id: 'song-9', title: 'Givenchy', artistId: 'art-3', cover: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&q=80', url: basslineDrop, duration: 182 },
  { id: 'song-10', title: 'Malbec', artistId: 'art-3', cover: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&q=80', url: midnightDrive, duration: 194 },
  { id: 'song-11', title: 'Goteo', artistId: 'art-3', cover: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&q=80', url: deepBlue, duration: 165 },
  { id: 'song-12', title: 'She Don’t Give a FO', artistId: 'art-3', cover: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&q=80', url: lunaDePlata, duration: 210 },

  // Dua Lipa (art-4)
  { id: 'song-13', title: 'Levitating', artistId: 'art-4', cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80', url: goldenHour, duration: 203 },
  { id: 'song-14', title: 'Don’t Start Now', artistId: 'art-4', cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80', url: basslineDrop, duration: 183 },
  { id: 'song-15', title: 'Houdini', artistId: 'art-4', cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80', url: midnightDrive, duration: 186 },
  { id: 'song-16', title: 'New Rules', artistId: 'art-4', cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80', url: deepBlue, duration: 209 },

  // Bad Bunny (art-5)
  { id: 'song-17', title: 'Tití Me Preguntó', artistId: 'art-5', cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80', url: basslineDrop, duration: 243 },
  { id: 'song-18', title: 'Dakiti', artistId: 'art-5', cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80', url: midnightDrive, duration: 205 },
  { id: 'song-19', title: 'Moscow Mule', artistId: 'art-5', cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80', url: lunaDePlata, duration: 245 },
  { id: 'song-20', title: 'Me Porto Bonito', artistId: 'art-5', cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80', url: goldenHour, duration: 178 },

  // Emilia (art-6)
  { id: 'song-21', title: 'La_Original.mp3', artistId: 'art-6', cover: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400&q=80', url: lunaDePlata, duration: 141 },
  { id: 'song-22', title: 'No_Se_Ve.mp3', artistId: 'art-6', cover: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400&q=80', url: basslineDrop, duration: 202 },
  { id: 'song-23', title: 'Exclusive.mp3', artistId: 'art-6', cover: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400&q=80', url: goldenHour, duration: 158 },
  { id: 'song-24', title: 'Cuatro Veinte', artistId: 'art-6', cover: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400&q=80', url: deepBlue, duration: 146 },

  // Coldplay (art-7)
  { id: 'song-25', title: 'Viva La Vida', artistId: 'art-7', cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80', url: goldenHour, duration: 242 },
  { id: 'song-26', title: 'Yellow', artistId: 'art-7', cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80', url: deepBlue, duration: 266 },
  { id: 'song-27', title: 'A Sky Full of Stars', artistId: 'art-7', cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80', url: midnightDrive, duration: 268 },
  { id: 'song-28', title: 'The Scientist', artistId: 'art-7', cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80', url: lunaDePlata, duration: 309 },

  // Travis Scott (art-8)
  { id: 'song-29', title: 'FE!N', artistId: 'art-8', cover: 'https://images.unsplash.com/photo-1571266028243-d220c6a6db90?w=400&q=80', url: basslineDrop, duration: 191 },
  { id: 'song-30', title: 'SICKO MODE', artistId: 'art-8', cover: 'https://images.unsplash.com/photo-1571266028243-d220c6a6db90?w=400&q=80', url: midnightDrive, duration: 312 },
  { id: 'song-31', title: 'goosebumps', artistId: 'art-8', cover: 'https://images.unsplash.com/photo-1571266028243-d220c6a6db90?w=400&q=80', url: deepBlue, duration: 243 },
  { id: 'song-32', title: 'HIGHEST IN THE ROOM', artistId: 'art-8', cover: 'https://images.unsplash.com/photo-1571266028243-d220c6a6db90?w=400&q=80', url: goldenHour, duration: 175 },

  // Feid (art-9)
  { id: 'song-33', title: 'LUNA', artistId: 'art-9', cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80', url: basslineDrop, duration: 196 },
  { id: 'song-34', title: 'CLASSY 101', artistId: 'art-9', cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80', url: midnightDrive, duration: 195 },
  { id: 'song-35', title: 'FERXXO 100', artistId: 'art-9', cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80', url: lunaDePlata, duration: 168 },
  { id: 'song-36', title: 'Normal', artistId: 'art-9', cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80', url: goldenHour, duration: 171 },
  { id: 'song-37', title: 'Feliz Cumpleaños Ferxxo', artistId: 'art-9', cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80', url: deepBlue, duration: 155 },
];