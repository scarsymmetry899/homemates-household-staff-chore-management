import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface AddExpenseEntryData {
  expenseEntry_insert: ExpenseEntry_Key;
}

export interface AddExpenseEntryVariables {
  householdId: UUIDString;
  staffId?: UUIDString | null;
  category: string;
  amount: number;
  description: string;
  receiptUrl?: string | null;
}

export interface AddStaffMemberData {
  staffMember_insert: StaffMember_Key;
}

export interface AddStaffMemberVariables {
  householdId: UUIDString;
  name: string;
  role: string;
  department: string;
  phone?: string | null;
  salary: number;
  shiftStart?: string | null;
  shiftEnd?: string | null;
}

export interface AddTaskInstanceData {
  taskInstance_insert: TaskInstance_Key;
}

export interface AddTaskInstanceVariables {
  householdId: UUIDString;
  assignedStaffId?: UUIDString | null;
  title: string;
  dueAt?: TimestampString | null;
}

export interface AiActionLog_Key {
  id: UUIDString;
  __typename?: 'AiActionLog_Key';
}

export interface AiConversation_Key {
  id: UUIDString;
  __typename?: 'AiConversation_Key';
}

export interface AiMessage_Key {
  id: UUIDString;
  __typename?: 'AiMessage_Key';
}

export interface Alert_Key {
  id: UUIDString;
  __typename?: 'Alert_Key';
}

export interface AttendanceEvent_Key {
  id: UUIDString;
  __typename?: 'AttendanceEvent_Key';
}

export interface CompleteTaskInstanceData {
  taskInstance_update?: TaskInstance_Key | null;
}

export interface CompleteTaskInstanceVariables {
  taskId: UUIDString;
  source?: string | null;
}

export interface CreateHouseholdData {
  user_upsert: User_Key;
  household_insert: Household_Key;
}

export interface CreateHouseholdVariables {
  name: string;
  timezone: string;
  addressLabel?: string | null;
}

export interface DeleteExpenseEntryData {
  expenseEntry_delete?: ExpenseEntry_Key | null;
}

export interface DeleteExpenseEntryVariables {
  expenseId: UUIDString;
}

export interface DeleteTaskInstanceData {
  taskInstance_delete?: TaskInstance_Key | null;
}

export interface DeleteTaskInstanceVariables {
  taskId: UUIDString;
}

export interface DismissAlertData {
  alert_update?: Alert_Key | null;
}

export interface DismissAlertVariables {
  alertId: UUIDString;
}

export interface ExpenseEntry_Key {
  id: UUIDString;
  __typename?: 'ExpenseEntry_Key';
}

export interface HomemateProfile_Key {
  id: UUIDString;
  __typename?: 'HomemateProfile_Key';
}

export interface HouseholdMember_Key {
  id: UUIDString;
  __typename?: 'HouseholdMember_Key';
}

export interface Household_Key {
  id: UUIDString;
  __typename?: 'Household_Key';
}

export interface InventoryItem_Key {
  id: UUIDString;
  __typename?: 'InventoryItem_Key';
}

export interface InventoryMovement_Key {
  id: UUIDString;
  __typename?: 'InventoryMovement_Key';
}

export interface MyHouseholdsData {
  households: ({
    id: UUIDString;
    name: string;
    timezone: string;
    addressLabel?: string | null;
    createdAt: TimestampString;
    staffMembers_on_household: ({
      id: UUIDString;
      name: string;
      role: string;
      department: string;
      phone?: string | null;
      photoUrl?: string | null;
      salary: number;
      status: string;
      locationLabel?: string | null;
      shiftStart?: string | null;
      shiftEnd?: string | null;
      reliabilityScore: number;
      punctualityScore: number;
      telegramChatId?: string | null;
      notes?: string | null;
    } & StaffMember_Key)[];
    taskInstances_on_household: ({
      id: UUIDString;
      title: string;
      status: string;
      dueAt?: TimestampString | null;
      completedAt?: TimestampString | null;
      assignedStaff?: {
        id: UUIDString;
        name: string;
      } & StaffMember_Key;
    } & TaskInstance_Key)[];
    alerts_on_household: ({
      id: UUIDString;
      alertType: string;
      severity: string;
      title: string;
      description: string;
      status: string;
      createdAt: TimestampString;
      staff?: {
        id: UUIDString;
        name: string;
      } & StaffMember_Key;
    } & Alert_Key)[];
    expenseEntries_on_household: ({
      id: UUIDString;
      category: string;
      amount: number;
      description: string;
      spentAt: TimestampString;
      staff?: {
        id: UUIDString;
        name: string;
      } & StaffMember_Key;
    } & ExpenseEntry_Key)[];
  } & Household_Key)[];
}

