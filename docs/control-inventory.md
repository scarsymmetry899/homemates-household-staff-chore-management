# Button audit worksheet

Static inventory of JSX button declarations in pages and application components. Repeated list buttons appear once per declaration. Source expressions identify the expected action. Rendered labels, placement, keyboard reachability, actual outcomes, and persisted results await browser verification for every row. Shared library primitives, clickable non-button elements and native form controls require a separate runtime walk.

| Source location | Visible label expression | Accessible name source | Click handler |
| --- | --- | --- | --- |
| src/pages/AlertsPage.tsx:225 | (icon or nested content) | from content | {() => setReassignAlert(null)} |
| src/pages/AlertsPage.tsx:232 | (icon or nested content) | from content | {() => handleReassignTo(s.id)} |
| src/pages/AlertsPage.tsx:277 | (icon or nested content) | from content | {() => dismissAlert(alert.id)} |
| src/pages/AlertsPage.tsx:288 | {action} | from content | {() => handleAction(alert, action)} |
| src/pages/AuthPage.tsx:130 | {loading ? ( <Loader2 size={18} className="animate-spin text-muted-foreground" /> ) : ( <s | from content | {handleGoogleLogin} |
| src/pages/AuthPage.tsx:189 | {showPassword ? <EyeOff size={16} /> : <Eye size={16} />} | from content | {() => setShowPassword(!showPassword)} |
| src/pages/AuthPage.tsx:194 | {loading && <Loader2 size={16} className="animate-spin" />} {isSignUp ? "Create Account" : | from content | form or inherited |
| src/pages/AuthPage.tsx:207 | {isSignUp ? "Sign In" : "Sign Up"} | from content | {() => setIsSignUp(!isSignUp)} |
| src/pages/ExpensesPage.tsx:235 | Log an Expense | from content | {() => setShowForm(!showForm)} |
| src/pages/ExpensesPage.tsx:242 | Scan Receipt | from content | {() => setShowScanForm(!showScanForm)} |
| src/pages/ExpensesPage.tsx:304 | Approve | from content | {() => approveRequest(request.id, request.amountRequested)} |
| src/pages/ExpensesPage.tsx:311 | Reject | from content | {() => rejectRequest(request.id)} |
| src/pages/ExpensesPage.tsx:320 | Mark Purchased & Add To Expenses | from content | {() => convertRequestToExpense(request)} |
| src/pages/ExpensesPage.tsx:349 | (icon or nested content) | from content | {() => setShowForm(false)} |
| src/pages/ExpensesPage.tsx:355 | {cat} | from content | {() => setNewExpense({ ...newExpense, category: cat })} |
| src/pages/ExpensesPage.tsx:389 | Add Expense | from content | {handleAdd} |
| src/pages/ExpensesPage.tsx:413 | (icon or nested content) | from content | {() => { setShowScanForm(false); setScanFile(null); setScanPreviewUrl(""); setScanItems([] |
| src/pages/ExpensesPage.tsx:427 | (icon or nested content) | from content | {() => scanInputRef.current?.click()} |
| src/pages/ExpensesPage.tsx:442 | Parse Expenses | from content | {handleParseReceipt} |
| src/pages/ExpensesPage.tsx:476 | (icon or nested content) | from content | {() => handleScanApprove(item.id, true)} |
| src/pages/ExpensesPage.tsx:486 | (icon or nested content) | from content | {() => handleScanApprove(item.id, false)} |
| src/pages/ExpensesPage.tsx:500 | Add Approved to Expenses | from content | {handleAddApproved} |
| src/pages/ExpensesPage.tsx:536 | (icon or nested content) | from content | {() => setEditingExpense(null)} |
| src/pages/ExpensesPage.tsx:542 | {cat} | from content | {() => setEditForm({ ...editForm, category: cat })} |
| src/pages/ExpensesPage.tsx:576 | Update Expense | from content | {handleUpdate} |
| src/pages/HouseholdPage.tsx:211 | {homemateFormOpen && !editingHomemateId ? <X size={14} /> : <Plus size={14} />} {homemateF | from content | {() => { resetHomemateForm(); setHomemateFormOpen((value) => !value); }} |
| src/pages/HouseholdPage.tsx:232 | {editingHomemateId ? "Save Changes" : "Add Homemate"} | from content | {saveHomemate} |
| src/pages/HouseholdPage.tsx:255 | (icon or nested content) | from content | {() => startHomemateEdit(profile)} |
| src/pages/HouseholdPage.tsx:258 | (icon or nested content) | from content | {() => handleDeleteHomemate(profile)} |
| src/pages/HouseholdPage.tsx:275 | {roomFormOpen && !editingRoomId ? <X size={14} /> : <Plus size={14} />} {roomFormOpen && ! | from content | {() => { resetRoomForm(); setRoomFormOpen((value) => !value); }} |
| src/pages/HouseholdPage.tsx:295 | {editingRoomId ? "Save Changes" : "Add Room"} | from content | {saveRoom} |
| src/pages/HouseholdPage.tsx:322 | (icon or nested content) | from content | {() => startRoomEdit(room)} |
| src/pages/HouseholdPage.tsx:325 | (icon or nested content) | from content | {() => handleDeleteRoom(room)} |
| src/pages/Index.tsx:71 | {t("home.dispatchTask")} | from content | {() => navigate("/tasks")} |
| src/pages/Index.tsx:84 | (icon or nested content) | from content | {() => navigate("/alerts")} |
| src/pages/Index.tsx:105 | {t("home.viewAll")} | from content | {() => navigate("/staff")} |
| src/pages/Index.tsx:113 | (icon or nested content) | from content | {() => navigate(`/staff/${s.id}`)} |
| src/pages/Index.tsx:147 | {t("home.allTasks")} | from content | {() => navigate("/tasks")} |
| src/pages/Index.tsx:206 | {t("home.viewFullLedger")} | from content | {() => navigate("/expenses")} |
| src/pages/InsightsPage.tsx:305 | Export Excel Report | from content | {handleExport} |
| src/pages/InsightsPage.tsx:316 | {mode} | from content | {() => { setViewMode(mode); setShowDropdown(false); }} |
| src/pages/InsightsPage.tsx:331 | (icon or nested content) | from content | {() => setShowDropdown(!showDropdown)} |
| src/pages/InsightsPage.tsx:348 | {opt.label} | from content | {() => { if (viewMode === "monthly") setSelectedMonth(opt.value); else if (viewMode === "w |
| src/pages/InsightsPage.tsx:412 | Approve | from content | {() => approveAttendanceRequest(request.id)} |
| src/pages/InsightsPage.tsx:419 | Reject | from content | {() => rejectAttendanceRequest(request.id)} |
| src/pages/InventoryPage.tsx:128 | (icon or nested content) | from content | {() => startEdit(item)} |
| src/pages/InventoryPage.tsx:139 | {showForm && !editingId ? <X size={16} /> : <PackagePlus size={16} />} {showForm && !editi | from content | {() => { resetForm(); setShowForm((value) => !value); }} |
| src/pages/InventoryPage.tsx:156 | New item | from content | {resetForm} |
| src/pages/InventoryPage.tsx:176 | {editingId ? "Save Changes" : "Add Item"} | from content | {handleSave} |
| src/pages/InventoryPage.tsx:212 | (icon or nested content) | from content | {() => startEdit(item)} |
| src/pages/InventoryPage.tsx:215 | (icon or nested content) | from content | {() => handleDelete(item)} |
| src/pages/PayrollPage.tsx:67 | {t("payroll.export")} | from content | {() => toast.success(t("payroll.exportStarted"), { description: t("payroll.exportDescripti |
| src/pages/SettingsPage.tsx:220 | {t("settings.save")} | from content | {handleSaveName} |
| src/pages/SettingsPage.tsx:227 | (icon or nested content) | from content | {() => { setEditingName(true); setNameInput(ownerName); }} |
| src/pages/SettingsPage.tsx:235 | (icon or nested content) | from content | {() => navigate("/household")} |
| src/pages/SettingsPage.tsx:264 | {item.label} | from content | {() => setLanguage(item.code)} |
| src/pages/SettingsPage.tsx:292 | {t(`settings.role.${role}`)} | from content | {() => setAppRole(role)} |
| src/pages/SettingsPage.tsx:336 | (icon or nested content) | {isDemoMode ? "Disable demo data" : "Enable demo data"} | {() => { if (isDemoMode) { disableDemoMode(); toast.success(t("settings.demoDisabled"), {  |
| src/pages/SettingsPage.tsx:418 | (icon or nested content) | from content | {() => { setEditingChatId(true); setChatIdInput(ownerChatId); }} |
| src/pages/SettingsPage.tsx:434 | (icon or nested content) | from content | {handleSaveChatId} |
| src/pages/SettingsPage.tsx:437 | (icon or nested content) | from content | {() => setEditingChatId(false)} |
| src/pages/SettingsPage.tsx:453 | {testingTelegram ? "Sending…" : "Send test message"} | from content | {handleTestTelegram} |
| src/pages/SettingsPage.tsx:516 | {writingNfc ? "Setting up…" : verifiedStaffId === s.id ? "Retry registration" : "Write and | from content | {() => handleWriteNfc(s.id)} |
| src/pages/SettingsPage.tsx:524 | (icon or nested content) | "Cancel tag setup" | {() => { setVerifiedStaffId(null); setNfcWriteStaffId(null); }} |
| src/pages/SettingsPage.tsx:529 | Program | from content | {() => { if (!nfcSupported) { toast.error("NFC not supported on this device"); return; } s |
| src/pages/SettingsPage.tsx:549 | (icon or nested content) | from content | {() => setTestModeOpen((v) => !v)} |
| src/pages/SettingsPage.tsx:582 | {t === "auto" ? "Auto" : t === "check-in" ? "Force In" : "Force Out"} | from content | {() => setTestForceType(t)} |
| src/pages/SettingsPage.tsx:615 | (icon or nested content) | from content | {() => handleSimulateTap(s.id)} |
| src/pages/SettingsPage.tsx:653 | (icon or nested content) | from content | {() => { toast.success("Signed out successfully"); onLogout(); }} |
| src/pages/StaffDirectory.tsx:129 | Add staff member | from content | {() => setShowAddForm(true)} |
| src/pages/StaffDirectory.tsx:154 | (icon or nested content) | from content | {() => setShowAddForm(false)} |
| src/pages/StaffDirectory.tsx:215 | Add to Team | from content | {handleAddStaff} |
| src/pages/StaffDirectory.tsx:273 | {dept === "All" ? "All Roles" : dept} | from content | {() => setActiveDept(dept)} |
| src/pages/StaffDirectory.tsx:295 | {dot && <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />} {label} | from content | {() => setStatusFilter(statusFilter === value ? "" : value)} |
| src/pages/StaffDirectory.tsx:342 | (icon or nested content) | from content | {() => toast.success(`Calling ${s.name}...`)} |
| src/pages/StaffDirectory.tsx:348 | (icon or nested content) | from content | {() => handleMessage(s.phone, s.name)} |
| src/pages/StaffDirectory.tsx:354 | Profile | from content | {() => navigate(`/staff/${s.id}`)} |
| src/pages/StaffProfile.tsx:116 | (icon or nested content) | from content | {() => photoInputRef.current?.click()} |
| src/pages/StaffProfile.tsx:131 | (icon or nested content) | from content | {() => navigate(-1)} |
| src/pages/StaffProfile.tsx:139 | (icon or nested content) | from content | form or inherited |
| src/pages/StaffProfile.tsx:142 | (icon or nested content) | from content | form or inherited |
| src/pages/StaffProfile.tsx:167 | (icon or nested content) | from content | {() => { setEditingRole(true); setRoleInput(s.role); }} |
| src/pages/StaffProfile.tsx:180 | Save | from content | {handleSaveRole} |
| src/pages/StaffProfile.tsx:197 | (icon or nested content) | from content | {() => { setEditingShift(true); setShiftStartInput(s.shiftStart); setShiftEndInput(s.shift |
| src/pages/StaffProfile.tsx:216 | Save | from content | {handleSaveShift} |
| src/pages/StaffProfile.tsx:233 | (icon or nested content) | from content | {() => { setEditingTelegramId(true); setTelegramIdInput(s.telegramChatId // ""); }} |
| src/pages/StaffProfile.tsx:247 | (icon or nested content) | from content | {handleSaveTelegramId} |
| src/pages/StaffProfile.tsx:250 | (icon or nested content) | from content | {() => setEditingTelegramId(false)} |
| src/pages/StaffProfile.tsx:262 | {sendingTest ? "Sending…" : "Message"} | from content | {handleMessage} |
| src/pages/StaffProfile.tsx:265 | Schedule | from content | {() => setShowSchedule(true)} |
| src/pages/StaffProfile.tsx:268 | (icon or nested content) | from content | {() => setShowDeleteConfirm(true)} |
| src/pages/StaffProfile.tsx:309 | (icon or nested content) | from content | {() => { deleteTask(s.id, i); toast.success("Task deleted", { description: task.task }); } |
| src/pages/StaffProfile.tsx:331 | Edit Notes | from content | form or inherited |
| src/pages/StaffProfile.tsx:389 | + Add Deduction | from content | {() => setShowDeductionForm(!showDeductionForm)} |
| src/pages/StaffProfile.tsx:422 | Apply Deduction | from content | {handleAddDeduction} |
| src/pages/StaffProfile.tsx:462 | Cancel | from content | {() => setShowDeleteConfirm(false)} |
| src/pages/StaffProfile.tsx:468 | Remove | from content | {() => { removeStaff(s.id); toast.success(`${s.name} removed from staff`); navigate("/staf |
| src/pages/StaffProfile.tsx:514 | (icon or nested content) | from content | {() => setShowSchedule(false)} |
| src/pages/StaffWorkspace.tsx:165 | (icon or nested content) | from content | {() => toggleTask(activeStaff.id, index)} |
| src/pages/StaffWorkspace.tsx:192 | (icon or nested content) | from content | {() => setShowCashForm((value) => !value)} |
| src/pages/StaffWorkspace.tsx:201 | (icon or nested content) | from content | {() => setShowAttendanceForm((value) => !value)} |
| src/pages/StaffWorkspace.tsx:219 | (icon or nested content) | from content | {() => setShowAttendanceForm(false)} |
| src/pages/StaffWorkspace.tsx:231 | {t(statusLabelKey[status] // "status.offDuty")} | from content | {() => setAttendanceForm((form) => ({ ...form, requestedStatus: status }))} |
| src/pages/StaffWorkspace.tsx:249 | {t("staff.sendForOwnerReview")} | from content | {submitAttendanceRequest} |
| src/pages/StaffWorkspace.tsx:262 | (icon or nested content) | from content | {() => setShowCashForm(false)} |
| src/pages/StaffWorkspace.tsx:268 | {category} | from content | {() => setCashForm((form) => ({ ...form, category }))} |
| src/pages/StaffWorkspace.tsx:306 | {t("staff.sendRequest")} | from content | {submitCashRequest} |
| src/pages/TasksPage.tsx:129 | {task.done ? ( <CheckCircle2 size={20} className="text-status-on-time" /> ) : ( <Circle si | {`${task.done ? "Mark pending" : "Mark complete"}: ${task.task}`} | {() => handleToggle(task.staffId, task.taskIndex, task.task, task.done)} |
| src/pages/TasksPage.tsx:163 | (icon or nested content) | {`Delete task: ${task.task}`} | {(e) => { e.stopPropagation(); deleteTask(task.staffId, task.taskIndex); toast.success("Ta |
| src/pages/TasksPage.tsx:214 | Today | from content | {() => handleCarryForward(task)} |
| src/pages/TasksPage.tsx:220 | +7 Days | from content | {() => handleExtendDeadline(task, 7)} |
| src/pages/TasksPage.tsx:226 | Reassign | from content | {() => setReassignPickerTask(task)} |
| src/pages/TasksPage.tsx:232 | Delete | from content | {() => { deleteTask(task.staffId, task.taskIndex); toast.success("Task removed", { descrip |
| src/pages/TasksPage.tsx:256 | (icon or nested content) | from content | {() => handleReassignTask(task, s.id)} |
| src/pages/TasksPage.tsx:273 | Cancel | from content | {() => setReassignPickerTask(null)} |
| src/pages/TasksPage.tsx:305 | {f === "bydate" ? t("tasks.filter.bydate") : t(`tasks.filter.${f}`)} | from content | {() => setFilter(f)} |
| src/pages/TasksPage.tsx:319 | {t("tasks.queueTask")} | from content | {() => setShowForm(!showForm)} |
| src/pages/TasksPage.tsx:339 | (icon or nested content) | from content | {() => setShowForm(false)} |
| src/pages/TasksPage.tsx:380 | (icon or nested content) | {t("tasks.dispatchTelegram")} | {() => setNewTask((prev) => ({ ...prev, notifyTelegram: !prev.notifyTelegram }))} |
| src/pages/TasksPage.tsx:394 | {t("tasks.createAssign")} | from content | {handleAddTask} |
| src/components/HouseholdSetupWizard.tsx:265 | Use demo data instead | from content | {() => { enableDemoMode(); toast.success("Demo data enabled", { description: "Sample house |
| src/components/HouseholdSetupWizard.tsx:280 | {label} | from content | {() => setStep(index)} |
| src/components/HouseholdSetupWizard.tsx:327 | Remove | from content | {() => setHomemates((prev) => prev.filter((m) => m.id !== mate.id))} |
| src/components/HouseholdSetupWizard.tsx:340 | Remove | from content | {() => setRooms((prev) => prev.filter((r) => r.id !== room.id))} |
| src/components/HouseholdSetupWizard.tsx:372 | {preset.label} | from content | {() => toggleResponsibility(member.id, preset.label)} |
| src/components/HouseholdSetupWizard.tsx:403 | {skill} × | from content | {() => toggleResponsibility(member.id, skill)} |
| src/components/HouseholdSetupWizard.tsx:422 | {selected ? "✓ " : ""} {task} | from content | {() => toggleTask(member.id, task)} |
| src/components/HouseholdSetupWizard.tsx:455 | Remove staff member | from content | {() => setStaff((prev) => prev.filter((s) => s.id !== member.id))} |
| src/components/HouseholdSetupWizard.tsx:473 | Remove | from content | {() => setInventoryItems((prev) => prev.filter((i) => i.id !== item.id))} |
| src/components/HouseholdSetupWizard.tsx:495 | Reload saved household | from content | {() => window.location.reload()} |
| src/components/HouseholdSetupWizard.tsx:501 | Back | from content | {() => setStep((s) => Math.max(0, s - 1))} |
| src/components/HouseholdSetupWizard.tsx:510 | Continue | from content | {() => setStep((s) => Math.min(steps.length - 1, s + 1))} |
| src/components/HouseholdSetupWizard.tsx:519 | {saving ? "Saving..." : "Create household"} | from content | {handleFinish} |
| src/components/HouseholdSetupWizard.tsx:552 | Add | from content | {onAdd} |
| src/components/OnboardingTour.tsx:102 | Skip | from content | {onDone} |
| src/components/OnboardingTour.tsx:149 | (icon or nested content) | from content | {() => setStep(i)} |
| src/components/OnboardingTour.tsx:164 | (icon or nested content) | from content | {prev} |
| src/components/OnboardingTour.tsx:171 | {isLast ? "Get Started" : ( <> Next <ChevronRight size={16} /> </> )} | from content | {next} |
| src/components/SmartCommandBox.tsx:505 | (icon or nested content) | "Open AI home assistant" | {() => { setIsOpen(true); setTimeout(() => inputRef.current?.focus(), 300); }} |
| src/components/SmartCommandBox.tsx:542 | (icon or nested content) | "Close AI home assistant" | {() => { setIsOpen(false); if (guidedCmd) setGuidedCmd(null); }} |
| src/components/SmartCommandBox.tsx:568 | (icon or nested content) | from content | {() => { if ("query" in chip && chip.query) { const userMsg: ChatMessage = { id: `u-${Date |
| src/components/SmartCommandBox.tsx:631 | Yes | from content | {() => handleConfirm(m.id, true)} |
| src/components/SmartCommandBox.tsx:637 | No | from content | {() => handleConfirm(m.id, false)} |
| src/components/SmartCommandBox.tsx:683 | {isThinking ? <Loader2 size={14} className="text-primary-foreground animate-spin" /> : <Se | "Send message to AI home assistant" | {handleSend} |
| src/components/layout/AppHeader.tsx:25 | (icon or nested content) | "Go to household dashboard" | {() => navigate("/")} |
| src/components/layout/AppHeader.tsx:50 | (icon or nested content) | "Open settings" | {() => navigate("/settings")} |
| src/components/layout/AppHeader.tsx:59 | {activeAlerts.length > 0 && ( <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} c | {`Open alerts${activeAlerts.length ? `, ${activeAlerts.length} active` : ""}`} | {() => navigate("/alerts")} |
| src/components/layout/BottomNav.tsx:45 | {t(labelKey)} | from content | {() => { setMoreOpen(false); navigate(path); }} |
| src/components/layout/BottomNav.tsx:58 | (icon or nested content) | from content | {() => { setMoreOpen(false); navigate(path); }} |
| src/components/layout/BottomNav.tsx:77 | (icon or nested content) | from content | {() => { setMoreOpen(false); navigate(path); }} |
| src/components/layout/BottomNav.tsx:86 | (icon or nested content) | {t("nav.more")} | {() => setMoreOpen((open) => !open)} |
