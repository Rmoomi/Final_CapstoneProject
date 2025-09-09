import { useEffect, useState } from "react";
import "../css/UserManagement.css";
import editIcon from "../../assets/edit-icon.png";
import deleteIcon from "../../assets/delete-icon.png";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // ✅ new state
  const [userToDelete, setUserToDelete] = useState(null); // ✅ store user being deleted
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    contact: "",
    email: "",
    password: "",
  });

  // ✅ Fetch users from backend
  const fetchUsers = () => {
    fetch("http://localhost:8080/users")
      .then((res) => res.json())
      .then((data) => setUsers(data.users || []));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleEdit = (user) => {
    setEditingUser(user.user_id);
    setFormData({
      firstname: user.firstname,
      lastname: user.lastname,
      contact: user.contact_num,
      email: user.email,
      password: "",
    });
  };

  const handleUpdate = (id) => {
    fetch(`http://localhost:8080/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    }).then(() => {
      setEditingUser(null);
      fetchUsers();
    });
  };

  // ✅ Trigger delete modal
  const confirmDelete = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  // ✅ Perform delete after confirmation
  const handleDelete = () => {
    if (userToDelete) {
      fetch(`http://localhost:8080/users/${userToDelete.user_id}`, {
        method: "DELETE",
      }).then(() => {
        fetchUsers();
        setShowDeleteModal(false);
        setUserToDelete(null);
      });
    }
  };

  // ✅ Add new user
  const handleAddUser = (e) => {
    e.preventDefault();
    fetch("http://localhost:8080/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstname: formData.firstname,
        lastname: formData.lastname,
        contact: formData.contact,
        email: formData.email,
        pass: formData.password,
      }),
    }).then(() => {
      setShowForm(false);
      setFormData({
        firstname: "",
        lastname: "",
        contact: "",
        email: "",
        password: "",
      });
      fetchUsers();
    });
  };

  // ✅ Filter users by search query
  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstname} ${user.lastname}`.toLowerCase();
    return (
      fullName.includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="user-management">
      <div className="header">
        <h2>User Management</h2>
        <button className="add-btn" onClick={() => setShowForm(true)}>
          + Add New User
        </button>
      </div>

      {/* ✅ Summary cards */}
      <div className="stats-cards">
        <div className="card blue">
          <h3>{users.length}</h3>
          <p>Total Users</p>
        </div>
        <div className="card purple">
          <h3>
            {
              users.filter(
                (user) => user.role && user.role.toLowerCase() === "admin"
              ).length
            }
          </h3>
          <p>Administrators</p>
        </div>
      </div>

      {/* ✅ Search */}
      <div className="controls">
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select>
          <option>All Roles</option>
          <option>Administrator</option>
          <option>User</option>
        </select>
        <button className="filter-btn">More Filters</button>
      </div>

      {/* ✅ User list */}
      <div className="user-list">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) =>
            editingUser === user.user_id ? (
              <div className="user-card editing" key={user.user_id}>
                <input
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                />
                <input
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                />
                <input
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                />
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                <div className="actions">
                  <button onClick={() => handleUpdate(user.user_id)}>
                    Save
                  </button>
                  <button onClick={() => setEditingUser(null)}>Cancel</button>
                </div>
              </div>
            ) : (
              <div className="user-card" key={user.user_id}>
                <div className="avatar">
                  {user.firstname[0]}
                  {user.lastname[0]}
                </div>
                <div className="user-info">
                  <h4>
                    {user.firstname} {user.lastname}
                  </h4>
                  <p>{user.email}</p>
                  <p>{user.contact_num}</p>
                </div>
                <div className="badges">
                  <span className="role">{user.role || "User"}</span>
                  <span className="status active">Active</span>
                </div>
                <div className="actions">
                  <button className="edit" onClick={() => handleEdit(user)}>
                    <img src={editIcon} className="edit-icon" alt="Edit" />
                  </button>
                  <button
                    className="delete"
                    onClick={() => confirmDelete(user)} // ✅ show modal
                  >
                    <img
                      src={deleteIcon}
                      className="delete-icon"
                      alt="Delete"
                    />
                  </button>
                </div>
              </div>
            )
          )
        ) : (
          <p className="no-results">No users found.</p>
        )}
      </div>

      {/* ✅ Modal Form for Add User */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add New User</h3>
            <form onSubmit={handleAddUser}>
              <input
                type="text"
                name="firstname"
                placeholder="First Name"
                value={formData.firstname}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="lastname"
                placeholder="Last Name"
                value={formData.lastname}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="contact"
                placeholder="Contact"
                value={formData.contact}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <div className="modal-actions">
                <button type="submit" className="save-btn">
                  Save
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ✅ Delete confirmation modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal confirm-modal">
            <h3>Confirm Delete</h3>
            <p>
              Are you sure you want to delete{" "}
              <b>
                {userToDelete?.firstname} {userToDelete?.lastname}
              </b>
              ?
            </p>
            <div className="modal-actions">
              <button onClick={handleDelete} className="delete-btn">
                Yes
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;
