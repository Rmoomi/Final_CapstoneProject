import { useEffect, useState } from "react";
import "../css/UserManagement.css";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    contact: "",
    email: "",
    password: "", // frontend uses "password"
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
      password: "", // reset password unless updated
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

  const handleDelete = (id) => {
    fetch(`http://localhost:8080/users/${id}`, { method: "DELETE" }).then(() =>
      fetchUsers()
    );
  };

  // ✅ Add new user (send "pass" instead of "password")
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
        pass: formData.password, // 🔑 backend expects "pass"
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

      {/* Search and Filters */}
      <div className="controls">
        <input type="text" placeholder="Search users..." />
        <select>
          <option>All Roles</option>
          <option>Administrator</option>
          <option>User</option>
        </select>
        <button className="filter-btn">More Filters</button>
      </div>

      {/* User list */}
      <div className="user-list">
        {users.map((user) =>
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
                <button onClick={() => handleUpdate(user.user_id)}>Save</button>
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
                  ✏️
                </button>
                <button
                  className="delete"
                  onClick={() => handleDelete(user.user_id)}
                >
                  🗑️
                </button>
              </div>
            </div>
          )
        )}
      </div>

      {/* ✅ Modal Form for Add New User */}
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
              {/* ✅ Password field */}
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
    </div>
  );
}

export default UserManagement;
