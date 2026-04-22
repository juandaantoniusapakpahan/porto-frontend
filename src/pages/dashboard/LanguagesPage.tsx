import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Globe } from 'lucide-react';
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, arrayMove,
} from '@dnd-kit/sortable';
import { portfolioService } from '../../api/services/portfolioService';
import { usePortfolioStore } from '../../store/portfolioStore';
import type { Language } from '../../types';
import { Input, Select } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Modal, ConfirmDialog } from '../../components/ui/Modal';
import { PageHeader } from '../../components/dashboard/FormSection';
import { SortableItem } from '../../components/dashboard/SortableItem';
import { SkeletonList } from '../../components/ui/Skeleton';
import { languageProficiencyLabel, languageProficiencyToPercent } from '../../utils';

const schema = z.object({
  languageName: z.string().min(1, 'Required'),
  proficiency: z.enum(['BASIC', 'CONVERSATIONAL', 'PROFESSIONAL', 'FLUENT', 'NATIVE']),
});

type FormValues = z.infer<typeof schema>;

const LanguageCard: React.FC<{ lang: Language; onEdit: (l: Language) => void; onDelete: (id: string) => void }> = ({ lang, onEdit, onDelete }) => {
  const percent = languageProficiencyToPercent(lang.proficiency);
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="font-semibold text-gray-900 text-sm">{lang.languageName}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{languageProficiencyLabel(lang.proficiency)}</p>
        </div>
        <div className="flex gap-1.5">
          <button onClick={() => onEdit(lang)} className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => onDelete(lang.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <div className="skill-bar">
        <div className="skill-bar-fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
};

export const LanguagesPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLang, setEditingLang] = useState<Language | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const store = usePortfolioStore();

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { proficiency: 'CONVERSATIONAL' },
  });

  useEffect(() => {
    (async () => {
      try { const res = await portfolioService.getLanguages(); store.setLanguages(res.data.data || []); }
      catch { /* */ } finally { setLoading(false); }
    })();
  }, []);

  const openAdd = () => { setEditingLang(null); reset({ proficiency: 'CONVERSATIONAL' }); setModalOpen(true); };
  const openEdit = (l: Language) => { setEditingLang(l); reset(l); setModalOpen(true); };

  const onSubmit = async (data: FormValues) => {
    setSaving(true);
    try {
      const payload = { ...data, orderIndex: editingLang?.orderIndex ?? store.languages.length };
      if (editingLang) {
        const res = await portfolioService.updateLanguage(editingLang.id, payload);
        store.setLanguages(store.languages.map((l) => l.id === editingLang.id ? res.data.data : l));
        toast.success('Updated!');
      } else {
        const res = await portfolioService.createLanguage(payload);
        store.setLanguages([...store.languages, res.data.data]);
        toast.success('Added!');
      }
      setModalOpen(false);
    } catch { toast.error('Failed'); } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return; setDeleting(true);
    try { await portfolioService.deleteLanguage(deleteId); store.setLanguages(store.languages.filter((l) => l.id !== deleteId)); toast.success('Deleted'); }
    catch { toast.error('Failed'); } finally { setDeleting(false); setDeleteId(null); }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event; if (!over || active.id === over.id) return;
    const reordered = arrayMove(store.languages, store.languages.findIndex((l) => l.id === active.id), store.languages.findIndex((l) => l.id === over.id)).map((l, i) => ({ ...l, orderIndex: i }));
    store.setLanguages(reordered);
    await Promise.all(reordered.map((l) => portfolioService.updateLanguage(l.id, { orderIndex: l.orderIndex })));
  };

  const sorted = [...store.languages].sort((a, b) => a.orderIndex - b.orderIndex);

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      <PageHeader title="Languages" subtitle="Languages you speak" actions={<Button icon={<Plus className="w-4 h-4" />} onClick={openAdd}>Add Language</Button>} />

      {loading ? <SkeletonList count={2} /> : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={sorted.map((l) => l.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {sorted.length === 0 && (
                <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
                  <Globe className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">No languages added yet</p>
                </div>
              )}
              {sorted.map((lang) => (
                <SortableItem key={lang.id} id={lang.id}>
                  <LanguageCard lang={lang} onEdit={openEdit} onDelete={setDeleteId} />
                </SortableItem>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingLang ? 'Edit Language' : 'Add Language'} size="sm">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <Input label="Language Name" error={errors.languageName?.message} {...register('languageName')} />
          <Select
            label="Proficiency Level"
            options={[
              { value: 'BASIC', label: 'Basic' },
              { value: 'CONVERSATIONAL', label: 'Conversational' },
              { value: 'PROFESSIONAL', label: 'Professional' },
              { value: 'FLUENT', label: 'Fluent' },
              { value: 'NATIVE', label: 'Native / Bilingual' },
            ]}
            error={errors.proficiency?.message}
            {...register('proficiency')}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" loading={saving}>{editingLang ? 'Update' : 'Add'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Language" message="Delete this language?" loading={deleting} />
    </div>
  );
};
