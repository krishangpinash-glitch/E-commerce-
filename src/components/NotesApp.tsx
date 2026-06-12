import React, { useState } from 'react';
import { ChevronLeft, Plus, Save, Trash2, Edit2, Search, FileText } from 'lucide-react';
import { Note } from '../types';

interface NotesProps {
  onClose: () => void;
  notes: Note[];
  onAddNote: (title: string, content: string) => void;
  onEditNote: (id: string, title: string, content: string) => void;
  onDeleteNote: (id: string) => void;
  onAddNotification?: (title: string, body: string, app: string) => void;
}

export const NotesApp: React.FC<NotesProps> = ({
  onClose,
  notes,
  onAddNote,
  onEditNote,
  onDeleteNote,
  onAddNotification
}) => {
  const [editingId, setEditingId] = useState<string | 'new' | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleCreateNew = () => {
    setEditingId('new');
    setTitle('');
    setContent('');
  };

  const handleSelectNote = (note: Note) => {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('A note must have a title!');
      return;
    }

    if (editingId === 'new') {
      onAddNote(title, content);
      if (onAddNotification) {
        onAddNotification('Note Added', `"${title}" has been saved.`, 'Notes');
      }
    } else if (editingId) {
      onEditNote(editingId, title, content);
    }
    setEditingId(null);
  };

  const filteredNotes = notes.filter(n =>
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-amber-50/95 text-slate-900 font-sans p-4" id="app-notes">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 border-b border-amber-200/55 pb-3">
        <button
          onClick={editingId ? () => setEditingId(null) : onClose}
          className="p-1 hover:bg-amber-100 rounded-full transition text-slate-700"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <span className="font-display font-semibold tracking-wide text-sm">
          {editingId ? (editingId === 'new' ? 'New Note' : 'Edit Note') : 'Shopping Notes'}
        </span>
        {editingId ? (
          <button onClick={handleSave} className="p-1.5 bg-amber-700 hover:bg-amber-800 text-amber-50 rounded-lg flex items-center gap-1.5 transition text-xs font-semibold">
            <Save className="w-4 h-4" /> Save
          </button>
        ) : (
          <button onClick={handleCreateNew} className="p-1.5 bg-amber-700 hover:bg-amber-800 text-amber-50 rounded-lg flex items-center transition">
            <Plus className="w-4.5 h-4.5" />
          </button>
        )}
      </div>

      {editingId ? (
        <form onSubmit={handleSave} className="flex-grow flex flex-col gap-3 text-left">
          <input
            type="text"
            placeholder="Title (e.g. Weekly Groceries)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-base font-bold bg-transparent border-b border-amber-200 p-2 focus:border-amber-700 focus:outline-none placeholder-slate-400 font-display"
          />
          <textarea
            placeholder="Write your shopping plans, comparison lists, or coupon summaries here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full flex-grow bg-transparent p-2 focus:outline-none resize-none text-xs leading-relaxed font-sans placeholder-slate-400"
          />
          {editingId !== 'new' && (
            <button
              type="button"
              onClick={() => {
                onDeleteNote(editingId);
                setEditingId(null);
              }}
              className="mt-2 py-2 border border-red-300 hover:bg-red-50 text-red-600 rounded-xl flex items-center justify-center gap-1 text-xs font-semibold transition"
            >
              <Trash2 className="w-4 h-4" /> Delete Note
            </button>
          )}
        </form>
      ) : (
        <div className="flex-grow overflow-y-auto flex flex-col gap-4 phone-scroll">
          {/* Search bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-amber-100/50 rounded-2xl text-xs placeholder-slate-500 text-slate-800 focus:outline-none border border-amber-200/40"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          {filteredNotes.length === 0 ? (
            <div className="flex-grow flex flex-col items-center justify-center py-20 text-slate-400 gap-1.5 text-center px-4">
              <FileText className="w-10 h-10 opacity-30 text-amber-700" />
              <span className="text-xs font-semibold text-slate-600">No notes yet</span>
              <p className="text-[10px] text-slate-500 max-w-[170px]">Click the "+" symbol above to create a shopping notepad file.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 pb-8">
              {filteredNotes.map((note) => (
                <button
                  key={note.id}
                  onClick={() => handleSelectNote(note)}
                  className="p-3.5 rounded-2xl bg-amber-100/40 hover:bg-amber-100/80 border border-amber-200/50 text-left transition flex flex-col justify-between aspect-square hover:scale-[1.02] duration-200 shadow-sm relative group"
                >
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 font-display truncate mb-1 pr-2">{note.title}</h4>
                    <p className="text-[10px] text-slate-655 line-clamp-3 leading-relaxed whitespace-pre-wrap">{note.content}</p>
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-amber-200/20 w-full">
                    <span className="text-[9px] text-slate-555 font-mono">{note.date}</span>
                    <Edit2 className="w-3 h-3 text-amber-700 opacity-0 group-hover:opacity-100 transition" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
