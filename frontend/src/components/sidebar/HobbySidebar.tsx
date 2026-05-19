import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import HobbyItem from './HobbyItem';
import { useGraphContext } from '../../context/GraphContext';
import { useUsers } from '../../hooks/useUsers';
import { useGraph } from '../../hooks/useGraph'; // refreshAll के लिए इम्पोर्ट किया
import { debounce } from '../../utils/debounce';

const ALL_HOBBIES = [
  'Gaming', 'Cooking', 'Reading', 'Hiking', 'Photography', 'Music', 'Painting',
  'Coding', 'Dancing', 'Swimming', 'Cycling', 'Yoga', 'Baking', 'Traveling',
  'Writing', 'Drawing', 'Football', 'Cricket', 'Chess', 'Anime', 'Gardening',
  'Movies', 'Meditation', 'Skateboarding', 'Surfing', 'Knitting', 'Podcasting',
  'Rock Climbing', 'Astronomy', 'Languages',
];

export default function HobbySidebar() {
  const [query, setQuery] = useState('');
  const [debouncedQ, setDebouncedQ] = useState('');
  const { dispatch, addToast } = useGraphContext();
  const { update, users } = useUsers(); // सीधे हुक से users निकाला
  const { refreshAll } = useGraph();

  const debounced = useMemo(
    () => debounce((v: string) => setDebouncedQ(v), 250),
    []
  );

  const filtered = useMemo(
    () =>
      ALL_HOBBIES.filter((h) =>
        h.toLowerCase().includes(debouncedQ.toLowerCase())
      ),
    [debouncedQ]
  );

  // ग्राफ कैनवस से आने वाले ड्रॉप इवेंट को सुनना
  useEffect(() => {
    const handler = async (e: Event) => {
      const { hobby, userId } = (e as CustomEvent).detail as { hobby: string; userId: string };
      
      const user = users.find((u) => u.id === userId);
      if (!user) return;
      
      if (user.hobbies.includes(hobby)) {
        if (addToast) addToast('error', `${user.username} already has ${hobby}!`);
        return;
      }

      try {
        if (dispatch) dispatch({ type: 'SET_LOADING', payload: true });
        
        // बैकएंड अपडेट
        await update(userId, { hobbies: [...user.hobbies, hobby] });
        
        if (addToast) addToast('success', `Added ${hobby} to ${user.username}!`);
        if (refreshAll) await refreshAll(); // नए स्कोर के साथ नोड्स को री-रेंडर करेगा
      } catch (err) {
        console.error("Hobby drop error:", err);
      } finally {
        if (dispatch) dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    window.addEventListener('hobby-dropped-on-node', handler);
    return () => window.removeEventListener('hobby-dropped-on-node', handler);
  }, [users, update, refreshAll, dispatch, addToast]);

  return (
    <aside className="hobby-sidebar">
      <div className="sidebar-header">
        <span className="sidebar-title">HOBBIES</span>
        <span className="sidebar-subtitle">drag onto user</span>
      </div>

      <div className="search-wrap">
        <Search size={13} color="#555" />
        <input
          className="search-input"
          placeholder="Filter…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            debounced(e.target.value);
          }}
        />
      </div>

      <div className="hobby-list">
        {filtered.map((h) => (
          <HobbyItem key={h} hobby={h} />
        ))}
        {filtered.length === 0 && (
          <div className="no-hobbies">No matches</div>
        )}
      </div>

      <style>{`
        .hobby-sidebar {
          width: 200px;
          min-width: 200px;
          height: 100%;
          background: #06060c;
          border-right: 1px solid #1a1a2e;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .sidebar-header { padding: 20px 16px 12px; border-bottom: 1px solid #1a1a2e; }
        .sidebar-title { display: block; font-family: 'Syne', sans-serif; font-size: 11px; font-weight: 800; letter-spacing: 0.1em; color: #00ff9d; }
        .sidebar-subtitle { font-family: 'Space Mono', monospace; font-size: 9px; color: #333; }
        .search-wrap { display: flex; align-items: center; gap: 8px; padding: 10px 12px; border-bottom: 1px solid #1a1a2e; }
        .search-input { background: none; border: none; outline: none; color: #aaa; font-family: 'Space Mono', monospace; font-size: 11px; width: 100%; }
        .search-input::placeholder { color: #333; }
        .hobby-list { flex: 1; overflow-y: auto; padding: 10px 10px; display: flex; flex-direction: column; gap: 6px; }
        .hobby-list::-webkit-scrollbar { width: 4px; }
        .hobby-list::-webkit-scrollbar-track { background: transparent; }
        .hobby-list::-webkit-scrollbar-thumb { background: #1e1e3a; border-radius: 2px; }
        .no-hobbies { color: #333; font-family: 'Space Mono', monospace; font-size: 11px; text-align: center; padding: 20px 0; }
      `}</style>
    </aside>
  );
}