"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:4001/notes';

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState(null);

  const [selectedNote, setSelectedNote] = useState<any>(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axios.get(API_URL);
      setNotes(response.data.notes);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, { title, content });
        setEditingId(null);
      } else {
        await axios.post(API_URL, { title, content });
      }
      setTitle('');
      setContent('');
      fetchNotes();
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const handleEdit = (note: any) => {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleViewDetails = async (id: number) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      setSelectedNote(response.data.note);
    } catch (error) {
      console.error('Error fetching note details:', error);
    }
  };

  const [searchTerm, setSearchTerm] = useState('');

  const filteredNotes = notes.filter((note: any) => 
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.id.toString().includes(searchTerm)
  );

  return (
    <div className="container mx-auto p-4 relative">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notes App</h1>
        <button 
          onClick={fetchNotes}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
        >
          <span className="mr-2">↻</span> Refresh List
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="mb-8 p-4 border rounded shadow-md bg-white">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
            placeholder="Enter note title"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
            placeholder="Enter note content"
            rows={3}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {editingId ? 'Update Note' : 'Add Note'}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setTitle('');
              setContent('');
            }}
            className="ml-2 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
        )}
      </form>

      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search notes by ID, title, or content..."
            className="w-full p-3 pl-10 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNotes.length === 0 ? (
          <div className="col-span-full text-center py-10 text-gray-500">
            No notes found matching your search.
          </div>
        ) : filteredNotes.map((note: any) => (
          <div key={note.id} className="bg-white p-4 rounded shadow border">
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-xl font-bold">{note.title}</h2>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">ID: {note.id}</span>
            </div>
            <p className="text-gray-700 mb-4">{note.content}</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => handleViewDetails(note.id)}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded"
              >
                View
              </button>
              <button
                onClick={() => handleEdit(note)}
                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(note.id)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedNote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Note Details</h2>
              <button 
                onClick={() => setSelectedNote(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="font-bold text-gray-700">ID:</label>
                <p className="text-gray-900">{selectedNote.id}</p>
              </div>
              <div>
                <label className="font-bold text-gray-700">Title:</label>
                <p className="text-gray-900">{selectedNote.title}</p>
              </div>
              <div>
                <label className="font-bold text-gray-700">Content:</label>
                <p className="text-gray-900 whitespace-pre-wrap">{selectedNote.content}</p>
              </div>
              <div>
                <label className="font-bold text-gray-700">Created At:</label>
                <p className="text-gray-900 text-sm">
                  {new Date(selectedNote.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedNote(null)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
