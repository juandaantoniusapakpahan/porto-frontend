import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Zap } from 'lucide-react';
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, arrayMove,
} from '@dnd-kit/sortable';
import { portfolioService } from '../../api/services/portfolioService';
import { usePortfolioStore } from '../../store/portfolioStore';
import type { Skill } from '../../types';
import { Input, Select } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Modal, ConfirmDialog } from '../../components/ui/Modal';
import { PageHeader } from '../../components/dashboard/FormSection';
import { SortableItem } from '../../components/dashboard/SortableItem';
import { Badge } from '../../components/ui/Badge';
import { SkeletonList } from '../../components/ui/Skeleton';

const schema = z.object({
  name: z.string().min(1, 'Required'),
  category: z.enum(['HARD', 'SOFT']),
  proficiencyLevel: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']),
});

type FormValues = z.infer<typeof schema>;

const LEVEL_VARIANT: Record<string, 'blue' | 'yellow' | 'accent' | 'green'> = {
  BEGINNER: 'blue',
  INTERMEDIATE: 'yellow',
  ADVANCED: 'accent',
  EXPERT: 'green',
};

const SkillCard: React.FC<{ skill: Skill; onEdit: (s: Skill) => void; onDelete: (id: string) => void }> = ({
  skill, onEdit, onDelete,
}) => (
  <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex items-center justify-between gap-3">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
        <Zap className="w-4 h-4 text-primary-600" />
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 text-sm">{skill.name}</h3>
        <div className="flex items-center gap-2 mt-0.5">
          <Badge variant={skill.category === 'HARD' ? 'primary' : 'accent'}>{skill.category}</Badge>
          <Badge variant={LEVEL_VARIANT[skill.proficiencyLevel]}>
            {skill.proficiencyLevel.charAt(0) + skill.proficiencyLevel.slice(1).toLowerCase()}
          </Badge>
        </div>
      </div>
    </div>
    <div className="flex gap-1.5">
      <button onClick={() => onEdit(skill)} className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
        <Pencil className="w-3.5 h-3.5" />
      </button>
      <button onClick={() => onDelete(skill.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  </div>
);

export const SkillsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
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
    defaultValues: { category: 'HARD', proficiencyLevel: 'INTERMEDIATE' },
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await portfolioService.getSkills();
        store.setSkills(res.data.data || []);
      } catch { /* */ }
      finally { setLoading(false); }
    })();
  }, []);

  const openAdd = () => {
    setEditingSkill(null);
    reset({ category: 'HARD', proficiencyLevel: 'INTERMEDIATE' });
    setModalOpen(true);
  };

  const openEdit = (skill: Skill) => {
    setEditingSkill(skill);
    reset(skill);
    setModalOpen(true);
  };

  const onSubmit = async (data: FormValues) => {
    setSaving(true);
    try {
      const payload = { ...data, orderIndex: editingSkill?.orderIndex ?? store.skills.length };
      if (editingSkill) {
        const res = await portfolioService.updateSkill(editingSkill.id, payload);
        store.setSkills(store.skills.map((s) => s.id === editingSkill.id ? res.data.data : s));
        toast.success('Skill updated!');
      } else {
        const res = await portfolioService.createSkill(payload);
        store.setSkills([...store.skills, res.data.data]);
        toast.success('Skill added!');
      }
      setModalOpen(false);
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await portfolioService.deleteSkill(deleteId);
      store.setSkills(store.skills.filter((s) => s.id !== deleteId));
      toast.success('Deleted');
    } catch { toast.error('Failed'); }
    finally { setDeleting(false); setDeleteId(null); }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = store.skills.findIndex((s) => s.id === active.id);
    const newIdx = store.skills.findIndex((s) => s.id === over.id);
    const reordered = arrayMove(store.skills, oldIdx, newIdx).map((s, i) => ({ ...s, orderIndex: i }));
    store.setSkills(reordered);
    await Promise.all(reordered.map((s) => portfolioService.updateSkill(s.id, { orderIndex: s.orderIndex })));
  };

  const sorted = [...store.skills].sort((a, b) => a.orderIndex - b.orderIndex);

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      <PageHeader
        title="Skills"
        subtitle="Add your technical and soft skills"
        actions={<Button icon={<Plus className="w-4 h-4" />} onClick={openAdd}>Add Skill</Button>}
      />

      {loading ? <SkeletonList count={4} /> : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={sorted.map((s) => s.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {sorted.length === 0 && (
                <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
                  <Zap className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">No skills added yet</p>
                </div>
              )}
              {sorted.map((skill) => (
                <SortableItem key={skill.id} id={skill.id}>
                  <SkillCard skill={skill} onEdit={openEdit} onDelete={setDeleteId} />
                </SortableItem>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingSkill ? 'Edit Skill' : 'Add Skill'} size="sm">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <Input label="Skill Name" error={errors.name?.message} {...register('name')} />
          <Select
            label="Category"
            options={[{ value: 'HARD', label: 'Hard Skill' }, { value: 'SOFT', label: 'Soft Skill' }]}
            error={errors.category?.message}
            {...register('category')}
          />
          <Select
            label="Proficiency Level"
            options={[
              { value: 'BEGINNER', label: 'Beginner' },
              { value: 'INTERMEDIATE', label: 'Intermediate' },
              { value: 'ADVANCED', label: 'Advanced' },
              { value: 'EXPERT', label: 'Expert' },
            ]}
            error={errors.proficiencyLevel?.message}
            {...register('proficiencyLevel')}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" loading={saving}>{editingSkill ? 'Update' : 'Add'} Skill</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete}
        title="Delete Skill" message="Delete this skill?" loading={deleting}
      />
    </div>
  );
};