export interface NfcTag_Key {
  id: UUIDString;
  __typename?: 'NfcTag_Key';
}

export interface NfcTapEvent_Key {
  id: UUIDString;
  __typename?: 'NfcTapEvent_Key';
}

export interface PayrollProfile_Key {
  id: UUIDString;
  __typename?: 'PayrollProfile_Key';
}

export interface PayrollRun_Key {
  id: UUIDString;
  __typename?: 'PayrollRun_Key';
}

export interface ReassignTaskInstanceData {
  taskInstance_update?: TaskInstance_Key | null;
}

export interface ReassignTaskInstanceVariables {
  taskId: UUIDString;
  assignedStaffId: UUIDString;
}

export interface RecordAttendanceEventData {
  attendanceEvent_insert: AttendanceEvent_Key;
}

export interface RecordAttendanceEventVariables {
  householdId: UUIDString;
  staffId: UUIDString;
  eventType: string;
  source: string;
  detail?: string | null;
}

export interface RecordNfcTapData {
  nfcTapEvent_insert: NfcTapEvent_Key;
}

export interface RecordNfcTapVariables {
  householdId: UUIDString;
  tagId: UUIDString;
  staffId?: UUIDString | null;
  roomId?: UUIDString | null;
  taskId?: UUIDString | null;
  actionType: string;
  deviceLabel?: string | null;
}

export interface RegisterNfcTagData {
  nfcTag_insert: NfcTag_Key;
}

export interface RegisterNfcTagVariables {
  householdId: UUIDString;
  tagUid: string;
  tagType: string;
  label: string;
  roomId?: UUIDString | null;
  staffId?: UUIDString | null;
  taskTemplateId?: UUIDString | null;
}

export interface RemoveStaffMemberData {
  staffMember_delete?: StaffMember_Key | null;
}

export interface RemoveStaffMemberVariables {
  staffId: UUIDString;
}

export interface RoomZone_Key {
  id: UUIDString;
  __typename?: 'RoomZone_Key';
}

export interface SetTaskCompletionData {
  taskInstance_update?: TaskInstance_Key | null;
}

export interface SetTaskCompletionVariables {
  taskId: UUIDString;
  status: string;
  completedAt?: TimestampString | null;
  source?: string | null;
}

export interface StaffMember_Key {
  id: UUIDString;
  __typename?: 'StaffMember_Key';
}

export interface StaffSkill_Key {
  id: UUIDString;
  __typename?: 'StaffSkill_Key';
}

export interface TaskInstance_Key {
  id: UUIDString;
  __typename?: 'TaskInstance_Key';
}

export interface TaskTemplate_Key {
  id: UUIDString;
  __typename?: 'TaskTemplate_Key';
}

export interface UpdateExpenseEntryData {
  expenseEntry_update?: ExpenseEntry_Key | null;
}

export interface UpdateExpenseEntryVariables {
  expenseId: UUIDString;
  category: string;
  amount: number;
  description: string;
}

export interface UpdateStaffPhotoData {
  staffMember_update?: StaffMember_Key | null;
}

export interface UpdateStaffPhotoVariables {
  staffId: UUIDString;
  photoUrl: string;
}

export interface UpdateStaffRoleData {
  staffMember_update?: StaffMember_Key | null;
}

export interface UpdateStaffRoleVariables {
  staffId: UUIDString;
  role: string;
}

export interface UpdateStaffShiftData {
  staffMember_update?: StaffMember_Key | null;
}

export interface UpdateStaffShiftVariables {
  staffId: UUIDString;
  shiftStart: string;
  shiftEnd: string;
}

