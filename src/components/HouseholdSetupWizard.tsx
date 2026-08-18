import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, Home, Package, UserRound, UsersRound } from "lucide-react";
import { toast } from "sonner";
import { departments, type Department, type StaffMember } from "@/data/staff";
import { useAppState, type HomemateProfile, type HouseholdSetupPayload, type InventorySetupItem, type RoomZoneProfile } from "@/context/AppContext";

const steps = ["Household", "Housemates", "Rooms", "Staff", "Inventory", "Review"];

const responsibilityPresets = [
  { label: "Cooking", roleHint: "Cook", tasks: ["Prepare breakfast", "Prepare lunch", "Prepare dinner", "Plan grocery list"] },
  { label: "Kitchen prep", roleHint: "Kitchen Helper", tasks: ["Chop vegetables", "Prep ingredients", "Clean kitchen counters", "Store leftovers"] },
  { label: "Dishwashing", roleHint: "Dishwashing Help", tasks: ["Wash utensils", "Load/unload dishwasher", "Sanitize bottles", "Dry and store dishes"] },
  { label: "House cleaning", roleHint: "Cleaner", tasks: ["Sweep and mop floors", "Dust living areas", "Clean bathrooms", "Take out trash"] },
  { label: "Deep cleaning", roleHint: "Housekeeper", tasks: ["Clean windows", "Deep clean kitchen", "Deep clean bathrooms", "Organize storage areas"] },
  { label: "Maid/servant support", roleHint: "Household Help", tasks: ["Make beds", "Serve meals", "Refill water bottles", "General household errands"] },
  { label: "Laundry", roleHint: "Laundry Help", tasks: ["Wash clothes", "Dry clothes", "Iron uniforms", "Fold and store laundry"] },
  { label: "Driving", roleHint: "Chauffeur", tasks: ["Morning drop-off", "Vehicle cleaning", "Fuel check", "Evening pickup"] },
  { label: "Vehicle care", roleHint: "Driver", tasks: ["Check tyre pressure", "Schedule servicing", "Log fuel purchase", "Clean vehicle interior"] },
  { label: "Errands", roleHint: "Runner", tasks: ["Pick up parcels", "Visit pharmacy", "Coordinate deliveries", "Bank or document errand"] },
  { label: "Groceries", roleHint: "Grocery Runner", tasks: ["Buy vegetables", "Buy pantry items", "Upload grocery bill", "Update kitchen inventory"] },
  { label: "Babysitting", roleHint: "Babysitter", tasks: ["Baby feeding", "Nap-time care", "School pickup support", "Playtime supervision"] },
  { label: "Nanny care", roleHint: "Nanny", tasks: ["Prepare baby bag", "Sterilize baby items", "Track baby meals", "Track diaper changes"] },
  { label: "Tutoring", roleHint: "Tutor", tasks: ["Homework support", "Reading practice", "Activity planning", "Progress note for owner"] },
  { label: "Elder care", roleHint: "Caregiver", tasks: ["Medicine reminder", "Meal assistance", "Walk support", "Vitals note"] },
  { label: "Nursing", roleHint: "Nurse", tasks: ["Medicine administration", "Blood pressure check", "Doctor visit support", "Care report"] },
  { label: "Pet care", roleHint: "Pet Caretaker", tasks: ["Feed pets", "Refill pet water", "Clean pet area", "Track pet supplies"] },
  { label: "Dog walking", roleHint: "Dog Walker", tasks: ["Morning dog walk", "Evening dog walk", "Clean paws", "Log pet activity"] },
  { label: "Pet grooming", roleHint: "Pet Groomer", tasks: ["Brush coat", "Schedule grooming", "Clean litter area", "Check pet medication"] },
  { label: "Gardening", roleHint: "Gardener", tasks: ["Water plants", "Trim hedges", "Lawn care", "Check garden supplies"] },
  { label: "Plant care", roleHint: "Plant Caretaker", tasks: ["Mist indoor plants", "Add fertilizer", "Prune dead leaves", "Track plant health"] },
  { label: "Pool care", roleHint: "Pool Caretaker", tasks: ["Check pool filter", "Clean pool surface", "Log chlorine level", "Report maintenance issue"] },
  { label: "Security", roleHint: "Security Guard", tasks: ["Gate check-in", "Visitor log", "Night patrol", "Report suspicious activity"] },
  { label: "House manager", roleHint: "House Manager", tasks: ["Coordinate staff", "Review daily tasks", "Approve supply list", "Send daily summary"] },
  { label: "Maintenance", roleHint: "Handyman", tasks: ["Fix minor repairs", "Inspect fixtures", "Coordinate technician", "Log maintenance issue"] },
  { label: "Electrical", roleHint: "Electrician", tasks: ["Check electrical points", "Replace bulbs", "Report wiring issue", "Coordinate appliance repair"] },
  { label: "Plumbing", roleHint: "Plumber", tasks: ["Check leaks", "Clean drains", "Inspect bathroom fittings", "Report water issue"] },
  { label: "Waste management", roleHint: "Waste Helper", tasks: ["Segregate waste", "Move bins out", "Clean dustbins", "Track pickup"] },
  { label: "Vendor coordination", roleHint: "Vendor Coordinator", tasks: ["Milk delivery check", "Water can delivery check", "Newspaper delivery check", "Package handoff"] },
];

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function emptyStaff(): StaffMember {
  const salary = 0;
  return {
    id: makeId("staff"),
    name: "",
    role: "",
    department: "Other",
    photo: "/placeholder.svg",
    phone: "",
    salary,
    status: "off-duty",
    reliabilityScore: 100,
    punctualityScore: 100,
    tenure: "New profile",
    location: "Not set",
    skills: [],
    shiftStart: "09:00 AM",
    shiftEnd: "06:00 PM",
    assignments: [],
    attendance: [],
    payroll: {
      baseSalary: salary,
      deductions: 0,
      netPay: salary,
      month: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    },
  };
}

