import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Receipt, Fuel, ShoppingCart, Wrench, Banknote, Home as HomeIcon, TrendingUp } from "lucide-react";
import { useAppState, type Expense } from "@/context/AppContext";
import { PageTransition, StaggerContainer, StaggerItem, PressableCard } from "@/components/animations/MotionComponents";

const categoryConfig: Record<Expense["category"], { icon: typeof Fuel; color: string; bgColor: string }> = {
  Fuel: { icon: Fuel, color: "text-status-late", bgColor: "bg-status-late/10" },
  Groceries: { icon: ShoppingCart, color: "text-status-on-time", bgColor: "bg-status-on-time/10" },
  Repairs: { icon: Wrench, color: "text-secondary", bgColor: "bg-secondary/10" },
  Advances: { icon: Banknote, color: "text-status-leave", bgColor: "bg-status-leave/10" },
  Household: { icon: HomeIcon, color: "text-muted-foreground", bgColor: "bg-surface-container" },
};

const ExpensesPage = () => {
  const { expenses, addExpense } = useAppState();
  const [showForm, setShowForm] = useState(false);
  const [newExpense, setNewExpense] = useState({ category: "Fuel" as Expense["category"], amount: "", description: "", staffName: "" });

  const total = expenses.reduce((a, e) => a + e.amount, 0);
  const byCategory = expenses.reduce<Record<string, number>>((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});

  const handleAdd = () => {
    if (!newExpense.amount || !newExpense.description) return;
    addExpense({
      category: newExpense.category,
      amount: Number(newExpense.amount),
      description: newExpense.description,
      staffName: newExpense.staffName || undefined,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    });
    setNewExpense({ category: "Fuel", amount: "", description: "", staffName: "" });
    setShowForm(false);
  };

  return (
    <PageTransition className="px-6 space-y-6">
      <section className="space-y-2">
        <p className="label-sm text-muted-foreground">Financial Tracking</p>
        <h1 className="display-sm text-foreground">
          Expense
          <br />
          <span className="font-display italic text-secondary">Ledger</span>
        </h1>
      </section>

      {/* Total Burn Rate */}
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="estate-gradient rounded-xl p-6 space-y-3"
      >
        <div className="flex items-center justify-between">
          <p className="label-sm text-primary-foreground/60">October 2023</p>
          <TrendingUp size={16} className="text-primary-foreground/60" />
        </div>
        <p className="label-sm text-primary-foreground/50">Monthly Burn Rate</p>
        <p className="font-display text-3xl text-primary-foreground">
          ₹{total.toLocaleString("en-IN")}
        </p>
      </motion.section>

      {/* Category Breakdown */}
      <StaggerContainer className="grid grid-cols-2 gap-3">
        {Object.entries(byCategory).map(([cat, amount]) => {
          const cfg = categoryConfig[cat as Expense["category"]];
          const Icon = cfg.icon;
          return (
            <StaggerItem key={cat}>
              <PressableCard className="bg-card rounded-xl p-4 shadow-card">
                <div className={`w-8 h-8 rounded-lg ${cfg.bgColor} flex items-center justify-center mb-2`}>
                  <Icon size={16} className={cfg.color} />
                </div>
                <p className="label-sm text-muted-foreground">{cat}</p>
                <p className="font-display text-lg text-card-foreground mt-0.5">
                  ₹{amount.toLocaleString("en-IN")}
                </p>
              </PressableCard>
            </StaggerItem>
          );
        })}
      </StaggerContainer>

      {/* Add Expense Button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowForm(!showForm)}
        className="w-full estate-gradient text-primary-foreground label-sm py-3 rounded-xl flex items-center justify-center gap-2"
      >
        <Plus size={16} /> Add Expense
      </motion.button>

      {/* Add Expense Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-card rounded-xl p-5 shadow-card space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="headline-sm text-card-foreground">New Expense</h3>
                <button onClick={() => setShowForm(false)}>
                  <X size={18} className="text-muted-foreground" />
                </button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {(Object.keys(categoryConfig) as Expense["category"][]).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setNewExpense({ ...newExpense, category: cat })}
                    className={`label-sm px-3 py-1.5 rounded-md transition-colors ${
                      newExpense.category === cat
                        ? "estate-gradient text-primary-foreground"
                        : "bg-surface-low text-muted-foreground"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <input
                type="number"
                placeholder="Amount (₹)"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                className="w-full bg-surface-high rounded-lg px-4 py-3 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              <input
                type="text"
                placeholder="Description"
                value={newExpense.description}
                onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                className="w-full bg-surface-high rounded-lg px-4 py-3 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              <input
                type="text"
                placeholder="Staff member (optional)"
                value={newExpense.staffName}
                onChange={(e) => setNewExpense({ ...newExpense, staffName: e.target.value })}
                className="w-full bg-surface-high rounded-lg px-4 py-3 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleAdd}
                className="w-full estate-gradient text-primary-foreground label-sm py-3 rounded-lg"
              >
                Add Expense
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expense List */}
      <StaggerContainer className="space-y-3 pb-4">
        {expenses.map((expense) => {
          const cfg = categoryConfig[expense.category];
          const Icon = cfg.icon;
          return (
            <StaggerItem key={expense.id}>
              <PressableCard className="bg-card rounded-xl p-4 shadow-card flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg ${cfg.bgColor} flex items-center justify-center shrink-0`}>
                  <Icon size={18} className={cfg.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-card-foreground truncate">{expense.description}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="label-sm text-muted-foreground">{expense.category}</span>
                    {expense.staffName && (
                      <>
                        <span className="text-muted-foreground">·</span>
                        <span className="text-xs text-muted-foreground">{expense.staffName}</span>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{expense.date}</p>
                </div>
                <p className="font-display text-base text-card-foreground shrink-0">
                  ₹{expense.amount.toLocaleString("en-IN")}
                </p>
              </PressableCard>
            </StaggerItem>
          );
        })}
      </StaggerContainer>
    </PageTransition>
  );
};

export default ExpensesPage;
