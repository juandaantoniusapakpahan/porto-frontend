import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Trophy } from 'lucide-react';
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, arrayMove,
} from '@dnd-kit/sortable';
import { portfolioService } from '../../api/services/portfolioService';
import { usePortfolioStore } from '../../store/portfolioStore';
import type { Award } from '../../types';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Modal, ConfirmDialog } from '../../components/ui/Modal';
import { PageHeader } from '../../components/dashboard/FormSection';
import { SortableItem } from '../../components/dashboard/SortableItem';
import { SkeletonList } from '../../components/ui/Skeleton';
import { formatDate } from '../../utils';

const schema = z.object({
  title: z.string().min(1, 'Required'),
  issuer: z.string().min(1, 'Required'),
  date: z.string().min(7, 'Required (YYYY-MM)'),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const AwardCard: React.FC<{ award: Award; onEdit: (a: Award) => void; onDelete: (id: string) => void }> = ({ award, onEdit, onDelete }) => (
  <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
    <div className="flex items-start justify-between gap-3">
      <div>
        <h3 className="font-semibold text-gray-900 text-sm">{award.title}</h3>
        <p className="text-primary-600 text-xs font-medium mt-0.5">{award.issuer}</p>
        <p className="text-xs text-gray-400 mt-0.5">{formatDate(award.date)}</p>
        {award.description && <p className="text-xs text-gray-500 mt-1.5 line-clamp-2">{award.description}</p>}
      </div>
      <div className="flex gap-1.5">
        <button onClick={() => onEdit(award)} className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button onClick={() => onDelete(award.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  </div>
);

export const AwardsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAward, setEditingAward] = useState<Award | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const store = usePortfolioStore();

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(schema) });

  useEffect(() => {
    (async () => {
      try { const res = await portfolioService.getAwards(); store.setAwards(res.data.data || []); }
      catch { /* */ } finally { setLoading(false); }
    })();
  }, []);

  const openAdd = () => { setEditingAward(null); reset({}); setModalOpen(true); };
  const openEdit = (a: Award) => { setEditingAward(a); reset({ ...a, date: a.date?.slice(0, 7) }); setModalOpen(true); };

  const onSubmit = async (data: FormValues) => {
    setSaving(true);
    try {
      const payload = { ...data, date: data.date ? `${data.date}-01` : data.date, orderIndex: editingAward?.orderIndex ?? store.awards.length };
      if (editingAward) {
        const res = await portfolioService.updateAward(editingAward.id, payload);
        store.setAwards(store.awards.map((a) => a.id === editingAward.id ? res.data.data : a));
        toast.success('Updated!');
      } else {
        const res = await portfolioService.createAward(payload);
        store.setAwards([...store.awards, res.data.data]);
        toast.success('Added!');
      }
      setModalOpen(false);
    } catch { toast.error('Failed'); } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return; setDeleting(true);
    try { await portfolioService.deleteAward(deleteId); store.setAwards(store.awards.filter((a) => a.id !== deleteId)); toast.success('Deleted'); }
    catch { toast.error('Failed'); } finally { setDeleting(false); setDeleteId(null); }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event; if (!over || active.id === over.id) return;
    const reordered = arrayMove(store.awards, store.awards.findIndex((a) => a.id === active.id), store.awards.findIndex((a) => a.id === over.id)).map((a, i) => ({ ...a, orderIndex: i }));
    store.setAwards(reordered);
    await Promise.all(reordered.map((a) => portfolioService.updateAward(a.id, { orderIndex: a.orderIndex })));
  };

  const sorted = [...store.awards].sort((a, b) => a.orderIndex - b.orderIndex);

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      <PageHeader title="Awards" subtitle="Recognition and achievements" actions={<Button icon={<Plus className="w-4 h-4" />} onClick={openAdd}>Add Award</Button>} />

      {loading ? <SkeletonList count={2} /> : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={sorted.map((a) => a.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {sorted.length === 0 && (
                <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
                  <Trophy className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">No awards yet</p>
                </div>
              )}
              {sorted.map((award) => (
                <SortableItem key={award.id} id={award.id}>
                  <AwardCard award={award} onEdit={openEdit} onDelete={setDeleteId} />
                </SortableItem>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingAward ? 'Edit Award' : 'Add Award'}>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <Input label="Award Title" error={errors.title?.message} {...register('title')} />
          <Input label="Issuing Organization" error={errors.issuer?.message} {...register('issuer')} />
          <Input label="Date (YYYY-MM)" placeholder="2023-11" error={errors.date?.message} {...register('date')} />
          <Textarea label="Description (optional)" rows={3} {...register('description')} />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" loading={saving}>{editingAward ? 'Update' : 'Add'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Award" message="Delete this award?" loading={deleting} />
    </div>
  );
};