const inputClass = "w-full rounded-2xl border border-border/40 bg-surface-low px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring/30";

export default function HouseholdSetupWizard() {
  const { ownerName, completeHouseholdSetup, enableDemoMode } = useAppState();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [householdName, setHouseholdName] = useState("My Household");
  const [setupOwnerName, setSetupOwnerName] = useState(ownerName === "Boss" ? "" : ownerName);
  const [ownerPhone, setOwnerPhone] = useState("");
  const [addressLabel, setAddressLabel] = useState("");
  const [deductionPolicy, setDeductionPolicy] = useState("Late/absence deductions reviewed by owner before payroll finalization.");
  const [homemates, setHomemates] = useState<HomemateProfile[]>([
    { id: makeId("mate"), name: "", relationLabel: "", phone: "", notes: "" },
  ]);
  const [rooms, setRooms] = useState<RoomZoneProfile[]>([
    { id: makeId("room"), name: "Kitchen", floorLabel: "Ground floor", notes: "" },
    { id: makeId("room"), name: "Living Room", floorLabel: "Ground floor", notes: "" },
  ]);
  const [staff, setStaff] = useState<StaffMember[]>([emptyStaff()]);
  const [inventoryItems, setInventoryItems] = useState<InventorySetupItem[]>([
    { id: makeId("item"), name: "Rice", category: "Groceries", unit: "kg", currentQuantity: 0, minimumQuantity: 5 },
    { id: makeId("item"), name: "Cleaning liquid", category: "Household", unit: "bottle", currentQuantity: 0, minimumQuantity: 2 },
  ]);

  const timezone = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Kolkata", []);

  const updateStaff = (id: string, updates: Partial<StaffMember>) => {
    setStaff((prev) =>
      prev.map((member) => {
        if (member.id !== id) return member;
        const salary = updates.salary ?? member.salary;
        return {
          ...member,
          ...updates,
          payroll: {
            ...member.payroll,
            baseSalary: salary,
            netPay: salary - member.payroll.deductions,
          },
        };
      })
    );
  };

  const toggleResponsibility = (staffId: string, label: string) => {
    const preset = responsibilityPresets.find((item) => item.label === label);
    setStaff((prev) =>
      prev.map((member) => {
        if (member.id !== staffId) return member;
        const hasSkill = member.skills.includes(label);
        const skills = hasSkill ? member.skills.filter((skill) => skill !== label) : [...member.skills, label];
        const presetTasks = preset?.tasks || [];
        const assignments = hasSkill
          ? member.assignments.filter((assignment) => !presetTasks.includes(assignment.task))
          : [
              ...member.assignments,
              ...presetTasks
                .filter((task) => !member.assignments.some((assignment) => assignment.task === task))
                .map((task) => ({ id: makeId("task"), task, done: false })),
            ];
        const roleParts = skills.map((skill) => responsibilityPresets.find((item) => item.label === skill)?.roleHint || skill);
        return {
          ...member,
          skills,
          assignments,
          role: member.role.trim() && !responsibilityPresets.some((item) => item.roleHint === member.role)
            ? member.role
            : roleParts.join(" + "),
        };
      })
    );
  };

  const toggleTask = (staffId: string, task: string) => {
    setStaff((prev) =>
      prev.map((member) => {
        if (member.id !== staffId) return member;
        const exists = member.assignments.some((assignment) => assignment.task === task);
        return {
          ...member,
          assignments: exists
            ? member.assignments.filter((assignment) => assignment.task !== task)
            : [...member.assignments, { id: makeId("task"), task, done: false }],
        };
      })
    );
  };

  const addCustomResponsibility = (staffId: string, label: string) => {
    setStaff((prev) =>
      prev.map((member) => {
        if (member.id !== staffId || member.skills.includes(label)) return member;
        const skills = [...member.skills, label];
        return {
          ...member,
          skills,
          role: member.role.trim() ? member.role : skills.join(" + "),
        };
      })
    );
  };

  const canContinue = () => {
    if (step === 0) return householdName.trim() && setupOwnerName.trim();
    if (step === 2) return rooms.some((room) => room.name.trim());
    if (step === 3) return staff.every((member) => member.name.trim() && member.role.trim() && member.skills.length > 0);
    return true;
  };

  const handleFinish = async () => {
    if (!householdName.trim() || !setupOwnerName.trim()) {
      toast.error("Household name and owner name are required.");
      return;
    }

    const payload: HouseholdSetupPayload = {
      householdName: householdName.trim(),
      ownerName: setupOwnerName.trim(),
      ownerPhone: ownerPhone.trim() || undefined,
      addressLabel: addressLabel.trim() || undefined,
      timezone,
      homemates: homemates.filter((mate) => mate.name.trim()).map((mate) => ({ ...mate, name: mate.name.trim() })),
      rooms: rooms.filter((room) => room.name.trim()).map((room) => ({ ...room, name: room.name.trim() })),
      staff: staff
        .filter((member) => member.name.trim() && member.role.trim())
        .map((member) => ({
          ...member,
          name: member.name.trim(),
          role: member.role.trim(),
          phone: member.phone.trim(),
          salary: Number(member.salary) || 0,
          payroll: {
            ...member.payroll,
            baseSalary: Number(member.salary) || 0,
            netPay: Number(member.salary) || 0,
          },
        })),
      inventoryItems: inventoryItems
        .filter((item) => item.name.trim())
        .map((item) => ({
          ...item,
          name: item.name.trim(),
          currentQuantity: Number(item.currentQuantity) || 0,
          minimumQuantity: item.minimumQuantity === undefined ? undefined : Number(item.minimumQuantity) || 0,
        })),
      payroll: { deductionPolicy: deductionPolicy.trim() || undefined },
    };

    setSaving(true);
    try {
      await completeHouseholdSetup(payload);
      localStorage.setItem("homemaker_onboarding_done", "true");
      toast.success("Household setup complete", { description: "Your fresh workspace is ready." });
    } catch (error) {
      toast.error("Setup could not be saved", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 py-6 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl glass-card rounded-[2rem] p-5 md:p-8 shadow-card"
      >
        <div className="flex items-start gap-4 mb-6">
          <div className="h-12 w-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center">
            <Home size={20} />
          </div>
          <div className="flex-1">
            <p className="label-sm text-muted-foreground">Fresh setup</p>
            <h1 className="display-sm text-foreground">Build your real household</h1>
            <p className="text-sm text-muted-foreground mt-1">
              No demo data. Add only the people, rooms, payroll and supplies you want to track.
            </p>
            <button
              type="button"
              onClick={() => {
                enableDemoMode();
                toast.success("Demo data enabled", { description: "Sample household loaded for testing." });
              }}
              className="mt-3 glass-btn rounded-2xl px-4 py-2 text-xs font-semibold text-primary"
            >
              Use demo data instead
            </button>
          </div>
        </div>

        <div className="grid grid-cols-6 gap-2 mb-6">
          {steps.map((label, index) => (
            <button
              key={label}
              type="button"
              onClick={() => setStep(index)}
              className={`rounded-full px-2 py-2 text-[11px] font-semibold transition ${
                index === step ? "bg-primary text-primary-foreground" : index < step ? "bg-secondary/15 text-secondary" : "bg-muted text-muted-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="min-h-[360px]">
          {step === 0 && (
            <section className="grid md:grid-cols-2 gap-4">
              <Field label="Household name">
                <input className={inputClass} value={householdName} onChange={(e) => setHouseholdName(e.target.value)} placeholder="e.g. Mehra Residence" />
              </Field>
              <Field label="Owner name">
                <input className={inputClass} value={setupOwnerName} onChange={(e) => setSetupOwnerName(e.target.value)} placeholder="Your name" />
              </Field>
              <Field label="Owner phone">
                <input className={inputClass} value={ownerPhone} onChange={(e) => setOwnerPhone(e.target.value)} placeholder="+91..." />
              </Field>
              <Field label="Address label">
                <input className={inputClass} value={addressLabel} onChange={(e) => setAddressLabel(e.target.value)} placeholder="Hyderabad home, farmhouse..." />
              </Field>
              <Field label="Timezone">
                <input className={inputClass} value={timezone} readOnly />
              </Field>
            </section>
          )}

          {step === 1 && (
            <RepeatingSection
              title="Housemates"
              description="Add family members or residents whose household routines matter."
              icon={<UsersRound size={18} />}
              onAdd={() => setHomemates((prev) => [...prev, { id: makeId("mate"), name: "", relationLabel: "", phone: "", notes: "" }])}
            >
              {homemates.map((mate) => (
                <div key={mate.id} className="grid md:grid-cols-4 gap-3">
                  <input className={inputClass} value={mate.name} onChange={(e) => setHomemates((prev) => prev.map((m) => m.id === mate.id ? { ...m, name: e.target.value } : m))} placeholder="Name" />
                  <input className={inputClass} value={mate.relationLabel} onChange={(e) => setHomemates((prev) => prev.map((m) => m.id === mate.id ? { ...m, relationLabel: e.target.value } : m))} placeholder="Relation" />
                  <input className={inputClass} value={mate.phone || ""} onChange={(e) => setHomemates((prev) => prev.map((m) => m.id === mate.id ? { ...m, phone: e.target.value } : m))} placeholder="Phone" />
                  <button className="glass-btn rounded-2xl text-sm" onClick={() => setHomemates((prev) => prev.filter((m) => m.id !== mate.id))}>Remove</button>
                </div>
              ))}
            </RepeatingSection>
          )}

          {step === 2 && (
            <RepeatingSection title="Rooms and zones" description="These become the basis for room-wise NFC tags later." icon={<Home size={18} />} onAdd={() => setRooms((prev) => [...prev, { id: makeId("room"), name: "", floorLabel: "", notes: "" }])}>
              {rooms.map((room) => (
                <div key={room.id} className="grid md:grid-cols-4 gap-3">
                  <input className={inputClass} value={room.name} onChange={(e) => setRooms((prev) => prev.map((r) => r.id === room.id ? { ...r, name: e.target.value } : r))} placeholder="Room / zone" />
                  <input className={inputClass} value={room.floorLabel || ""} onChange={(e) => setRooms((prev) => prev.map((r) => r.id === room.id ? { ...r, floorLabel: e.target.value } : r))} placeholder="Floor" />
                  <input className={inputClass} value={room.notes || ""} onChange={(e) => setRooms((prev) => prev.map((r) => r.id === room.id ? { ...r, notes: e.target.value } : r))} placeholder="Notes" />
                  <button className="glass-btn rounded-2xl text-sm" onClick={() => setRooms((prev) => prev.filter((r) => r.id !== room.id))}>Remove</button>
                </div>
              ))}
            </RepeatingSection>
          )}

          {step === 3 && (
            <RepeatingSection title="Staff and payroll" description="Add staff with their shifts and monthly salary." icon={<UserRound size={18} />} onAdd={() => setStaff((prev) => [...prev, emptyStaff()])}>
              {staff.map((member) => (
                <div key={member.id} className="rounded-3xl bg-muted/30 p-4 space-y-3">
                  <div className="grid md:grid-cols-3 gap-3">
                    <input className={inputClass} value={member.name} onChange={(e) => updateStaff(member.id, { name: e.target.value })} placeholder="Staff name" />
                    <input className={inputClass} value={member.role} onChange={(e) => updateStaff(member.id, { role: e.target.value })} placeholder="Combined role e.g. Cook + Cleaner" />
                    <select className={inputClass} value={member.department} onChange={(e) => updateStaff(member.id, { department: e.target.value as Department })}>
                      {departments.map((department) => <option key={department}>{department}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <p className="label-sm text-muted-foreground">Responsibilities</p>
                    <div className="flex flex-wrap gap-2">
                      {responsibilityPresets.map((preset) => {
                        const selected = member.skills.includes(preset.label);
                        return (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() => toggleResponsibility(member.id, preset.label)}
                            className={`rounded-full px-3 py-2 text-xs font-semibold transition ${
                              selected ? "bg-primary text-primary-foreground" : "bg-background/70 text-muted-foreground border border-border/40"
                            }`}
                          >
                            {preset.label}
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Select multiple if one person cooks, cleans, babysits, drives, gardens, or handles other mixed work.
                    </p>
                    <input
                      className={inputClass}
                      placeholder="Add custom responsibility and press Enter"
                      onKeyDown={(e) => {
                        if (e.key !== "Enter") return;
                        e.preventDefault();
                        const value = e.currentTarget.value.trim();
                        if (!value) return;
                        addCustomResponsibility(member.id, value);
                        e.currentTarget.value = "";
                      }}
                    />
                    {member.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {member.skills.map((skill) => (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => toggleResponsibility(member.id, skill)}
                            className="rounded-full bg-primary/10 px-3 py-1.5 text-xs text-primary"
                          >
                            {skill} ×
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {member.skills.length > 0 && (
                    <div className="space-y-2">
                      <p className="label-sm text-muted-foreground">Starting tasks for this person</p>
                      <div className="flex flex-wrap gap-2">
                        {[...new Set(member.skills.flatMap((skill) => responsibilityPresets.find((preset) => preset.label === skill)?.tasks || []))].map((task) => {
                          const selected = member.assignments.some((assignment) => assignment.task === task);
                          return (
                            <button
                              key={task}
                              type="button"
                              onClick={() => toggleTask(member.id, task)}
                              className={`rounded-full px-3 py-2 text-xs transition ${
                                selected ? "bg-secondary/15 text-secondary border border-secondary/30" : "bg-background/70 text-muted-foreground border border-border/40"
                              }`}
                            >
                              {selected ? "✓ " : ""}{task}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  <div className="grid md:grid-cols-4 gap-3">
                    <input className={inputClass} value={member.phone} onChange={(e) => updateStaff(member.id, { phone: e.target.value })} placeholder="Phone" />
                    <input className={inputClass} type="number" value={member.salary || ""} onChange={(e) => updateStaff(member.id, { salary: Number(e.target.value) })} placeholder="Monthly salary" />
                    <input className={inputClass} value={member.shiftStart} onChange={(e) => updateStaff(member.id, { shiftStart: e.target.value })} placeholder="Shift start" />
                    <input className={inputClass} value={member.shiftEnd} onChange={(e) => updateStaff(member.id, { shiftEnd: e.target.value })} placeholder="Shift end" />
                  </div>
                  <input
                    className={inputClass}
                    placeholder="Add custom task and press Enter"
                    onKeyDown={(e) => {
                      if (e.key !== "Enter") return;
                      e.preventDefault();
                      const value = e.currentTarget.value.trim();
                      if (!value) return;
                      toggleTask(member.id, value);
                      e.currentTarget.value = "";
                    }}
                  />
                  <button className="text-sm text-destructive" onClick={() => setStaff((prev) => prev.filter((s) => s.id !== member.id))}>Remove staff member</button>
                </div>
              ))}
              <Field label="Payroll deduction policy">
                <textarea className={`${inputClass} min-h-24`} value={deductionPolicy} onChange={(e) => setDeductionPolicy(e.target.value)} />
              </Field>
            </RepeatingSection>
          )}

          {step === 4 && (
            <RepeatingSection title="Inventory starter list" description="Track groceries, vegetables, household supplies and minimum stock levels." icon={<Package size={18} />} onAdd={() => setInventoryItems((prev) => [...prev, { id: makeId("item"), name: "", category: "Groceries", unit: "unit", currentQuantity: 0, minimumQuantity: 0 }])}>
              {inventoryItems.map((item) => (
                <div key={item.id} className="grid md:grid-cols-6 gap-3">
                  <input className={inputClass} value={item.name} onChange={(e) => setInventoryItems((prev) => prev.map((i) => i.id === item.id ? { ...i, name: e.target.value } : i))} placeholder="Item" />
                  <input className={inputClass} value={item.category} onChange={(e) => setInventoryItems((prev) => prev.map((i) => i.id === item.id ? { ...i, category: e.target.value } : i))} placeholder="Category" />
                  <input className={inputClass} value={item.unit} onChange={(e) => setInventoryItems((prev) => prev.map((i) => i.id === item.id ? { ...i, unit: e.target.value } : i))} placeholder="Unit" />
                  <input className={inputClass} type="number" value={item.currentQuantity} onChange={(e) => setInventoryItems((prev) => prev.map((i) => i.id === item.id ? { ...i, currentQuantity: Number(e.target.value) } : i))} placeholder="Qty" />
                  <input className={inputClass} type="number" value={item.minimumQuantity ?? ""} onChange={(e) => setInventoryItems((prev) => prev.map((i) => i.id === item.id ? { ...i, minimumQuantity: Number(e.target.value) } : i))} placeholder="Min" />
                  <button className="glass-btn rounded-2xl text-sm" onClick={() => setInventoryItems((prev) => prev.filter((i) => i.id !== item.id))}>Remove</button>
                </div>
              ))}
            </RepeatingSection>
          )}

          {step === 5 && (
            <section className="grid md:grid-cols-2 gap-4">
              <SummaryCard label="Household" value={householdName || "Not set"} />
              <SummaryCard label="Owner" value={setupOwnerName || "Not set"} />
              <SummaryCard label="Housemates" value={`${homemates.filter((m) => m.name.trim()).length} profiles`} />
              <SummaryCard label="Rooms" value={`${rooms.filter((r) => r.name.trim()).length} zones`} />
              <SummaryCard label="Staff" value={`${staff.filter((s) => s.name.trim()).length} members`} />
              <SummaryCard label="Inventory" value={`${inventoryItems.filter((i) => i.name.trim()).length} items`} />
            </section>
          )}
        </div>

        <div className="flex gap-3 pt-6">
          <button
            type="button"
            disabled={step === 0 || saving}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className="glass-btn rounded-2xl px-4 py-3 text-sm disabled:opacity-40 flex items-center gap-2"
          >
            <ChevronLeft size={16} /> Back
          </button>
          {step < steps.length - 1 ? (
            <button
              type="button"
              disabled={!canContinue() || saving}
              onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
              className="btn-estate rounded-2xl px-5 py-3 text-sm text-primary-foreground font-semibold ml-auto disabled:opacity-50 flex items-center gap-2"
            >
              Continue <ChevronRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              disabled={saving}
              onClick={handleFinish}
              className="btn-estate rounded-2xl px-5 py-3 text-sm text-primary-foreground font-semibold ml-auto disabled:opacity-50 flex items-center gap-2"
            >
              <Check size={16} /> {saving ? "Saving..." : "Create household"}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="space-y-2 block">
      <span className="label-sm text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function RepeatingSection({ title, description, icon, onAdd, children }: { title: string; description: string; icon: ReactNode; onAdd: () => void; children: ReactNode }) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center">{icon}</div>
        <div className="flex-1">
          <h2 className="headline-sm text-foreground">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <button type="button" className="glass-btn rounded-2xl px-4 py-2 text-sm" onClick={onAdd}>Add</button>
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl bg-muted/30 p-5">
      <p className="label-sm text-muted-foreground">{label}</p>
      <p className="headline-sm text-foreground mt-1">{value}</p>
    </div>
  );
}
