/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Note, useNotes } from "../context/NoteContext";
import styles from "./NotesPage.module.css";
import { AnimatePresence, motion } from "framer-motion";

export default function NotesContent() {
  const { username, notes, setNotes, showModal, setShowModal } = useNotes();
  const [editorContent, setEditorContent] = useState("");
  const [noteTitle, setNoteTitle] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const editorRef = useRef<any>(null);

  const openModalForNewNote = () => {
    setEditingNoteId(null);
    setEditorContent("");
    setNoteTitle("");
    setShowModal(true);
  };

  const openModalForEditNote = (note: Note) => {
    setEditingNoteId(note.id);
    setEditorContent(note.content);
    setNoteTitle(note.title);
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleSave = () => {
    const newTimestamp = new Date().toLocaleString();
    let updatedNotes;

    if (editingNoteId === null) {
      const newNote = {
        id: Date.now(),
        title: noteTitle,
        content: editorContent,
        timestamp: newTimestamp,
      };
      updatedNotes = [...notes, newNote];
    } else {
      updatedNotes = notes.map((note: any) =>
        note.id === editingNoteId
          ? {
              ...note,
              title: noteTitle,
              content: editorContent,
              timestamp: newTimestamp,
            }
          : note
      );
    }

    setNotes(updatedNotes);
    localStorage.setItem(username, JSON.stringify(updatedNotes));
    setShowModal(false);
  };

  const handleDelete = (id: number) => {
    const updatedNotes = notes.filter((note: any) => note.id !== id);
    setNotes(updatedNotes);
    localStorage.setItem(username, JSON.stringify(updatedNotes));
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.welcome}>Welcome, {username} 👋</h1>
        <motion.button
          onClick={openModalForNewNote}
          className={styles.addButton}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {" "}
          + Add Notes
        </motion.button>

        <div className={styles.notesList}>
          {notes.map((note: any) => (
            <motion.div
              key={note.id}
              className={styles.note}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              {" "}
              <div className={styles.noteHeader}>
                <h3 className={styles.noteTitle}>{note.title}</h3>
                <span className={styles.timestamp}>{note.timestamp}</span>
              </div>
              <div
                className={styles.noteContent}
                dangerouslySetInnerHTML={{ __html: note.content }}
              />
              <div>
                <button
                  onClick={() => openModalForEditNote(note)}
                  className={styles.editbutton}
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(note.id)}
                  className={styles.deleteButton}
                >
                  <FaTrash />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
        <AnimatePresence>
          {showModal && (
            <motion.div
              className={styles.modalOverlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {" "}
              <motion.div
                className={styles.modal}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {" "}
                <h2>{editingNoteId === null ? "Add New Note" : "Edit Note"}</h2>
                <input
                  type="text"
                  placeholder="Title"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className={styles.titleInput}
                />
                <Editor
                  onInit={(evt, editor) => (editorRef.current = editor)}
                  apiKey="e1m37arst2qyym0txdcludggqpy3646mrvlnhn64rmgc6brg"
                  value={editorContent}
                  init={{
                    height: 300,
                    menubar: false,
                    plugins: [
                      // Core editing features
                      "anchor",
                      "autolink",
                      "charmap",
                      "codesample",
                      "emoticons",
                      "image",
                      "link",
                      "lists",
                      "media",
                      "searchreplace",
                      "table",
                      "visualblocks",
                      "wordcount",
                      // Your account includes a free trial of TinyMCE premium features
                      // Try the most popular premium features until Jun 26, 2025:
                      "checklist",
                      "mediaembed",
                      "casechange",
                      "formatpainter",
                      "pageembed",
                      "a11ychecker",
                      "tinymcespellchecker",
                      "permanentpen",
                      "powerpaste",
                      "advtable",
                      "advcode",
                      "editimage",
                      "advtemplate",
                      "ai",
                      "mentions",
                      "tinycomments",
                      "tableofcontents",
                      "footnotes",
                      "mergetags",
                      "autocorrect",
                      "typography",
                      "inlinecss",
                      "markdown",
                      "importword",
                      "exportword",
                      "exportpdf",
                    ],
                    toolbar:
                      "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
                    tinycomments_mode: "embedded",
                    tinycomments_author: "Author name",
                    content_style: `body {
                        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                        font-size: 16px;
                        background-color: #D3D3D3;
                        color: #333;    
                     }
                    a {
                      color: #007bff;
                    } `,
                    ai_request: (respondWith: any) =>
                      respondWith.string(() =>
                        Promise.reject("See docs to implement AI Assistant")
                      ),
                  }}
                  onEditorChange={(content) => setEditorContent(content)}
                />
                <div className={styles.modalActions}>
                  <button onClick={handleSave} className={styles.saveButton}>
                    Save
                  </button>
                  <button onClick={closeModal} className={styles.cancelButton}>
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
