import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  AlertDescription,
  AlertTitle,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Checkbox,
  Combobox,
  DatePicker,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Skeleton,
  Slider,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Toggle,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@saas-core/core-ui';

export function ComponentsPage() {
  const { t } = useTranslation();
  const [sliderValue, setSliderValue] = useState([50]);
  const [comboValue, setComboValue] = useState('');
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
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
          <TabsTrigger value="overlay">Overlay</TabsTrigger>
        </TabsList>

        <TabsContent value="buttons" className="space-y-6 mt-4">
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

        <TabsContent value="inputs" className="space-y-6 mt-4">
          <div className="space-y-3 max-w-md">
            <h3 className="text-lg font-semibold">Input</h3>
            <Input placeholder="Type something..." />
          </div>
          <div className="space-y-3 max-w-md">
            <h3 className="text-lg font-semibold">Checkbox</h3>
            <div className="flex items-center gap-2">
              <Checkbox id="terms" />
              <label htmlFor="terms" className="text-sm">
                Accept terms and conditions
              </label>
            </div>
          </div>
          <div className="space-y-3 max-w-md">
            <h3 className="text-lg font-semibold">Slider</h3>
            <Slider value={sliderValue} onValueChange={setSliderValue} max={100} step={1} />
            <p className="text-sm text-muted-foreground">Value: {sliderValue[0]}</p>
          </div>
          <div className="space-y-3 max-w-md">
            <h3 className="text-lg font-semibold">Combobox</h3>
            <Combobox
              options={frameworks}
              value={comboValue}
              onValueChange={setComboValue}
              placeholder="Select framework..."
            />
          </div>
          <div className="space-y-3 max-w-md">
            <h3 className="text-lg font-semibold">Date Picker</h3>
            <DatePicker date={date} onDateChange={setDate} />
          </div>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-6 mt-4">
          <div className="space-y-3 max-w-lg">
            <h3 className="text-lg font-semibold">Alert</h3>
            <Alert>
              <AlertTitle>Heads up!</AlertTitle>
              <AlertDescription>This is an informational alert using shadcn/ui.</AlertDescription>
            </Alert>
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

        <TabsContent value="overlay" className="space-y-6 mt-4">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Dialog</h3>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Open Dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Dialog Title</DialogTitle>
                  <DialogDescription>
                    This is a dialog component from shadcn/ui.
                  </DialogDescription>
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
