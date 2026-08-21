import React, { useState, useEffect, useCallback } from 'react';
import { categoryService } from '../services/categoryService';
import { useToast } from '../context/ToastContext';

import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import ConfirmationModal from '../components/common/ConfirmationModal';
import CategoryModal from '../components/categories/CategoryModal';
import CategoryIcon from '../components/common/CategoryIcon';
import { SkeletonCard } from '../components/common/SkeletonLoader';

import {
  HiOutlinePlus,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineTag,
} from 'react-icons/hi2';

export const CategoriesPage = () => {
  const { showToast } = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const res = await categoryService.getCategories();
      if (res.success) {
        setCategories(res.data);
      }
    } catch (err) {
      showToast('Failed to load categories', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSaveCategory = async (data) => {
    setActionLoading(true);
    try {
      if (editingCategory) {
        const res = await categoryService.updateCategory(editingCategory._id, data);
        if (res.success) {
          showToast('Category updated successfully!', 'success');
          setIsModalOpen(false);
          setEditingCategory(null);
          fetchCategories();
        }
      } else {
        const res = await categoryService.createCategory(data);
        if (res.success) {
          showToast('Custom category created successfully!', 'success');
          setIsModalOpen(false);
          fetchCategories();
        }
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save category', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      const res = await categoryService.deleteCategory(deleteTarget._id);
      if (res.success) {
        showToast('Category deleted successfully', 'success');
        setDeleteTarget(null);
        fetchCategories();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete category', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading tracking-tight">
            Expense Categories
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Organize transactions with tailored category names, icons, and color tags
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => {
            setEditingCategory(null);
            setIsModalOpen(true);
          }}
          icon={<HiOutlinePlus className="w-4 h-4" />}
        >
          Create Custom Category
        </Button>
      </div>

      {/* Categories Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : categories.length === 0 ? (
        <EmptyState
          title="No Categories Available"
          subtitle="Add your custom categories to start tagging expenses!"
          actionLabel="+ Add Category"
          onAction={() => {
            setEditingCategory(null);
            setIsModalOpen(true);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="glass-card rounded-2xl p-5 hover:border-brand-500/30 transition-all duration-300 flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3 min-w-0">
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center text-base shadow-sm transition-transform group-hover:scale-105"
                  style={{
                    backgroundColor: `${cat.color || '#6366f1'}18`,
                    color: cat.color || '#6366f1',
                  }}
                >
                  <CategoryIcon icon={cat.icon || 'tag'} className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-slate-900 dark:text-white font-heading truncate">
                    {cat.name}
                  </h4>
                  <div className="flex items-center space-x-1.5 mt-0.5">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: cat.color || '#6366f1' }}
                    />
                    <span className="text-[11px] text-slate-400">
                      {cat.isDefault ? 'Default' : 'Custom'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-1 shrink-0">
                <button
                  onClick={() => {
                    setEditingCategory(cat);
                    setIsModalOpen(true);
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-brand-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Edit category"
                >
                  <HiOutlinePencilSquare className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteTarget(cat)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                  title="Delete category"
                >
                  <HiOutlineTrash className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Category Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCategory(null);
        }}
        onSubmit={handleSaveCategory}
        initialData={editingCategory}
        isLoading={actionLoading}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Category?"
        message={`Are you sure you want to delete '${deleteTarget?.name}'? Note: Categories linked to existing transactions or budgets cannot be deleted.`}
        isLoading={actionLoading}
      />
    </div>
  );
};

export default CategoriesPage;
