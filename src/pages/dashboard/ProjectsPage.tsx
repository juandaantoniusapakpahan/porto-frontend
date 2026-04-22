import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, FolderOpen, X } from 'lucide-react';
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, arrayMove,
} from '@dnd-kit/sortable';
import { portfolioService } from '../../api/services/portfolioService';
import { usePortfolioStore } from '../../store/portfolioStore';
import type { Project } from '../../types';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Modal, ConfirmDialog } from '../../components/ui/Modal';
import { PageHeader } from '../../components/dashboard/FormSection';
import { SortableItem } from '../../components/dashboard/SortableItem';
import { SkeletonList } from '../../components/ui/Skeleton';

const schema = z.object({
  name: z.string().min(1, 'Required'),
  description: z.string().min(10, 'Min 10 characters'),
  techStack: z.array(z.object({ value: z.string() })),
  projectUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  repoUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  thumbnailUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const ProjectCard: React.FC<{ project: Project; onEdit: (p: Project) => void; onDelete: (id: string) => void }> = ({ project, onEdit, onDelete }) => (
  <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
    <div className="flex items-start justify-between gap-3">
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 text-sm">{project.name}</h3>
        <p className="text-gray-500 text-xs mt-0.5 line-clamp-2">{project.description}</p>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {project.techStack?.slice(0, 4).map((tech) => (
            <span key={tech} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">{tech}</span>
          ))}
          {project.techStack?.length > 4 && (
            <span className="text-xs text-gray-400">+{project.techStack.length - 4}</span>
          )}
        </div>
      </div>
      <div className="flex gap-1.5 flex-shrink-0">
        <button onClick={() => onEdit(project)} className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button onClick={() => onDelete(project.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  </div>
);

export const ProjectsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const store = usePortfolioStore();

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { techStack: [{ value: '' }] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'techStack' });

  useEffect(() => {
    (async () => {
      try { const res = await portfolioService.getProjects(); store.setProjects(res.data.data || []); }
      catch { /* */ } finally { setLoading(false); }
    })();
  }, []);

  const openAdd = () => { setEditingProject(null); reset({ techStack: [{ value: '' }] }); setModalOpen(true); };
  const openEdit = (p: Project) => {
    setEditingProject(p);
    reset({ ...p, startDate: p.startDate?.slice(0, 7), endDate: p.endDate?.slice(0, 7), techStack: (p.techStack || []).map((v) => ({ value: v })) });
    setModalOpen(true);
  };

  const onSubmit = async (data: FormValues) => {
    setSaving(true);
    try {
      const payload = {
        ...data,
        startDate: data.startDate ? `${data.startDate}-01` : undefined,
        endDate: data.endDate ? `${data.endDate}-01` : undefined,
        techStack: data.techStack.map((t) => t.value).filter(Boolean),
        orderIndex: editingProject?.orderIndex ?? store.projects.length,
      };
      if (editingProject) {
        const res = await portfolioService.updateProject(editingProject.id, payload);
        store.setProjects(store.projects.map((p) => p.id === editingProject.id ? res.data.data : p));
        toast.success('Project updated!');
      } else {
        const res = await portfolioService.createProject(payload);
        store.setProjects([...store.projects, res.data.data]);
        toast.success('Project added!');
      }
      setModalOpen(false);
    } catch { toast.error('Failed to save'); } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return; setDeleting(true);
    try { await portfolioService.deleteProject(deleteId); store.setProjects(store.projects.filter((p) => p.id !== deleteId)); toast.success('Deleted'); }
    catch { toast.error('Failed'); } finally { setDeleting(false); setDeleteId(null); }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event; if (!over || active.id === over.id) return;
    const reordered = arrayMove(store.projects, store.projects.findIndex((p) => p.id === active.id), store.projects.findIndex((p) => p.id === over.id)).map((p, i) => ({ ...p, orderIndex: i }));
    store.setProjects(reordered);
    await Promise.all(reordered.map((p) => portfolioService.updateProject(p.id, { orderIndex: p.orderIndex })));
  };

  const sorted = [...store.projects].sort((a, b) => a.orderIndex - b.orderIndex);

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      <PageHeader title="Projects" subtitle="Showcase your work" actions={<Button icon={<Plus className="w-4 h-4" />} onClick={openAdd}>Add Project</Button>} />

      {loading ? <SkeletonList count={3} /> : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={sorted.map((p) => p.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {sorted.length === 0 && (
                <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
                  <FolderOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">No projects yet</p>
                </div>
              )}
              {sorted.map((project) => (
                <SortableItem key={project.id} id={project.id}>
                  <ProjectCard project={project} onEdit={openEdit} onDelete={setDeleteId} />
                </SortableItem>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingProject ? 'Edit Project' : 'Add Project'} size="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <Input label="Project Name" error={errors.name?.message} {...register('name')} />
          <Textarea label="Description" error={errors.description?.message} rows={4} {...register('description')} />

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-2">Tech Stack</label>
            <div className="flex flex-wrap gap-2">
              {fields.map((field, i) => (
                <div key={field.id} className="flex items-center gap-1">
                  <input
                    className="w-24 px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="React"
                    {...register(`techStack.${i}.value`)}
                  />
                  <button type="button" onClick={() => remove(i)} className="p-1 text-gray-300 hover:text-red-400">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => append({ value: '' })}
                className="px-2.5 py-1.5 text-xs text-primary-600 border border-dashed border-primary-300 rounded-lg hover:bg-primary-50">
                + Add
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Live URL" type="url" error={errors.projectUrl?.message} {...register('projectUrl')} />
            <Input label="Repo URL" type="url" error={errors.repoUrl?.message} {...register('repoUrl')} />
            <Input label="Thumbnail URL" type="url" error={errors.thumbnailUrl?.message} {...register('thumbnailUrl')} className="col-span-2" />
            <Input label="Start Date (YYYY-MM)" {...register('startDate')} />
            <Input label="End Date (YYYY-MM)" {...register('endDate')} />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" loading={saving}>{editingProject ? 'Update' : 'Add'} Project</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Project" message="Delete this project?" loading={deleting} />
    </div>
  );
};
