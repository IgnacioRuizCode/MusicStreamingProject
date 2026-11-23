import { useCallback, useState } from 'react';
import type { Playlist, Song } from '../types/types';
import {
  addSongWithSync,
  deleteSongWithCascade,
  getAll,
  getById,
  getPlaylistSongs,
  getUserPlaylists,
  update,
} from '../services/storageServices';

export function useLibrary() {
  const [songs, setSongs] = useState<Song[]>(() => getAll('songs'));
  const [playlists, setPlaylists] = useState<Playlist[]>(() => getAll('playlists'));

  const refresh = useCallback(() => {
    setSongs(getAll('songs'));
    setPlaylists(getAll('playlists'));
  }, []);

  const addSong = useCallback(
    (data: Omit<Song, 'id'>) => {
      const created = addSongWithSync(data);
      refresh();
      return created;
    },
    [refresh],
  );

  const updateSong = useCallback(
    (id: string, changes: Partial<Omit<Song, 'id'>>) => {
      const updated = update('songs', id, changes);
      refresh();
      return updated;
    },
    [refresh],
  );

  const deleteSong = useCallback(
    (id: string) => {
      const result = deleteSongWithCascade(id);
      refresh();
      return result;
    },
    [refresh],
  );

  const getSong = useCallback((id: string) => getById('songs', id), []);
  const getPlaylist = useCallback((id: string) => getById('playlists', id), []);
  const getPlaylistTracks = useCallback(
    (playlistId: string) => getPlaylistSongs(playlistId),
    [],
  );
  const getUserPlaylistsFor = useCallback(
    (userId: string) => getUserPlaylists(userId),
    [],
  );

  const togglePlaylistSong = useCallback(
    (playlistId: string, songId: string) => {
      const playlist = getById('playlists', playlistId);
      if (!playlist) return null;

      const exists = playlist.songIds.includes(songId);
      const updated = update('playlists', playlistId, {
        songIds: exists
          ? playlist.songIds.filter((id) => id !== songId)
          : [...playlist.songIds, songId],
      });
      refresh();
      return updated;
    },
    [refresh],
  );

  const isInPlaylist = useCallback((playlistId: string, songId: string) => {
    const playlist = getById('playlists', playlistId);
    return playlist?.songIds.includes(songId) ?? false;
  }, []);

  return {
    songs,
    playlists,
    addSong,
    updateSong,
    deleteSong,
    getSong,
    getPlaylist,
    getPlaylistTracks,
    getUserPlaylists: getUserPlaylistsFor,
    togglePlaylistSong,
    isInPlaylist,
    refresh,
  };
}