export interface UpdateStaffStatusData {
  staffMember_update?: StaffMember_Key | null;
}

export interface UpdateStaffStatusVariables {
  staffId: UUIDString;
  status: string;
}

export interface UpdateStaffTelegramIdData {
  staffMember_update?: StaffMember_Key | null;
}

export interface UpdateStaffTelegramIdVariables {
  staffId: UUIDString;
  telegramChatId: string;
}

export interface UpdateTaskDueDateData {
  taskInstance_update?: TaskInstance_Key | null;
}

export interface UpdateTaskDueDateVariables {
  taskId: UUIDString;
  dueAt?: TimestampString | null;
}

export interface UpsertCurrentUserData {
  user_upsert: User_Key;
}

export interface UpsertCurrentUserVariables {
  displayName?: string | null;
  email?: string | null;
}

export interface User_Key {
  uid: string;
  __typename?: 'User_Key';
}

interface UpsertCurrentUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars?: UpsertCurrentUserVariables): MutationRef<UpsertCurrentUserData, UpsertCurrentUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars?: UpsertCurrentUserVariables): MutationRef<UpsertCurrentUserData, UpsertCurrentUserVariables>;
  operationName: string;
}
export const upsertCurrentUserRef: UpsertCurrentUserRef;

export function upsertCurrentUser(vars?: UpsertCurrentUserVariables): MutationPromise<UpsertCurrentUserData, UpsertCurrentUserVariables>;
export function upsertCurrentUser(dc: DataConnect, vars?: UpsertCurrentUserVariables): MutationPromise<UpsertCurrentUserData, UpsertCurrentUserVariables>;

interface CreateHouseholdRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateHouseholdVariables): MutationRef<CreateHouseholdData, CreateHouseholdVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateHouseholdVariables): MutationRef<CreateHouseholdData, CreateHouseholdVariables>;
  operationName: string;
}
export const createHouseholdRef: CreateHouseholdRef;

export function createHousehold(vars: CreateHouseholdVariables): MutationPromise<CreateHouseholdData, CreateHouseholdVariables>;
export function createHousehold(dc: DataConnect, vars: CreateHouseholdVariables): MutationPromise<CreateHouseholdData, CreateHouseholdVariables>;

interface MyHouseholdsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<MyHouseholdsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<MyHouseholdsData, undefined>;
  operationName: string;
}
export const myHouseholdsRef: MyHouseholdsRef;

export function myHouseholds(options?: ExecuteQueryOptions): QueryPromise<MyHouseholdsData, undefined>;
export function myHouseholds(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<MyHouseholdsData, undefined>;

interface AddStaffMemberRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddStaffMemberVariables): MutationRef<AddStaffMemberData, AddStaffMemberVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AddStaffMemberVariables): MutationRef<AddStaffMemberData, AddStaffMemberVariables>;
  operationName: string;
}
export const addStaffMemberRef: AddStaffMemberRef;

export function addStaffMember(vars: AddStaffMemberVariables): MutationPromise<AddStaffMemberData, AddStaffMemberVariables>;
export function addStaffMember(dc: DataConnect, vars: AddStaffMemberVariables): MutationPromise<AddStaffMemberData, AddStaffMemberVariables>;

interface UpdateStaffStatusRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateStaffStatusVariables): MutationRef<UpdateStaffStatusData, UpdateStaffStatusVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateStaffStatusVariables): MutationRef<UpdateStaffStatusData, UpdateStaffStatusVariables>;
  operationName: string;
}
export const updateStaffStatusRef: UpdateStaffStatusRef;

export function updateStaffStatus(vars: UpdateStaffStatusVariables): MutationPromise<UpdateStaffStatusData, UpdateStaffStatusVariables>;
export function updateStaffStatus(dc: DataConnect, vars: UpdateStaffStatusVariables): MutationPromise<UpdateStaffStatusData, UpdateStaffStatusVariables>;

interface UpdateStaffRoleRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateStaffRoleVariables): MutationRef<UpdateStaffRoleData, UpdateStaffRoleVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateStaffRoleVariables): MutationRef<UpdateStaffRoleData, UpdateStaffRoleVariables>;
  operationName: string;
}
export const updateStaffRoleRef: UpdateStaffRoleRef;

