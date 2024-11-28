import React, { useEffect, useState } from "react";
import { deleteUser, get, post, put } from "../services/ApiEndpoint";
import { toast } from "react-hot-toast";

export default function Admin() {
  const [users, setUsers] = useState([]); // Store the list of users
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Fetch all users from the server
  const fetchUsers = async () => {
    try {
      const response = await get("/api/admin/getuser");
      if (response.status === 200) {
        setUsers(response.data.users);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch users when the component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  // Delete a user and refresh the user list
  const handleDelete = async (id) => {
    try {
      const response = await deleteUser(`/api/admin/delete/${id}`);
      if (response.status === 200) {
        toast.success(response.data.message);
        fetchUsers(); // Refresh the list after deletion
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting user");
    }
  };

  // Handle input changes in the add user form
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add a new user and refresh the list
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await post("/api/admin/adduser", formData);
      if (response.status === 200) {
        toast.success(response.data.message);
        fetchUsers(); // Refresh the list after adding
        setShowModal(false); // Close the modal
        setFormData({ name: "", email: "", password: "" }); // Reset form
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding user");
    }
  };

  // Update a user's role and refresh the list
  const handleRoleChange = async (userId, newRole) => {
    try {
      const response = await put(`/api/admin/update-role/${userId}`, {
        role: newRole,
      });
      if (response.status === 200) {
        toast.success(response.data.message);
        fetchUsers(); // Refresh the list after updating
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating role");
    }
  };

  return (
    <div className="admin-container">
      <h2>Manage Users</h2>
      <button className="add-user" onClick={() => setShowModal(true)}>
        Add User
      </button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add New User</h3>
              <button
                className="close-button"
                onClick={() => setShowModal(false)}
              >
                X
              </button>
            </div>
            <form onSubmit={handleAddUser}>
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password:</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-buttons">
                <button type="submit">Add User</button>
                <button type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Current Role</th>
            <th>Change Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user._id, e.target.value)}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td>
                <button onClick={() => handleDelete(user._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
