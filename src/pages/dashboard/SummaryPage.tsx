import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { FileText } from 'lucide-react';
import { portfolioService } from '../../api/services/portfolioService';
import { usePortfolioStore } from '../../store/portfolioStore';
import { Textarea } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { FormSection, PageHeader } from '../../components/dashboard/FormSection';
import { SkeletonForm } from '../../components/ui/Skeleton';

const schema = z.object({
  content: z.string().min(10, 'Summary must be at least 10 characters').max(2000),
});

type FormValues = z.infer<typeof schema>;

export const SummaryPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const store = usePortfolioStore();

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const content = watch('content', '');

  useEffect(() => {
    (async () => {
      try {
        const res = await portfolioService.getSummary();
        const data = res.data.data;
        store.setSummary(data);
        if (data) reset(data);
      } catch { /* empty */ }
      finally { setLoading(false); }
    })();
  }, []);

  const onSubmit = async (data: FormValues) => {
    setSaving(true);
    try {
      const res = await portfolioService.updateSummary(data);
      store.setSummary(res.data.data);
      toast.success('Summary saved!');
    } catch {
      toast.error('Failed to save summary');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto"><SkeletonForm /></div>
  );

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      <PageHeader title="Professional Summary" subtitle="A brief overview about yourself and your career" />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormSection title="Summary" icon={<FileText className="w-5 h-5" />}
          description="Write 2-4 sentences about your background, skills, and what you bring to the table.">
          <Textarea
            label="Professional Summary"
            error={errors.content?.message}
            rows={8}
            {...register('content')}
          />
          <p className="text-xs text-gray-400 mt-2 text-right">{content.length} / 2000</p>
        </FormSection>
        <div className="flex justify-end">
          <Button type="submit" loading={saving} size="lg">Save Summary</Button>
        </div>
      </form>
    </div>
  );
};
