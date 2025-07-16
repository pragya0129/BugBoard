import Modal from "./Modal";
import { useState } from "react";
import axios from "axios";

const ProjectModal = ({ open, onClose, refresh }) => {
  const [form, setForm] = useState({ name: "", description: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(
      `${import.meta.env.VITE_API_URL}/api/projects/create`,
      form
    );
    refresh();
    setForm({ name: "", description: "" });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="p-4">
        <h2 className="text-xl font-semibold text-blue-800 mb-5 tracking-tight">
          Create New Project
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full px-4 py-2 border border-blue-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Project Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <textarea
            className="w-full px-4 py-2 border border-blue-200 rounded-2xl shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Project Description"
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full border text-gray-700 hover:bg-gray-100 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition shadow-sm"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ProjectModal;
