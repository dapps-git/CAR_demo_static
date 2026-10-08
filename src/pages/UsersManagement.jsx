import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Modal } from '../components/Modal';
import { ConfirmModal } from '../components/ConfirmModal';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  ShieldCheck,
  Mail,
  Lock,
  User,
} from 'lucide-react';

export const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openAddModal = () => {
    setEditingUser(null);
    setName('');
    setEmail('');
    setPassword('');
    setFormError('');
    setIsAddOpen(true);
  };

  const openEditModal = (u) => {
    setEditingUser(u);
    setName(u.name);
    setEmail(u.email);
    setPassword('');
    setFormError('');
    setIsAddOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim() || !email.trim()) {
      setFormError('Name and email are required');
      return;
    }

    if (!editingUser && !password.trim()) {
      setFormError('Password is required for new users');
      return;
    }

    setSaving(true);

    try {
      if (editingUser) {
        await api.put(`/users/${editingUser._id}`, {
          name,
          email,
          ...(password ? { password } : {}),
        });
      } else {
        await api.post('/users', {
          name,
          email,
          password,
        });
      }

      setIsAddOpen(false);
      fetchUsers();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save user account');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!userToDelete) return;
    try {
      setDeleting(true);
      await api.delete(`/users/${userToDelete._id}`);
      setUserToDelete(null);
      fetchUsers();
    } catch (err) {
      console.error('Error deleting user', err);
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-[#172033] tracking-tight leading-tight">
            User Accounts & Staff
          </h1>
          <p className="text-[14px] text-[#667085] font-normal mt-0.5">
            Manage administrative and technician access to the service center.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="btn-primary self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add New User</span>
        </button>
      </div>

      {/* Users List */}
      <div className="card-premium p-0 overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#F5F7FA] text-[#667085] text-[12px] uppercase font-bold border-b border-[#E2E8F0]">
              <tr>
                <th className="px-5 py-3.5">User</th>
                <th className="px-5 py-3.5">Email</th>
                <th className="px-5 py-3.5">Role</th>
                <th className="px-5 py-3.5">Created Date</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] text-[#172033]">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-5 py-8 text-center text-[#667085] text-[13px] font-medium">
                    Loading users list...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-5 py-8 text-center text-[#667085] text-[13px] font-medium">
                    No users registered.
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const isCurrent = currentUser?._id === u._id || currentUser?.email === u.email;
                  return (
                    <tr key={u._id} className="hover:bg-[#EAF4FC]/50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#EAF4FC] border border-[#1677C8]/20 text-[#1677C8] flex items-center justify-center font-bold text-xs">
                            {u.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-[14px] font-bold text-[#172033] flex items-center gap-2">
                              <span>{u.name}</span>
                              {isCurrent && (
                                <span className="text-[10px] bg-[#EAF4FC] text-[#1677C8] px-1.5 py-0.2 rounded border border-[#1677C8]/30 font-bold">
                                  You
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 font-mono text-[13px] text-[#667085]">
                        {u.email}
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1 text-[12px] font-semibold px-2.5 py-0.5 rounded-md bg-[#F5F7FA] border border-[#E2E8F0] text-[#172033]">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#1677C8]" />
                          <span>{u.role || 'Admin'}</span>
                        </span>
                      </td>

                      <td className="px-5 py-4 font-mono text-[12px] text-[#667085]">
                        {formatDate(u.createdAt)}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(u)}
                            className="p-1.5 rounded-md text-[#667085] hover:text-[#1677C8] hover:bg-[#EAF4FC] transition-colors"
                            title="Edit User"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setUserToDelete(u)}
                            disabled={users.length <= 1 || isCurrent}
                            className="p-1.5 rounded-md text-[#667085] hover:text-[#DC3545] hover:bg-[#FEF2F2] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            title={isCurrent ? "Cannot delete your own account" : "Delete User"}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title={editingUser ? 'Edit User Account' : 'Create New User Account'}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 bg-[#FEF2F2] border border-[#FECACA] rounded-xl text-[#DC3545] text-xs font-semibold">
              {formError}
            </div>
          )}

          <div>
            <label className="block text-[13px] font-medium text-[#667085] mb-1">
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#667085]" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Marcus Sterling"
                className="input-field pl-10"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-[#667085] mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#667085]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. staff@carservice.com"
                className="input-field pl-10"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-[#667085] mb-1">
              Password {editingUser && '(leave blank to keep current password)'}
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#667085]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={editingUser ? '••••••••' : 'Enter password'}
                className="input-field pl-10"
                required={!editingUser}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="btn-secondary text-[13px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary"
            >
              {saving ? 'Saving...' : editingUser ? 'Update User' : 'Create User'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete User"
        message={`Are you sure you want to remove user ${userToDelete?.name} (${userToDelete?.email})?`}
      />
    </div>
  );
};
