const { queryRef, executeQuery, validateArgsWithOptions, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'web',
  service: 'homemaker',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;

const upsertCurrentUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertCurrentUser', inputVars);
}
upsertCurrentUserRef.operationName = 'UpsertCurrentUser';
exports.upsertCurrentUserRef = upsertCurrentUserRef;

exports.upsertCurrentUser = function upsertCurrentUser(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars);
  return executeMutation(upsertCurrentUserRef(dcInstance, inputVars));
}
;

const createHouseholdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateHousehold', inputVars);
}
createHouseholdRef.operationName = 'CreateHousehold';
exports.createHouseholdRef = createHouseholdRef;

exports.createHousehold = function createHousehold(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createHouseholdRef(dcInstance, inputVars));
}
;

const myHouseholdsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'MyHouseholds');
}
myHouseholdsRef.operationName = 'MyHouseholds';
exports.myHouseholdsRef = myHouseholdsRef;

exports.myHouseholds = function myHouseholds(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(myHouseholdsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const addStaffMemberRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddStaffMember', inputVars);
}
addStaffMemberRef.operationName = 'AddStaffMember';
exports.addStaffMemberRef = addStaffMemberRef;

exports.addStaffMember = function addStaffMember(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(addStaffMemberRef(dcInstance, inputVars));
}
;

const createHomemateProfileRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateHomemateProfile', inputVars);
}
createHomemateProfileRef.operationName = 'CreateHomemateProfile';
exports.createHomemateProfileRef = createHomemateProfileRef;

exports.createHomemateProfile = function createHomemateProfile(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createHomemateProfileRef(dcInstance, inputVars));
}
;

const createRoomZoneRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateRoomZone', inputVars);
}
createRoomZoneRef.operationName = 'CreateRoomZone';
exports.createRoomZoneRef = createRoomZoneRef;

exports.createRoomZone = function createRoomZone(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createRoomZoneRef(dcInstance, inputVars));
}
;

const createInventoryItemRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateInventoryItem', inputVars);
}
createInventoryItemRef.operationName = 'CreateInventoryItem';
exports.createInventoryItemRef = createInventoryItemRef;

exports.createInventoryItem = function createInventoryItem(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createInventoryItemRef(dcInstance, inputVars));
}
;

const createPayrollProfileRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreatePayrollProfile', inputVars);
}
createPayrollProfileRef.operationName = 'CreatePayrollProfile';
exports.createPayrollProfileRef = createPayrollProfileRef;

exports.createPayrollProfile = function createPayrollProfile(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createPayrollProfileRef(dcInstance, inputVars));
}
;

const createStaffSkillRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateStaffSkill', inputVars);
}
createStaffSkillRef.operationName = 'CreateStaffSkill';
exports.createStaffSkillRef = createStaffSkillRef;

exports.createStaffSkill = function createStaffSkill(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createStaffSkillRef(dcInstance, inputVars));
}
;

const updateStaffStatusRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateStaffStatus', inputVars);
}
updateStaffStatusRef.operationName = 'UpdateStaffStatus';
exports.updateStaffStatusRef = updateStaffStatusRef;

exports.updateStaffStatus = function updateStaffStatus(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateStaffStatusRef(dcInstance, inputVars));
}
;

const updateStaffRoleRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateStaffRole', inputVars);
}
updateStaffRoleRef.operationName = 'UpdateStaffRole';
exports.updateStaffRoleRef = updateStaffRoleRef;

exports.updateStaffRole = function updateStaffRole(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateStaffRoleRef(dcInstance, inputVars));
}
;

const updateStaffShiftRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateStaffShift', inputVars);
}
updateStaffShiftRef.operationName = 'UpdateStaffShift';
exports.updateStaffShiftRef = updateStaffShiftRef;

exports.updateStaffShift = function updateStaffShift(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateStaffShiftRef(dcInstance, inputVars));
}
;

const updateStaffPhotoRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateStaffPhoto', inputVars);
}
updateStaffPhotoRef.operationName = 'UpdateStaffPhoto';
exports.updateStaffPhotoRef = updateStaffPhotoRef;

exports.updateStaffPhoto = function updateStaffPhoto(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateStaffPhotoRef(dcInstance, inputVars));
}
;

const updateStaffTelegramIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateStaffTelegramId', inputVars);
}
updateStaffTelegramIdRef.operationName = 'UpdateStaffTelegramId';
exports.updateStaffTelegramIdRef = updateStaffTelegramIdRef;

exports.updateStaffTelegramId = function updateStaffTelegramId(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateStaffTelegramIdRef(dcInstance, inputVars));
}
;

const removeStaffMemberRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'RemoveStaffMember', inputVars);
}
removeStaffMemberRef.operationName = 'RemoveStaffMember';
exports.removeStaffMemberRef = removeStaffMemberRef;

exports.removeStaffMember = function removeStaffMember(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(removeStaffMemberRef(dcInstance, inputVars));
}
;

const addTaskInstanceRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddTaskInstance', inputVars);
}
addTaskInstanceRef.operationName = 'AddTaskInstance';
exports.addTaskInstanceRef = addTaskInstanceRef;

exports.addTaskInstance = function addTaskInstance(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(addTaskInstanceRef(dcInstance, inputVars));
}
;

const completeTaskInstanceRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CompleteTaskInstance', inputVars);
}
completeTaskInstanceRef.operationName = 'CompleteTaskInstance';
exports.completeTaskInstanceRef = completeTaskInstanceRef;

exports.completeTaskInstance = function completeTaskInstance(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(completeTaskInstanceRef(dcInstance, inputVars));
}
;

const setTaskCompletionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'SetTaskCompletion', inputVars);
}
setTaskCompletionRef.operationName = 'SetTaskCompletion';
exports.setTaskCompletionRef = setTaskCompletionRef;

exports.setTaskCompletion = function setTaskCompletion(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(setTaskCompletionRef(dcInstance, inputVars));
}
;

const updateTaskDueDateRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateTaskDueDate', inputVars);
}
updateTaskDueDateRef.operationName = 'UpdateTaskDueDate';
exports.updateTaskDueDateRef = updateTaskDueDateRef;

exports.updateTaskDueDate = function updateTaskDueDate(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateTaskDueDateRef(dcInstance, inputVars));
}
;

const reassignTaskInstanceRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'ReassignTaskInstance', inputVars);
}
reassignTaskInstanceRef.operationName = 'ReassignTaskInstance';
exports.reassignTaskInstanceRef = reassignTaskInstanceRef;

exports.reassignTaskInstance = function reassignTaskInstance(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(reassignTaskInstanceRef(dcInstance, inputVars));
}
;

const deleteTaskInstanceRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteTaskInstance', inputVars);
}
deleteTaskInstanceRef.operationName = 'DeleteTaskInstance';
exports.deleteTaskInstanceRef = deleteTaskInstanceRef;

exports.deleteTaskInstance = function deleteTaskInstance(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteTaskInstanceRef(dcInstance, inputVars));
}
;

const recordAttendanceEventRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'RecordAttendanceEvent', inputVars);
}
recordAttendanceEventRef.operationName = 'RecordAttendanceEvent';
exports.recordAttendanceEventRef = recordAttendanceEventRef;

exports.recordAttendanceEvent = function recordAttendanceEvent(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(recordAttendanceEventRef(dcInstance, inputVars));
}
;

const addExpenseEntryRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddExpenseEntry', inputVars);
}
addExpenseEntryRef.operationName = 'AddExpenseEntry';
exports.addExpenseEntryRef = addExpenseEntryRef;

exports.addExpenseEntry = function addExpenseEntry(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(addExpenseEntryRef(dcInstance, inputVars));
}
;

const updateExpenseEntryRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateExpenseEntry', inputVars);
}
updateExpenseEntryRef.operationName = 'UpdateExpenseEntry';
exports.updateExpenseEntryRef = updateExpenseEntryRef;