export function updateStaffRole(vars: UpdateStaffRoleVariables): MutationPromise<UpdateStaffRoleData, UpdateStaffRoleVariables>;
export function updateStaffRole(dc: DataConnect, vars: UpdateStaffRoleVariables): MutationPromise<UpdateStaffRoleData, UpdateStaffRoleVariables>;

interface UpdateStaffShiftRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateStaffShiftVariables): MutationRef<UpdateStaffShiftData, UpdateStaffShiftVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateStaffShiftVariables): MutationRef<UpdateStaffShiftData, UpdateStaffShiftVariables>;
  operationName: string;
}
export const updateStaffShiftRef: UpdateStaffShiftRef;

export function updateStaffShift(vars: UpdateStaffShiftVariables): MutationPromise<UpdateStaffShiftData, UpdateStaffShiftVariables>;
export function updateStaffShift(dc: DataConnect, vars: UpdateStaffShiftVariables): MutationPromise<UpdateStaffShiftData, UpdateStaffShiftVariables>;

interface UpdateStaffPhotoRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateStaffPhotoVariables): MutationRef<UpdateStaffPhotoData, UpdateStaffPhotoVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateStaffPhotoVariables): MutationRef<UpdateStaffPhotoData, UpdateStaffPhotoVariables>;
  operationName: string;
}
export const updateStaffPhotoRef: UpdateStaffPhotoRef;

export function updateStaffPhoto(vars: UpdateStaffPhotoVariables): MutationPromise<UpdateStaffPhotoData, UpdateStaffPhotoVariables>;
export function updateStaffPhoto(dc: DataConnect, vars: UpdateStaffPhotoVariables): MutationPromise<UpdateStaffPhotoData, UpdateStaffPhotoVariables>;

interface UpdateStaffTelegramIdRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateStaffTelegramIdVariables): MutationRef<UpdateStaffTelegramIdData, UpdateStaffTelegramIdVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateStaffTelegramIdVariables): MutationRef<UpdateStaffTelegramIdData, UpdateStaffTelegramIdVariables>;
  operationName: string;
}
export const updateStaffTelegramIdRef: UpdateStaffTelegramIdRef;

export function updateStaffTelegramId(vars: UpdateStaffTelegramIdVariables): MutationPromise<UpdateStaffTelegramIdData, UpdateStaffTelegramIdVariables>;
export function updateStaffTelegramId(dc: DataConnect, vars: UpdateStaffTelegramIdVariables): MutationPromise<UpdateStaffTelegramIdData, UpdateStaffTelegramIdVariables>;

interface RemoveStaffMemberRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: RemoveStaffMemberVariables): MutationRef<RemoveStaffMemberData, RemoveStaffMemberVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: RemoveStaffMemberVariables): MutationRef<RemoveStaffMemberData, RemoveStaffMemberVariables>;
  operationName: string;
}
export const removeStaffMemberRef: RemoveStaffMemberRef;

export function removeStaffMember(vars: RemoveStaffMemberVariables): MutationPromise<RemoveStaffMemberData, RemoveStaffMemberVariables>;
export function removeStaffMember(dc: DataConnect, vars: RemoveStaffMemberVariables): MutationPromise<RemoveStaffMemberData, RemoveStaffMemberVariables>;

interface AddTaskInstanceRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddTaskInstanceVariables): MutationRef<AddTaskInstanceData, AddTaskInstanceVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AddTaskInstanceVariables): MutationRef<AddTaskInstanceData, AddTaskInstanceVariables>;
  operationName: string;
}
export const addTaskInstanceRef: AddTaskInstanceRef;

export function addTaskInstance(vars: AddTaskInstanceVariables): MutationPromise<AddTaskInstanceData, AddTaskInstanceVariables>;
export function addTaskInstance(dc: DataConnect, vars: AddTaskInstanceVariables): MutationPromise<AddTaskInstanceData, AddTaskInstanceVariables>;

