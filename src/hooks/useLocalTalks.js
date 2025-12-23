import { useEffect, useState, useCallback } from 'react';
import { getItem, setItem } from '../services/storage';

const KEY = 'otakus:tasks:v1';

export default function useLocalTasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const t = await getItem(KEY);
      if (mounted) setTasks(t || []);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const persist = useCallback(
    async (newTasks) => {
      setTasks(newTasks);
      await setItem(KEY, newTasks);
    },
    [setTasks]
  );

  const add = useCallback(
    async (task) => {
      const next = [{ id: String(Date.now()), text: task, done: false, createdAt: Date.now() }, ...tasks];
      await persist(next);
    },
    [tasks, persist]
  );

  const toggle = useCallback(
    async (id) => {
      const next = tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
      await persist(next);
    },
    [tasks, persist]
  );

  const remove = useCallback(
    async (id) => {
      const next = tasks.filter((t) => t.id !== id);
      await persist(next);
    },
    [tasks, persist]
  );

  return { tasks, add, toggle, remove, setTasks };
}
