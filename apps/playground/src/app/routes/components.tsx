import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@saas-core/core-ui/components/accordion';
import { Alert, AlertDescription, AlertTitle } from '@saas-core/core-ui/components/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@saas-core/core-ui/components/avatar';
import { Badge } from '@saas-core/core-ui/components/badge';
import { Button } from '@saas-core/core-ui/components/button';
import { Checkbox } from '@saas-core/core-ui/components/checkbox';
import { Combobox } from '@saas-core/core-ui/components/combobox';
import { DatePicker } from '@saas-core/core-ui/components/date-picker';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@saas-core/core-ui/components/dialog';
import { Input } from '@saas-core/core-ui/components/input';
import { Skeleton } from '@saas-core/core-ui/components/skeleton';
import { Slider } from '@saas-core/core-ui/components/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@saas-core/core-ui/components/tabs';
import { Toggle } from '@saas-core/core-ui/components/toggle';
import { Tooltip, TooltipContent, TooltipTrigger } from '@saas-core/core-ui/components/tooltip';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export function ComponentsPage() {
  const { t } = useTranslation();
  const [sliderValue, setSliderValue] = useState([50]);
  const [comboValue, setComboValue] = useState('');
  const [editorColor, setEditorColor] = useState('221 83% 53%');
  const [activeSwatch, setActiveSwatch] = useState('blue');
  const [date, setDate] = useState<Date>();

  const frameworks = [
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue' },
    { value: 'angular', label: 'Angular' },
    { value: 'svelte', label: 'Svelte' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{t('components.title')}</h1>
        <p className="text-muted-foreground mt-1">{t('components.subtitle')}</p>
      </div>

      <Tabs defaultValue="buttons" className="w-full">
        <TabsList>
          <TabsTrigger value="buttons">Buttons & Badges</TabsTrigger>
          <TabsTrigger value="inputs">Inputs</TabsTrigger>
          <TabsTrigger value="color">Color</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
          <TabsTrigger value="overlay">Overlay</TabsTrigger>
        </TabsList>

        <TabsContent value="buttons" className="mt-4 space-y-6">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Buttons</h3>
            <div className="flex flex-wrap gap-3">
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Badges</h3>
            <div className="flex flex-wrap gap-3">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Toggle</h3>
            <Toggle>Toggle me</Toggle>
          </div>
        </TabsContent>

        <TabsContent value="inputs" className="mt-4 space-y-6">
          <div className="max-w-md space-y-3">
            <h3 className="text-lg font-semibold">Input</h3>
            <Input placeholder="Type something..." />
          </div>
          <div className="max-w-md space-y-3">
            <h3 className="text-lg font-semibold">Checkbox</h3>
            <div className="flex items-center gap-2">
              <Checkbox id="terms" />
              <label htmlFor="terms" className="text-sm">
                Accept terms and conditions
              </label>
            </div>
          </div>
          <div className="max-w-md space-y-3">
            <h3 className="text-lg font-semibold">Slider</h3>
            <Slider value={sliderValue} onValueChange={setSliderValue} max={100} step={1} />
            <p className="text-muted-foreground text-sm">Value: {sliderValue[0]}</p>
          </div>
          <div className="max-w-md space-y-3">
            <h3 className="text-lg font-semibold">Combobox</h3>
            <Combobox
              options={frameworks}
              value={comboValue}
              onValueChange={setComboValue}
              placeholder="Select framework..."
            />
          </div>
          <div className="max-w-md space-y-3">
            <h3 className="text-lg font-semibold">Date Picker</h3>
            <DatePicker date={date} onDateChange={setDate} />
          </div>
        </TabsContent>

        <TabsContent value="color" className="mt-4 space-y-6">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Color Swatch</h3>
            <div className="flex flex-wrap gap-4">
              {[
                { id: 'blue', label: 'Ocean', color: '221 83% 53%' },
                { id: 'green', label: 'Mint', color: '142 71% 45%' },
                { id: 'amber', label: 'Amber', color: '38 92% 50%' },
              ].map((swatch) => (
                <ColorSwatch
                  key={swatch.id}
                  color={swatch.color}
                  isActive={activeSwatch === swatch.id}
                  label={swatch.label}
                  onClick={() => setActiveSwatch(swatch.id)}
                />
              ))}
            </div>
          </div>

          <div className="max-w-sm space-y-3">
            <h3 className="text-lg font-semibold">Color Editor</h3>
            <ColorEditor label="Accent" onChange={setEditorColor} value={editorColor} />
            <p className="text-muted-foreground text-sm">Value: {editorColor}</p>
          </div>
        </TabsContent>

        <TabsContent value="feedback" className="mt-4 space-y-6">
          <div className="max-w-lg space-y-3">
            <h3 className="text-lg font-semibold">Alert</h3>
            <Alert>
              <AlertTitle>Heads up!</AlertTitle>
              <AlertDescription>This is an informational alert using shadcn/ui.</AlertDescription>
            </Alert>
          </div>
          <div className="max-w-lg space-y-3">
            <h3 className="text-lg font-semibold">Progress</h3>
            <div className="space-y-2">
              <Progress value={33} />
              <Progress value={66} />
              <Progress value={100} />
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Skeleton</h3>
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Avatar</h3>
            <div className="flex gap-3">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Accordion</h3>
            <Accordion type="single" collapsible className="w-full max-w-lg">
              <AccordionItem value="item-1">
                <AccordionTrigger>Is it accessible?</AccordionTrigger>
                <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Is it styled?</AccordionTrigger>
                <AccordionContent>
                  Yes. It comes with default styles from shadcn/ui.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </TabsContent>

        <TabsContent value="overlay" className="mt-4 space-y-6">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Dialog</h3>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Open Dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Dialog Title</DialogTitle>
                  <DialogDescription>This is a dialog component from shadcn/ui.</DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Tooltip</h3>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">Hover me</Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>This is a tooltip!</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
