import { useEffect } from 'react';

import { subscribeToMemories } from '../lib/memoriesService';
import { useAuthStore } from '../store/authStore';
import { useMemoriesStore } from '../store/memoriesStore';

export function useMemories() {
  const user = useAuthStore((s) => s.user);
  const memories = useMemoriesStore((s) => s.memories);
  const setMemories = useMemoriesStore((s) => s.setMemories);

  useEffect(() => {
    if (!user) {
      setMemories([]);
      return;
    }
    const unsubscribe = subscribeToMemories(user.uid, setMemories);
    return unsubscribe;
  }, [user, setMemories]);

  return memories;
}
