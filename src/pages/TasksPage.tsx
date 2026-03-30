import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle, Clock, Plus, X, Trash2 } from "lucide-react";
import { useAppState } from "@/context/AppContext";
import { PageTransition, StaggerContainer, StaggerItem, PressableCard, PullToRefresh, SwipeableCard } from "@/components/animations/MotionComponents";
import { toast } from "sonner";

type TaskFilter = "all" | "pending" | "done";

const TasksPage = () => {
  const { staff, toggleTask, addTask, deleteTask } = useAppState();
  const [filter, setFilter] = useState<TaskFilter>("all");
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({ staffId: "", task: "" });

  const allTasks = staff.flatMap((s) =>
    s.assignments.map((t, i) => ({
      ...t,
      staffId: s.id,
      taskIndex: i,
      staffName: s.name,
      staffRole: s.role,
      staffPhoto: s.photo,
    }))
  );

  const filtered =
    filter === "all" ? allTasks
    : filter === "done" ? allTasks.filter((t) => t.done)
    : allTasks.filter((t) => !t.done);

  const doneCount = allTasks.filter((t) => t.done).length;
  const pendingCount = allTasks.length - doneCount;

  const handleToggle = (staffId: string, taskIndex: number, taskName: string, currentDone: boolean) => {
    toggleTask(staffId, taskIndex);
    if (!currentDone) toast.success("Task completed", { description: taskName });
  };

  const handleAddTask = () => {
    if (!newTask.staffId || !newTask.task.trim()) return;
    addTask(newTask.staffId, newTask.task.trim());
    toast.success("Task added", { description: newTask.task });
    setNewTask({ staffId: "", task: "" });
    setShowForm(false);
  };

  const handleRefresh = useCallback(async () => {
    await new Promise((r) => setTimeout(r, 800));
    toast.success("Tasks refreshed");
  }, []);

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <PageTransition className="px-5 space-y-6">
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
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-card rounded-2xl p-4">
            <p className="label-sm text-status-on-time">Completed</p>
            <p className="font-display text-2xl text-card-foreground mt-1">{doneCount}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-2xl p-4">
            <p className="label-sm text-status-late">Pending</p>
            <p className="font-display text-2xl text-card-foreground mt-1">{pendingCount}</p>
          </motion.div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          {(["all", "pending", "done"] as TaskFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`label-sm px-5 py-2.5 rounded-xl capitalize transition-all ${
                filter === f ? "btn-estate text-primary-foreground" : "glass-btn text-muted-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Add Task */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(!showForm)}
          className="w-full glass-card text-card-foreground label-sm py-3.5 rounded-2xl flex items-center justify-center gap-2"
        >
          <Plus size={16} /> Add Task
        </motion.button>

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="glass-card rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="headline-sm text-card-foreground">New Task</h3>
                  <button onClick={() => setShowForm(false)} className="glass-btn w-8 h-8 rounded-xl flex items-center justify-center">
                    <X size={16} className="text-muted-foreground" />
                  </button>
                </div>
                <select
                  value={newTask.staffId}
                  onChange={(e) => setNewTask({ ...newTask, staffId: e.target.value })}
                  className="w-full bg-surface-low rounded-xl px-4 py-3 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50 border border-border/30"
                >
                  <option value="">Assign to staff member</option>
                  {staff.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} — {s.role}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Task description"
                  value={newTask.task}
                  onChange={(e) => setNewTask({ ...newTask, task: e.target.value })}
                  className="w-full bg-surface-low rounded-xl px-4 py-3 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50 border border-border/30"
                />
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddTask}
                  className="w-full btn-estate text-primary-foreground label-sm py-3.5 rounded-xl"
                >
                  Create Task
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Task List */}
        <StaggerContainer className="space-y-3 pb-4">
          {filtered.map((task) => (
            <StaggerItem key={`${task.staffId}-${task.taskIndex}-${task.task}`}>
              <SwipeableCard
                onSwipeRight={() => handleToggle(task.staffId, task.taskIndex, task.task, task.done)}
                rightLabel={task.done ? "Undo" : "Done"}
                leftLabel="Reassign"
              >
                <PressableCard>
                  <div
                    onClick={() => handleToggle(task.staffId, task.taskIndex, task.task, task.done)}
                    className="glass-card rounded-2xl p-4 flex items-start gap-3 cursor-pointer select-none"
                  >
                    <motion.div animate={{ scale: task.done ? [1, 1.3, 1] : 1 }} transition={{ duration: 0.3 }}>
                      {task.done ? (
                        <CheckCircle2 size={20} className="text-status-on-time shrink-0 mt-0.5" />
                      ) : (
                        <Circle size={20} className="text-surface-container shrink-0 mt-0.5" />
                      )}
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium transition-all ${task.done ? "text-muted-foreground line-through" : "text-card-foreground"}`}>
                        {task.task}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <img src={task.staffPhoto} alt={task.staffName} className="w-5 h-5 rounded-lg object-cover" loading="lazy" />
                        <span className="text-xs text-muted-foreground">{task.staffName}</span>
                        <span className="text-xs text-muted-foreground">·</span>
                        <span className="text-xs text-muted-foreground">{task.staffRole}</span>
                      </div>
                    </div>
                    {!task.done && <Clock size={14} className="text-status-late shrink-0 mt-1" />}
                  </div>
                </PressableCard>
              </SwipeableCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </PageTransition>
    </PullToRefresh>
  );
};

export default TasksPage;
