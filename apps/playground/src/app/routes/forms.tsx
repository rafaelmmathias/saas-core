import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@saas-core/core-ui/components/button';
import { Form } from '@saas-core/core-ui/form/form';
import { FormCheckbox } from '@saas-core/core-ui/form/form-checkbox';
import { FormCombobox } from '@saas-core/core-ui/form/form-combobox';
import { FormDatePicker } from '@saas-core/core-ui/form/form-datepicker';
import { FormInput } from '@saas-core/core-ui/form/form-input';
import { FormInputFile } from '@saas-core/core-ui/form/form-input-file';
import { FormSlider } from '@saas-core/core-ui/form/form-slider';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  framework: z.string().min(1, 'Please select a framework'),
  birthDate: z.date({ required_error: 'Please select a date' }),
  attachments: z
    .custom<File[] | null>((value) => value === null || Array.isArray(value))
    .refine((value) => Array.isArray(value) && value.length > 0, 'Please upload at least one file.')
    .refine(
      (value) => value == null || value.every((f) => /\.(pdf|png|jpe?g)$/i.test(f.name)),
      'Only PDF, PNG, and JPEG files are accepted.',
    ),
  experience: z.number().min(0).max(20),
  terms: z.boolean().refine((v) => v, 'You must accept the terms'),
});

type FormValues = z.infer<typeof formSchema>;

export function FormsPage() {
  const { t } = useTranslation();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      framework: '',
      attachments: null,
      experience: 5,
      terms: false,
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log('Form submitted:', data);
    alert(t('forms.success'));
  };

  const frameworks = [
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue' },
    { value: 'angular', label: 'Angular' },
    { value: 'svelte', label: 'Svelte' },
  ];

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('forms.title')}</h1>
        <p className="text-muted-foreground mt-1">{t('forms.subtitle')}</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormInput<FormValues>
            control={form.control}
            name="name"
            label={t('forms.name')}
            placeholder={t('forms.namePlaceholder')}
          />

          <FormInput<FormValues>
            control={form.control}
            name="email"
            label={t('forms.email')}
            placeholder={t('forms.emailPlaceholder')}
            type="email"
          />

          <FormCombobox<FormValues>
            control={form.control}
            name="framework"
            label="Framework"
            options={frameworks}
            placeholder="Select a framework..."
          />

          <FormDatePicker<FormValues>
            control={form.control}
            name="birthDate"
            label="Birth Date"
            placeholder="Select your birth date"
          />

          <FormInputFile<FormValues>
            accept=".pdf,.png,.jpg,.jpeg"
            buttonText="Upload attachments"
            control={form.control}
            description="Try the file input with React Hook Form."
            label="Attachments"
            multiple
            name="attachments"
            placeholder="No attachments selected yet."
            variant="dropzone"
          />

          <FormSlider<FormValues>
            control={form.control}
            name="experience"
            label="Years of Experience"
            description="How many years of development experience do you have?"
            min={0}
            max={20}
            step={1}
          />

          <FormCheckbox<FormValues>
            control={form.control}
            name="terms"
            label="I accept the terms and conditions"
            description="By checking this you agree to our Terms of Service."
          />

          <Button type="submit">{t('forms.submit')}</Button>
        </form>
      </Form>
    </div>
  );
}