interface CompleteTaskInstanceRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CompleteTaskInstanceVariables): MutationRef<CompleteTaskInstanceData, CompleteTaskInstanceVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CompleteTaskInstanceVariables): MutationRef<CompleteTaskInstanceData, CompleteTaskInstanceVariables>;
  operationName: string;
}
export const completeTaskInstanceRef: CompleteTaskInstanceRef;

export function completeTaskInstance(vars: CompleteTaskInstanceVariables): MutationPromise<CompleteTaskInstanceData, CompleteTaskInstanceVariables>;
export function completeTaskInstance(dc: DataConnect, vars: CompleteTaskInstanceVariables): MutationPromise<CompleteTaskInstanceData, CompleteTaskInstanceVariables>;

interface SetTaskCompletionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: SetTaskCompletionVariables): MutationRef<SetTaskCompletionData, SetTaskCompletionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: SetTaskCompletionVariables): MutationRef<SetTaskCompletionData, SetTaskCompletionVariables>;
  operationName: string;
}
export const setTaskCompletionRef: SetTaskCompletionRef;

export function setTaskCompletion(vars: SetTaskCompletionVariables): MutationPromise<SetTaskCompletionData, SetTaskCompletionVariables>;
export function setTaskCompletion(dc: DataConnect, vars: SetTaskCompletionVariables): MutationPromise<SetTaskCompletionData, SetTaskCompletionVariables>;

interface UpdateTaskDueDateRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateTaskDueDateVariables): MutationRef<UpdateTaskDueDateData, UpdateTaskDueDateVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateTaskDueDateVariables): MutationRef<UpdateTaskDueDateData, UpdateTaskDueDateVariables>;
  operationName: string;
}
export const updateTaskDueDateRef: UpdateTaskDueDateRef;

export function updateTaskDueDate(vars: UpdateTaskDueDateVariables): MutationPromise<UpdateTaskDueDateData, UpdateTaskDueDateVariables>;
export function updateTaskDueDate(dc: DataConnect, vars: UpdateTaskDueDateVariables): MutationPromise<UpdateTaskDueDateData, UpdateTaskDueDateVariables>;

interface ReassignTaskInstanceRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ReassignTaskInstanceVariables): MutationRef<ReassignTaskInstanceData, ReassignTaskInstanceVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ReassignTaskInstanceVariables): MutationRef<ReassignTaskInstanceData, ReassignTaskInstanceVariables>;
  operationName: string;
}
export const reassignTaskInstanceRef: ReassignTaskInstanceRef;

export function reassignTaskInstance(vars: ReassignTaskInstanceVariables): MutationPromise<ReassignTaskInstanceData, ReassignTaskInstanceVariables>;
export function reassignTaskInstance(dc: DataConnect, vars: ReassignTaskInstanceVariables): MutationPromise<ReassignTaskInstanceData, ReassignTaskInstanceVariables>;

interface DeleteTaskInstanceRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteTaskInstanceVariables): MutationRef<DeleteTaskInstanceData, DeleteTaskInstanceVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteTaskInstanceVariables): MutationRef<DeleteTaskInstanceData, DeleteTaskInstanceVariables>;
  operationName: string;
}
export const deleteTaskInstanceRef: DeleteTaskInstanceRef;

export function deleteTaskInstance(vars: DeleteTaskInstanceVariables): MutationPromise<DeleteTaskInstanceData, DeleteTaskInstanceVariables>;
export function deleteTaskInstance(dc: DataConnect, vars: DeleteTaskInstanceVariables): MutationPromise<DeleteTaskInstanceData, DeleteTaskInstanceVariables>;

interface RecordAttendanceEventRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: RecordAttendanceEventVariables): MutationRef<RecordAttendanceEventData, RecordAttendanceEventVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: RecordAttendanceEventVariables): MutationRef<RecordAttendanceEventData, RecordAttendanceEventVariables>;
  operationName: string;
}
export const recordAttendanceEventRef: RecordAttendanceEventRef;

export function recordAttendanceEvent(vars: RecordAttendanceEventVariables): MutationPromise<RecordAttendanceEventData, RecordAttendanceEventVariables>;
export function recordAttendanceEvent(dc: DataConnect, vars: RecordAttendanceEventVariables): MutationPromise<RecordAttendanceEventData, RecordAttendanceEventVariables>;

