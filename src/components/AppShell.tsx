import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { CalendarDays, LineChart, NotebookPen, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { useDiaryStore } from "@/stores/useDiaryStore";
import Button from "@/components/ui/Button";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const load = useDiaryStore((s) => s.load);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 via-zinc-50 to-amber-50/40 text-zinc-900">
      <div className="mx-auto max-w-6xl px-4 pb-10">
        <header className="sticky top-0 z-20 -mx-4 border-b border-zinc-200/70 bg-zinc-50/70 px-4 py-3 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white ring-1 ring-zinc-200">
                <NotebookPen className="h-5 w-5 text-zinc-900" />
              </div>
              <div>
                <div className="text-sm font-semibold leading-none">차분한 일기</div>
                <div className="text-xs text-zinc-500">기분을 기록하고 되돌아봐요</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <nav className="hidden items-center gap-1 rounded-2xl bg-white p-1 ring-1 ring-zinc-200 md:flex">
                <NavItem to="/" active={pathname === "/"} icon={<NotebookPen className="h-4 w-4" />} label="홈" />
                <NavItem to="/history" active={pathname.startsWith("/history")} icon={<CalendarDays className="h-4 w-4" />} label="히스토리" />
                <NavItem to="/trends" active={pathname.startsWith("/trends")} icon={<LineChart className="h-4 w-4" />} label="트렌드" />
              </nav>

              <Button onClick={() => navigate("/entries/new")}>
                <Plus className="h-4 w-4" />
                새 일기
              </Button>
            </div>
          </div>
        </header>

        <main className="pb-24 pt-6 md:pb-6">{children}</main>

        <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-zinc-200/70 bg-zinc-50/80 px-4 py-3 backdrop-blur md:hidden">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-2">
            <NavItem to="/" active={pathname === "/"} icon={<NotebookPen className="h-4 w-4" />} label="홈" />
            <NavItem to="/history" active={pathname.startsWith("/history")} icon={<CalendarDays className="h-4 w-4" />} label="히스토리" />
            <button
              type="button"
              onClick={() => navigate("/entries/new")}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-zinc-900 px-4 text-sm font-medium text-white"
            >
              <Plus className="h-4 w-4" />
              새 일기
            </button>
            <NavItem to="/trends" active={pathname.startsWith("/trends")} icon={<LineChart className="h-4 w-4" />} label="트렌드" />
          </div>
        </div>

        <footer className="mt-10 text-center text-xs text-zinc-500">
          로컬 저장(브라우저) 기반 데모 · 다른 기기와는 동기화되지 않아요
        </footer>
      </div>
    </div>
  );
}

function NavItem({
  to,
  active,
  icon,
  label,
}: {
  to: string;
  active: boolean;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <NavLink
      to={to}
      className={cn(
        "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition",
        active ? "bg-zinc-900 text-white" : "text-zinc-700 hover:bg-zinc-100",
      )}
    >
      {icon}
      {label}
    </NavLink>
  );
}
