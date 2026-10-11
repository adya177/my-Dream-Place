import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";

const CreateCategory = () => {
  const [categoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState([]);
  const [editId, setEditId] = useState(null);

  // Fetch categories from the backend
  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/category/get-category`
      );
      setCategories(response.data.category);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Handle form submission for adding/updating category
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (categoryName.trim() === "") return;

    try {
      if (editId) {
        // Update category
        await axios.put(
          `${
            import.meta.env.VITE_BASE_URL
          }/api/category/update-category/${editId}`,
          { name: categoryName }
        );
      } else {
        // Create new category
        await axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/category/create-category`,
          { name: categoryName }
        );
      }
      setCategoryName("");
      setEditId(null);
      fetchCategories(); // Refresh categories after adding/updating
    } catch (error) {
      console.error("Error adding/updating category:", error);
    }
  };

  // Handle deleting a category
  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/category/delete-category/${id}`
      );
      fetchCategories(); // Refresh categories after deletion
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  // Load categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle edit button click
  const handleEdit = (id, name) => {
    setEditId(id);
    setCategoryName(name);
  };

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 lg:flex-row lg:px-8">
      <Navbar />
      <section className="min-w-0 flex-1 p-2 sm:p-5">
        <p className="text-sm font-semibold uppercase tracking-[.18em] text-blue-600">Workspace</p><h1 className="mb-7 mt-2 text-3xl font-bold tracking-tight text-slate-900">Manage categories</h1>
        <form
          onSubmit={handleSubmit}
          className="mb-7 flex w-full max-w-xl flex-col gap-3 sm:flex-row"
        >
          <input
            type="text"
            placeholder="Category Name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-blue-500"
          />
          <button
            type="submit"
            className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            {editId ? "Update" : "Submit"}
          </button>
        </form>
        <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-lg font-bold text-slate-900">Categories</h2>
          <ul className="divide-y divide-slate-100">
            {categories.map((category) => (
              <li
                key={category._id}
                className="flex items-center justify-between gap-4 py-3"
              >
                <span className="flex-grow">{category.name}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(category._id, category.name)}
                    className="rounded-lg bg-amber-100 px-3 py-2 text-sm font-semibold text-amber-800 hover:bg-amber-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(category._id)}
                    className="rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
};

export default CreateCategory;

