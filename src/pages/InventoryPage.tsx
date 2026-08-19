import { useCallback, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Boxes, Home, PackagePlus, Pencil, Save, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { PageTransition, PullToRefresh, StaggerContainer, StaggerItem, PressableCard } from "@/components/animations/MotionComponents";
import { useAppState, type InventorySetupItem } from "@/context/AppContext";

const inputClass = "w-full rounded-xl border border-border/40 bg-surface-low px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring/30";

function isLowStock(item: InventorySetupItem) {
  return item.minimumQuantity !== undefined && item.currentQuantity <= item.minimumQuantity;
}

export default function InventoryPage() {
  const { inventoryItems, rooms, addInventoryItem, updateInventoryItem, deleteInventoryItem } = useAppState();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    category: "Groceries",
    unit: "unit",
    currentQuantity: "",
    minimumQuantity: "",
    roomId: "",
  });

  const lowStockItems = inventoryItems.filter(isLowStock);
  const categoryCount = new Set(inventoryItems.map((item) => item.category)).size;
  const roomNameById = useMemo(() => new Map(rooms.map((room) => [room.id, room.name])), [rooms]);

  const resetForm = () => {
    setForm({ name: "", category: "Groceries", unit: "unit", currentQuantity: "", minimumQuantity: "", roomId: "" });
    setEditingId(null);
  };

  const startEdit = (item: InventorySetupItem) => {
    setEditingId(item.id);
    setShowForm(true);
    setForm({
      name: item.name,
      category: item.category,
      unit: item.unit,
      currentQuantity: String(item.currentQuantity),
      minimumQuantity: item.minimumQuantity === undefined ? "" : String(item.minimumQuantity),
      roomId: item.roomId || "",
    });
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      toast.error("Item name is required");
      return;
    }

    const payload = {
      name: form.name.trim(),
      category: form.category.trim() || "Household",
      unit: form.unit.trim() || "unit",
      currentQuantity: Number(form.currentQuantity) || 0,
      minimumQuantity: form.minimumQuantity === "" ? undefined : Number(form.minimumQuantity) || 0,
      roomId: form.roomId || undefined,
    };

    if (editingId) {
      updateInventoryItem(editingId, payload);
      toast.success("Inventory item updated", { description: payload.name });
    } else {
      addInventoryItem(payload);
      toast.success("Inventory item added", { description: payload.name });
    }

    resetForm();
    setShowForm(false);
  };

  const handleDelete = (item: InventorySetupItem) => {
    deleteInventoryItem(item.id);
    toast.success("Inventory item removed", { description: item.name });
    if (editingId === item.id) {
      resetForm();
      setShowForm(false);
    }
  };

  const handleRefresh = useCallback(async () => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    toast.success("Inventory refreshed");
  }, []);

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <PageTransition className="px-5 space-y-6">
        <section className="space-y-2">
          <p className="label-sm text-muted-foreground">Supply Command</p>
          <h1 className="display-sm text-foreground">
            Inventory
            <br />
            <span className="font-display italic text-secondary">Ledger</span>
          </h1>
        </section>

        <div className="grid grid-cols-3 gap-3">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-4">
            <Boxes size={16} className="text-secondary mb-2" />
            <p className="label-sm text-muted-foreground">Items</p>
            <p className="font-display text-2xl text-card-foreground">{inventoryItems.length}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-card rounded-2xl p-4">
            <AlertTriangle size={16} className="text-status-late mb-2" />
            <p className="label-sm text-muted-foreground">Low</p>
            <p className="font-display text-2xl text-card-foreground">{lowStockItems.length}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-2xl p-4">
            <Home size={16} className="text-status-on-time mb-2" />
            <p className="label-sm text-muted-foreground">Groups</p>
            <p className="font-display text-2xl text-card-foreground">{categoryCount}</p>
          </motion.div>
        </div>

        {lowStockItems.length > 0 && (
          <section className="glass-card rounded-2xl p-4 space-y-3 border border-status-late/20">
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className="text-status-late" />
              <h2 className="headline-sm text-foreground">Needs Restock</h2>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {lowStockItems.map((item) => (
                <button key={item.id} type="button" onClick={() => startEdit(item)} className="shrink-0 rounded-2xl bg-status-late/10 px-4 py-3 text-left">
                  <p className="text-sm font-semibold text-card-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.currentQuantity} / min {item.minimumQuantity} {item.unit}
                  </p>
                </button>
              ))}
            </div>
          </section>
        )}

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            resetForm();
            setShowForm((value) => !value);
          }}
          className="w-full btn-estate text-primary-foreground label-sm py-3.5 rounded-2xl flex items-center justify-center gap-2"
        >
          {showForm && !editingId ? <X size={16} /> : <PackagePlus size={16} />}
          {showForm && !editingId ? "Close" : "Add Supply Item"}
        </motion.button>

        {showForm && (
          <section className="glass-card rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="headline-sm text-foreground">{editingId ? "Edit Supply" : "New Supply Item"}</h2>
              {editingId && (
                <button type="button" onClick={resetForm} className="glass-btn rounded-xl px-3 py-2 text-xs text-muted-foreground">
                  New item
                </button>
              )}
            </div>
            <input className={inputClass} value={form.name} onChange={(event) => setForm((value) => ({ ...value, name: event.target.value }))} placeholder="Item name, e.g. Tomatoes" />
            <div className="grid grid-cols-2 gap-3">
              <input className={inputClass} value={form.category} onChange={(event) => setForm((value) => ({ ...value, category: event.target.value }))} placeholder="Category" />
              <input className={inputClass} value={form.unit} onChange={(event) => setForm((value) => ({ ...value, unit: event.target.value }))} placeholder="Unit" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input className={inputClass} type="number" value={form.currentQuantity} onChange={(event) => setForm((value) => ({ ...value, currentQuantity: event.target.value }))} placeholder="Current qty" />
              <input className={inputClass} type="number" value={form.minimumQuantity} onChange={(event) => setForm((value) => ({ ...value, minimumQuantity: event.target.value }))} placeholder="Minimum qty" />
            </div>
            <select className={inputClass} value={form.roomId} onChange={(event) => setForm((value) => ({ ...value, roomId: event.target.value }))}>
              <option value="">No room assigned</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>{room.name}</option>
              ))}
            </select>
            <button type="button" onClick={handleSave} className="w-full btn-estate rounded-2xl py-3 text-primary-foreground label-sm flex items-center justify-center gap-2">
              <Save size={16} /> {editingId ? "Save Changes" : "Add Item"}
            </button>
          </section>
        )}

        <StaggerContainer className="space-y-3 pb-4">
          {inventoryItems.length === 0 ? (
            <div className="glass-card rounded-2xl p-6 text-center text-sm text-muted-foreground">
              No inventory yet. Add groceries, vegetables, cleaning supplies, pet items, fuel cards, or anything else the household tracks.
            </div>
          ) : (
            inventoryItems.map((item) => {
              const low = isLowStock(item);
              return (
                <StaggerItem key={item.id}>
                  <PressableCard className={`glass-card rounded-2xl p-4 space-y-3 ${low ? "border border-status-late/30" : ""}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-card-foreground truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.category}{item.roomId ? ` · ${roomNameById.get(item.roomId) || "Room"}` : ""}
                        </p>
                      </div>
                      <span className={`label-sm rounded-full px-2.5 py-1 ${low ? "bg-status-late/10 text-status-late" : "bg-status-on-time/10 text-status-on-time"}`}>
                        {low ? "Low stock" : "In stock"}
                      </span>
                    </div>
                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <p className="font-display text-2xl text-card-foreground">{item.currentQuantity}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.unit} available{item.minimumQuantity !== undefined ? ` · min ${item.minimumQuantity}` : ""}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button type="button" onClick={() => startEdit(item)} className="glass-btn rounded-xl w-9 h-9 flex items-center justify-center text-secondary">
                          <Pencil size={14} />
                        </button>
                        <button type="button" onClick={() => handleDelete(item)} className="glass-btn rounded-xl w-9 h-9 flex items-center justify-center text-destructive">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </PressableCard>
                </StaggerItem>
              );
            })
          )}
        </StaggerContainer>
      </PageTransition>
    </PullToRefresh>
  );
}
