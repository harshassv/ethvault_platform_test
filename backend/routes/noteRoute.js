const express = require("express");
const router = express.Router();

// In-memory storage for notes
let notes = [];
let nextId = 1;

// New note creation
router.post("/notes", (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }
  const newNote = {
    id: nextId++,
    title,
    content,
    createdAt: new Date()
  };
  notes.push(newNote);
  res.status(201).json({
    success: true,
    note: newNote
  });
});

// Getting all notes
router.get("/notes", (req, res) => {
  res.status(200).json({
    success: true,
    notes
  });
});

// Get a specific note by ID
router.get("/notes/:id", (req, res) => {
  const note = notes.find(n => n.id === parseInt(req.params.id));
  if (!note) {
    return res.status(404).json({ message: "Note not found" });
  }
  res.status(200).json({
    success: true,
    note
  });
});

// Update a note
router.put("/notes/:id", (req, res) => {
  const note = notes.find(n => n.id === parseInt(req.params.id));
  if (!note) {
    return res.status(404).json({ message: "Note not found" });
  }
  
  const { title, content } = req.body;
  if (title) note.title = title;
  if (content) note.content = content;
  
  res.status(200).json({
    success: true,
    note
  });
});

// Delete a note
router.delete("/notes/:id", (req, res) => {
  const noteIndex = notes.findIndex(n => n.id === parseInt(req.params.id));
  if (noteIndex === -1) {
    return res.status(404).json({ message: "Note not found" });
  }
  
  notes.splice(noteIndex, 1);
  res.status(200).json({
    success: true,
    message: "Note deleted successfully"
  });
});

module.exports = router;
