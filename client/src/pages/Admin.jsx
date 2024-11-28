import React, { useEffect, useState } from "react";
import { deleteUser, get, post ,put } from "../services/ApiEndpoint";
import { toast } from "react-hot-toast";

export default function Admin() {
  const [users, setUsers] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Though using [] would be better for an array of users
  // Separate GetUsers function so we can reuse it
  const GetUsers = async () => {
    try {
      const request = await get("/api/admin/getuser");
      const response = request.data;
      if (request.status === 200) {
        setUsers(response.users);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // const fetchCurrentUser = async () => {
  //   try {
  //     const request = await get("/api/user/me");
  //     setCurrentUser(request.data.user);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // Modified useEffect to watch for refresh
  useEffect(() => {
    GetUsers();
  }, []); // Will re-run when refresh changes

  // Modified handleDelete
  const handleDelete = async (id) => {
    try {
      const request = await deleteUser(`/api/admin/delete/${id}`);
      const response = request.data;
      if (request.status === 200) {
        toast.success(response.message);
        // Call GetUsers to refresh the table
        GetUsers();
        // OR trigger refresh using:
        // setRefresh(prev => !prev);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      }
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const request = await post("/api/admin/adduser", formData);
      const response = request.data;
      if (request.status === 200) {
        toast.success(response.message);
        GetUsers();
        setShowModal(false); // Close modal after success
        // Clear form
        setFormData({
          name: "",
          email: "",
          password: "",
        });
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      }
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const request = await put(`/api/admin/update-role/${userId}`, { role: newRole });
      const response = request.data;
      if (response.success){
        toast.success(response.message);
        GetUsers(); // Refresh user list
      }
    } catch (error){
      if (error.response){
        toast.error(error.response.data.message);
      }
    }
  };

  useEffect(() => {
    GetUsers();
    // fetchCurrentUser();
  }, []);



  return (
    <>
      <div className="admin-container">
        <h2>Mange Users</h2>
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
            {users &&
              users.map((elem, index) => {
                return (
                  <tr key={index}>
                    <td>{elem.name}</td>
                    <td>{elem.email}</td>
                    <td>{elem.role}</td>
                    <td>

                          <select
                            value={elem.role}
                            onChange={(e) =>
                              handleRoleChange(elem._id, e.target.value)
                            }
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                          
                    </td>
                    <td>
                      <button onClick={() => handleDelete(elem._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </>
  );
}
