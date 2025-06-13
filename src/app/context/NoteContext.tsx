"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

export interface Note {
  id: number;
  title: string;
  content: string;
  timestamp: string;
}

interface NotesContextType {
  username: string;
  notes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error("useNotes must be used within a NotesProvider");
  }
  return context;
};

export const NotesProvider = ({ children }: { children: ReactNode }) => {
  const [username, setUsername] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("loggedIn") === "true";
    const user = localStorage.getItem("currentUser");

    if (!isLoggedIn || !user) {
      router.push("/login");
    } else {
      setUsername(user);
      const savedNotes = JSON.parse(localStorage.getItem(user) || "[]");
      setNotes(savedNotes);
    }
  }, [router]);

  return (
    <NotesContext.Provider
      value={{ username, notes, setNotes, showModal, setShowModal }}
    >
      {children}
    </NotesContext.Provider>
  );
};
