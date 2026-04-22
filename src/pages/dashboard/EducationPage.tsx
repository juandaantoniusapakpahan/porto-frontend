import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, GraduationCap } from 'lucide-react';
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, arrayMove,
} from '@dnd-kit/sortable';
import { portfolioService } from '../../api/services/portfolioService';
import { usePortfolioStore } from '../../store/portfolioStore';
import type { Education } from '../../types';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Modal, ConfirmDialog } from '../../components/ui/Modal';
import { PageHeader } from '../../components/dashboard/FormSection';
import { SortableItem } from '../../components/dashboard/SortableItem';
import { SkeletonList } from '../../components/ui/Skeleton';

const schema = z.object({
  institution: z.string().min(1, 'Required'),
  degree: z.string().min(1, 'Required'),
  major: z.string().min(1, 'Required'),
  startYear: z.string().min(1, 'Required'),
  endYear: z.string().min(1, 'Required'),
  gpa: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const EducationCard: React.FC<{ edu: Education; onEdit: (e: Education) => void; onDelete: (id: string) => void }> = ({ edu, onEdit, onDelete }) => (
  <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
    <div className="flex items-start justify-between gap-3">
      <div>
        <h3 className="font-semibold text-gray-900 text-sm">{edu.institution}</h3>
        <p className="text-primary-600 text-xs font-medium mt-0.5">{edu.degree} — {edu.major}</p>
        <p className="text-xs text-gray-400 mt-0.5">{edu.startYear} – {edu.endYear}{edu.gpa ? ` • GPA ${edu.gpa}` : ''}</p>
      </div>
      <div className="flex gap-1.5">
        <button onClick={() => onEdit(edu)} className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button onClick={() => onDelete(edu.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  </div>
);

export const EducationPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEdu, setEditingEdu] = useState<Education | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const store = usePortfolioStore();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await portfolioService.getEducations();
        store.setEducations(res.data.data || []);
      } catch { /* */ }
      finally { setLoading(false); }
    })();
  }, []);

  const openAdd = () => {
    setEditingEdu(null);
    reset({});
    setModalOpen(true);
  };

  const openEdit = (edu: Education) => {
    setEditingEdu(edu);
    reset({
      ...edu,
      startYear: String(edu.startYear),
      endYear: String(edu.endYear),
      gpa: edu.gpa != null ? String(edu.gpa) : '',
    });
    setModalOpen(true);
  };

  const onSubmit = async (data: FormValues) => {
    setSaving(true);
    try {
      const payload = {
        ...data,
        startYear: parseInt(data.startYear, 10),
        endYear: parseInt(data.endYear, 10),
        gpa: data.gpa ? parseFloat(data.gpa) : undefined,
        orderIndex: editingEdu?.orderIndex ?? store.educations.length,
      };
      if (editingEdu) {
        const res = await portfolioService.updateEducation(editingEdu.id, payload);
        store.setEducations(store.educations.map((e) => e.id === editingEdu.id ? res.data.data : e));
        toast.success('Education updated!');
      } else {
        const res = await portfolioService.createEducation(payload);
        store.setEducations([...store.educations, res.data.data]);
        toast.success('Education added!');
      }
      setModalOpen(false);
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await portfolioService.deleteEducation(deleteId);
      store.setEducations(store.educations.filter((e) => e.id !== deleteId));
      toast.success('Deleted');
    } catch { toast.error('Failed'); }
    finally { setDeleting(false); setDeleteId(null); }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = store.educations.findIndex((e) => e.id === active.id);
    const newIdx = store.educations.findIndex((e) => e.id === over.id);
    const reordered = arrayMove(store.educations, oldIdx, newIdx).map((e, i) => ({ ...e, orderIndex: i }));
    store.setEducations(reordered);
    await Promise.all(reordered.map((e) => portfolioService.updateEducation(e.id, { orderIndex: e.orderIndex })));
  };

  const sorted = [...store.educations].sort((a, b) => a.orderIndex - b.orderIndex);

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      <PageHeader
        title="Education"
        subtitle="Your academic background"
        actions={<Button icon={<Plus className="w-4 h-4" />} onClick={openAdd}>Add Education</Button>}
      />

      {loading ? <SkeletonList count={2} /> : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={sorted.map((e) => e.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {sorted.length === 0 && (
                <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
                  <GraduationCap className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">No education added yet</p>
                </div>
              )}
              {sorted.map((edu) => (
                <SortableItem key={edu.id} id={edu.id}>
                  <EducationCard edu={edu} onEdit={openEdit} onDelete={setDeleteId} />
                </SortableItem>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingEdu ? 'Edit Education' : 'Add Education'}>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <Input label="Institution" error={errors.institution?.message} {...register('institution')} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Degree (e.g. S1, Bachelor)" error={errors.degree?.message} {...register('degree')} />
            <Input label="Major / Field of Study" error={errors.major?.message} {...register('major')} />
            <Input label="Start Year" type="number" error={errors.startYear?.message} {...register('startYear')} />
            <Input label="End Year" type="number" error={errors.endYear?.message} {...register('endYear')} />
            <Input label="GPA (optional)" type="number" step="0.01" error={errors.gpa?.message} {...register('gpa')} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" loading={saving}>{editingEdu ? 'Update' : 'Add'} Education</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete}
        title="Delete Education" message="Delete this education entry?" loading={deleting}
      />
    </div>
  );
};