exports.updateExpenseEntry = function updateExpenseEntry(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateExpenseEntryRef(dcInstance, inputVars));
}
;

const deleteExpenseEntryRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteExpenseEntry', inputVars);
}
deleteExpenseEntryRef.operationName = 'DeleteExpenseEntry';
exports.deleteExpenseEntryRef = deleteExpenseEntryRef;

exports.deleteExpenseEntry = function deleteExpenseEntry(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteExpenseEntryRef(dcInstance, inputVars));
}
;

const dismissAlertRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DismissAlert', inputVars);
}
dismissAlertRef.operationName = 'DismissAlert';
exports.dismissAlertRef = dismissAlertRef;

exports.dismissAlert = function dismissAlert(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(dismissAlertRef(dcInstance, inputVars));
}
;

const createAlertRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateAlert', inputVars);
}
createAlertRef.operationName = 'CreateAlert';
exports.createAlertRef = createAlertRef;

exports.createAlert = function createAlert(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createAlertRef(dcInstance, inputVars));
}
;

const recordPayrollDeductionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'RecordPayrollDeduction', inputVars);
}
recordPayrollDeductionRef.operationName = 'RecordPayrollDeduction';
exports.recordPayrollDeductionRef = recordPayrollDeductionRef;

exports.recordPayrollDeduction = function recordPayrollDeduction(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(recordPayrollDeductionRef(dcInstance, inputVars));
}
;

const registerNfcTagRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'RegisterNfcTag', inputVars);
}
registerNfcTagRef.operationName = 'RegisterNfcTag';
exports.registerNfcTagRef = registerNfcTagRef;

exports.registerNfcTag = function registerNfcTag(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(registerNfcTagRef(dcInstance, inputVars));
}
;

const recordNfcTapRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'RecordNfcTap', inputVars);
}
recordNfcTapRef.operationName = 'RecordNfcTap';
exports.recordNfcTapRef = recordNfcTapRef;

exports.recordNfcTap = function recordNfcTap(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(recordNfcTapRef(dcInstance, inputVars));
}
;

const createStaffCashRequestRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateStaffCashRequest', inputVars);
}
createStaffCashRequestRef.operationName = 'CreateStaffCashRequest';
exports.createStaffCashRequestRef = createStaffCashRequestRef;

exports.createStaffCashRequest = function createStaffCashRequest(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createStaffCashRequestRef(dcInstance, inputVars));
}
;

const reviewStaffCashRequestRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'ReviewStaffCashRequest', inputVars);
}
reviewStaffCashRequestRef.operationName = 'ReviewStaffCashRequest';
exports.reviewStaffCashRequestRef = reviewStaffCashRequestRef;

exports.reviewStaffCashRequest = function reviewStaffCashRequest(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(reviewStaffCashRequestRef(dcInstance, inputVars));
}
;

const markStaffCashRequestPurchasedRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'MarkStaffCashRequestPurchased', inputVars);
}
markStaffCashRequestPurchasedRef.operationName = 'MarkStaffCashRequestPurchased';
exports.markStaffCashRequestPurchasedRef = markStaffCashRequestPurchasedRef;

exports.markStaffCashRequestPurchased = function markStaffCashRequestPurchased(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(markStaffCashRequestPurchasedRef(dcInstance, inputVars));
}
;

const createCctvCameraRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateCctvCamera', inputVars);
}
createCctvCameraRef.operationName = 'CreateCctvCamera';
exports.createCctvCameraRef = createCctvCameraRef;

exports.createCctvCamera = function createCctvCamera(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createCctvCameraRef(dcInstance, inputVars));
}
;

const recordCctvHealthEventRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'RecordCctvHealthEvent', inputVars);
}
recordCctvHealthEventRef.operationName = 'RecordCctvHealthEvent';
exports.recordCctvHealthEventRef = recordCctvHealthEventRef;

exports.recordCctvHealthEvent = function recordCctvHealthEvent(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(recordCctvHealthEventRef(dcInstance, inputVars));
}
;
