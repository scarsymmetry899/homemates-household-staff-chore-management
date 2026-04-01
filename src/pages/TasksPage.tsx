import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle, Clock, Plus, X, Trash2, CalendarDays, Send, AlertTriangle, RotateCcw } from "lucide-react";
import { useAppState } from "@/context/AppContext";
import { PageTransition, StaggerContainer, StaggerItem, PressableCard, PullToRefresh, SwipeableCard } from "@/components/animations/MotionComponents";
import { toast } from "sonner";

type TaskFilter = "all" | "pending" | "done" | "bydate";

interface TaskItem {
  task: string;
  done: boolean;
  dueDate?: string;
  staffId: string;
  taskIndex: number;
  staffName: string;
  staffRole: string;
  staffPhoto: string;
}

const TasksPage = () => {
  const { staff, toggleTask, addTask, deleteTask, updateTaskDueDate } = useAppState();
  const [filter, setFilter] = useState<TaskFilter>("all");
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({
    staffId: "",
    task: "",
    dueDate: "",
    notifyTelegram: false,
  });

  const today = new Date().toISOString().split("T")[0];

  const allTasks: TaskItem[] = staff.flatMap((s) =>
    s.assignments.map((t, i) => ({
      ...t,
      staffId: s.id,
      taskIndex: i,
      staffName: s.name,
      staffRole: s.role,
      staffPhoto: s.photo,
    }))
  );

  const filtered: TaskItem[] =
    filter === "all" ? allTasks
    : filter === "done" ? allTasks.filter((t) => t.done)
    : filter === "pending" ? allTasks.filter((t) => !t.done)
    : allTasks; // bydate handled separately

  const doneCount = allTasks.filter((t) => t.done).length;
  const pendingCount = allTasks.length - doneCount;

  // By-date buckets (only pending tasks)
  const pendingTasks = allTasks.filter((t) => !t.done);
  const overdueTasks = pendingTasks.filter((t) => t.dueDate && t.dueDate < today);
  const todayTasks = pendingTasks.filter((t) => t.dueDate === today);
  const upcomingTasks = pendingTasks.filter((t) => t.dueDate && t.dueDate > today);
  const nodateTasks = pendingTasks.filter((t) => !t.dueDate);

  const handleToggle = (staffId: string, taskIndex: number, taskName: string, currentDone: boolean) => {
    toggleTask(staffId, taskIndex);
    if (!currentDone) toast.success("Task completed", { description: taskName });
  };

  const handleAddTask = async () => {
    if (!newTask.staffId || !newTask.task.trim()) return;

    const cleanTask = newTask.task.trim();
    const selectedMember = staff.find((s) => s.id === newTask.staffId);

    addTask(newTask.staffId, cleanTask, newTask.dueDate || undefined);
    toast.success("Task added", {
      description: newTask.dueDate
        ? `${cleanTask} · Due ${new Date(newTask.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`
        : cleanTask,
    });

    if (newTask.notifyTelegram && selectedMember) {
      if (selectedMember.telegramChatId) {
        const { sendMessage } = await import("@/lib/telegram");
        const dueStr = newTask.dueDate
          ? ` · Due: ${new Date(newTask.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`
          : "";
        const sent = await sendMessage(
          selectedMember.telegramChatId,
          `📋 <b>New Task Assigned</b>\n\nHi ${selectedMember.name.split(" ")[0]}! You have a new task:\n<b>${cleanTask}</b>${dueStr}\n\nPlease acknowledge when done. — Homemaker`
        );
        if (sent) {
          toast.success("Telegram notified", { description: `Message sent to ${selectedMember.name}` });
        } else {
          toast.warning("Telegram not reachable", {
            description: "Check your bot token in .env.local",
          });
        }
      } else {
        toast.info("No Telegram ID", {
          description: `Set ${selectedMember.name}'s Telegram Chat ID in their profile first.`,
        });
      }
    }

    setNewTask({ staffId: "", task: "", dueDate: "", notifyTelegram: false });
    setShowForm(false);
  };

  const handleRefresh = useCallback(async () => {
    await new Promise((r) => setTimeout(r, 800));
    toast.success("Tasks refreshed");
  }, []);

  const handleCarryForward = (task: TaskItem) => {
    updateTaskDueDate(task.staffId, task.taskIndex, today);
    toast.success("Task carried forward to today", { description: task.task });
  };

  const TaskCard = ({ task }: { task: TaskItem }) => (
    <SwipeableCard
      onSwipeRight={() => handleToggle(task.staffId, task.taskIndex, task.task, task.done)}
      onSwipeLeft={() => {
        deleteTask(task.staffId, task.taskIndex);
        toast.success("Task deleted", { description: task.task });
      }}
      rightLabel={task.done ? "Undo" : "Done"}
      leftLabel="Delete"
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
            {task.dueDate && (
              <div className="flex items-center gap-1.5 mt-1.5 text-xs text-muted-foreground">
                <CalendarDays size={12} />
                Due {new Date(task.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </div>
            )}
          </div>
          {!task.done && <Clock size={14} className="text-status-late shrink-0 mt-1" />}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              deleteTask(task.staffId, task.taskIndex);
              toast.success("Task deleted", { description: task.task });
            }}
            className="w-7 h-7 rounded-lg glass-btn flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors shrink-0 ml-1"
          >
            <Trash2 size={13} />
          </motion.button>
        </div>
      </PressableCard>
    </SwipeableCard>
  );

  const OverdueTaskCard = ({ task }: { task: TaskItem }) => (
    <div className="glass-card rounded-2xl p-4 flex items-start gap-3">
      <AlertTriangle size={18} className="text-status-late shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-sm font-medium text-card-foreground flex-1 truncate">{task.task}</p>
          <span className="label-sm text-status-late bg-status-late/10 px-2 py-0.5 rounded-lg shrink-0">Overdue</span>
        </div>
        <div className="flex items-center gap-2">
          <img src={task.staffPhoto} alt={task.staffName} className="w-4 h-4 rounded-md object-cover" loading="lazy" />
          <span className="text-xs text-muted-foreground">{task.staffName}</span>
          {task.dueDate && (
            <span className="text-xs text-destructive">· Due {new Date(task.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
          )}
        </div>
        <button
          onClick={() => handleCarryForward(task)}
          className="mt-2 flex items-center gap-1.5 label-sm text-secondary glass-btn px-3 py-1.5 rounded-xl"
        >
          <RotateCcw size={11} /> Carry Forward
        </button>
      </div>
    </div>
  );

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <PageTransition className="px-5 space-y-6">
        <section className="space-y-2">
          <p className="label-sm text-muted-foreground">Mission Control</p>
          <h1 className="display-sm text-foreground">
            Task
            <br />
            <span className="font-display italic text-secondary">Pipeline</span>
          </h1>
        </section>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-card rounded-2xl p-4">
            <p className="label-sm text-status-on-time">Shipped</p>
            <p className="font-display text-2xl text-card-foreground mt-1">{doneCount}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-2xl p-4">
            <p className="label-sm text-status-late">In Queue</p>
            <p className="font-display text-2xl text-card-foreground mt-1">{pendingCount}</p>
          </motion.div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 flex-wrap">
          {(["all", "pending", "done", "bydate"] as TaskFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`label-sm px-4 py-2.5 rounded-xl capitalize transition-all ${
                filter === f ? "btn-estate text-primary-foreground" : "glass-btn text-muted-foreground"
              }`}
            >
              {f === "bydate" ? "By Date" : f}
            </button>
          ))}
        </div>

        {/* Add Task */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(!showForm)}
          className="w-full glass-card text-card-foreground label-sm py-3.5 rounded-2xl flex items-center justify-center gap-2"
        >
          <Plus size={16} /> Queue a Task
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
                  <option value="">Assign to homemaker</option>
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

                <div className="space-y-2">
                  <label className="label-sm text-muted-foreground">Due date</label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="w-full bg-surface-low rounded-xl px-4 py-3 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50 border border-border/30"
                  />
                </div>

                <div className="glass-btn rounded-xl px-4 py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="label-sm text-foreground">Dispatch via Telegram</p>
                    <p className="text-xs text-muted-foreground">Auto-send after Telegram API is connected</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNewTask((prev) => ({ ...prev, notifyTelegram: !prev.notifyTelegram }))}
                    className={`w-11 h-6 rounded-full p-1 transition-colors ${newTask.notifyTelegram ? "bg-secondary" : "bg-surface-container"}`}
                  >
                    <span
                      className={`block h-4 w-4 rounded-full bg-background transition-transform ${newTask.notifyTelegram ? "translate-x-5" : "translate-x-0"}`}
                    />
                  </button>
                </div>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddTask}
                  className="w-full btn-estate text-primary-foreground label-sm py-3.5 rounded-xl inline-flex items-center justify-center gap-2"
                >
                  <Send size={14} /> Create & Assign Task
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* By Date View */}
        {filter === "bydate" ? (
          <div className="space-y-6 pb-4">
            {overdueTasks.length > 0 && (
              <section className="space-y-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={14} className="text-status-late" />
                  <h3 className="label-sm text-status-late">Overdue ({overdueTasks.length})</h3>
                </div>
                <div className="space-y-2">
                  {overdueTasks.map((task) => (
                    <OverdueTaskCard key={`${task.staffId}-${task.taskIndex}`} task={task} />
                  ))}
                </div>
              </section>
            )}

            {todayTasks.length > 0 && (
              <section className="space-y-3">
                <div className="flex items-center gap-2">
                  <CalendarDays size={14} className="text-secondary" />
                  <h3 className="label-sm text-secondary">Due Today ({todayTasks.length})</h3>
                </div>
                <StaggerContainer className="space-y-2">
                  {todayTasks.map((task) => (
                    <StaggerItem key={`${task.staffId}-${task.taskIndex}`}>
                      <TaskCard task={task} />
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </section>
            )}

            {upcomingTasks.length > 0 && (
              <section className="space-y-3">
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-status-on-time" />
                  <h3 className="label-sm text-status-on-time">Upcoming ({upcomingTasks.length})</h3>
                </div>
                <StaggerContainer className="space-y-2">
                  {upcomingTasks.map((task) => (
                    <StaggerItem key={`${task.staffId}-${task.taskIndex}`}>
                      <TaskCard task={task} />
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </section>
            )}

            {nodateTasks.length > 0 && (
              <section className="space-y-3">
                <div className="flex items-center gap-2">
                  <Circle size={14} className="text-muted-foreground" />
                  <h3 className="label-sm text-muted-foreground">No Due Date ({nodateTasks.length})</h3>
                </div>
                <StaggerContainer className="space-y-2">
                  {nodateTasks.map((task) => (
                    <StaggerItem key={`${task.staffId}-${task.taskIndex}`}>
                      <TaskCard task={task} />
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </section>
            )}

            {pendingTasks.length === 0 && (
              <div className="text-center py-10 text-muted-foreground">
                <CheckCircle2 size={32} className="mx-auto mb-3 text-status-on-time/50" />
                <p className="text-sm">All tasks completed!</p>
              </div>
            )}
          </div>
        ) : (
          /* Regular Task List */
          <StaggerContainer className="space-y-3 pb-4">
            {filtered.map((task) => (
              <StaggerItem key={`${task.staffId}-${task.taskIndex}-${task.task}-${task.dueDate || "na"}`}>
                <TaskCard task={task} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </PageTransition>
    </PullToRefresh>
  );
};

export default TasksPage;
