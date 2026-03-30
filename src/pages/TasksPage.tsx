import { useState } from "react";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import { staffMembers } from "@/data/staff";

type TaskFilter = "all" | "pending" | "done";

const TasksPage = () => {
  const [filter, setFilter] = useState<TaskFilter>("all");

  const allTasks = staffMembers.flatMap((s) =>
    s.assignments.map((t) => ({ ...t, staffName: s.name, staffRole: s.role, staffPhoto: s.photo }))
  );

  const filtered =
    filter === "all"
      ? allTasks
      : filter === "done"
      ? allTasks.filter((t) => t.done)
      : allTasks.filter((t) => !t.done);

  const doneCount = allTasks.filter((t) => t.done).length;
  const pendingCount = allTasks.length - doneCount;

  return (
    <div className="px-6 space-y-6 animate-fade-in">
      <section className="space-y-2">
        <p className="label-sm text-muted-foreground">Operations & Workflow</p>
        <h1 className="display-sm text-foreground">
          Task
          <br />
          <span className="font-display italic text-secondary">Engine</span>
        </h1>
      </section>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-card rounded-xl p-4 shadow-card">
          <p className="label-sm text-status-on-time">Completed</p>
          <p className="font-display text-2xl text-card-foreground mt-1">{doneCount}</p>
        </div>
        <div className="bg-card rounded-xl p-4 shadow-card">
          <p className="label-sm text-status-late">Pending</p>
          <p className="font-display text-2xl text-card-foreground mt-1">{pendingCount}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(["all", "pending", "done"] as TaskFilter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`label-sm px-4 py-2 rounded-md capitalize transition-colors ${
              filter === f
                ? "estate-gradient text-primary-foreground"
                : "bg-surface-low text-muted-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-3 pb-4">
        {filtered.map((task, i) => (
          <div key={i} className="bg-card rounded-xl p-4 shadow-card flex items-start gap-3">
            {task.done ? (
              <CheckCircle2 size={20} className="text-status-on-time shrink-0 mt-0.5" />
            ) : (
              <Circle size={20} className="text-surface-container shrink-0 mt-0.5" />
            )}
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${task.done ? "text-muted-foreground line-through" : "text-card-foreground"}`}>
                {task.task}
              </p>
              <div className="flex items-center gap-2 mt-1.5">
                <img src={task.staffPhoto} alt={task.staffName} className="w-5 h-5 rounded-full object-cover" loading="lazy" />
                <span className="text-xs text-muted-foreground">{task.staffName}</span>
                <span className="text-xs text-muted-foreground">·</span>
                <span className="text-xs text-muted-foreground">{task.staffRole}</span>
              </div>
            </div>
            {!task.done && (
              <Clock size={14} className="text-status-late shrink-0 mt-1" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TasksPage;
