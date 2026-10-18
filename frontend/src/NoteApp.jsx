
import { useState, useEffect } from "react";

function NoteApp() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = "http://localhost:5000/api/notes";

  // Lay danh sach ghi chu tu API
  useEffect(() => {
    const controller = new AbortController();

    async function fetchNotes() {
      try {
        const response = await fetch(API_URL, {
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error("Khong the tai danh sach ghi chu");
        }

        const data = await response.json();
        setNotes(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchNotes();

    return () => controller.abort();
  }, []);

  // Them ghi chu moi
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Vui long nhap tieu de");
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content
        })
      });

      const newNote = await response.json();

      if (!response.ok) {
        throw new Error(
          newNote.message || "Khong the tao ghi chu"
        );
      }

      setNotes(prevNotes => [newNote, ...prevNotes]);
      setTitle("");
      setContent("");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <h1>Quản lý ghi chú</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Tiêu đề:</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="content">Nội dung:</label>
          <textarea
            id="content"
            value={content}
            onChange={e => setContent(e.target.value)}
          />
        </div>

        <button type="submit">Thêm ghi chú</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>Danh sách ghi chú</h2>

      {loading ? (
        <p>đang tải dữ liệu...</p>
      ) : notes.length === 0 ? (
        <p>Chưa có ghi chú nào.</p>
      ) : (
        <ul>
          {notes.map(note => (
            <li key={note._id}>
              <h3>{note.title}</h3>
              <p>{note.content}</p>
              <small>
                {new Date(note.createdAt).toLocaleString("vi-VN")}
              </small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default NoteApp;
