# 🎯 JavaScript Quick Reference

## API Client Usage

### Import the API Client

```javascript
import { apiClient } from "@/lib/api";
```

### GET Request

```javascript
const fetchUsers = async () => {
  try {
    const response = await apiClient.get("/users");
    console.log(response.data);
  } catch (error) {
    console.error("Error:", error);
  }
};
```

### POST Request

```javascript
const createUser = async () => {
  try {
    const response = await apiClient.post("/users", {
      name: "John Doe",
      email: "john@example.com",
    });
    console.log("User created:", response.data);
  } catch (error) {
    console.error("Error:", error);
  }
};
```

### PUT Request

```javascript
const updateUser = async userId => {
  try {
    const response = await apiClient.put(`/users/${userId}`, {
      name: "Jane Doe",
      email: "jane@example.com",
    });
    console.log("User updated:", response.data);
  } catch (error) {
    console.error("Error:", error);
  }
};
```

### DELETE Request

```javascript
const deleteUser = async userId => {
  try {
    const response = await apiClient.delete(`/users/${userId}`);
    console.log("User deleted:", response.data);
  } catch (error) {
    console.error("Error:", error);
  }
};
```

## React Component Example

### Simple Component with API Call

```javascript
"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await apiClient.get("/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Component with Form

```javascript
"use client";

import { useState } from "react";
import { apiClient } from "@/lib/api";

export default function CreateUserForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiClient.post("/users", formData);
      console.log("User created:", response.data);
      // Reset form
      setFormData({ name: "", email: "" });
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="border p-2"
          required
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="border p-2"
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {loading ? "Creating..." : "Create User"}
      </button>
    </form>
  );
}
```

## Common Patterns

### Loading State

```javascript
const [loading, setLoading] = useState(false);

const fetchData = async () => {
  setLoading(true);
  try {
    const response = await apiClient.get("/data");
    // Handle response
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};
```

### Error Handling

```javascript
const [error, setError] = useState(null);

const fetchData = async () => {
  setError(null);
  try {
    const response = await apiClient.get("/data");
    // Handle response
  } catch (err) {
    setError(err.message);
  }
};

// In JSX
{
  error && <div className="error">{error}</div>;
}
```

### With Authentication Token

```javascript
const response = await apiClient.get("/protected-route", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

## Environment Variables

Access environment variables in your components:

```javascript
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
```

**Note:** Only variables prefixed with `NEXT_PUBLIC_` are available in the
browser.

## File Structure

```
frontend/src/
├── app/
│   ├── page.js           # Home page
│   ├── about/
│   │   └── page.js       # About page
│   └── layout.js         # Root layout
├── components/
│   └── ExampleComponent.js
└── lib/
    └── api.js            # API client
```

## Creating New Pages

Create a new file in `src/app/`:

```javascript
// src/app/about/page.js
export default function AboutPage() {
  return (
    <div>
      <h1>About Page</h1>
      <p>This is the about page</p>
    </div>
  );
}
```

Access at: `http://localhost:3000/about`

## Styling with Tailwind

```javascript
export default function Button({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      {children}
    </button>
  );
}
```

## Tips

1. Always use `'use client'` for components with hooks or event handlers
2. Server components (default) are better for SEO and performance
3. Use `async/await` with try-catch for API calls
4. Keep API base URL in environment variables
5. Handle loading and error states in UI

---

Happy coding! 🚀
