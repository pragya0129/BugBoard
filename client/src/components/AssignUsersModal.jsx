import { useEffect, useState } from "react";
import Modal from "./Modal";
import axios from "axios";

const AssignUsersModal = ({ open, onClose, projectId, refresh }) => {
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    if (open) {
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/projects/available-users`)
        .then((res) => setAvailableUsers(res.data))
        .catch((err) => console.error(err));
    }
  }, [open]);

  const handleToggleUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleAssign = async () => {
    await axios.put(
      `${import.meta.env.VITE_API_URL}/api/projects/assign-users/${projectId}`,
      { userIds: selectedUsers }
    );
    refresh();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="p-4">
        <h2 className="text-xl font-semibold text-blue-800 mb-5 tracking-tight">
          Assign Users
        </h2>

        <ul className="space-y-3 max-h-64 overflow-y-auto mb-6 pr-1">
          {availableUsers.map((user) => (
            <li
              key={user._id}
              className="flex items-center justify-between bg-blue-50 rounded-lg px-4 py-2 border border-blue-100 shadow-sm"
            >
              <span className="text-sm text-gray-800 font-medium">
                {user.name}{" "}
                <span className="text-xs text-gray-500">({user.role})</span>
              </span>
              <input
                type="checkbox"
                checked={selectedUsers.includes(user._id)}
                onChange={() => handleToggleUser(user._id)}
                className="accent-blue-600 w-4 h-4"
              />
            </li>
          ))}
        </ul>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full border text-gray-700 hover:bg-gray-100 transition font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            className="px-5 py-2 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition shadow-sm"
          >
            Assign
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AssignUsersModal;
