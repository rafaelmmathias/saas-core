import { Badge } from '@saas-core/core-ui/components/badge';
import { AreaChart } from '@saas-core/core-ui/components/charts/area-chart';
import { BarChart } from '@saas-core/core-ui/components/charts/bar-chart';
import { DonutChart } from '@saas-core/core-ui/components/charts/donut-chart';
import { LineChart } from '@saas-core/core-ui/components/charts/line-chart';
import { KpiCard } from '@saas-core/core-ui/components/composite/kpi-card';
import { SectionTitle } from '@saas-core/core-ui/components/composite/section-title';
import { StatusCard } from '@saas-core/core-ui/components/composite/status-card';
import { DataTable, type ColumnDef } from '@saas-core/core-ui/components/data-table';
import { Input } from '@saas-core/core-ui/components/input';
import { Progress } from '@saas-core/core-ui/components/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@saas-core/core-ui/components/tabs';
import { Toggle } from '@saas-core/core-ui/components/toggle';
import {
  Activity,
  BarChart3,
  CheckCircle,
  Clock,
  DollarSign,
  Search,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useState } from 'react';

interface Row {
  id: string;
  item: string;
  category: string;
  amount: number;
  status: 'paid' | 'pending' | 'rejected';
}

const rows: Row[] = [
  {
    id: '0001',
    item: 'Concreto usinado 25MPa',
    category: 'Materiais',
    amount: 12450,
    status: 'paid',
  },
  {
    id: '0002',
    item: 'Mão de obra — pedreiro sênior',
    category: 'Mão de Obra',
    amount: 8200,
    status: 'pending',
  },
  { id: '0003', item: 'Aluguel de andaime', category: 'Alugueis', amount: 3400, status: 'paid' },
  {
    id: '0004',
    item: 'Projeto estrutural',
    category: 'Projetos',
    amount: 15800,
    status: 'rejected',
  },
  { id: '0005', item: 'Fiscalização', category: 'Adm Obra', amount: 2100, status: 'paid' },
];

const columns: ColumnDef<Row, unknown>[] = [
  { accessorKey: 'id', header: '#' },
  { accessorKey: 'item', header: 'Item' },
  {
    accessorKey: 'category',
    header: 'Categoria',
    cell: ({ getValue }) => <Badge variant="info">{getValue<string>()}</Badge>,
  },
  {
    accessorKey: 'amount',
    header: 'Valor',
    cell: ({ getValue }) =>
      new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
        getValue<number>(),
      ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => {
      const v = getValue<Row['status']>();
      if (v === 'paid')
        return (
          <Badge variant="success" icon={CheckCircle}>
            Pago
          </Badge>
        );
      if (v === 'pending')
        return (
          <Badge variant="warning" icon={Clock}>
            Pendente
          </Badge>
        );
      return <Badge variant="danger">Rejeitado</Badge>;
    },
  },
];

const barData = [
  { month: 'Jan', receita: 42000, despesa: 31000 },
  { month: 'Fev', receita: 51000, despesa: 36000 },
  { month: 'Mar', receita: 48000, despesa: 34000 },
  { month: 'Abr', receita: 62000, despesa: 41000 },
  { month: 'Mai', receita: 58000, despesa: 39000 },
];

const lineData = [
  { week: 'S1', vendas: 120, meta: 100 },
  { week: 'S2', vendas: 145, meta: 120 },
  { week: 'S3', vendas: 132, meta: 130 },
  { week: 'S4', vendas: 168, meta: 140 },
];

const areaData = [
  { day: 'Seg', visitas: 420 },
  { day: 'Ter', visitas: 510 },
  { day: 'Qua', visitas: 480 },
  { day: 'Qui', visitas: 620 },
  { day: 'Sex', visitas: 720 },
];

const donutData = [
  { name: 'Materiais', value: 45 },
  { name: 'Mão de Obra', value: 25 },
  { name: 'Alugueis', value: 15 },
  { name: 'Outros', value: 15 },
];

