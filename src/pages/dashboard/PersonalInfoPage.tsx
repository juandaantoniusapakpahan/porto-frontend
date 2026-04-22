import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { User, Plus, Trash2 } from 'lucide-react';
import { portfolioService } from '../../api/services/portfolioService';
import { usePortfolioStore } from '../../store/portfolioStore';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { FormSection, PageHeader } from '../../components/dashboard/FormSection';
import { SkeletonForm } from '../../components/ui/Skeleton';

const schema = z.object({
  fullName: z.string().min(2, 'Required'),
  professionalTitle: z.string().optional(),
  phone: z.string().min(5, 'Required'),
  email: z.string().email('Invalid email'),
  domicile: z.string().min(2, 'Required'),
  linkedinUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  githubUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  websiteUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  otherLinks: z.array(z.object({
    label: z.string().min(1, 'Label required'),
    url: z.string().url('Invalid URL'),
  })).optional(),
});

type FormValues = z.infer<typeof schema>;

export const PersonalInfoPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const store = usePortfolioStore();

  const { register, handleSubmit, reset, formState: { errors }, control } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'otherLinks' });

  useEffect(() => {
    (async () => {
      try {
        const res = await portfolioService.getPersonalInfo();
        const data = res.data.data;
        store.setPersonalInfo(data);
        if (data) reset({
          ...data,
          otherLinks: Object.entries(data.otherLinks || {}).map(([label, url]) => ({ label, url })),
        });
      } catch {
        // empty form
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onSubmit = async (data: FormValues) => {
    setSaving(true);
    try {
      const payload = {
        ...data,
        otherLinks: Object.fromEntries((data.otherLinks || []).map(({ label, url }) => [label, url])),
      };
      const res = await portfolioService.updatePersonalInfo(payload);
      store.setPersonalInfo(res.data.data);
      toast.success('Personal info saved!');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8 max-w-3xl mx-auto">
        <SkeletonForm />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      <PageHeader
        title="Personal Info"
        subtitle="Your basic contact and profile information"
      />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormSection title="Basic Information" icon={<User className="w-5 h-5" />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Full Name" error={errors.fullName?.message} {...register('fullName')} />
            <Input label="Professional Title" error={errors.professionalTitle?.message} {...register('professionalTitle')} />
            <Input label="Phone Number" type="tel" error={errors.phone?.message} {...register('phone')} />
            <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
            <Input label="Domicile / City" error={errors.domicile?.message} {...register('domicile')} className="sm:col-span-2" />
          </div>
        </FormSection>

        <FormSection title="Social & Links">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="LinkedIn URL" type="url" error={errors.linkedinUrl?.message} {...register('linkedinUrl')} />
            <Input label="GitHub URL" type="url" error={errors.githubUrl?.message} {...register('githubUrl')} />
            <Input label="Website URL" type="url" error={errors.websiteUrl?.message} {...register('websiteUrl')} className="sm:col-span-2" />
          </div>
        </FormSection>

        <FormSection title="Other Links">
          <div className="space-y-3">
            {fields.map((field, i) => (
              <div key={field.id} className="flex gap-3 items-start">
                <div className="flex-1 grid grid-cols-2 gap-3">
                  <Input
                    label="Label"
                    error={errors.otherLinks?.[i]?.label?.message}
                    {...register(`otherLinks.${i}.label`)}
                  />
                  <Input
                    label="URL"
                    type="url"
                    error={errors.otherLinks?.[i]?.url?.message}
                    {...register(`otherLinks.${i}.url`)}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="mt-3 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => append({ label: '', url: '' })}
            >
              Add Link
            </Button>
          </div>
        </FormSection>

        <div className="flex justify-end">
          <Button type="submit" loading={saving} size="lg">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};
