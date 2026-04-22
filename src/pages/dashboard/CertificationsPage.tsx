import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Award } from 'lucide-react';
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, arrayMove,
} from '@dnd-kit/sortable';
import { portfolioService } from '../../api/services/portfolioService';
import { usePortfolioStore } from '../../store/portfolioStore';
import type { Certification } from '../../types';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Modal, ConfirmDialog } from '../../components/ui/Modal';
import { PageHeader } from '../../components/dashboard/FormSection';
import { SortableItem } from '../../components/dashboard/SortableItem';
import { SkeletonList } from '../../components/ui/Skeleton';
import { formatDate } from '../../utils';

const schema = z.object({
  name: z.string().min(1, 'Required'),
  issuer: z.string().min(1, 'Required'),
  issueDate: z.string().min(7, 'Required (YYYY-MM)'),
  expiryDate: z.string().optional(),
  credentialUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
});

type FormValues = z.infer<typeof schema>;

const CertCard: React.FC<{ cert: Certification; onEdit: (c: Certification) => void; onDelete: (id: string) => void }> = ({ cert, onEdit, onDelete }) => (
  <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
    <div className="flex items-start justify-between gap-3">
      <div>
        <h3 className="font-semibold text-gray-900 text-sm">{cert.name}</h3>
        <p className="text-primary-600 text-xs font-medium mt-0.5">{cert.issuer}</p>
        <p className="text-xs text-gray-400 mt-0.5">
          {formatDate(cert.issueDate)}{cert.expiryDate ? ` → ${formatDate(cert.expiryDate)}` : ''}
        </p>
        {cert.credentialUrl && (
          <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-500 hover:underline mt-0.5 block">
            View credential
          </a>
        )}
      </div>
      <div className="flex gap-1.5">
        <button onClick={() => onEdit(cert)} className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button onClick={() => onDelete(cert.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  </div>
);

export const CertificationsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Certification | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const store = usePortfolioStore();

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(schema) });

  useEffect(() => {
    (async () => {
      try { const res = await portfolioService.getCertifications(); store.setCertifications(res.data.data || []); }
      catch { /* */ } finally { setLoading(false); }
    })();
  }, []);

  const openAdd = () => { setEditingCert(null); reset({}); setModalOpen(true); };
  const openEdit = (c: Certification) => {
    setEditingCert(c);
    reset({ ...c, issueDate: c.issueDate?.slice(0, 7), expiryDate: c.expiryDate?.slice(0, 7) });
    setModalOpen(true);
  };

  const onSubmit = async (data: FormValues) => {
    setSaving(true);
    try {
      const payload = {
        ...data,
        issueDate: data.issueDate ? `${data.issueDate}-01` : data.issueDate,
        expiryDate: data.expiryDate ? `${data.expiryDate}-01` : undefined,
        orderIndex: editingCert?.orderIndex ?? store.certifications.length,
      };
      if (editingCert) {
        const res = await portfolioService.updateCertification(editingCert.id, payload);
        store.setCertifications(store.certifications.map((c) => c.id === editingCert.id ? res.data.data : c));
        toast.success('Updated!');
      } else {
        const res = await portfolioService.createCertification(payload);
        store.setCertifications([...store.certifications, res.data.data]);
        toast.success('Added!');
      }
      setModalOpen(false);
    } catch { toast.error('Failed to save'); } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return; setDeleting(true);
    try { await portfolioService.deleteCertification(deleteId); store.setCertifications(store.certifications.filter((c) => c.id !== deleteId)); toast.success('Deleted'); }
    catch { toast.error('Failed'); } finally { setDeleting(false); setDeleteId(null); }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event; if (!over || active.id === over.id) return;
    const reordered = arrayMove(store.certifications, store.certifications.findIndex((c) => c.id === active.id), store.certifications.findIndex((c) => c.id === over.id)).map((c, i) => ({ ...c, orderIndex: i }));
    store.setCertifications(reordered);
    await Promise.all(reordered.map((c) => portfolioService.updateCertification(c.id, { orderIndex: c.orderIndex })));
  };

  const sorted = [...store.certifications].sort((a, b) => a.orderIndex - b.orderIndex);

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      <PageHeader title="Certifications" subtitle="Professional credentials" actions={<Button icon={<Plus className="w-4 h-4" />} onClick={openAdd}>Add Certification</Button>} />

      {loading ? <SkeletonList count={3} /> : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={sorted.map((c) => c.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {sorted.length === 0 && (
                <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
                  <Award className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">No certifications yet</p>
                </div>
              )}
              {sorted.map((cert) => (
                <SortableItem key={cert.id} id={cert.id}>
                  <CertCard cert={cert} onEdit={openEdit} onDelete={setDeleteId} />
                </SortableItem>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingCert ? 'Edit Certification' : 'Add Certification'}>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <Input label="Certification Name" error={errors.name?.message} {...register('name')} />
          <Input label="Issuing Organization" error={errors.issuer?.message} {...register('issuer')} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Issue Date (YYYY-MM)" placeholder="2023-06" error={errors.issueDate?.message} {...register('issueDate')} />
            <Input label="Expiry Date (YYYY-MM)" placeholder="2026-06" {...register('expiryDate')} />
          </div>
          <Input label="Credential URL" type="url" error={errors.credentialUrl?.message} {...register('credentialUrl')} />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" loading={saving}>{editingCert ? 'Update' : 'Add'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Certification" message="Delete this certification?" loading={deleting} />
    </div>
  );
};
