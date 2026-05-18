"use client";

import Link from "next/link";
import { BookOpen, CalendarDays, CheckCircle2, ChevronRight, FileText, Mic, RotateCcw, Volume2 } from "lucide-react";
import { starterLearningTasks } from "@/data/kristang";
import { useLocalStorageState } from "@/lib/hooks/use-local-storage-state";
import type { LearningTask } from "@/types/kambradu";

const trackMeta = {
  listen: { label: "Listen", icon: Volume2, action: "Open practice", href: "/practice" },
  review: { label: "Review", icon: BookOpen, action: "Review saved", href: "/saved" },
  journal: { label: "Journal", icon: FileText, action: "Write note", href: "/journal" },
  record: { label: "Record", icon: Mic, action: "Draft contribution", href: "/contribute" },
  culture: { label: "Culture", icon: CalendarDays, action: "Browse lessons", href: "/lessons" }
} satisfies Record<LearningTask["track"], { label: string; icon: typeof Volume2; action: string; href: string }>;

export function LearningPlan() {
  const [tasks, setTasks] = useLocalStorageState<LearningTask[]>("kambradu-learning-plan-v1", starterLearningTasks);
  const [reminderCadence, setReminderCadence] = useLocalStorageState("kambradu-reminder-cadence-v1", "Weekday mornings");
  const completedCount = tasks.filter((task) => task.completed).length;
  const totalMinutes = tasks.reduce((sum, task) => sum + task.minutes, 0);
  const completedMinutes = tasks.filter((task) => task.completed).reduce((sum, task) => sum + task.minutes, 0);
  const progress = Math.round((completedCount / tasks.length) * 100);

  function toggleTask(taskId: string) {
    setTasks((current) => current.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)));
  }

  function resetPlan() {
    setTasks(starterLearningTasks.map((task) => ({ ...task, completed: false })));
  }

  return (
    <section className="learning-workbench" aria-label="Learning support">
      <article className="learning-plan-panel">
        <div className="rail-title compact-title">
          <h2>Multi-track practice plan</h2>
          <CalendarDays size={18} aria-hidden="true" />
        </div>

        <div className="progress-strip">
          <span>
            <strong>{progress}%</strong>
            complete
          </span>
          <span>
            <strong>{completedMinutes}/{totalMinutes}</strong>
            minutes
          </span>
          <span>
            <strong>{completedCount}/{tasks.length}</strong>
            tracks
          </span>
        </div>

        <div className="task-list">
          {tasks.map((task) => {
            const meta = trackMeta[task.track];
            const Icon = meta.icon;

            return (
              <button
                aria-pressed={task.completed}
                className={`task-row ${task.completed ? "completed" : ""}`}
                key={task.id}
                onClick={() => toggleTask(task.id)}
                type="button"
              >
                <span className="task-icon">
                  <Icon size={23} aria-hidden="true" />
                </span>
                <span>
                  <strong>{task.title}</strong>
                  <small>
                    {meta.label} track · {task.minutes} min
                  </small>
                  <em>{task.detail}</em>
                  <span className="task-next">Next: {meta.action}</span>
                </span>
                <CheckCircle2 size={20} aria-hidden="true" />
              </button>
            );
          })}
        </div>

        <button className="secondary-action" type="button" onClick={resetPlan}>
          <RotateCcw size={17} aria-hidden="true" />
          Reset today
        </button>
      </article>

      <aside className="support-panel">
        <h2>Structure and support</h2>
        <p>
          The roadmap calls for a friendly support layer: calendar rhythm, reminders, and gentle suggestions that make
          learning easier when speakers and resources are far away.
        </p>

        <label>
          Reminder rhythm
          <select value={reminderCadence} onChange={(event) => setReminderCadence(event.target.value)}>
            <option>Weekday mornings</option>
            <option>Evening review</option>
            <option>Weekend recording sprint</option>
            <option>No reminders yet</option>
          </select>
        </label>

        <div className="support-checklist">
          <span>Audio before text</span>
          <span>Private notes first</span>
          <span>Consent before sharing</span>
          <span>Small daily loops</span>
        </div>

        <Link className="primary-action support-action" href="/practice" prefetch={false}>
          Open focused practice
          <ChevronRight size={17} aria-hidden="true" />
        </Link>
      </aside>
    </section>
  );
}
