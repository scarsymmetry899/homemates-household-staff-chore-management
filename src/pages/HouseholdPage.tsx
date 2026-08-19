import { useCallback, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { DoorOpen, Home, Pencil, Plus, Save, Trash2, UserRound, X } from "lucide-react";
import { toast } from "sonner";
import { PageTransition, PullToRefresh, StaggerContainer, StaggerItem, PressableCard } from "@/components/animations/MotionComponents";
import { useAppState, type HomemateProfile, type RoomZoneProfile } from "@/context/AppContext";

const inputClass = "w-full rounded-xl border border-border/40 bg-surface-low px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring/30";

type HomemateForm = Omit<HomemateProfile, "id">;
type RoomForm = Omit<RoomZoneProfile, "id">;

const emptyHomemate: HomemateForm = {
  name: "",
  relationLabel: "",
  phone: "",
  notes: "",
};

const emptyRoom: RoomForm = {
  name: "",
  floorLabel: "",
  notes: "",
};

export default function HouseholdPage() {
  const {
    householdProfile,
    homemates,
    rooms,
    staff,
    inventoryItems,
    addHomemate,
    updateHomemate,
    deleteHomemate,
    addRoom,
    updateRoom,
    deleteRoom,
  } = useAppState();
  const [homemateFormOpen, setHomemateFormOpen] = useState(false);
  const [roomFormOpen, setRoomFormOpen] = useState(false);
  const [editingHomemateId, setEditingHomemateId] = useState<string | null>(null);
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [homemateForm, setHomemateForm] = useState<HomemateForm>(emptyHomemate);
  const [roomForm, setRoomForm] = useState<RoomForm>(emptyRoom);

  const inventoryCountByRoom = useMemo(() => {
    const counts = new Map<string, number>();
    inventoryItems.forEach((item) => {
      if (item.roomId) counts.set(item.roomId, (counts.get(item.roomId) || 0) + 1);
    });
    return counts;
  }, [inventoryItems]);

  const resetHomemateForm = () => {
    setHomemateForm(emptyHomemate);
    setEditingHomemateId(null);
  };

  const resetRoomForm = () => {
    setRoomForm(emptyRoom);
    setEditingRoomId(null);
  };

  const startHomemateEdit = (profile: HomemateProfile) => {
    setEditingHomemateId(profile.id);
    setHomemateFormOpen(true);
    setHomemateForm({
      name: profile.name,
      relationLabel: profile.relationLabel,
      phone: profile.phone || "",
      notes: profile.notes || "",
    });
  };

  const startRoomEdit = (room: RoomZoneProfile) => {
    setEditingRoomId(room.id);
    setRoomFormOpen(true);
    setRoomForm({
      name: room.name,
      floorLabel: room.floorLabel || "",
      notes: room.notes || "",
    });
  };

  const saveHomemate = () => {
    const payload: HomemateForm = {
      name: homemateForm.name.trim(),
      relationLabel: homemateForm.relationLabel.trim(),
      phone: homemateForm.phone?.trim() || undefined,
      notes: homemateForm.notes?.trim() || undefined,
    };
    if (!payload.name || !payload.relationLabel) {
      toast.error("Name and relation are required");
      return;
    }

    if (editingHomemateId) {
      updateHomemate(editingHomemateId, payload);
      toast.success("Homemate updated", { description: payload.name });
    } else {
      addHomemate(payload);
      toast.success("Homemate added", { description: payload.name });
    }
    resetHomemateForm();
    setHomemateFormOpen(false);
  };

  const saveRoom = () => {
    const payload: RoomForm = {
      name: roomForm.name.trim(),
      floorLabel: roomForm.floorLabel?.trim() || undefined,
      notes: roomForm.notes?.trim() || undefined,
    };
    if (!payload.name) {
      toast.error("Room name is required");
      return;
    }

    if (editingRoomId) {
      updateRoom(editingRoomId, payload);
      toast.success("Room updated", { description: payload.name });
    } else {
      addRoom(payload);
      toast.success("Room added", { description: payload.name });
    }
    resetRoomForm();
    setRoomFormOpen(false);
  };

  const handleDeleteRoom = (room: RoomZoneProfile) => {
    const linkedInventory = inventoryCountByRoom.get(room.id) || 0;
    if (linkedInventory > 0) {
      toast.error("Room still has linked inventory", {
        description: "Move or delete those supply items before removing this room.",
      });
      return;
    }
    deleteRoom(room.id);
    toast.success("Room removed", { description: room.name });
    if (editingRoomId === room.id) {
      resetRoomForm();
      setRoomFormOpen(false);
    }
  };

  const handleDeleteHomemate = (profile: HomemateProfile) => {
    deleteHomemate(profile.id);
    toast.success("Homemate removed", { description: profile.name });
    if (editingHomemateId === profile.id) {
      resetHomemateForm();
      setHomemateFormOpen(false);
    }
  };

  const handleRefresh = useCallback(async () => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    toast.success("Household refreshed");
  }, []);

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <PageTransition className="px-5 space-y-6">
        <section className="space-y-2">
          <p className="label-sm text-muted-foreground">Household Control</p>
          <h1 className="display-sm text-foreground">
            Setup
            <br />
            <span className="font-display italic text-secondary">Manager</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Keep the people and rooms behind your household dashboard synced after onboarding.
          </p>
        </section>

        <section className="glass-card rounded-3xl p-5 space-y-4">
          <div className="flex items-start gap-3">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Home size={20} className="text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="label-sm text-muted-foreground">Active Household</p>
              <h2 className="headline-sm text-card-foreground truncate">{householdProfile?.name || "My Household"}</h2>
              <p className="text-xs text-muted-foreground mt-1">
                {householdProfile?.addressLabel || "Address not set"} - {householdProfile?.timezone || "Asia/Kolkata"}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-surface-low p-3">
              <p className="label-sm text-muted-foreground">Homemates</p>
              <p className="font-display text-2xl text-card-foreground">{homemates.length}</p>
            </div>
            <div className="rounded-2xl bg-surface-low p-3">
              <p className="label-sm text-muted-foreground">Staff</p>
              <p className="font-display text-2xl text-card-foreground">{staff.length}</p>
            </div>
            <div className="rounded-2xl bg-surface-low p-3">
              <p className="label-sm text-muted-foreground">Rooms</p>
              <p className="font-display text-2xl text-card-foreground">{rooms.length}</p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="label-sm text-muted-foreground">Family Profiles</p>
              <h2 className="headline-sm text-foreground">Homemates</h2>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => {
                resetHomemateForm();
                setHomemateFormOpen((value) => !value);
              }}
              className="glass-btn rounded-2xl px-4 py-2 label-sm text-primary flex items-center gap-2"
            >
              {homemateFormOpen && !editingHomemateId ? <X size={14} /> : <Plus size={14} />}
              {homemateFormOpen && !editingHomemateId ? "Close" : "Add"}
            </motion.button>
          </div>

          {homemateFormOpen && (
            <div className="glass-card rounded-2xl p-5 space-y-3">
              <h3 className="headline-sm text-foreground">{editingHomemateId ? "Edit Homemate" : "New Homemate"}</h3>
              <input className={inputClass} value={homemateForm.name} onChange={(event) => setHomemateForm((value) => ({ ...value, name: event.target.value }))} placeholder="Name" />
              <input className={inputClass} value={homemateForm.relationLabel} onChange={(event) => setHomemateForm((value) => ({ ...value, relationLabel: event.target.value }))} placeholder="Relation, e.g. Owner, Parent, Child" />
              <input className={inputClass} value={homemateForm.phone || ""} onChange={(event) => setHomemateForm((value) => ({ ...value, phone: event.target.value }))} placeholder="Phone optional" />
              <textarea className={`${inputClass} min-h-20 resize-none`} value={homemateForm.notes || ""} onChange={(event) => setHomemateForm((value) => ({ ...value, notes: event.target.value }))} placeholder="Notes optional" />
              <button type="button" onClick={saveHomemate} className="w-full btn-estate rounded-2xl py-3 text-primary-foreground label-sm flex items-center justify-center gap-2">
                <Save size={16} /> {editingHomemateId ? "Save Changes" : "Add Homemate"}
              </button>
            </div>
          )}

          <StaggerContainer className="space-y-3">
            {homemates.length === 0 ? (
              <div className="glass-card rounded-2xl p-6 text-center text-sm text-muted-foreground">
                No homemates yet. Add owner, spouse, parents, children, or anyone who belongs to this household.
              </div>
            ) : (
              homemates.map((profile) => (
                <StaggerItem key={profile.id}>
                  <PressableCard className="glass-card rounded-2xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 rounded-2xl bg-secondary/10 flex items-center justify-center shrink-0">
                        <UserRound size={18} className="text-secondary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-card-foreground truncate">{profile.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{profile.relationLabel}{profile.phone ? ` - ${profile.phone}` : ""}</p>
                      </div>
                      <button type="button" onClick={() => startHomemateEdit(profile)} className="glass-btn rounded-xl w-9 h-9 flex items-center justify-center text-secondary">
                        <Pencil size={14} />
                      </button>
                      <button type="button" onClick={() => handleDeleteHomemate(profile)} className="glass-btn rounded-xl w-9 h-9 flex items-center justify-center text-destructive">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </PressableCard>
                </StaggerItem>
              ))
            )}
          </StaggerContainer>
        </section>

        <section className="space-y-3 pb-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="label-sm text-muted-foreground">Room-Wise Controls</p>
              <h2 className="headline-sm text-foreground">Rooms & Zones</h2>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => {
                resetRoomForm();
                setRoomFormOpen((value) => !value);
              }}
              className="glass-btn rounded-2xl px-4 py-2 label-sm text-primary flex items-center gap-2"
            >
              {roomFormOpen && !editingRoomId ? <X size={14} /> : <Plus size={14} />}
              {roomFormOpen && !editingRoomId ? "Close" : "Add"}
            </motion.button>
          </div>

          {roomFormOpen && (
            <div className="glass-card rounded-2xl p-5 space-y-3">
              <h3 className="headline-sm text-foreground">{editingRoomId ? "Edit Room" : "New Room"}</h3>
              <input className={inputClass} value={roomForm.name} onChange={(event) => setRoomForm((value) => ({ ...value, name: event.target.value }))} placeholder="Room or zone name" />
              <input className={inputClass} value={roomForm.floorLabel || ""} onChange={(event) => setRoomForm((value) => ({ ...value, floorLabel: event.target.value }))} placeholder="Floor optional" />
              <textarea className={`${inputClass} min-h-20 resize-none`} value={roomForm.notes || ""} onChange={(event) => setRoomForm((value) => ({ ...value, notes: event.target.value }))} placeholder="Notes optional, e.g. NFC tag near main door" />
              <button type="button" onClick={saveRoom} className="w-full btn-estate rounded-2xl py-3 text-primary-foreground label-sm flex items-center justify-center gap-2">
                <Save size={16} /> {editingRoomId ? "Save Changes" : "Add Room"}
              </button>
            </div>
          )}

          <StaggerContainer className="space-y-3">
            {rooms.length === 0 ? (
              <div className="glass-card rounded-2xl p-6 text-center text-sm text-muted-foreground">
                No rooms yet. Add kitchen, bathrooms, bedrooms, garden, garage, pet area, or other household zones.
              </div>
            ) : (
              rooms.map((room) => {
                const linkedInventory = inventoryCountByRoom.get(room.id) || 0;
                return (
                  <StaggerItem key={room.id}>
                    <PressableCard className="glass-card rounded-2xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-11 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                          <DoorOpen size={18} className="text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-card-foreground truncate">{room.name}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {room.floorLabel || "No floor set"} - {linkedInventory} linked supply item{linkedInventory === 1 ? "" : "s"}
                          </p>
                        </div>
                        <button type="button" onClick={() => startRoomEdit(room)} className="glass-btn rounded-xl w-9 h-9 flex items-center justify-center text-secondary">
                          <Pencil size={14} />
                        </button>
                        <button type="button" onClick={() => handleDeleteRoom(room)} className="glass-btn rounded-xl w-9 h-9 flex items-center justify-center text-destructive">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </PressableCard>
                  </StaggerItem>
                );
              })
            )}
          </StaggerContainer>
        </section>
      </PageTransition>
    </PullToRefresh>
  );
}