interface AddExpenseEntryRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddExpenseEntryVariables): MutationRef<AddExpenseEntryData, AddExpenseEntryVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AddExpenseEntryVariables): MutationRef<AddExpenseEntryData, AddExpenseEntryVariables>;
  operationName: string;
}
export const addExpenseEntryRef: AddExpenseEntryRef;

export function addExpenseEntry(vars: AddExpenseEntryVariables): MutationPromise<AddExpenseEntryData, AddExpenseEntryVariables>;
export function addExpenseEntry(dc: DataConnect, vars: AddExpenseEntryVariables): MutationPromise<AddExpenseEntryData, AddExpenseEntryVariables>;

interface UpdateExpenseEntryRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateExpenseEntryVariables): MutationRef<UpdateExpenseEntryData, UpdateExpenseEntryVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateExpenseEntryVariables): MutationRef<UpdateExpenseEntryData, UpdateExpenseEntryVariables>;
  operationName: string;
}
export const updateExpenseEntryRef: UpdateExpenseEntryRef;

export function updateExpenseEntry(vars: UpdateExpenseEntryVariables): MutationPromise<UpdateExpenseEntryData, UpdateExpenseEntryVariables>;
export function updateExpenseEntry(dc: DataConnect, vars: UpdateExpenseEntryVariables): MutationPromise<UpdateExpenseEntryData, UpdateExpenseEntryVariables>;

interface DeleteExpenseEntryRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteExpenseEntryVariables): MutationRef<DeleteExpenseEntryData, DeleteExpenseEntryVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteExpenseEntryVariables): MutationRef<DeleteExpenseEntryData, DeleteExpenseEntryVariables>;
  operationName: string;
}
export const deleteExpenseEntryRef: DeleteExpenseEntryRef;

export function deleteExpenseEntry(vars: DeleteExpenseEntryVariables): MutationPromise<DeleteExpenseEntryData, DeleteExpenseEntryVariables>;
export function deleteExpenseEntry(dc: DataConnect, vars: DeleteExpenseEntryVariables): MutationPromise<DeleteExpenseEntryData, DeleteExpenseEntryVariables>;

interface DismissAlertRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DismissAlertVariables): MutationRef<DismissAlertData, DismissAlertVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DismissAlertVariables): MutationRef<DismissAlertData, DismissAlertVariables>;
  operationName: string;
}
export const dismissAlertRef: DismissAlertRef;

export function dismissAlert(vars: DismissAlertVariables): MutationPromise<DismissAlertData, DismissAlertVariables>;
export function dismissAlert(dc: DataConnect, vars: DismissAlertVariables): MutationPromise<DismissAlertData, DismissAlertVariables>;

interface RegisterNfcTagRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: RegisterNfcTagVariables): MutationRef<RegisterNfcTagData, RegisterNfcTagVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: RegisterNfcTagVariables): MutationRef<RegisterNfcTagData, RegisterNfcTagVariables>;
  operationName: string;
}
export const registerNfcTagRef: RegisterNfcTagRef;

export function registerNfcTag(vars: RegisterNfcTagVariables): MutationPromise<RegisterNfcTagData, RegisterNfcTagVariables>;
export function registerNfcTag(dc: DataConnect, vars: RegisterNfcTagVariables): MutationPromise<RegisterNfcTagData, RegisterNfcTagVariables>;

interface RecordNfcTapRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: RecordNfcTapVariables): MutationRef<RecordNfcTapData, RecordNfcTapVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: RecordNfcTapVariables): MutationRef<RecordNfcTapData, RecordNfcTapVariables>;
  operationName: string;
}
export const recordNfcTapRef: RecordNfcTapRef;

export function recordNfcTap(vars: RecordNfcTapVariables): MutationPromise<RecordNfcTapData, RecordNfcTapVariables>;
export function recordNfcTap(dc: DataConnect, vars: RecordNfcTapVariables): MutationPromise<RecordNfcTapData, RecordNfcTapVariables>;

