const express = require("express");
const router = express.Router();
const Note = require("../models/Note");

// GET: Lấy danh sách ghi chú
router.get("/", async (req, res) => {
  try {
    const notes = await Note.find().sort({
      createdAt: -1
    });

    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// POST: Thêm ghi chú
router.post("/", async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Tiêu đề không được để trống"
      });
    }

    const note = await Note.create({
      title: title.trim(),
      content: content || ""
    });

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

module.exports = router;