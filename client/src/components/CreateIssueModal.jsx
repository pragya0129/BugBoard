import { useState } from "react";
import axios from "axios";

const CreateIssueModal = ({ project, onClose }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/issues/create`,
        {
          ...form,
          projectId: project._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Issue created!");
      onClose();
    } catch (err) {
      console.error("Error creating issue:", err);
      alert("Failed to create issue");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-2xl w-[400px] shadow-lg">
        <h3 className="text-xl font-semibold text-blue-800 mb-5 tracking-tight">
          Raise Issue in: <span className="text-gray-800">{project.name}</span>
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Issue Title"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-4 py-2 border border-blue-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <textarea
            placeholder="Issue Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-4 py-2 border border-blue-200 rounded-2xl shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          />

          <select
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value })}
            className="w-full px-4 py-2 border border-blue-200 rounded-2xl shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

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
    </div>
  );
};

export default CreateIssueModal;