export function DesignSystemPage() {
  const [pendentes, setPendentes] = useState(false);

  return (
    <div className="space-y-8">
      <SectionTitle
        title="Design System Showcase"
        subtitle="Smoke test for KPI cards, charts, tables and primitives — rendered with the default preset from the `design` skill."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard
          label="Receita"
          value="R$ 399k"
          subtitle="Abril 2026"
          icon={DollarSign}
          color="primary"
          trend={{ value: 10.4, direction: 'up' }}
        />
        <KpiCard
          label="Clientes"
          value="1.248"
          subtitle="+42 este mês"
          icon={Users}
          color="success"
          trend={{ value: 3.2, direction: 'up' }}
        />
        <KpiCard
          label="Atraso"
          value="R$ 12k"
          subtitle="5 faturas"
          icon={Clock}
          color="warning"
          trend={{ value: 1.1, direction: 'down' }}
        />
        <KpiCard
          label="Churn"
          value="2.4%"
          subtitle="Meta: 3%"
          icon={Activity}
          color="danger"
          trend={{ value: 0.6, direction: 'down' }}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <KpiCard label="Engajamento" value="68%" icon={TrendingUp} color="purple" size="small" />
        <KpiCard label="Sessões" value="12.4k" icon={BarChart3} color="cyan" size="small" />
        <StatusCard label="Uploads" percentage={72} color="primary" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="border-border bg-card shadow-card rounded-lg border p-5">
          <h3 className="text-foreground mb-4 text-sm font-semibold">Receita vs Despesa</h3>
          <BarChart
            data={barData}
            series={[
              { dataKey: 'receita', name: 'Receita' },
              { dataKey: 'despesa', name: 'Despesa' },
            ]}
            xAxisKey="month"
            height={240}
          />
        </div>
        <div className="border-border bg-card rounded-lg border p-5 shadow-[var(--shadow-card)]">
          <h3 className="text-foreground mb-4 text-sm font-semibold">Vendas vs Meta</h3>
          <LineChart
            data={lineData}
            series={[
              { dataKey: 'vendas', name: 'Vendas' },
              { dataKey: 'meta', name: 'Meta' },
            ]}
            xAxisKey="week"
            height={240}
          />
        </div>
        <div className="border-border bg-card rounded-lg border p-5 shadow-[var(--shadow-card)]">
          <h3 className="text-foreground mb-4 text-sm font-semibold">Visitas diárias</h3>
          <AreaChart
            data={areaData}
            series={[{ dataKey: 'visitas', name: 'Visitas' }]}
            xAxisKey="day"
            height={240}
          />
        </div>
        <div className="border-border bg-card rounded-lg border p-5 shadow-[var(--shadow-card)]">
          <h3 className="text-foreground mb-4 text-sm font-semibold">Distribuição de custos</h3>
          <DonutChart data={donutData} height={240} />
        </div>
      </div>

      <div className="space-y-3">
        <SectionTitle title="Lançamentos" subtitle="DataTable com TanStack Table" />
        <div className="flex flex-wrap items-center gap-2">
          <Input leadingIcon={Search} placeholder="Buscar..." className="max-w-xs" />
          <Toggle pressed={pendentes} onPressedChange={setPendentes}>
            <Clock className="size-3.5" /> Pendentes
          </Toggle>
        </div>
        <DataTable columns={columns} data={rows} />
      </div>

      <div className="border-border bg-card space-y-3 rounded-lg border p-5 shadow-[var(--shadow-card)]">
        <SectionTitle title="Badges & Progress" />
        <div className="flex flex-wrap gap-2">
          <Badge variant="default">Default</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="danger">Danger</Badge>
          <Badge variant="info">Info</Badge>
          <Badge variant="neutral">Neutral</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
        <Progress value={72} label="Orçamento consumido" showPercentage />
      </div>

      <div className="space-y-6">
        <SectionTitle title="Tabs" subtitle="Variantes line e default — full-width com scroll horizontal" />

        <div className="border-border bg-card rounded-lg border p-5 shadow-[var(--shadow-card)] space-y-2">
          <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">Variant: line (padrão)</p>
          <Tabs defaultValue="overview">
            <TabsList variant="line">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="reports">Relatórios</TabsTrigger>
              <TabsTrigger value="notifications">Notificações</TabsTrigger>
              <TabsTrigger value="settings">Configurações</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="pt-4">
              <p className="text-muted-foreground text-sm">Conteúdo da aba Visão Geral.</p>
            </TabsContent>
            <TabsContent value="analytics" className="pt-4">
              <p className="text-muted-foreground text-sm">Conteúdo da aba Analytics.</p>
            </TabsContent>
            <TabsContent value="reports" className="pt-4">
              <p className="text-muted-foreground text-sm">Conteúdo da aba Relatórios.</p>
            </TabsContent>
            <TabsContent value="notifications" className="pt-4">
              <p className="text-muted-foreground text-sm">Conteúdo da aba Notificações.</p>
            </TabsContent>
            <TabsContent value="settings" className="pt-4">
              <p className="text-muted-foreground text-sm">Conteúdo da aba Configurações.</p>
            </TabsContent>
          </Tabs>
        </div>

        <div className="border-border bg-card rounded-lg border p-5 shadow-[var(--shadow-card)] space-y-2">
          <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">Variant: default (pill/segment)</p>
          <Tabs defaultValue="overview">
            <TabsList variant="default">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="reports">Relatórios</TabsTrigger>
              <TabsTrigger value="notifications">Notificações</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="pt-4">
              <p className="text-muted-foreground text-sm">Conteúdo da aba Visão Geral.</p>
            </TabsContent>
            <TabsContent value="analytics" className="pt-4">
              <p className="text-muted-foreground text-sm">Conteúdo da aba Analytics.</p>
            </TabsContent>
            <TabsContent value="reports" className="pt-4">
              <p className="text-muted-foreground text-sm">Conteúdo da aba Relatórios.</p>
            </TabsContent>
            <TabsContent value="notifications" className="pt-4">
              <p className="text-muted-foreground text-sm">Conteúdo da aba Notificações.</p>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
