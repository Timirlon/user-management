const API_URL = '/api/users';

document.addEventListener('DOMContentLoaded', () => {
  const userForm = document.getElementById('user-form');
  const userTable = document.getElementById('user-table');
  const searchInput = document.getElementById('search');
  const sortButton = document.getElementById('sort-button');

  let users = [];
  let filteredUsers = []; // Declare globally
  let ascending = true; // Sorting order

  // Fetch and display users
  const fetchUsers = async () => {
    const res = await fetch(API_URL);
    users = await res.json(); // Store the fetched users
    filteredUsers = [...users]; // Initialize filteredUsers
    displayUsers(users);
  };

  const displayUsers = (usersToDisplay) => {
    userTable.innerHTML = '';
    usersToDisplay.forEach((user) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.age}</td>
        <td class="actions">
          <button onclick="editUser('${user._id}')">Edit</button>
          <button onclick="deleteUser('${user._id}')">Delete</button>
        </td>
      `;
      userTable.appendChild(row);
    });
  };

  // Add or update user
  let editingUserId = null; // Track the user being edited
  userForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const age = document.getElementById('age').value;
    const userData = { name, email, age };

    if (editingUserId) {
      // Update existing user
      await fetch(`${API_URL}/${editingUserId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      editingUserId = null;
      document.querySelector('button[type="submit"]').textContent = 'Add User';
    } else {
      // Add new user
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
    }

    userForm.reset();
    fetchUsers();
  });

  // Edit user
  window.editUser = async (id) => {
    const res = await fetch(`${API_URL}/${id}`);
    const user = await res.json();

    document.getElementById('name').value = user.name;
    document.getElementById('email').value = user.email;
    document.getElementById('age').value = user.age;

    editingUserId = id; // Store the ID for updating later
    document.querySelector('button[type="submit"]').textContent = 'Update User';
  };

  // Delete user
  window.deleteUser = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchUsers();
  };

  // Search users
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    filteredUsers = users.filter((user) =>
      user.name.toLowerCase().includes(query)
    );
    displayUsers(filteredUsers);
  });

  // Sort users
  sortButton.addEventListener('click', () => {
    filteredUsers.sort((a, b) =>
      ascending ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );
    ascending = !ascending; // Toggle order
    sortButton.textContent = ascending
      ? 'Sort by Name (A-Z)'
      : 'Sort by Name (Z-A)';
    displayUsers(filteredUsers);
  });

  // Initial fetch
  fetchUsers();
});
