import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Fuel, ShoppingCart, Wrench, Banknote, Home as HomeIcon, TrendingUp, Camera, Check, Pencil } from "lucide-react";
import { useAppState, type Expense } from "@/context/AppContext";
import { PageTransition, StaggerContainer, StaggerItem, PressableCard, PullToRefresh, SwipeableCard } from "@/components/animations/MotionComponents";
import { toast } from "sonner";

const categoryConfig: Record<Expense["category"], { icon: typeof Fuel; color: string; bgColor: string }> = {
  Fuel: { icon: Fuel, color: "text-status-late", bgColor: "bg-status-late/10" },
  Groceries: { icon: ShoppingCart, color: "text-status-on-time", bgColor: "bg-status-on-time/10" },
  Repairs: { icon: Wrench, color: "text-secondary", bgColor: "bg-secondary/10" },
  Advances: { icon: Banknote, color: "text-status-leave", bgColor: "bg-status-leave/10" },
  Household: { icon: HomeIcon, color: "text-muted-foreground", bgColor: "bg-surface-container" },
};

const categoryList = Object.keys(categoryConfig) as Expense["category"][];

interface ScanItem {
  id: string;
  category: Expense["category"];
  amount: number;
  description: string;
  approved: boolean | null;
}

const ExpensesPage = () => {
  const { expenses, addExpense, editExpense, deleteExpense } = useAppState();
  const [showForm, setShowForm] = useState(false);
  const [newExpense, setNewExpense] = useState({ category: "Fuel" as Expense["category"], amount: "", description: "", staffName: "" });

  // Edit modal
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [editForm, setEditForm] = useState({ category: "Fuel" as Expense["category"], amount: "", description: "", staffName: "" });

  // Scan receipt
  const [showScanForm, setShowScanForm] = useState(false);
  const [scanFile, setScanFile] = useState<File | null>(null);
  const [scanPreviewUrl, setScanPreviewUrl] = useState("");
  const [scanParsing, setScanParsing] = useState(false);
  const [scanItems, setScanItems] = useState<ScanItem[]>([]);
  const scanInputRef = useRef<HTMLInputElement>(null);

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
    toast.success("Expense added");
  };

  const openEditModal = (expense: Expense) => {
    setEditingExpense(expense);
    setEditForm({
      category: expense.category,
      amount: String(expense.amount),
      description: expense.description,
      staffName: expense.staffName || "",
    });
  };

  const handleUpdate = () => {
    if (!editingExpense || !editForm.amount || !editForm.description) return;
    editExpense(editingExpense.id, {
      category: editForm.category,
      amount: Number(editForm.amount),
      description: editForm.description,
      staffName: editForm.staffName || undefined,
    });
    setEditingExpense(null);
    toast.success("Expense updated");
  };

  const handleScanFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setScanFile(file);
    setScanPreviewUrl(URL.createObjectURL(file));
    setScanItems([]);
  };

  const handleParseReceipt = async () => {
    if (!scanFile) return;
    setScanParsing(true);
    await new Promise((r) => setTimeout(r, 2200));

    const count = (scanFile.size % 3) + 2;
    const descriptions = ["Grocery items", "Fuel refill", "Household supplies", "Advance payment", "Repair materials"];
    const items: ScanItem[] = Array.from({ length: count }, (_, i) => {
      const charCode = scanFile.name.charCodeAt(i % scanFile.name.length);
      const rawAmount = 200 + (charCode * 17) % 2800;
      const amount = Math.round(rawAmount / 50) * 50;
      return {
        id: `scan-${Date.now()}-${i}`,
        category: categoryList[i % categoryList.length],
        amount,
        description: descriptions[i % descriptions.length],
        approved: null,
      };
    });

    setScanItems(items);
    setScanParsing(false);
  };

  const handleScanApprove = (id: string, approved: boolean) => {
    setScanItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, approved } : item))
    );
  };

  const handleAddApproved = () => {
    const approvedItems = scanItems.filter((item) => item.approved === true);
    if (approvedItems.length === 0) {
      toast.error("No approved items to add");
      return;
    }
    const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    approvedItems.forEach((item) => {
      addExpense({
        category: item.category,
        amount: item.amount,
        description: item.description,
        date: today,
      });
    });
    toast.success(`${approvedItems.length} expense${approvedItems.length > 1 ? "s" : ""} added from receipt`);
    setShowScanForm(false);
    setScanFile(null);
    setScanPreviewUrl("");
    setScanItems([]);
  };

  const handleRefresh = useCallback(async () => {
    await new Promise((r) => setTimeout(r, 800));
    toast.success("Expenses refreshed");
  }, []);

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <PageTransition className="px-5 space-y-6">
        <section className="space-y-2">
          <p className="label-sm text-muted-foreground">Treasury & Outflows</p>
          <h1 className="display-sm text-foreground">
            Expense
            <br />
            <span className="font-display italic text-secondary">Tracker</span>
          </h1>
        </section>

        {/* Total Burn Rate */}
        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="btn-estate rounded-2xl p-6 space-y-3"
        >
          <div className="flex items-center justify-between">
            <p className="label-sm text-primary-foreground/60">This Month</p>
            <TrendingUp size={16} className="text-primary-foreground/60" />
          </div>
          <p className="label-sm text-primary-foreground/50">Monthly Spending</p>
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
                <PressableCard className="glass-card rounded-2xl p-4">
                  <div className={`w-9 h-9 rounded-xl ${cfg.bgColor} flex items-center justify-center mb-2`}>
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

        {/* Action Buttons */}
        <div className="flex gap-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(!showForm)}
            className="flex-1 btn-estate text-primary-foreground label-sm py-3.5 rounded-2xl flex items-center justify-center gap-2"
          >
            <Plus size={16} /> Log an Expense
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowScanForm(!showScanForm)}
            className="glass-btn text-foreground label-sm px-4 py-3.5 rounded-2xl flex items-center gap-2"
          >
            <Camera size={16} /> Scan Receipt
          </motion.button>
        </div>

        {/* Add Expense Form */}
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
                  <h3 className="headline-sm text-card-foreground">New Expense</h3>
                  <button onClick={() => setShowForm(false)} className="glass-btn w-8 h-8 rounded-xl flex items-center justify-center">
                    <X size={16} className="text-muted-foreground" />
                  </button>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {categoryList.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setNewExpense({ ...newExpense, category: cat })}
                      className={`label-sm px-3 py-2 rounded-xl transition-all ${
                        newExpense.category === cat
                          ? "btn-estate text-primary-foreground"
                          : "glass-btn text-muted-foreground"
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
                  className="w-full bg-surface-low rounded-xl px-4 py-3 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50 border border-border/30"
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  className="w-full bg-surface-low rounded-xl px-4 py-3 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50 border border-border/30"
                />
                <input
                  type="text"
                  placeholder="Staff member (optional)"
                  value={newExpense.staffName}
                  onChange={(e) => setNewExpense({ ...newExpense, staffName: e.target.value })}
                  className="w-full bg-surface-low rounded-xl px-4 py-3 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50 border border-border/30"
                />
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAdd}
                  className="w-full btn-estate text-primary-foreground label-sm py-3.5 rounded-xl"
                >
                  Add Expense
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scan Receipt Form */}
        <AnimatePresence>
          {showScanForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="glass-card rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="headline-sm text-card-foreground">Scan Receipt</h3>
                  <button
                    onClick={() => {
                      setShowScanForm(false);
                      setScanFile(null);
                      setScanPreviewUrl("");
                      setScanItems([]);
                    }}
                    className="glass-btn w-8 h-8 rounded-xl flex items-center justify-center"
                  >
                    <X size={16} className="text-muted-foreground" />
                  </button>
                </div>

                {!scanFile ? (
                  <button
                    onClick={() => scanInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-border/40 rounded-2xl py-10 flex flex-col items-center gap-3 text-muted-foreground"
                  >
                    <Camera size={32} className="text-secondary/60" />
                    <span className="label-sm">Tap to upload receipt image</span>
                  </button>
                ) : (
                  <div className="space-y-4">
                    <img
                      src={scanPreviewUrl}
                      alt="Receipt preview"
                      className="w-full max-h-52 object-contain rounded-xl border border-border/20"
                    />
                    {scanItems.length === 0 && !scanParsing && (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={handleParseReceipt}
                        className="w-full btn-estate text-primary-foreground label-sm py-3 rounded-xl"
                      >
                        Parse Expenses
                      </motion.button>
                    )}
                    {scanParsing && (
                      <div className="flex items-center justify-center gap-3 py-4">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                          className="w-5 h-5 rounded-full border-2 border-secondary border-t-transparent"
                        />
                        <span className="text-sm text-muted-foreground">Parsing receipt...</span>
                      </div>
                    )}
                    {scanItems.length > 0 && (
                      <div className="space-y-3">
                        <p className="label-sm text-muted-foreground">Parsed Items</p>
                        {scanItems.map((item) => {
                          const cfg = categoryConfig[item.category];
                          const Icon = cfg.icon;
                          return (
                            <div key={item.id} className="glass-card rounded-xl p-3 flex items-center gap-3">
                              <div className={`w-9 h-9 rounded-xl ${cfg.bgColor} flex items-center justify-center shrink-0`}>
                                <Icon size={14} className={cfg.color} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-card-foreground">{item.description}</p>
                                <p className="text-xs text-muted-foreground">{item.category} · ₹{item.amount.toLocaleString("en-IN")}</p>
                              </div>
                              <div className="flex gap-1">
                                <button
                                  onClick={() => handleScanApprove(item.id, true)}
                                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                                    item.approved === true
                                      ? "bg-status-on-time text-white"
                                      : "glass-btn text-status-on-time"
                                  }`}
                                >
                                  <Check size={14} />
                                </button>
                                <button
                                  onClick={() => handleScanApprove(item.id, false)}
                                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                                    item.approved === false
                                      ? "bg-muted text-muted-foreground"
                                      : "glass-btn text-muted-foreground"
                                  }`}
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={handleAddApproved}
                          className="w-full btn-estate text-primary-foreground label-sm py-3 rounded-xl"
                        >
                          Add Approved to Expenses
                        </motion.button>
                      </div>
                    )}
                  </div>
                )}

                <input
                  ref={scanInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleScanFileChange}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Expense Modal */}
        <AnimatePresence>
          {editingExpense && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="glass-card rounded-2xl p-5 space-y-4 border border-secondary/20">
                <div className="flex items-center justify-between">
                  <h3 className="headline-sm text-card-foreground">Edit Expense</h3>
                  <button onClick={() => setEditingExpense(null)} className="glass-btn w-8 h-8 rounded-xl flex items-center justify-center">
                    <X size={16} className="text-muted-foreground" />
                  </button>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {categoryList.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setEditForm({ ...editForm, category: cat })}
                      className={`label-sm px-3 py-2 rounded-xl transition-all ${
                        editForm.category === cat
                          ? "btn-estate text-primary-foreground"
                          : "glass-btn text-muted-foreground"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  placeholder="Amount (₹)"
                  value={editForm.amount}
                  onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                  className="w-full bg-surface-low rounded-xl px-4 py-3 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50 border border-border/30"
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full bg-surface-low rounded-xl px-4 py-3 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50 border border-border/30"
                />
                <input
                  type="text"
                  placeholder="Staff member (optional)"
                  value={editForm.staffName}
                  onChange={(e) => setEditForm({ ...editForm, staffName: e.target.value })}
                  className="w-full bg-surface-low rounded-xl px-4 py-3 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50 border border-border/30"
                />
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleUpdate}
                  className="w-full btn-estate text-primary-foreground label-sm py-3.5 rounded-xl flex items-center justify-center gap-2"
                >
                  <Pencil size={14} /> Update Expense
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
                <SwipeableCard
                  leftLabel="Delete"
                  rightLabel="Edit"
                  onSwipeLeft={() => {
                    deleteExpense(expense.id);
                    toast.success("Expense deleted");
                  }}
                  onSwipeRight={() => openEditModal(expense)}
                >
                  <PressableCard className="glass-card rounded-2xl p-4 flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl ${cfg.bgColor} flex items-center justify-center shrink-0`}>
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
                </SwipeableCard>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </PageTransition>
    </PullToRefresh>
  );
};

export default ExpensesPage;
