import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Briefcase, X } from 'lucide-react';
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, arrayMove,
} from '@dnd-kit/sortable';
import { portfolioService } from '../../api/services/portfolioService';
import { usePortfolioStore } from '../../store/portfolioStore';
import type { Experience } from '../../types';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Modal, ConfirmDialog } from '../../components/ui/Modal';
import { PageHeader } from '../../components/dashboard/FormSection';
import { SortableItem } from '../../components/dashboard/SortableItem';
import { SkeletonList } from '../../components/ui/Skeleton';
import { formatDate } from '../../utils';

const schema = z.object({
  companyName: z.string().min(1, 'Required'),
  location: z.string().min(1, 'Required'),
  position: z.string().min(1, 'Required'),
  startDate: z.string().min(7, 'Required (YYYY-MM)'),
  endDate: z.string().optional(),
  isCurrent: z.boolean(),
  descriptionPoints: z.array(z.object({ value: z.string() })),
});

type FormValues = z.infer<typeof schema>;

const ExperienceCard: React.FC<{
  exp: Experience;
  onEdit: (e: Experience) => void;
  onDelete: (id: string) => void;
}> = ({ exp, onEdit, onDelete }) => (
  <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
    <div className="flex items-start justify-between gap-3">
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 text-sm">{exp.position}</h3>
        <p className="text-primary-600 text-xs font-medium mt-0.5">{exp.companyName}</p>
        <p className="text-xs text-gray-400 mt-0.5">{exp.location}</p>
        <p className="text-xs text-gray-400 mt-1">
          {formatDate(exp.startDate)} — {exp.isCurrent ? 'Present' : formatDate(exp.endDate || '')}
        </p>
      </div>
      <div className="flex gap-1.5">
        <button onClick={() => onEdit(exp)} className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button onClick={() => onDelete(exp.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
    {exp.descriptionPoints?.length > 0 && (
      <ul className="mt-3 space-y-0.5">
        {exp.descriptionPoints.slice(0, 2).map((p, i) => (
          <li key={i} className="flex gap-1.5 text-xs text-gray-500">
            <span className="w-1 h-1 rounded-full bg-gray-300 mt-1.5 flex-shrink-0" />
            {p}
          </li>
        ))}
        {exp.descriptionPoints.length > 2 && (
          <li className="text-xs text-gray-400">+{exp.descriptionPoints.length - 2} more</li>
        )}
      </ul>
    )}
  </div>
);

export const ExperiencePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const store = usePortfolioStore();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const { register, handleSubmit, reset, watch, control, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { isCurrent: false, descriptionPoints: [{ value: '' }] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'descriptionPoints' });
  const isCurrent = watch('isCurrent');

  useEffect(() => {
    (async () => {
      try {
        const res = await portfolioService.getExperiences();
        store.setExperiences(res.data.data || []);
      } catch { /* */ }
      finally { setLoading(false); }
    })();
  }, []);

  const openAdd = () => {
    setEditingExp(null);
    reset({ isCurrent: false, descriptionPoints: [{ value: '' }] });
    setModalOpen(true);
  };

  const openEdit = (exp: Experience) => {
    setEditingExp(exp);
    reset({
      ...exp,
      startDate: exp.startDate?.slice(0, 7),
      endDate: exp.endDate?.slice(0, 7),
      descriptionPoints: (exp.descriptionPoints || []).map((v) => ({ value: v })),
    });
    setModalOpen(true);
  };

  const onSubmit = async (data: FormValues) => {
    setSaving(true);
    try {
      const payload = {
        ...data,
        startDate: data.startDate ? `${data.startDate}-01` : data.startDate,
        endDate: data.isCurrent ? undefined : (data.endDate ? `${data.endDate}-01` : undefined),
        descriptionPoints: data.descriptionPoints.map((d) => d.value).filter(Boolean),
        orderIndex: editingExp?.orderIndex ?? store.experiences.length,
      };
      if (editingExp) {
        const res = await portfolioService.updateExperience(editingExp.id, payload);
        store.setExperiences(store.experiences.map((e) => e.id === editingExp.id ? res.data.data : e));
        toast.success('Experience updated!');
      } else {
        const res = await portfolioService.createExperience(payload);
        store.setExperiences([...store.experiences, res.data.data]);
        toast.success('Experience added!');
      }
      setModalOpen(false);
    } catch {
      toast.error('Failed to save experience');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await portfolioService.deleteExperience(deleteId);
      store.setExperiences(store.experiences.filter((e) => e.id !== deleteId));
      toast.success('Experience deleted');
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = store.experiences.findIndex((e) => e.id === active.id);
    const newIdx = store.experiences.findIndex((e) => e.id === over.id);
    const reordered = arrayMove(store.experiences, oldIdx, newIdx).map((e, i) => ({ ...e, orderIndex: i }));
    store.setExperiences(reordered);
    await Promise.all(reordered.map((e) => portfolioService.updateExperience(e.id, { orderIndex: e.orderIndex })));
  };

  const sorted = [...store.experiences].sort((a, b) => a.orderIndex - b.orderIndex);

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      <PageHeader
        title="Work Experience"
        subtitle="Add and reorder your professional experience"
        actions={<Button icon={<Plus className="w-4 h-4" />} onClick={openAdd}>Add Experience</Button>}
      />

      {loading ? <SkeletonList count={3} /> : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={sorted.map((e) => e.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {sorted.length === 0 && (
                <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
                  <Briefcase className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">No experience added yet</p>
                  <Button variant="ghost" size="sm" className="mt-3" onClick={openAdd}>Add your first role</Button>
                </div>
              )}
              {sorted.map((exp) => (
                <SortableItem key={exp.id} id={exp.id}>
                  <ExperienceCard exp={exp} onEdit={openEdit} onDelete={setDeleteId} />
                </SortableItem>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingExp ? 'Edit Experience' : 'Add Experience'} size="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Company Name" error={errors.companyName?.message} {...register('companyName')} />
            <Input label="Location" error={errors.location?.message} {...register('location')} />
            <Input label="Position / Role" error={errors.position?.message} {...register('position')} className="sm:col-span-2" />
            <Input label="Start Date (YYYY-MM)" placeholder="2022-01" error={errors.startDate?.message} {...register('startDate')} />
            {!isCurrent && (
              <Input label="End Date (YYYY-MM)" placeholder="2024-06" error={errors.endDate?.message} {...register('endDate')} />
            )}
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" {...register('isCurrent')} />
            Currently working here
          </label>

          {/* Description points */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-2">Description Points</label>
            <div className="space-y-2">
              {fields.map((field, i) => (
                <div key={field.id} className="flex gap-2">
                  <input
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder={`Point ${i + 1}`}
                    {...register(`descriptionPoints.${i}.value`)}
                  />
                  <button type="button" onClick={() => remove(i)} className="p-2 text-gray-400 hover:text-red-500 rounded-lg">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <Button type="button" variant="ghost" size="sm" className="mt-2" icon={<Plus className="w-3.5 h-3.5" />} onClick={() => append({ value: '' })}>
              Add Point
            </Button>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" loading={saving}>{editingExp ? 'Update' : 'Add'} Experience</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Experience"
        message="Are you sure you want to delete this experience? This action cannot be undone."
        loading={deleting}
      />
    </div>
  );
};
