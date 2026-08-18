import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Users, Building2, Building, MoveLeft } from "lucide-react";
import Layout from "../../components/it/ItLayout";
import StatusBadge from "../../components/it/StatusBadge";
import PageToolbar from "../../components/PageToolbar";
import PeriodButton from "../../components/PeriodButton";
import { SHELL } from "../../constants/shell";
import { ChartCard, SwitchableChart, withSliceColors } from "../../components/charts";
import {
  itKpis, itAlerts, entityTypeDistribution, adminsBarSeries, pendingTasks,
} from "../../data/mockIt";

const ICONS = { FileText, Users, Building2, Building };

const QUICK_ACTIONS = [
  { label: "إنشاء البيان جديد", to: "/it/forms/new" },
  { label: "إنشاء إدارة", to: "/it/admins/new" },
  { label: "إنشاء مستخدم جديد", to: "/it/users/new" },
];

function QuickActionsButton() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDoc = (e) => {
      if (!wrapRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  return (
    <div className="relative" ref={wrapRef}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex w-[224px] items-center justify-center gap-3 text-white text-[18px] font-semibold rounded-[12px] shadow-sm cursor-pointer"
        style={{ height: SHELL.navItemH, background: "linear-gradient(90deg, #003d96 0%, #052c65 100%)" }}
      >
        إجراءات سريعة
        <span
          className={`it-quick-chevron ${open ? "is-open" : ""}`}
          aria-hidden="true"
        />
      </button>
      {open && (
        <div
          role="menu"
          className="it-quick-menu absolute top-[calc(100%+8px)] right-0 z-20 w-[224px] rounded-[12px] bg-white shadow-lg border border-[#D8D8D8] overflow-hidden py-1"
        >
          {QUICK_ACTIONS.map((a) => (
            <button
              key={a.to}
              type="button"
              role="menuitem"
              className="w-full text-right px-4 py-2.5 text-[16px] text-[#052c65] hover:bg-[rgba(9,134,237,0.09)] cursor-pointer"
              onClick={() => {
                setOpen(false);
                navigate(a.to);
              }}
            >
              {a.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function shortAdminName(name) {
  return name.length > 22 ? `${name.slice(0, 20)}…` : name;
}

/** Admin names are long; wrap each tick onto up to two 13-char lines */
function WrappedTick({ x, y, payload }) {
  const words = String(payload.value).split(" ");
  const lines = [];
  for (const w of words) {
    const last = lines[lines.length - 1];
    if (last && `${last} ${w}`.length <= 13) lines[lines.length - 1] = `${last} ${w}`;
    else lines.push(w);
  }
  const shown = lines.slice(0, 3);
  if (lines.length > 3) shown[2] = `${shown[2]}…`;
  return (
    <text x={x} y={y + 10} textAnchor="middle" fill="rgba(0,0,0,0.7)" fontSize={10}>
      {shown.map((l, i) => (
        <tspan key={i} x={x} dy={i === 0 ? 0 : 11}>{l}</tspan>
      ))}
    </text>
  );
}

function KpiCard({ k }) {
  const Icon = ICONS[k.icon] || FileText;
  return (
    <div
      dir="rtl"
      className="it-kpi-card card-hover rounded-[20px] flex-1 min-w-0 h-[113px] shadow-sm flex flex-col items-start"
      style={{
        padding: "15.731px 19.663px",
        gap: "19.663px",
        background:
          "linear-gradient(180deg, rgba(5, 44, 101, 0) 0%, rgba(255, 255, 255, 0.08) 100%), #FFF",
      }}
    >
      <div className="flex w-full items-center gap-2 min-w-0">
        <div className="text-[16px] xl:text-[18px] font-semibold text-[#052c65] text-right min-w-0 flex-1 truncate">
          {k.label}
        </div>
        <div className="bg-[rgba(9,134,237,0.08)] h-[45px] w-[45px] rounded-full flex items-center justify-center shrink-0">
          <Icon size={26} className="text-[#0986ED]" />
        </div>
      </div>
      <div className="text-[25px] font-bold text-[#0986ed] text-right w-full -mt-[2px]">{k.value}</div>
    </div>
  );
}

function AlertsCard() {
  return (
    <div className="bg-white rounded-[20px] shadow-sm p-5 flex flex-col flex-1 min-w-0 min-h-[336px]">
      <h3 className="text-[20px] font-bold text-[#052c65] text-right mb-6">التنبيهات</h3>
      <div className="flex flex-col gap-6 flex-1">
        {itAlerts.map((a) => (
          <div key={a.text} className="bg-[rgba(52,152,219,0.13)] rounded-[10px] min-h-[66px] px-4 sm:px-5 py-3 flex flex-col justify-center gap-2 text-right">
            <p className="text-[#052c65] text-[16px] sm:text-[18px] font-semibold">
              <span className="text-[#3498db] text-[20px]">{a.count}</span> {a.text}
            </p>
            <p className="text-muted text-[14px]">{a.time}</p>
          </div>
        ))}
      </div>
      <button type="button" className="flex items-center gap-2 text-[#c89637] text-[14px] self-start cursor-pointer">
        <MoveLeft size={18} />
        عرض جميع التنبيهات
      </button>
    </div>
  );
}

function PendingTasksCard() {
  return (
    <div className="bg-white rounded-[20px] shadow-sm p-5 overflow-hidden flex-1 min-w-0 min-h-[336px]">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[20px] font-bold text-[#052c65]">الطلبات و المهام المعلقة</h3>
        <button type="button" className="text-[#0986ed] text-[16px] font-bold cursor-pointer">عرض كل</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="bg-[#f0f0f0] text-[#1f254b] text-[16px]">
              <th className="py-3 px-4 font-semibold rounded-tr-[17px] whitespace-nowrap">عنوان نموذج البيان</th>
              <th className="py-3 px-4 font-semibold whitespace-nowrap">نوع الطلب</th>
              <th className="py-3 px-4 font-semibold whitespace-nowrap">الحالة</th>
              <th className="py-3 px-4 font-semibold rounded-tl-[17px] whitespace-nowrap">تاريخ الإنشاء</th>
            </tr>
          </thead>
          <tbody>
            {pendingTasks.map((t) => (
              <tr key={t.id} className="border-b border-[rgba(18,36,67,0.1)] text-[17px] text-[#052c65]/60">
                <td className="py-4 px-4 whitespace-nowrap">{t.title}</td>
                <td className="py-4 px-4 whitespace-nowrap">{t.type}</td>
                <td className="py-4 px-4"><StatusBadge status={t.status} /></td>
                <td className="py-4 px-4 whitespace-nowrap font-semibold" dir="ltr">{t.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <Layout title="لوحة التحكم">
      <div className="p-8 space-y-[50px]">
        <PageToolbar>
          <QuickActionsButton />
          <PeriodButton />
        </PageToolbar>

        <div className="flex w-full max-w-[1535.5px] flex-nowrap items-center gap-[44px]" dir="ltr">
          {itKpis.map((k) => <KpiCard key={k.label} k={k} />)}
        </div>

        <div className="w-full max-w-[1535.5px] h-[345px] flex flex-row-reverse gap-[50px]">
          <ChartCard title="توزيع الجهات حسب النوع" defaultType="pie">
            {(type) => (
              <SwitchableChart
                type={type}
                categorical={entityTypeDistribution}
                pieSuffix=""
                donutSuffix=""
                hbarDomain={70}
              />
            )}
          </ChartCard>

          <ChartCard title="الإدارات العامة الأعلى فى طلب نماذج البيان" defaultType="bar">
            {(type) => (
              <SwitchableChart
                type={type}
                categorical={withSliceColors(adminsBarSeries)}
                pieSuffix=""
                donutSuffix=""
                xTick={WrappedTick}
                formatYName={shortAdminName}
              />
            )}
          </ChartCard>
        </div>

        <div className="w-full max-w-[1535.5px] flex flex-row-reverse gap-[50px]">
          <AlertsCard />
          <PendingTasksCard />
        </div>
      </div>
    </Layout>
  );
}
