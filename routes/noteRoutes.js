const express = require('express');
const Note = require('../models/Note');
const jwt = require('jsonwebtoken');

const router = express.Router();

// إضافة ملاحظة جديدة
router.post('/addNote', async (req, res) => {
  try {
    const { title, desc, userID, token } = req.body;

    // التحقق من صحة التوكن
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) return res.status(401).json({ message: 'Unauthorized' });

    const newNote = new Note({ title, desc, userID });
    await newNote.save();

    res.status(201).json({ message: 'Note added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// جلب جميع ملاحظات المستخدم
router.get('/getUserNotes/:userID', async (req, res) => {
  try {
    const { userID } = req.params;
    const notes = await Note.find({ userID });

    res.json({ message: 'success', notes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// حذف ملاحظة
router.delete('/deleteNote/:noteID', async (req, res) => {
  try {
    const { noteID } = req.params;

    await Note.findByIdAndDelete(noteID);

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// تعديل ملاحظة
router.put('/updateNote/:noteID', async (req, res) => {
  try {
    const { noteID } = req.params;
    const { title, desc } = req.body;

    const updatedNote = await Note.findByIdAndUpdate(
      noteID,
      { title, desc },
      { new: true }
    );

    res.json({ message: 'Note updated successfully', updatedNote });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
