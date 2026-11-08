# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `web`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*OwnerAttendancePeriod*](#ownerattendanceperiod)
  - [*FindStaffAttendanceTag*](#findstaffattendancetag)
  - [*MyHouseholds*](#myhouseholds)
- [**Mutations**](#mutations)
  - [*SetOwnerDayAttendance*](#setownerdayattendance)
  - [*SaveAttendanceAndPay*](#saveattendanceandpay)
  - [*SetAppLanguage*](#setapplanguage)
  - [*EnsureMonthlyPayroll*](#ensuremonthlypayroll)
  - [*PostCashPurchase*](#postcashpurchase)
  - [*AddPaidStaffMember*](#addpaidstaffmember)
  - [*AddManualPayDeduction*](#addmanualpaydeduction)
  - [*UpsertCurrentUser*](#upsertcurrentuser)
  - [*CreateHousehold*](#createhousehold)
  - [*AddStaffMember*](#addstaffmember)
  - [*CreateHomemateProfile*](#createhomemateprofile)
  - [*UpdateHomemateProfile*](#updatehomemateprofile)
  - [*DeleteHomemateProfile*](#deletehomemateprofile)
  - [*CreateRoomZone*](#createroomzone)
  - [*UpdateRoomZone*](#updateroomzone)
  - [*DeleteRoomZone*](#deleteroomzone)
  - [*CreateInventoryItem*](#createinventoryitem)
  - [*UpdateInventoryItem*](#updateinventoryitem)
  - [*DeleteInventoryItem*](#deleteinventoryitem)
  - [*CreatePayrollProfile*](#createpayrollprofile)
  - [*CreateStaffSkill*](#createstaffskill)
  - [*UpdateStaffStatus*](#updatestaffstatus)
  - [*UpdateStaffRole*](#updatestaffrole)
  - [*UpdateStaffShift*](#updatestaffshift)
  - [*UpdateStaffPhoto*](#updatestaffphoto)
  - [*UpdateStaffTelegramId*](#updatestafftelegramid)
  - [*RemoveStaffMember*](#removestaffmember)
  - [*AddTaskInstance*](#addtaskinstance)
  - [*CompleteTaskInstance*](#completetaskinstance)
  - [*SetTaskCompletion*](#settaskcompletion)
  - [*UpdateTaskDueDate*](#updatetaskduedate)
  - [*ReassignTaskInstance*](#reassigntaskinstance)
  - [*DeleteTaskInstance*](#deletetaskinstance)
  - [*RecordAttendanceEvent*](#recordattendanceevent)
  - [*AddExpenseEntry*](#addexpenseentry)
  - [*UpdateExpenseEntry*](#updateexpenseentry)
  - [*DeleteExpenseEntry*](#deleteexpenseentry)
  - [*DismissAlert*](#dismissalert)
  - [*CreateAlert*](#createalert)
  - [*RecordPayrollDeduction*](#recordpayrolldeduction)
  - [*RegisterNfcTag*](#registernfctag)
  - [*RecordNfcTap*](#recordnfctap)
  - [*CreateStaffCashRequest*](#createstaffcashrequest)
  - [*ReviewStaffCashRequest*](#reviewstaffcashrequest)
  - [*MarkStaffCashRequestPurchased*](#markstaffcashrequestpurchased)
  - [*CreateAttendanceCorrectionRequest*](#createattendancecorrectionrequest)
  - [*ReviewAttendanceCorrectionRequest*](#reviewattendancecorrectionrequest)
  - [*CreateCctvCamera*](#createcctvcamera)
  - [*RecordCctvHealthEvent*](#recordcctvhealthevent)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `web`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@homemaker/dataconnect` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@homemaker/dataconnect';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@homemaker/dataconnect';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `web` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## OwnerAttendancePeriod
You can execute the `OwnerAttendancePeriod` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
ownerAttendancePeriod(vars: OwnerAttendancePeriodVariables, options?: ExecuteQueryOptions): QueryPromise<OwnerAttendancePeriodData, OwnerAttendancePeriodVariables>;

interface OwnerAttendancePeriodRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: OwnerAttendancePeriodVariables): QueryRef<OwnerAttendancePeriodData, OwnerAttendancePeriodVariables>;
}
export const ownerAttendancePeriodRef: OwnerAttendancePeriodRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
ownerAttendancePeriod(dc: DataConnect, vars: OwnerAttendancePeriodVariables, options?: ExecuteQueryOptions): QueryPromise<OwnerAttendancePeriodData, OwnerAttendancePeriodVariables>;

interface OwnerAttendancePeriodRef {
  ...
  (dc: DataConnect, vars: OwnerAttendancePeriodVariables): QueryRef<OwnerAttendancePeriodData, OwnerAttendancePeriodVariables>;
}
export const ownerAttendancePeriodRef: OwnerAttendancePeriodRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the ownerAttendancePeriodRef:
```typescript
const name = ownerAttendancePeriodRef.operationName;
console.log(name);
```

### Variables
The `OwnerAttendancePeriod` query requires an argument of type `OwnerAttendancePeriodVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface OwnerAttendancePeriodVariables {
  householdId: UUIDString;
  from: DateString;
  to: DateString;
  start: TimestampString;
  end: TimestampString;
}
```
### Return Type
Recall that executing the `OwnerAttendancePeriod` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `OwnerAttendancePeriodData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface OwnerAttendancePeriodData {
  corrections: ({
    staffId: UUIDString;
    requestedFor: DateString;
    requestedStatus: string;
  })[];
  events: ({
    staffId: UUIDString;
    occurredAt: TimestampString;
    eventType: string;
    source: string;
    detail?: string | null;
  })[];
}
```
### Using `OwnerAttendancePeriod`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, ownerAttendancePeriod, OwnerAttendancePeriodVariables } from '@homemaker/dataconnect';

// The `OwnerAttendancePeriod` query requires an argument of type `OwnerAttendancePeriodVariables`:
const ownerAttendancePeriodVars: OwnerAttendancePeriodVariables = {
  householdId: ..., 
  from: ..., 
  to: ..., 
  start: ..., 
  end: ..., 
};

// Call the `ownerAttendancePeriod()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await ownerAttendancePeriod(ownerAttendancePeriodVars);
// Variables can be defined inline as well.
const { data } = await ownerAttendancePeriod({ householdId: ..., from: ..., to: ..., start: ..., end: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await ownerAttendancePeriod(dataConnect, ownerAttendancePeriodVars);

console.log(data.corrections);
console.log(data.events);

// Or, you can use the `Promise` API.
ownerAttendancePeriod(ownerAttendancePeriodVars).then((response) => {
  const data = response.data;
  console.log(data.corrections);
  console.log(data.events);
});
```

### Using `OwnerAttendancePeriod`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, ownerAttendancePeriodRef, OwnerAttendancePeriodVariables } from '@homemaker/dataconnect';

// The `OwnerAttendancePeriod` query requires an argument of type `OwnerAttendancePeriodVariables`:
const ownerAttendancePeriodVars: OwnerAttendancePeriodVariables = {
  householdId: ..., 
  from: ..., 
  to: ..., 
  start: ..., 
  end: ..., 
};

// Call the `ownerAttendancePeriodRef()` function to get a reference to the query.
const ref = ownerAttendancePeriodRef(ownerAttendancePeriodVars);
// Variables can be defined inline as well.
const ref = ownerAttendancePeriodRef({ householdId: ..., from: ..., to: ..., start: ..., end: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = ownerAttendancePeriodRef(dataConnect, ownerAttendancePeriodVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.corrections);
console.log(data.events);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.corrections);
  console.log(data.events);
});
```

## FindStaffAttendanceTag
You can execute the `FindStaffAttendanceTag` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
findStaffAttendanceTag(vars: FindStaffAttendanceTagVariables, options?: ExecuteQueryOptions): QueryPromise<FindStaffAttendanceTagData, FindStaffAttendanceTagVariables>;

interface FindStaffAttendanceTagRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: FindStaffAttendanceTagVariables): QueryRef<FindStaffAttendanceTagData, FindStaffAttendanceTagVariables>;
}
export const findStaffAttendanceTagRef: FindStaffAttendanceTagRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
findStaffAttendanceTag(dc: DataConnect, vars: FindStaffAttendanceTagVariables, options?: ExecuteQueryOptions): QueryPromise<FindStaffAttendanceTagData, FindStaffAttendanceTagVariables>;

interface FindStaffAttendanceTagRef {
  ...
  (dc: DataConnect, vars: FindStaffAttendanceTagVariables): QueryRef<FindStaffAttendanceTagData, FindStaffAttendanceTagVariables>;
}
export const findStaffAttendanceTagRef: FindStaffAttendanceTagRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the findStaffAttendanceTagRef:
```typescript
const name = findStaffAttendanceTagRef.operationName;
console.log(name);
```

### Variables
The `FindStaffAttendanceTag` query requires an argument of type `FindStaffAttendanceTagVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface FindStaffAttendanceTagVariables {
  householdId: UUIDString;
  staffId: UUIDString;
}
```
### Return Type
Recall that executing the `FindStaffAttendanceTag` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `FindStaffAttendanceTagData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface FindStaffAttendanceTagData {
  nfcTags: ({
    id: UUIDString;
  } & NfcTag_Key)[];
}
```
### Using `FindStaffAttendanceTag`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, findStaffAttendanceTag, FindStaffAttendanceTagVariables } from '@homemaker/dataconnect';

// The `FindStaffAttendanceTag` query requires an argument of type `FindStaffAttendanceTagVariables`:
const findStaffAttendanceTagVars: FindStaffAttendanceTagVariables = {
  householdId: ..., 
  staffId: ..., 
};

// Call the `findStaffAttendanceTag()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await findStaffAttendanceTag(findStaffAttendanceTagVars);
// Variables can be defined inline as well.
const { data } = await findStaffAttendanceTag({ householdId: ..., staffId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await findStaffAttendanceTag(dataConnect, findStaffAttendanceTagVars);

console.log(data.nfcTags);

// Or, you can use the `Promise` API.
findStaffAttendanceTag(findStaffAttendanceTagVars).then((response) => {
  const data = response.data;
  console.log(data.nfcTags);
});
```

### Using `FindStaffAttendanceTag`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, findStaffAttendanceTagRef, FindStaffAttendanceTagVariables } from '@homemaker/dataconnect';

// The `FindStaffAttendanceTag` query requires an argument of type `FindStaffAttendanceTagVariables`:
const findStaffAttendanceTagVars: FindStaffAttendanceTagVariables = {
  householdId: ..., 
  staffId: ..., 
};

// Call the `findStaffAttendanceTagRef()` function to get a reference to the query.
const ref = findStaffAttendanceTagRef(findStaffAttendanceTagVars);
// Variables can be defined inline as well.
const ref = findStaffAttendanceTagRef({ householdId: ..., staffId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = findStaffAttendanceTagRef(dataConnect, findStaffAttendanceTagVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.nfcTags);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.nfcTags);
});
```

## MyHouseholds
You can execute the `MyHouseholds` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
myHouseholds(options?: ExecuteQueryOptions): QueryPromise<MyHouseholdsData, undefined>;

interface MyHouseholdsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<MyHouseholdsData, undefined>;
}
export const myHouseholdsRef: MyHouseholdsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
myHouseholds(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<MyHouseholdsData, undefined>;

interface MyHouseholdsRef {
  ...
  (dc: DataConnect): QueryRef<MyHouseholdsData, undefined>;
}
export const myHouseholdsRef: MyHouseholdsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the myHouseholdsRef:
```typescript
const name = myHouseholdsRef.operationName;
console.log(name);
```

### Variables
The `MyHouseholds` query has no variables.
### Return Type
Recall that executing the `MyHouseholds` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `MyHouseholdsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface MyHouseholdsData {
  households: ({
    id: UUIDString;
    name: string;
    owner: {
      language?: string | null;
    };
    payrollProfiles_on_household: ({
      staffId: UUIDString;
    })[];
    timezone: string;
    addressLabel?: string | null;
    createdAt: TimestampString;
    homemateProfiles_on_household: ({
      id: UUIDString;
      name: string;
      relationLabel?: string | null;
      phone?: string | null;
      notes?: string | null;
    } & HomemateProfile_Key)[];
    roomZones_on_household: ({
      id: UUIDString;
      name: string;
      floorLabel?: string | null;
      notes?: string | null;
    } & RoomZone_Key)[];
    inventoryItems_on_household: ({
      id: UUIDString;
      name: string;
      category: string;
      unit: string;
      currentQuantity: number;
      minimumQuantity?: number | null;
      room?: {
        id: UUIDString;
        name: string;
      } & RoomZone_Key;
    } & InventoryItem_Key)[];
    staffCashRequests_on_household: ({
      id: UUIDString;
      category: string;
      amountRequested: number;
      amountApproved?: number | null;
      reason: string;
      status: string;
      neededBy?: TimestampString | null;
      requestedAt: TimestampString;
      approvedAt?: TimestampString | null;
      purchasedAt?: TimestampString | null;
      receiptUrl?: string | null;
      notes?: string | null;
      staff?: {
        id: UUIDString;
        name: string;
        role: string;
      } & StaffMember_Key;
      inventoryItem?: {
        id: UUIDString;
        name: string;
        category: string;
        unit: string;
      } & InventoryItem_Key;
      linkedExpense?: {
        id: UUIDString;
        amount: number;
        description: string;
      } & ExpenseEntry_Key;
    } & StaffCashRequest_Key)[];
    attendanceCorrectionRequests_on_household: ({
      id: UUIDString;
      currentStatus?: string | null;
      requestedStatus: string;
      reason: string;
      status: string;
      requestedFor: DateString;
      requestedAt: TimestampString;
      reviewedAt?: TimestampString | null;
      notes?: string | null;
      staff: {
        id: UUIDString;
        name: string;
        role: string;
      } & StaffMember_Key;
    } & AttendanceCorrectionRequest_Key)[];
    cctvCameras_on_household: ({
      id: UUIDString;
      name: string;
      provider?: string | null;
      streamUrl?: string | null;
      status: string;
      lastHeartbeatAt?: TimestampString | null;
      notes?: string | null;
      room?: {
        id: UUIDString;
        name: string;
      } & RoomZone_Key;
    } & CctvCamera_Key)[];
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
    payrollRuns_on_household: ({
      id: UUIDString;
      monthLabel: string;
      baseSalary: number;
      deductions: number;
      advances: number;
      netPay: number;
      status: string;
      updatedAt: TimestampString;
      staff: {
        id: UUIDString;
      } & StaffMember_Key;
    } & PayrollRun_Key)[];
  } & Household_Key)[];
}
```
### Using `MyHouseholds`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, myHouseholds } from '@homemaker/dataconnect';


// Call the `myHouseholds()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await myHouseholds();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await myHouseholds(dataConnect);

console.log(data.households);

// Or, you can use the `Promise` API.
myHouseholds().then((response) => {
  const data = response.data;
  console.log(data.households);
});
```

### Using `MyHouseholds`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, myHouseholdsRef } from '@homemaker/dataconnect';


// Call the `myHouseholdsRef()` function to get a reference to the query.
const ref = myHouseholdsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = myHouseholdsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.households);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.households);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `web` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## SetOwnerDayAttendance
You can execute the `SetOwnerDayAttendance` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
setOwnerDayAttendance(vars: SetOwnerDayAttendanceVariables): MutationPromise<SetOwnerDayAttendanceData, SetOwnerDayAttendanceVariables>;

interface SetOwnerDayAttendanceRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: SetOwnerDayAttendanceVariables): MutationRef<SetOwnerDayAttendanceData, SetOwnerDayAttendanceVariables>;
}
export const setOwnerDayAttendanceRef: SetOwnerDayAttendanceRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
setOwnerDayAttendance(dc: DataConnect, vars: SetOwnerDayAttendanceVariables): MutationPromise<SetOwnerDayAttendanceData, SetOwnerDayAttendanceVariables>;

interface SetOwnerDayAttendanceRef {
  ...
  (dc: DataConnect, vars: SetOwnerDayAttendanceVariables): MutationRef<SetOwnerDayAttendanceData, SetOwnerDayAttendanceVariables>;
}
export const setOwnerDayAttendanceRef: SetOwnerDayAttendanceRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the setOwnerDayAttendanceRef:
```typescript
const name = setOwnerDayAttendanceRef.operationName;
console.log(name);
```

### Variables
The `SetOwnerDayAttendance` mutation requires an argument of type `SetOwnerDayAttendanceVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface SetOwnerDayAttendanceVariables {
  householdId: UUIDString;
  staffId: UUIDString;
  date: DateString;
  status: string;
  reason: string;
}
```
### Return Type
Recall that executing the `SetOwnerDayAttendance` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `SetOwnerDayAttendanceData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface SetOwnerDayAttendanceData {
  attendanceCorrectionRequest_insert: AttendanceCorrectionRequest_Key;
}
```
### Using `SetOwnerDayAttendance`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, setOwnerDayAttendance, SetOwnerDayAttendanceVariables } from '@homemaker/dataconnect';

// The `SetOwnerDayAttendance` mutation requires an argument of type `SetOwnerDayAttendanceVariables`:
const setOwnerDayAttendanceVars: SetOwnerDayAttendanceVariables = {
  householdId: ..., 
  staffId: ..., 
  date: ..., 
  status: ..., 
  reason: ..., 
};

// Call the `setOwnerDayAttendance()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await setOwnerDayAttendance(setOwnerDayAttendanceVars);
// Variables can be defined inline as well.
const { data } = await setOwnerDayAttendance({ householdId: ..., staffId: ..., date: ..., status: ..., reason: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await setOwnerDayAttendance(dataConnect, setOwnerDayAttendanceVars);

console.log(data.attendanceCorrectionRequest_insert);

// Or, you can use the `Promise` API.
setOwnerDayAttendance(setOwnerDayAttendanceVars).then((response) => {
  const data = response.data;
  console.log(data.attendanceCorrectionRequest_insert);
});
```

### Using `SetOwnerDayAttendance`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, setOwnerDayAttendanceRef, SetOwnerDayAttendanceVariables } from '@homemaker/dataconnect';

// The `SetOwnerDayAttendance` mutation requires an argument of type `SetOwnerDayAttendanceVariables`:
const setOwnerDayAttendanceVars: SetOwnerDayAttendanceVariables = {
  householdId: ..., 
  staffId: ..., 
  date: ..., 
  status: ..., 
  reason: ..., 
};

// Call the `setOwnerDayAttendanceRef()` function to get a reference to the mutation.
const ref = setOwnerDayAttendanceRef(setOwnerDayAttendanceVars);
// Variables can be defined inline as well.
const ref = setOwnerDayAttendanceRef({ householdId: ..., staffId: ..., date: ..., status: ..., reason: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = setOwnerDayAttendanceRef(dataConnect, setOwnerDayAttendanceVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.attendanceCorrectionRequest_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.attendanceCorrectionRequest_insert);
});
```

## SaveAttendanceAndPay
You can execute the `SaveAttendanceAndPay` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
saveAttendanceAndPay(vars: SaveAttendanceAndPayVariables): MutationPromise<SaveAttendanceAndPayData, SaveAttendanceAndPayVariables>;

interface SaveAttendanceAndPayRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: SaveAttendanceAndPayVariables): MutationRef<SaveAttendanceAndPayData, SaveAttendanceAndPayVariables>;
}
export const saveAttendanceAndPayRef: SaveAttendanceAndPayRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
saveAttendanceAndPay(dc: DataConnect, vars: SaveAttendanceAndPayVariables): MutationPromise<SaveAttendanceAndPayData, SaveAttendanceAndPayVariables>;

interface SaveAttendanceAndPayRef {
  ...
  (dc: DataConnect, vars: SaveAttendanceAndPayVariables): MutationRef<SaveAttendanceAndPayData, SaveAttendanceAndPayVariables>;
}
export const saveAttendanceAndPayRef: SaveAttendanceAndPayRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the saveAttendanceAndPayRef:
```typescript
const name = saveAttendanceAndPayRef.operationName;
console.log(name);
```

### Variables
The `SaveAttendanceAndPay` mutation requires an argument of type `SaveAttendanceAndPayVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface SaveAttendanceAndPayVariables {
  householdId: UUIDString;
  staffId: UUIDString;
  date: DateString;
  status: string;
  reason: string;
  requestId?: UUIDString | null;
}
```
### Return Type
Recall that executing the `SaveAttendanceAndPay` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `SaveAttendanceAndPayData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface SaveAttendanceAndPayData {
  lockStaff?: number | null;
  review?: number | null;
  edit?: number | null;
  ensureRun?: number | null;
  reconcile?: number | null;
}
```
### Using `SaveAttendanceAndPay`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, saveAttendanceAndPay, SaveAttendanceAndPayVariables } from '@homemaker/dataconnect';

// The `SaveAttendanceAndPay` mutation requires an argument of type `SaveAttendanceAndPayVariables`:
const saveAttendanceAndPayVars: SaveAttendanceAndPayVariables = {
  householdId: ..., 
  staffId: ..., 
  date: ..., 
  status: ..., 
  reason: ..., 
  requestId: ..., // optional
};

// Call the `saveAttendanceAndPay()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await saveAttendanceAndPay(saveAttendanceAndPayVars);
// Variables can be defined inline as well.
const { data } = await saveAttendanceAndPay({ householdId: ..., staffId: ..., date: ..., status: ..., reason: ..., requestId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await saveAttendanceAndPay(dataConnect, saveAttendanceAndPayVars);

console.log(data.lockStaff);
console.log(data.review);
console.log(data.edit);
console.log(data.ensureRun);
console.log(data.reconcile);

// Or, you can use the `Promise` API.
saveAttendanceAndPay(saveAttendanceAndPayVars).then((response) => {
  const data = response.data;
  console.log(data.lockStaff);
  console.log(data.review);
  console.log(data.edit);
  console.log(data.ensureRun);
  console.log(data.reconcile);
});
```

### Using `SaveAttendanceAndPay`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, saveAttendanceAndPayRef, SaveAttendanceAndPayVariables } from '@homemaker/dataconnect';

// The `SaveAttendanceAndPay` mutation requires an argument of type `SaveAttendanceAndPayVariables`:
const saveAttendanceAndPayVars: SaveAttendanceAndPayVariables = {
  householdId: ..., 
  staffId: ..., 
  date: ..., 
  status: ..., 
  reason: ..., 
  requestId: ..., // optional
};

// Call the `saveAttendanceAndPayRef()` function to get a reference to the mutation.
const ref = saveAttendanceAndPayRef(saveAttendanceAndPayVars);
// Variables can be defined inline as well.
const ref = saveAttendanceAndPayRef({ householdId: ..., staffId: ..., date: ..., status: ..., reason: ..., requestId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = saveAttendanceAndPayRef(dataConnect, saveAttendanceAndPayVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.lockStaff);
console.log(data.review);
console.log(data.edit);
console.log(data.ensureRun);
console.log(data.reconcile);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.lockStaff);
  console.log(data.review);
  console.log(data.edit);
  console.log(data.ensureRun);
  console.log(data.reconcile);
});
```

## SetAppLanguage
You can execute the `SetAppLanguage` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
setAppLanguage(vars: SetAppLanguageVariables): MutationPromise<SetAppLanguageData, SetAppLanguageVariables>;

interface SetAppLanguageRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: SetAppLanguageVariables): MutationRef<SetAppLanguageData, SetAppLanguageVariables>;
}
export const setAppLanguageRef: SetAppLanguageRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
setAppLanguage(dc: DataConnect, vars: SetAppLanguageVariables): MutationPromise<SetAppLanguageData, SetAppLanguageVariables>;

interface SetAppLanguageRef {
  ...
  (dc: DataConnect, vars: SetAppLanguageVariables): MutationRef<SetAppLanguageData, SetAppLanguageVariables>;
}
export const setAppLanguageRef: SetAppLanguageRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the setAppLanguageRef:
```typescript
const name = setAppLanguageRef.operationName;
console.log(name);
```

### Variables
The `SetAppLanguage` mutation requires an argument of type `SetAppLanguageVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface SetAppLanguageVariables {
  language: string;
}
```
### Return Type
Recall that executing the `SetAppLanguage` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `SetAppLanguageData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface SetAppLanguageData {
  user_upsert: User_Key;
}
```
### Using `SetAppLanguage`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, setAppLanguage, SetAppLanguageVariables } from '@homemaker/dataconnect';

// The `SetAppLanguage` mutation requires an argument of type `SetAppLanguageVariables`:
const setAppLanguageVars: SetAppLanguageVariables = {
  language: ..., 
};

// Call the `setAppLanguage()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await setAppLanguage(setAppLanguageVars);
// Variables can be defined inline as well.
const { data } = await setAppLanguage({ language: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await setAppLanguage(dataConnect, setAppLanguageVars);

console.log(data.user_upsert);

// Or, you can use the `Promise` API.
setAppLanguage(setAppLanguageVars).then((response) => {
  const data = response.data;
  console.log(data.user_upsert);
});
```

### Using `SetAppLanguage`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, setAppLanguageRef, SetAppLanguageVariables } from '@homemaker/dataconnect';

// The `SetAppLanguage` mutation requires an argument of type `SetAppLanguageVariables`:
const setAppLanguageVars: SetAppLanguageVariables = {
  language: ..., 
};

// Call the `setAppLanguageRef()` function to get a reference to the mutation.
const ref = setAppLanguageRef(setAppLanguageVars);
// Variables can be defined inline as well.
const ref = setAppLanguageRef({ language: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = setAppLanguageRef(dataConnect, setAppLanguageVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_upsert);
});
```

## EnsureMonthlyPayroll
You can execute the `EnsureMonthlyPayroll` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
ensureMonthlyPayroll(vars: EnsureMonthlyPayrollVariables): MutationPromise<EnsureMonthlyPayrollData, EnsureMonthlyPayrollVariables>;

interface EnsureMonthlyPayrollRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: EnsureMonthlyPayrollVariables): MutationRef<EnsureMonthlyPayrollData, EnsureMonthlyPayrollVariables>;
}
export const ensureMonthlyPayrollRef: EnsureMonthlyPayrollRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
ensureMonthlyPayroll(dc: DataConnect, vars: EnsureMonthlyPayrollVariables): MutationPromise<EnsureMonthlyPayrollData, EnsureMonthlyPayrollVariables>;

interface EnsureMonthlyPayrollRef {
  ...
  (dc: DataConnect, vars: EnsureMonthlyPayrollVariables): MutationRef<EnsureMonthlyPayrollData, EnsureMonthlyPayrollVariables>;
}
export const ensureMonthlyPayrollRef: EnsureMonthlyPayrollRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the ensureMonthlyPayrollRef:
```typescript
const name = ensureMonthlyPayrollRef.operationName;
console.log(name);
```

### Variables
The `EnsureMonthlyPayroll` mutation requires an argument of type `EnsureMonthlyPayrollVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface EnsureMonthlyPayrollVariables {
  householdId: UUIDString;
}
```
### Return Type
Recall that executing the `EnsureMonthlyPayroll` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `EnsureMonthlyPayrollData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface EnsureMonthlyPayrollData {
  lockHousehold?: number | null;
  profiles?: number | null;
  runs?: number | null;
}
```
### Using `EnsureMonthlyPayroll`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, ensureMonthlyPayroll, EnsureMonthlyPayrollVariables } from '@homemaker/dataconnect';

// The `EnsureMonthlyPayroll` mutation requires an argument of type `EnsureMonthlyPayrollVariables`:
const ensureMonthlyPayrollVars: EnsureMonthlyPayrollVariables = {
  householdId: ..., 
};

// Call the `ensureMonthlyPayroll()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await ensureMonthlyPayroll(ensureMonthlyPayrollVars);
// Variables can be defined inline as well.
const { data } = await ensureMonthlyPayroll({ householdId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await ensureMonthlyPayroll(dataConnect, ensureMonthlyPayrollVars);

console.log(data.lockHousehold);
console.log(data.profiles);
console.log(data.runs);

// Or, you can use the `Promise` API.
ensureMonthlyPayroll(ensureMonthlyPayrollVars).then((response) => {
  const data = response.data;
  console.log(data.lockHousehold);
  console.log(data.profiles);
  console.log(data.runs);
});
```

### Using `EnsureMonthlyPayroll`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, ensureMonthlyPayrollRef, EnsureMonthlyPayrollVariables } from '@homemaker/dataconnect';

// The `EnsureMonthlyPayroll` mutation requires an argument of type `EnsureMonthlyPayrollVariables`:
const ensureMonthlyPayrollVars: EnsureMonthlyPayrollVariables = {
  householdId: ..., 
};

// Call the `ensureMonthlyPayrollRef()` function to get a reference to the mutation.
const ref = ensureMonthlyPayrollRef(ensureMonthlyPayrollVars);
// Variables can be defined inline as well.
const ref = ensureMonthlyPayrollRef({ householdId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = ensureMonthlyPayrollRef(dataConnect, ensureMonthlyPayrollVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.lockHousehold);
console.log(data.profiles);
console.log(data.runs);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.lockHousehold);
  console.log(data.profiles);
  console.log(data.runs);
});
```

## PostCashPurchase
You can execute the `PostCashPurchase` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
postCashPurchase(vars: PostCashPurchaseVariables): MutationPromise<PostCashPurchaseData, PostCashPurchaseVariables>;

interface PostCashPurchaseRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: PostCashPurchaseVariables): MutationRef<PostCashPurchaseData, PostCashPurchaseVariables>;
}
export const postCashPurchaseRef: PostCashPurchaseRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
postCashPurchase(dc: DataConnect, vars: PostCashPurchaseVariables): MutationPromise<PostCashPurchaseData, PostCashPurchaseVariables>;

interface PostCashPurchaseRef {
  ...
  (dc: DataConnect, vars: PostCashPurchaseVariables): MutationRef<PostCashPurchaseData, PostCashPurchaseVariables>;
}
export const postCashPurchaseRef: PostCashPurchaseRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the postCashPurchaseRef:
```typescript
const name = postCashPurchaseRef.operationName;
console.log(name);
```

### Variables
The `PostCashPurchase` mutation requires an argument of type `PostCashPurchaseVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface PostCashPurchaseVariables {
  requestId: UUIDString;
  itemId?: UUIDString | null;
  quantity: number;
}
```
### Return Type
Recall that executing the `PostCashPurchase` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `PostCashPurchaseData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface PostCashPurchaseData {
  claim?: number | null;
  expense?: number | null;
  post?: number | null;
  stock?: number | null;
  movement?: number | null;
}
```
### Using `PostCashPurchase`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, postCashPurchase, PostCashPurchaseVariables } from '@homemaker/dataconnect';

// The `PostCashPurchase` mutation requires an argument of type `PostCashPurchaseVariables`:
const postCashPurchaseVars: PostCashPurchaseVariables = {
  requestId: ..., 
  itemId: ..., // optional
  quantity: ..., 
};

// Call the `postCashPurchase()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await postCashPurchase(postCashPurchaseVars);
// Variables can be defined inline as well.
const { data } = await postCashPurchase({ requestId: ..., itemId: ..., quantity: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await postCashPurchase(dataConnect, postCashPurchaseVars);

console.log(data.claim);
console.log(data.expense);
console.log(data.post);
console.log(data.stock);
console.log(data.movement);

// Or, you can use the `Promise` API.
postCashPurchase(postCashPurchaseVars).then((response) => {
  const data = response.data;
  console.log(data.claim);
  console.log(data.expense);
  console.log(data.post);
  console.log(data.stock);
  console.log(data.movement);
});
```

### Using `PostCashPurchase`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, postCashPurchaseRef, PostCashPurchaseVariables } from '@homemaker/dataconnect';

// The `PostCashPurchase` mutation requires an argument of type `PostCashPurchaseVariables`:
const postCashPurchaseVars: PostCashPurchaseVariables = {
  requestId: ..., 
  itemId: ..., // optional
  quantity: ..., 
};

// Call the `postCashPurchaseRef()` function to get a reference to the mutation.
const ref = postCashPurchaseRef(postCashPurchaseVars);
// Variables can be defined inline as well.
const ref = postCashPurchaseRef({ requestId: ..., itemId: ..., quantity: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = postCashPurchaseRef(dataConnect, postCashPurchaseVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.claim);
console.log(data.expense);
console.log(data.post);
console.log(data.stock);
console.log(data.movement);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.claim);
  console.log(data.expense);
  console.log(data.post);
  console.log(data.stock);
  console.log(data.movement);
});
```

## AddPaidStaffMember
You can execute the `AddPaidStaffMember` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
addPaidStaffMember(vars: AddPaidStaffMemberVariables): MutationPromise<AddPaidStaffMemberData, AddPaidStaffMemberVariables>;

interface AddPaidStaffMemberRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddPaidStaffMemberVariables): MutationRef<AddPaidStaffMemberData, AddPaidStaffMemberVariables>;
}
export const addPaidStaffMemberRef: AddPaidStaffMemberRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
addPaidStaffMember(dc: DataConnect, vars: AddPaidStaffMemberVariables): MutationPromise<AddPaidStaffMemberData, AddPaidStaffMemberVariables>;

interface AddPaidStaffMemberRef {
  ...
  (dc: DataConnect, vars: AddPaidStaffMemberVariables): MutationRef<AddPaidStaffMemberData, AddPaidStaffMemberVariables>;
}
export const addPaidStaffMemberRef: AddPaidStaffMemberRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the addPaidStaffMemberRef:
```typescript
const name = addPaidStaffMemberRef.operationName;
console.log(name);
```

### Variables
The `AddPaidStaffMember` mutation requires an argument of type `AddPaidStaffMemberVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AddPaidStaffMemberVariables {
  householdId: UUIDString;
  month: string;
  name: string;
  role: string;
  department: string;
  phone?: string | null;
  salary: number;
  shiftStart?: string | null;
  shiftEnd?: string | null;
}
```
### Return Type
Recall that executing the `AddPaidStaffMember` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AddPaidStaffMemberData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AddPaidStaffMemberData {
  staffMember_insert: StaffMember_Key;
  payrollProfile_insert: PayrollProfile_Key;
  payrollRun_insert: PayrollRun_Key;
}
```
### Using `AddPaidStaffMember`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, addPaidStaffMember, AddPaidStaffMemberVariables } from '@homemaker/dataconnect';

// The `AddPaidStaffMember` mutation requires an argument of type `AddPaidStaffMemberVariables`:
const addPaidStaffMemberVars: AddPaidStaffMemberVariables = {
  householdId: ..., 
  month: ..., 
  name: ..., 
  role: ..., 
  department: ..., 
  phone: ..., // optional
  salary: ..., 
  shiftStart: ..., // optional
  shiftEnd: ..., // optional
};

// Call the `addPaidStaffMember()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await addPaidStaffMember(addPaidStaffMemberVars);
// Variables can be defined inline as well.
const { data } = await addPaidStaffMember({ householdId: ..., month: ..., name: ..., role: ..., department: ..., phone: ..., salary: ..., shiftStart: ..., shiftEnd: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await addPaidStaffMember(dataConnect, addPaidStaffMemberVars);

console.log(data.staffMember_insert);
console.log(data.payrollProfile_insert);
console.log(data.payrollRun_insert);

// Or, you can use the `Promise` API.
addPaidStaffMember(addPaidStaffMemberVars).then((response) => {
  const data = response.data;
  console.log(data.staffMember_insert);
  console.log(data.payrollProfile_insert);
  console.log(data.payrollRun_insert);
});
```

### Using `AddPaidStaffMember`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, addPaidStaffMemberRef, AddPaidStaffMemberVariables } from '@homemaker/dataconnect';

// The `AddPaidStaffMember` mutation requires an argument of type `AddPaidStaffMemberVariables`:
const addPaidStaffMemberVars: AddPaidStaffMemberVariables = {
  householdId: ..., 
  month: ..., 
  name: ..., 
  role: ..., 
  department: ..., 
  phone: ..., // optional
  salary: ..., 
  shiftStart: ..., // optional
  shiftEnd: ..., // optional
};

// Call the `addPaidStaffMemberRef()` function to get a reference to the mutation.
const ref = addPaidStaffMemberRef(addPaidStaffMemberVars);
// Variables can be defined inline as well.
const ref = addPaidStaffMemberRef({ householdId: ..., month: ..., name: ..., role: ..., department: ..., phone: ..., salary: ..., shiftStart: ..., shiftEnd: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = addPaidStaffMemberRef(dataConnect, addPaidStaffMemberVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.staffMember_insert);
console.log(data.payrollProfile_insert);
console.log(data.payrollRun_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.staffMember_insert);
  console.log(data.payrollProfile_insert);
  console.log(data.payrollRun_insert);
});
```

## AddManualPayDeduction
You can execute the `AddManualPayDeduction` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
addManualPayDeduction(vars: AddManualPayDeductionVariables): MutationPromise<AddManualPayDeductionData, AddManualPayDeductionVariables>;

interface AddManualPayDeductionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddManualPayDeductionVariables): MutationRef<AddManualPayDeductionData, AddManualPayDeductionVariables>;
}
export const addManualPayDeductionRef: AddManualPayDeductionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
addManualPayDeduction(dc: DataConnect, vars: AddManualPayDeductionVariables): MutationPromise<AddManualPayDeductionData, AddManualPayDeductionVariables>;

interface AddManualPayDeductionRef {
  ...
  (dc: DataConnect, vars: AddManualPayDeductionVariables): MutationRef<AddManualPayDeductionData, AddManualPayDeductionVariables>;
}
export const addManualPayDeductionRef: AddManualPayDeductionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the addManualPayDeductionRef:
```typescript
const name = addManualPayDeductionRef.operationName;
console.log(name);
```

### Variables
The `AddManualPayDeduction` mutation requires an argument of type `AddManualPayDeductionVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AddManualPayDeductionVariables {
  staffId: UUIDString;
  month: string;
  amount: number;
}
```
### Return Type
Recall that executing the `AddManualPayDeduction` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AddManualPayDeductionData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AddManualPayDeductionData {
  lockStaff?: number | null;
  deduction?: number | null;
}
```
### Using `AddManualPayDeduction`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, addManualPayDeduction, AddManualPayDeductionVariables } from '@homemaker/dataconnect';

// The `AddManualPayDeduction` mutation requires an argument of type `AddManualPayDeductionVariables`:
const addManualPayDeductionVars: AddManualPayDeductionVariables = {
  staffId: ..., 
  month: ..., 
  amount: ..., 
};

// Call the `addManualPayDeduction()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await addManualPayDeduction(addManualPayDeductionVars);
// Variables can be defined inline as well.
const { data } = await addManualPayDeduction({ staffId: ..., month: ..., amount: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await addManualPayDeduction(dataConnect, addManualPayDeductionVars);

console.log(data.lockStaff);
console.log(data.deduction);

// Or, you can use the `Promise` API.
addManualPayDeduction(addManualPayDeductionVars).then((response) => {
  const data = response.data;
  console.log(data.lockStaff);
  console.log(data.deduction);
});
```

### Using `AddManualPayDeduction`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, addManualPayDeductionRef, AddManualPayDeductionVariables } from '@homemaker/dataconnect';

// The `AddManualPayDeduction` mutation requires an argument of type `AddManualPayDeductionVariables`:
const addManualPayDeductionVars: AddManualPayDeductionVariables = {
  staffId: ..., 
  month: ..., 
  amount: ..., 
};

// Call the `addManualPayDeductionRef()` function to get a reference to the mutation.
const ref = addManualPayDeductionRef(addManualPayDeductionVars);
// Variables can be defined inline as well.
const ref = addManualPayDeductionRef({ staffId: ..., month: ..., amount: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = addManualPayDeductionRef(dataConnect, addManualPayDeductionVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.lockStaff);
console.log(data.deduction);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.lockStaff);
  console.log(data.deduction);
});
```

## UpsertCurrentUser
You can execute the `UpsertCurrentUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
upsertCurrentUser(vars?: UpsertCurrentUserVariables): MutationPromise<UpsertCurrentUserData, UpsertCurrentUserVariables>;

interface UpsertCurrentUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars?: UpsertCurrentUserVariables): MutationRef<UpsertCurrentUserData, UpsertCurrentUserVariables>;
}
export const upsertCurrentUserRef: UpsertCurrentUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertCurrentUser(dc: DataConnect, vars?: UpsertCurrentUserVariables): MutationPromise<UpsertCurrentUserData, UpsertCurrentUserVariables>;

interface UpsertCurrentUserRef {
  ...
  (dc: DataConnect, vars?: UpsertCurrentUserVariables): MutationRef<UpsertCurrentUserData, UpsertCurrentUserVariables>;
}
export const upsertCurrentUserRef: UpsertCurrentUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertCurrentUserRef:
```typescript
const name = upsertCurrentUserRef.operationName;
console.log(name);
```

### Variables
The `UpsertCurrentUser` mutation has an optional argument of type `UpsertCurrentUserVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpsertCurrentUserVariables {
  displayName?: string | null;
  email?: string | null;
}
```
### Return Type
Recall that executing the `UpsertCurrentUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertCurrentUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertCurrentUserData {
  user_upsert: User_Key;
}
```
### Using `UpsertCurrentUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertCurrentUser, UpsertCurrentUserVariables } from '@homemaker/dataconnect';

// The `UpsertCurrentUser` mutation has an optional argument of type `UpsertCurrentUserVariables`:
const upsertCurrentUserVars: UpsertCurrentUserVariables = {
  displayName: ..., // optional
  email: ..., // optional
};

// Call the `upsertCurrentUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertCurrentUser(upsertCurrentUserVars);
// Variables can be defined inline as well.
const { data } = await upsertCurrentUser({ displayName: ..., email: ..., });
// Since all variables are optional for this mutation, you can omit the `UpsertCurrentUserVariables` argument.
const { data } = await upsertCurrentUser();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertCurrentUser(dataConnect, upsertCurrentUserVars);

console.log(data.user_upsert);

// Or, you can use the `Promise` API.
upsertCurrentUser(upsertCurrentUserVars).then((response) => {
  const data = response.data;
  console.log(data.user_upsert);
});
```

### Using `UpsertCurrentUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertCurrentUserRef, UpsertCurrentUserVariables } from '@homemaker/dataconnect';

// The `UpsertCurrentUser` mutation has an optional argument of type `UpsertCurrentUserVariables`:
const upsertCurrentUserVars: UpsertCurrentUserVariables = {
  displayName: ..., // optional
  email: ..., // optional
};

// Call the `upsertCurrentUserRef()` function to get a reference to the mutation.
const ref = upsertCurrentUserRef(upsertCurrentUserVars);
// Variables can be defined inline as well.
const ref = upsertCurrentUserRef({ displayName: ..., email: ..., });
// Since all variables are optional for this mutation, you can omit the `UpsertCurrentUserVariables` argument.
const ref = upsertCurrentUserRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertCurrentUserRef(dataConnect, upsertCurrentUserVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_upsert);
});
```

## CreateHousehold
You can execute the `CreateHousehold` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createHousehold(vars: CreateHouseholdVariables): MutationPromise<CreateHouseholdData, CreateHouseholdVariables>;

interface CreateHouseholdRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateHouseholdVariables): MutationRef<CreateHouseholdData, CreateHouseholdVariables>;
}
export const createHouseholdRef: CreateHouseholdRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createHousehold(dc: DataConnect, vars: CreateHouseholdVariables): MutationPromise<CreateHouseholdData, CreateHouseholdVariables>;

interface CreateHouseholdRef {
  ...
  (dc: DataConnect, vars: CreateHouseholdVariables): MutationRef<CreateHouseholdData, CreateHouseholdVariables>;
}
export const createHouseholdRef: CreateHouseholdRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createHouseholdRef:
```typescript
const name = createHouseholdRef.operationName;
console.log(name);
```

### Variables
The `CreateHousehold` mutation requires an argument of type `CreateHouseholdVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateHouseholdVariables {
  name: string;
  timezone: string;
  addressLabel?: string | null;
}
```
### Return Type
Recall that executing the `CreateHousehold` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateHouseholdData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateHouseholdData {
  user_upsert: User_Key;
  household_insert: Household_Key;
}
```
### Using `CreateHousehold`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createHousehold, CreateHouseholdVariables } from '@homemaker/dataconnect';

// The `CreateHousehold` mutation requires an argument of type `CreateHouseholdVariables`:
const createHouseholdVars: CreateHouseholdVariables = {
  name: ..., 
  timezone: ..., 
  addressLabel: ..., // optional
};

// Call the `createHousehold()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createHousehold(createHouseholdVars);
// Variables can be defined inline as well.
const { data } = await createHousehold({ name: ..., timezone: ..., addressLabel: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createHousehold(dataConnect, createHouseholdVars);

console.log(data.user_upsert);
console.log(data.household_insert);

// Or, you can use the `Promise` API.
createHousehold(createHouseholdVars).then((response) => {
  const data = response.data;
  console.log(data.user_upsert);
  console.log(data.household_insert);
});
```

### Using `CreateHousehold`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createHouseholdRef, CreateHouseholdVariables } from '@homemaker/dataconnect';

// The `CreateHousehold` mutation requires an argument of type `CreateHouseholdVariables`:
const createHouseholdVars: CreateHouseholdVariables = {
  name: ..., 
  timezone: ..., 
  addressLabel: ..., // optional
};

// Call the `createHouseholdRef()` function to get a reference to the mutation.
const ref = createHouseholdRef(createHouseholdVars);
// Variables can be defined inline as well.
const ref = createHouseholdRef({ name: ..., timezone: ..., addressLabel: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createHouseholdRef(dataConnect, createHouseholdVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_upsert);
console.log(data.household_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_upsert);
  console.log(data.household_insert);
});
```

## AddStaffMember
You can execute the `AddStaffMember` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
addStaffMember(vars: AddStaffMemberVariables): MutationPromise<AddStaffMemberData, AddStaffMemberVariables>;

interface AddStaffMemberRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddStaffMemberVariables): MutationRef<AddStaffMemberData, AddStaffMemberVariables>;
}
export const addStaffMemberRef: AddStaffMemberRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
addStaffMember(dc: DataConnect, vars: AddStaffMemberVariables): MutationPromise<AddStaffMemberData, AddStaffMemberVariables>;

interface AddStaffMemberRef {
  ...
  (dc: DataConnect, vars: AddStaffMemberVariables): MutationRef<AddStaffMemberData, AddStaffMemberVariables>;
}
export const addStaffMemberRef: AddStaffMemberRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the addStaffMemberRef:
```typescript
const name = addStaffMemberRef.operationName;
console.log(name);
```

### Variables
The `AddStaffMember` mutation requires an argument of type `AddStaffMemberVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `AddStaffMember` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AddStaffMemberData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AddStaffMemberData {
  staffMember_insert: StaffMember_Key;
}
```
### Using `AddStaffMember`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, addStaffMember, AddStaffMemberVariables } from '@homemaker/dataconnect';

// The `AddStaffMember` mutation requires an argument of type `AddStaffMemberVariables`:
const addStaffMemberVars: AddStaffMemberVariables = {
  householdId: ..., 
  name: ..., 
  role: ..., 
  department: ..., 
  phone: ..., // optional
  salary: ..., 
  shiftStart: ..., // optional
  shiftEnd: ..., // optional
};

// Call the `addStaffMember()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await addStaffMember(addStaffMemberVars);
// Variables can be defined inline as well.
const { data } = await addStaffMember({ householdId: ..., name: ..., role: ..., department: ..., phone: ..., salary: ..., shiftStart: ..., shiftEnd: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await addStaffMember(dataConnect, addStaffMemberVars);

console.log(data.staffMember_insert);

// Or, you can use the `Promise` API.
addStaffMember(addStaffMemberVars).then((response) => {
  const data = response.data;
  console.log(data.staffMember_insert);
});
```

### Using `AddStaffMember`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, addStaffMemberRef, AddStaffMemberVariables } from '@homemaker/dataconnect';

// The `AddStaffMember` mutation requires an argument of type `AddStaffMemberVariables`:
const addStaffMemberVars: AddStaffMemberVariables = {
  householdId: ..., 
  name: ..., 
  role: ..., 
  department: ..., 
  phone: ..., // optional
  salary: ..., 
  shiftStart: ..., // optional
  shiftEnd: ..., // optional
};

// Call the `addStaffMemberRef()` function to get a reference to the mutation.
const ref = addStaffMemberRef(addStaffMemberVars);
// Variables can be defined inline as well.
const ref = addStaffMemberRef({ householdId: ..., name: ..., role: ..., department: ..., phone: ..., salary: ..., shiftStart: ..., shiftEnd: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = addStaffMemberRef(dataConnect, addStaffMemberVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.staffMember_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.staffMember_insert);
});
```

## CreateHomemateProfile
You can execute the `CreateHomemateProfile` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createHomemateProfile(vars: CreateHomemateProfileVariables): MutationPromise<CreateHomemateProfileData, CreateHomemateProfileVariables>;

interface CreateHomemateProfileRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateHomemateProfileVariables): MutationRef<CreateHomemateProfileData, CreateHomemateProfileVariables>;
}
export const createHomemateProfileRef: CreateHomemateProfileRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createHomemateProfile(dc: DataConnect, vars: CreateHomemateProfileVariables): MutationPromise<CreateHomemateProfileData, CreateHomemateProfileVariables>;

interface CreateHomemateProfileRef {
  ...
  (dc: DataConnect, vars: CreateHomemateProfileVariables): MutationRef<CreateHomemateProfileData, CreateHomemateProfileVariables>;
}
export const createHomemateProfileRef: CreateHomemateProfileRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createHomemateProfileRef:
```typescript
const name = createHomemateProfileRef.operationName;
console.log(name);
```

### Variables
The `CreateHomemateProfile` mutation requires an argument of type `CreateHomemateProfileVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateHomemateProfileVariables {
  householdId: UUIDString;
  name: string;
  relationLabel?: string | null;
  phone?: string | null;
  notes?: string | null;
}
```
### Return Type
Recall that executing the `CreateHomemateProfile` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateHomemateProfileData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateHomemateProfileData {
  homemateProfile_insert: HomemateProfile_Key;
}
```
### Using `CreateHomemateProfile`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createHomemateProfile, CreateHomemateProfileVariables } from '@homemaker/dataconnect';

// The `CreateHomemateProfile` mutation requires an argument of type `CreateHomemateProfileVariables`:
const createHomemateProfileVars: CreateHomemateProfileVariables = {
  householdId: ..., 
  name: ..., 
  relationLabel: ..., // optional
  phone: ..., // optional
  notes: ..., // optional
};

// Call the `createHomemateProfile()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createHomemateProfile(createHomemateProfileVars);
// Variables can be defined inline as well.
const { data } = await createHomemateProfile({ householdId: ..., name: ..., relationLabel: ..., phone: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createHomemateProfile(dataConnect, createHomemateProfileVars);

console.log(data.homemateProfile_insert);

// Or, you can use the `Promise` API.
createHomemateProfile(createHomemateProfileVars).then((response) => {
  const data = response.data;
  console.log(data.homemateProfile_insert);
});
```

### Using `CreateHomemateProfile`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createHomemateProfileRef, CreateHomemateProfileVariables } from '@homemaker/dataconnect';

// The `CreateHomemateProfile` mutation requires an argument of type `CreateHomemateProfileVariables`:
const createHomemateProfileVars: CreateHomemateProfileVariables = {
  householdId: ..., 
  name: ..., 
  relationLabel: ..., // optional
  phone: ..., // optional
  notes: ..., // optional
};

// Call the `createHomemateProfileRef()` function to get a reference to the mutation.
const ref = createHomemateProfileRef(createHomemateProfileVars);
// Variables can be defined inline as well.
const ref = createHomemateProfileRef({ householdId: ..., name: ..., relationLabel: ..., phone: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createHomemateProfileRef(dataConnect, createHomemateProfileVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.homemateProfile_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.homemateProfile_insert);
});
```

## UpdateHomemateProfile
You can execute the `UpdateHomemateProfile` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateHomemateProfile(vars: UpdateHomemateProfileVariables): MutationPromise<UpdateHomemateProfileData, UpdateHomemateProfileVariables>;

interface UpdateHomemateProfileRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateHomemateProfileVariables): MutationRef<UpdateHomemateProfileData, UpdateHomemateProfileVariables>;
}
export const updateHomemateProfileRef: UpdateHomemateProfileRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateHomemateProfile(dc: DataConnect, vars: UpdateHomemateProfileVariables): MutationPromise<UpdateHomemateProfileData, UpdateHomemateProfileVariables>;

interface UpdateHomemateProfileRef {
  ...
  (dc: DataConnect, vars: UpdateHomemateProfileVariables): MutationRef<UpdateHomemateProfileData, UpdateHomemateProfileVariables>;
}
export const updateHomemateProfileRef: UpdateHomemateProfileRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateHomemateProfileRef:
```typescript
const name = updateHomemateProfileRef.operationName;
console.log(name);
```

### Variables
The `UpdateHomemateProfile` mutation requires an argument of type `UpdateHomemateProfileVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateHomemateProfileVariables {
  homemateId: UUIDString;
  name: string;
  relationLabel?: string | null;
  phone?: string | null;
  notes?: string | null;
}
```
### Return Type
Recall that executing the `UpdateHomemateProfile` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateHomemateProfileData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateHomemateProfileData {
  homemateProfile_update?: HomemateProfile_Key | null;
}
```
### Using `UpdateHomemateProfile`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateHomemateProfile, UpdateHomemateProfileVariables } from '@homemaker/dataconnect';

// The `UpdateHomemateProfile` mutation requires an argument of type `UpdateHomemateProfileVariables`:
const updateHomemateProfileVars: UpdateHomemateProfileVariables = {
  homemateId: ..., 
  name: ..., 
  relationLabel: ..., // optional
  phone: ..., // optional
  notes: ..., // optional
};

// Call the `updateHomemateProfile()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateHomemateProfile(updateHomemateProfileVars);
// Variables can be defined inline as well.
const { data } = await updateHomemateProfile({ homemateId: ..., name: ..., relationLabel: ..., phone: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateHomemateProfile(dataConnect, updateHomemateProfileVars);

console.log(data.homemateProfile_update);

// Or, you can use the `Promise` API.
updateHomemateProfile(updateHomemateProfileVars).then((response) => {
  const data = response.data;
  console.log(data.homemateProfile_update);
});
```

### Using `UpdateHomemateProfile`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateHomemateProfileRef, UpdateHomemateProfileVariables } from '@homemaker/dataconnect';

// The `UpdateHomemateProfile` mutation requires an argument of type `UpdateHomemateProfileVariables`:
const updateHomemateProfileVars: UpdateHomemateProfileVariables = {
  homemateId: ..., 
  name: ..., 
  relationLabel: ..., // optional
  phone: ..., // optional
  notes: ..., // optional
};

// Call the `updateHomemateProfileRef()` function to get a reference to the mutation.
const ref = updateHomemateProfileRef(updateHomemateProfileVars);
// Variables can be defined inline as well.
const ref = updateHomemateProfileRef({ homemateId: ..., name: ..., relationLabel: ..., phone: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateHomemateProfileRef(dataConnect, updateHomemateProfileVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.homemateProfile_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.homemateProfile_update);
});
```

## DeleteHomemateProfile
You can execute the `DeleteHomemateProfile` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteHomemateProfile(vars: DeleteHomemateProfileVariables): MutationPromise<DeleteHomemateProfileData, DeleteHomemateProfileVariables>;

interface DeleteHomemateProfileRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteHomemateProfileVariables): MutationRef<DeleteHomemateProfileData, DeleteHomemateProfileVariables>;
}
export const deleteHomemateProfileRef: DeleteHomemateProfileRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteHomemateProfile(dc: DataConnect, vars: DeleteHomemateProfileVariables): MutationPromise<DeleteHomemateProfileData, DeleteHomemateProfileVariables>;

interface DeleteHomemateProfileRef {
  ...
  (dc: DataConnect, vars: DeleteHomemateProfileVariables): MutationRef<DeleteHomemateProfileData, DeleteHomemateProfileVariables>;
}
export const deleteHomemateProfileRef: DeleteHomemateProfileRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteHomemateProfileRef:
```typescript
const name = deleteHomemateProfileRef.operationName;
console.log(name);
```

### Variables
The `DeleteHomemateProfile` mutation requires an argument of type `DeleteHomemateProfileVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteHomemateProfileVariables {
  homemateId: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteHomemateProfile` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteHomemateProfileData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteHomemateProfileData {
  homemateProfile_delete?: HomemateProfile_Key | null;
}
```
### Using `DeleteHomemateProfile`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteHomemateProfile, DeleteHomemateProfileVariables } from '@homemaker/dataconnect';

// The `DeleteHomemateProfile` mutation requires an argument of type `DeleteHomemateProfileVariables`:
const deleteHomemateProfileVars: DeleteHomemateProfileVariables = {
  homemateId: ..., 
};

// Call the `deleteHomemateProfile()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteHomemateProfile(deleteHomemateProfileVars);
// Variables can be defined inline as well.
const { data } = await deleteHomemateProfile({ homemateId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteHomemateProfile(dataConnect, deleteHomemateProfileVars);

console.log(data.homemateProfile_delete);

// Or, you can use the `Promise` API.
deleteHomemateProfile(deleteHomemateProfileVars).then((response) => {
  const data = response.data;
  console.log(data.homemateProfile_delete);
});
```

### Using `DeleteHomemateProfile`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteHomemateProfileRef, DeleteHomemateProfileVariables } from '@homemaker/dataconnect';

// The `DeleteHomemateProfile` mutation requires an argument of type `DeleteHomemateProfileVariables`:
const deleteHomemateProfileVars: DeleteHomemateProfileVariables = {
  homemateId: ..., 
};

// Call the `deleteHomemateProfileRef()` function to get a reference to the mutation.
const ref = deleteHomemateProfileRef(deleteHomemateProfileVars);
// Variables can be defined inline as well.
const ref = deleteHomemateProfileRef({ homemateId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteHomemateProfileRef(dataConnect, deleteHomemateProfileVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.homemateProfile_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.homemateProfile_delete);
});
```

## CreateRoomZone
You can execute the `CreateRoomZone` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createRoomZone(vars: CreateRoomZoneVariables): MutationPromise<CreateRoomZoneData, CreateRoomZoneVariables>;

interface CreateRoomZoneRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateRoomZoneVariables): MutationRef<CreateRoomZoneData, CreateRoomZoneVariables>;
}
export const createRoomZoneRef: CreateRoomZoneRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createRoomZone(dc: DataConnect, vars: CreateRoomZoneVariables): MutationPromise<CreateRoomZoneData, CreateRoomZoneVariables>;

interface CreateRoomZoneRef {
  ...
  (dc: DataConnect, vars: CreateRoomZoneVariables): MutationRef<CreateRoomZoneData, CreateRoomZoneVariables>;
}
export const createRoomZoneRef: CreateRoomZoneRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createRoomZoneRef:
```typescript
const name = createRoomZoneRef.operationName;
console.log(name);
```

### Variables
The `CreateRoomZone` mutation requires an argument of type `CreateRoomZoneVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateRoomZoneVariables {
  householdId: UUIDString;
  name: string;
  floorLabel?: string | null;
  notes?: string | null;
}
```
### Return Type
Recall that executing the `CreateRoomZone` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateRoomZoneData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateRoomZoneData {
  roomZone_insert: RoomZone_Key;
}
```
### Using `CreateRoomZone`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createRoomZone, CreateRoomZoneVariables } from '@homemaker/dataconnect';

// The `CreateRoomZone` mutation requires an argument of type `CreateRoomZoneVariables`:
const createRoomZoneVars: CreateRoomZoneVariables = {
  householdId: ..., 
  name: ..., 
  floorLabel: ..., // optional
  notes: ..., // optional
};

// Call the `createRoomZone()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createRoomZone(createRoomZoneVars);
// Variables can be defined inline as well.
const { data } = await createRoomZone({ householdId: ..., name: ..., floorLabel: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createRoomZone(dataConnect, createRoomZoneVars);

console.log(data.roomZone_insert);

// Or, you can use the `Promise` API.
createRoomZone(createRoomZoneVars).then((response) => {
  const data = response.data;
  console.log(data.roomZone_insert);
});
```

### Using `CreateRoomZone`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createRoomZoneRef, CreateRoomZoneVariables } from '@homemaker/dataconnect';

// The `CreateRoomZone` mutation requires an argument of type `CreateRoomZoneVariables`:
const createRoomZoneVars: CreateRoomZoneVariables = {
  householdId: ..., 
  name: ..., 
  floorLabel: ..., // optional
  notes: ..., // optional
};

// Call the `createRoomZoneRef()` function to get a reference to the mutation.
const ref = createRoomZoneRef(createRoomZoneVars);
// Variables can be defined inline as well.
const ref = createRoomZoneRef({ householdId: ..., name: ..., floorLabel: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createRoomZoneRef(dataConnect, createRoomZoneVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.roomZone_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.roomZone_insert);
});
```

## UpdateRoomZone
You can execute the `UpdateRoomZone` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateRoomZone(vars: UpdateRoomZoneVariables): MutationPromise<UpdateRoomZoneData, UpdateRoomZoneVariables>;

interface UpdateRoomZoneRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateRoomZoneVariables): MutationRef<UpdateRoomZoneData, UpdateRoomZoneVariables>;
}
export const updateRoomZoneRef: UpdateRoomZoneRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateRoomZone(dc: DataConnect, vars: UpdateRoomZoneVariables): MutationPromise<UpdateRoomZoneData, UpdateRoomZoneVariables>;

interface UpdateRoomZoneRef {
  ...
  (dc: DataConnect, vars: UpdateRoomZoneVariables): MutationRef<UpdateRoomZoneData, UpdateRoomZoneVariables>;
}
export const updateRoomZoneRef: UpdateRoomZoneRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateRoomZoneRef:
```typescript
const name = updateRoomZoneRef.operationName;
console.log(name);
```

### Variables
The `UpdateRoomZone` mutation requires an argument of type `UpdateRoomZoneVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateRoomZoneVariables {
  roomId: UUIDString;
  name: string;
  floorLabel?: string | null;
  notes?: string | null;
}
```
### Return Type
Recall that executing the `UpdateRoomZone` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateRoomZoneData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateRoomZoneData {
  roomZone_update?: RoomZone_Key | null;
}
```
### Using `UpdateRoomZone`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateRoomZone, UpdateRoomZoneVariables } from '@homemaker/dataconnect';

// The `UpdateRoomZone` mutation requires an argument of type `UpdateRoomZoneVariables`:
const updateRoomZoneVars: UpdateRoomZoneVariables = {
  roomId: ..., 
  name: ..., 
  floorLabel: ..., // optional
  notes: ..., // optional
};

// Call the `updateRoomZone()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateRoomZone(updateRoomZoneVars);
// Variables can be defined inline as well.
const { data } = await updateRoomZone({ roomId: ..., name: ..., floorLabel: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateRoomZone(dataConnect, updateRoomZoneVars);

console.log(data.roomZone_update);

// Or, you can use the `Promise` API.
updateRoomZone(updateRoomZoneVars).then((response) => {
  const data = response.data;
  console.log(data.roomZone_update);
});
```

### Using `UpdateRoomZone`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateRoomZoneRef, UpdateRoomZoneVariables } from '@homemaker/dataconnect';

// The `UpdateRoomZone` mutation requires an argument of type `UpdateRoomZoneVariables`:
const updateRoomZoneVars: UpdateRoomZoneVariables = {
  roomId: ..., 
  name: ..., 
  floorLabel: ..., // optional
  notes: ..., // optional
};

// Call the `updateRoomZoneRef()` function to get a reference to the mutation.
const ref = updateRoomZoneRef(updateRoomZoneVars);
// Variables can be defined inline as well.
const ref = updateRoomZoneRef({ roomId: ..., name: ..., floorLabel: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateRoomZoneRef(dataConnect, updateRoomZoneVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.roomZone_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.roomZone_update);
});
```

## DeleteRoomZone
You can execute the `DeleteRoomZone` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteRoomZone(vars: DeleteRoomZoneVariables): MutationPromise<DeleteRoomZoneData, DeleteRoomZoneVariables>;

interface DeleteRoomZoneRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteRoomZoneVariables): MutationRef<DeleteRoomZoneData, DeleteRoomZoneVariables>;
}
export const deleteRoomZoneRef: DeleteRoomZoneRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteRoomZone(dc: DataConnect, vars: DeleteRoomZoneVariables): MutationPromise<DeleteRoomZoneData, DeleteRoomZoneVariables>;

interface DeleteRoomZoneRef {
  ...
  (dc: DataConnect, vars: DeleteRoomZoneVariables): MutationRef<DeleteRoomZoneData, DeleteRoomZoneVariables>;
}
export const deleteRoomZoneRef: DeleteRoomZoneRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteRoomZoneRef:
```typescript
const name = deleteRoomZoneRef.operationName;
console.log(name);
```

### Variables
The `DeleteRoomZone` mutation requires an argument of type `DeleteRoomZoneVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteRoomZoneVariables {
  roomId: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteRoomZone` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteRoomZoneData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteRoomZoneData {
  roomZone_delete?: RoomZone_Key | null;
}
```
### Using `DeleteRoomZone`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteRoomZone, DeleteRoomZoneVariables } from '@homemaker/dataconnect';

// The `DeleteRoomZone` mutation requires an argument of type `DeleteRoomZoneVariables`:
const deleteRoomZoneVars: DeleteRoomZoneVariables = {
  roomId: ..., 
};

// Call the `deleteRoomZone()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteRoomZone(deleteRoomZoneVars);
// Variables can be defined inline as well.
const { data } = await deleteRoomZone({ roomId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteRoomZone(dataConnect, deleteRoomZoneVars);

console.log(data.roomZone_delete);

// Or, you can use the `Promise` API.
deleteRoomZone(deleteRoomZoneVars).then((response) => {
  const data = response.data;
  console.log(data.roomZone_delete);
});
```

### Using `DeleteRoomZone`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteRoomZoneRef, DeleteRoomZoneVariables } from '@homemaker/dataconnect';

// The `DeleteRoomZone` mutation requires an argument of type `DeleteRoomZoneVariables`:
const deleteRoomZoneVars: DeleteRoomZoneVariables = {
  roomId: ..., 
};

// Call the `deleteRoomZoneRef()` function to get a reference to the mutation.
const ref = deleteRoomZoneRef(deleteRoomZoneVars);
// Variables can be defined inline as well.
const ref = deleteRoomZoneRef({ roomId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteRoomZoneRef(dataConnect, deleteRoomZoneVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.roomZone_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.roomZone_delete);
});
```

## CreateInventoryItem
You can execute the `CreateInventoryItem` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createInventoryItem(vars: CreateInventoryItemVariables): MutationPromise<CreateInventoryItemData, CreateInventoryItemVariables>;

interface CreateInventoryItemRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateInventoryItemVariables): MutationRef<CreateInventoryItemData, CreateInventoryItemVariables>;
}
export const createInventoryItemRef: CreateInventoryItemRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createInventoryItem(dc: DataConnect, vars: CreateInventoryItemVariables): MutationPromise<CreateInventoryItemData, CreateInventoryItemVariables>;

interface CreateInventoryItemRef {
  ...
  (dc: DataConnect, vars: CreateInventoryItemVariables): MutationRef<CreateInventoryItemData, CreateInventoryItemVariables>;
}
export const createInventoryItemRef: CreateInventoryItemRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createInventoryItemRef:
```typescript
const name = createInventoryItemRef.operationName;
console.log(name);
```

### Variables
The `CreateInventoryItem` mutation requires an argument of type `CreateInventoryItemVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateInventoryItemVariables {
  householdId: UUIDString;
  roomId?: UUIDString | null;
  name: string;
  category: string;
  unit: string;
  currentQuantity: number;
  minimumQuantity?: number | null;
}
```
### Return Type
Recall that executing the `CreateInventoryItem` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateInventoryItemData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateInventoryItemData {
  inventoryItem_insert: InventoryItem_Key;
}
```
### Using `CreateInventoryItem`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createInventoryItem, CreateInventoryItemVariables } from '@homemaker/dataconnect';

// The `CreateInventoryItem` mutation requires an argument of type `CreateInventoryItemVariables`:
const createInventoryItemVars: CreateInventoryItemVariables = {
  householdId: ..., 
  roomId: ..., // optional
  name: ..., 
  category: ..., 
  unit: ..., 
  currentQuantity: ..., 
  minimumQuantity: ..., // optional
};

// Call the `createInventoryItem()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createInventoryItem(createInventoryItemVars);
// Variables can be defined inline as well.
const { data } = await createInventoryItem({ householdId: ..., roomId: ..., name: ..., category: ..., unit: ..., currentQuantity: ..., minimumQuantity: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createInventoryItem(dataConnect, createInventoryItemVars);

console.log(data.inventoryItem_insert);

// Or, you can use the `Promise` API.
createInventoryItem(createInventoryItemVars).then((response) => {
  const data = response.data;
  console.log(data.inventoryItem_insert);
});
```

### Using `CreateInventoryItem`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createInventoryItemRef, CreateInventoryItemVariables } from '@homemaker/dataconnect';

// The `CreateInventoryItem` mutation requires an argument of type `CreateInventoryItemVariables`:
const createInventoryItemVars: CreateInventoryItemVariables = {
  householdId: ..., 
  roomId: ..., // optional
  name: ..., 
  category: ..., 
  unit: ..., 
  currentQuantity: ..., 
  minimumQuantity: ..., // optional
};

// Call the `createInventoryItemRef()` function to get a reference to the mutation.
const ref = createInventoryItemRef(createInventoryItemVars);
// Variables can be defined inline as well.
const ref = createInventoryItemRef({ householdId: ..., roomId: ..., name: ..., category: ..., unit: ..., currentQuantity: ..., minimumQuantity: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createInventoryItemRef(dataConnect, createInventoryItemVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.inventoryItem_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.inventoryItem_insert);
});
```

## UpdateInventoryItem
You can execute the `UpdateInventoryItem` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateInventoryItem(vars: UpdateInventoryItemVariables): MutationPromise<UpdateInventoryItemData, UpdateInventoryItemVariables>;

interface UpdateInventoryItemRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateInventoryItemVariables): MutationRef<UpdateInventoryItemData, UpdateInventoryItemVariables>;
}
export const updateInventoryItemRef: UpdateInventoryItemRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateInventoryItem(dc: DataConnect, vars: UpdateInventoryItemVariables): MutationPromise<UpdateInventoryItemData, UpdateInventoryItemVariables>;

interface UpdateInventoryItemRef {
  ...
  (dc: DataConnect, vars: UpdateInventoryItemVariables): MutationRef<UpdateInventoryItemData, UpdateInventoryItemVariables>;
}
export const updateInventoryItemRef: UpdateInventoryItemRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateInventoryItemRef:
```typescript
const name = updateInventoryItemRef.operationName;
console.log(name);
```

### Variables
The `UpdateInventoryItem` mutation requires an argument of type `UpdateInventoryItemVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateInventoryItemVariables {
  itemId: UUIDString;
  roomId?: UUIDString | null;
  name: string;
  category: string;
  unit: string;
  currentQuantity: number;
  minimumQuantity?: number | null;
}
```
### Return Type
Recall that executing the `UpdateInventoryItem` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateInventoryItemData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateInventoryItemData {
  inventoryItem_update?: InventoryItem_Key | null;
}
```
### Using `UpdateInventoryItem`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateInventoryItem, UpdateInventoryItemVariables } from '@homemaker/dataconnect';

// The `UpdateInventoryItem` mutation requires an argument of type `UpdateInventoryItemVariables`:
const updateInventoryItemVars: UpdateInventoryItemVariables = {
  itemId: ..., 
  roomId: ..., // optional
  name: ..., 
  category: ..., 
  unit: ..., 
  currentQuantity: ..., 
  minimumQuantity: ..., // optional
};

// Call the `updateInventoryItem()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateInventoryItem(updateInventoryItemVars);
// Variables can be defined inline as well.
const { data } = await updateInventoryItem({ itemId: ..., roomId: ..., name: ..., category: ..., unit: ..., currentQuantity: ..., minimumQuantity: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateInventoryItem(dataConnect, updateInventoryItemVars);

console.log(data.inventoryItem_update);

// Or, you can use the `Promise` API.
updateInventoryItem(updateInventoryItemVars).then((response) => {
  const data = response.data;
  console.log(data.inventoryItem_update);
});
```

### Using `UpdateInventoryItem`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateInventoryItemRef, UpdateInventoryItemVariables } from '@homemaker/dataconnect';

// The `UpdateInventoryItem` mutation requires an argument of type `UpdateInventoryItemVariables`:
const updateInventoryItemVars: UpdateInventoryItemVariables = {
  itemId: ..., 
  roomId: ..., // optional
  name: ..., 
  category: ..., 
  unit: ..., 
  currentQuantity: ..., 
  minimumQuantity: ..., // optional
};

// Call the `updateInventoryItemRef()` function to get a reference to the mutation.
const ref = updateInventoryItemRef(updateInventoryItemVars);
// Variables can be defined inline as well.
const ref = updateInventoryItemRef({ itemId: ..., roomId: ..., name: ..., category: ..., unit: ..., currentQuantity: ..., minimumQuantity: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateInventoryItemRef(dataConnect, updateInventoryItemVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.inventoryItem_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.inventoryItem_update);
});
```

## DeleteInventoryItem
You can execute the `DeleteInventoryItem` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteInventoryItem(vars: DeleteInventoryItemVariables): MutationPromise<DeleteInventoryItemData, DeleteInventoryItemVariables>;

interface DeleteInventoryItemRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteInventoryItemVariables): MutationRef<DeleteInventoryItemData, DeleteInventoryItemVariables>;
}
export const deleteInventoryItemRef: DeleteInventoryItemRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteInventoryItem(dc: DataConnect, vars: DeleteInventoryItemVariables): MutationPromise<DeleteInventoryItemData, DeleteInventoryItemVariables>;

interface DeleteInventoryItemRef {
  ...
  (dc: DataConnect, vars: DeleteInventoryItemVariables): MutationRef<DeleteInventoryItemData, DeleteInventoryItemVariables>;
}
export const deleteInventoryItemRef: DeleteInventoryItemRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteInventoryItemRef:
```typescript
const name = deleteInventoryItemRef.operationName;
console.log(name);
```

### Variables
The `DeleteInventoryItem` mutation requires an argument of type `DeleteInventoryItemVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteInventoryItemVariables {
  itemId: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteInventoryItem` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteInventoryItemData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteInventoryItemData {
  inventoryItem_delete?: InventoryItem_Key | null;
}
```
### Using `DeleteInventoryItem`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteInventoryItem, DeleteInventoryItemVariables } from '@homemaker/dataconnect';

// The `DeleteInventoryItem` mutation requires an argument of type `DeleteInventoryItemVariables`:
const deleteInventoryItemVars: DeleteInventoryItemVariables = {
  itemId: ..., 
};

// Call the `deleteInventoryItem()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteInventoryItem(deleteInventoryItemVars);
// Variables can be defined inline as well.
const { data } = await deleteInventoryItem({ itemId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteInventoryItem(dataConnect, deleteInventoryItemVars);

console.log(data.inventoryItem_delete);

// Or, you can use the `Promise` API.
deleteInventoryItem(deleteInventoryItemVars).then((response) => {
  const data = response.data;
  console.log(data.inventoryItem_delete);
});
```

### Using `DeleteInventoryItem`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteInventoryItemRef, DeleteInventoryItemVariables } from '@homemaker/dataconnect';

// The `DeleteInventoryItem` mutation requires an argument of type `DeleteInventoryItemVariables`:
const deleteInventoryItemVars: DeleteInventoryItemVariables = {
  itemId: ..., 
};

// Call the `deleteInventoryItemRef()` function to get a reference to the mutation.
const ref = deleteInventoryItemRef(deleteInventoryItemVars);
// Variables can be defined inline as well.
const ref = deleteInventoryItemRef({ itemId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteInventoryItemRef(dataConnect, deleteInventoryItemVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.inventoryItem_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.inventoryItem_delete);
});
```

## CreatePayrollProfile
You can execute the `CreatePayrollProfile` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createPayrollProfile(vars: CreatePayrollProfileVariables): MutationPromise<CreatePayrollProfileData, CreatePayrollProfileVariables>;

interface CreatePayrollProfileRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreatePayrollProfileVariables): MutationRef<CreatePayrollProfileData, CreatePayrollProfileVariables>;
}
export const createPayrollProfileRef: CreatePayrollProfileRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createPayrollProfile(dc: DataConnect, vars: CreatePayrollProfileVariables): MutationPromise<CreatePayrollProfileData, CreatePayrollProfileVariables>;

interface CreatePayrollProfileRef {
  ...
  (dc: DataConnect, vars: CreatePayrollProfileVariables): MutationRef<CreatePayrollProfileData, CreatePayrollProfileVariables>;
}
export const createPayrollProfileRef: CreatePayrollProfileRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createPayrollProfileRef:
```typescript
const name = createPayrollProfileRef.operationName;
console.log(name);
```

### Variables
The `CreatePayrollProfile` mutation requires an argument of type `CreatePayrollProfileVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreatePayrollProfileVariables {
  householdId: UUIDString;
  staffId: UUIDString;
  baseSalary: number;
  payFrequency: string;
  deductionPolicy?: string | null;
}
```
### Return Type
Recall that executing the `CreatePayrollProfile` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreatePayrollProfileData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreatePayrollProfileData {
  payrollProfile_insert: PayrollProfile_Key;
}
```
### Using `CreatePayrollProfile`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createPayrollProfile, CreatePayrollProfileVariables } from '@homemaker/dataconnect';

// The `CreatePayrollProfile` mutation requires an argument of type `CreatePayrollProfileVariables`:
const createPayrollProfileVars: CreatePayrollProfileVariables = {
  householdId: ..., 
  staffId: ..., 
  baseSalary: ..., 
  payFrequency: ..., 
  deductionPolicy: ..., // optional
};

// Call the `createPayrollProfile()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createPayrollProfile(createPayrollProfileVars);
// Variables can be defined inline as well.
const { data } = await createPayrollProfile({ householdId: ..., staffId: ..., baseSalary: ..., payFrequency: ..., deductionPolicy: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createPayrollProfile(dataConnect, createPayrollProfileVars);

console.log(data.payrollProfile_insert);

// Or, you can use the `Promise` API.
createPayrollProfile(createPayrollProfileVars).then((response) => {
  const data = response.data;
  console.log(data.payrollProfile_insert);
});
```

### Using `CreatePayrollProfile`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createPayrollProfileRef, CreatePayrollProfileVariables } from '@homemaker/dataconnect';

// The `CreatePayrollProfile` mutation requires an argument of type `CreatePayrollProfileVariables`:
const createPayrollProfileVars: CreatePayrollProfileVariables = {
  householdId: ..., 
  staffId: ..., 
  baseSalary: ..., 
  payFrequency: ..., 
  deductionPolicy: ..., // optional
};

// Call the `createPayrollProfileRef()` function to get a reference to the mutation.
const ref = createPayrollProfileRef(createPayrollProfileVars);
// Variables can be defined inline as well.
const ref = createPayrollProfileRef({ householdId: ..., staffId: ..., baseSalary: ..., payFrequency: ..., deductionPolicy: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createPayrollProfileRef(dataConnect, createPayrollProfileVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.payrollProfile_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.payrollProfile_insert);
});
```

## CreateStaffSkill
You can execute the `CreateStaffSkill` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createStaffSkill(vars: CreateStaffSkillVariables): MutationPromise<CreateStaffSkillData, CreateStaffSkillVariables>;

interface CreateStaffSkillRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateStaffSkillVariables): MutationRef<CreateStaffSkillData, CreateStaffSkillVariables>;
}
export const createStaffSkillRef: CreateStaffSkillRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createStaffSkill(dc: DataConnect, vars: CreateStaffSkillVariables): MutationPromise<CreateStaffSkillData, CreateStaffSkillVariables>;

interface CreateStaffSkillRef {
  ...
  (dc: DataConnect, vars: CreateStaffSkillVariables): MutationRef<CreateStaffSkillData, CreateStaffSkillVariables>;
}
export const createStaffSkillRef: CreateStaffSkillRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createStaffSkillRef:
```typescript
const name = createStaffSkillRef.operationName;
console.log(name);
```

### Variables
The `CreateStaffSkill` mutation requires an argument of type `CreateStaffSkillVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateStaffSkillVariables {
  staffId: UUIDString;
  name: string;
}
```
### Return Type
Recall that executing the `CreateStaffSkill` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateStaffSkillData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateStaffSkillData {
  staffSkill_insert: StaffSkill_Key;
}
```
### Using `CreateStaffSkill`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createStaffSkill, CreateStaffSkillVariables } from '@homemaker/dataconnect';

// The `CreateStaffSkill` mutation requires an argument of type `CreateStaffSkillVariables`:
const createStaffSkillVars: CreateStaffSkillVariables = {
  staffId: ..., 
  name: ..., 
};

// Call the `createStaffSkill()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createStaffSkill(createStaffSkillVars);
// Variables can be defined inline as well.
const { data } = await createStaffSkill({ staffId: ..., name: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createStaffSkill(dataConnect, createStaffSkillVars);

console.log(data.staffSkill_insert);

// Or, you can use the `Promise` API.
createStaffSkill(createStaffSkillVars).then((response) => {
  const data = response.data;
  console.log(data.staffSkill_insert);
});
```

### Using `CreateStaffSkill`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createStaffSkillRef, CreateStaffSkillVariables } from '@homemaker/dataconnect';

// The `CreateStaffSkill` mutation requires an argument of type `CreateStaffSkillVariables`:
const createStaffSkillVars: CreateStaffSkillVariables = {
  staffId: ..., 
  name: ..., 
};

// Call the `createStaffSkillRef()` function to get a reference to the mutation.
const ref = createStaffSkillRef(createStaffSkillVars);
// Variables can be defined inline as well.
const ref = createStaffSkillRef({ staffId: ..., name: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createStaffSkillRef(dataConnect, createStaffSkillVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.staffSkill_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.staffSkill_insert);
});
```

## UpdateStaffStatus
You can execute the `UpdateStaffStatus` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateStaffStatus(vars: UpdateStaffStatusVariables): MutationPromise<UpdateStaffStatusData, UpdateStaffStatusVariables>;

interface UpdateStaffStatusRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateStaffStatusVariables): MutationRef<UpdateStaffStatusData, UpdateStaffStatusVariables>;
}
export const updateStaffStatusRef: UpdateStaffStatusRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateStaffStatus(dc: DataConnect, vars: UpdateStaffStatusVariables): MutationPromise<UpdateStaffStatusData, UpdateStaffStatusVariables>;

interface UpdateStaffStatusRef {
  ...
  (dc: DataConnect, vars: UpdateStaffStatusVariables): MutationRef<UpdateStaffStatusData, UpdateStaffStatusVariables>;
}
export const updateStaffStatusRef: UpdateStaffStatusRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateStaffStatusRef:
```typescript
const name = updateStaffStatusRef.operationName;
console.log(name);
```

### Variables
The `UpdateStaffStatus` mutation requires an argument of type `UpdateStaffStatusVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateStaffStatusVariables {
  staffId: UUIDString;
  status: string;
}
```
### Return Type
Recall that executing the `UpdateStaffStatus` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateStaffStatusData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateStaffStatusData {
  staffMember_update?: StaffMember_Key | null;
}
```
### Using `UpdateStaffStatus`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateStaffStatus, UpdateStaffStatusVariables } from '@homemaker/dataconnect';

// The `UpdateStaffStatus` mutation requires an argument of type `UpdateStaffStatusVariables`:
const updateStaffStatusVars: UpdateStaffStatusVariables = {
  staffId: ..., 
  status: ..., 
};

// Call the `updateStaffStatus()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateStaffStatus(updateStaffStatusVars);
// Variables can be defined inline as well.
const { data } = await updateStaffStatus({ staffId: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateStaffStatus(dataConnect, updateStaffStatusVars);

console.log(data.staffMember_update);

// Or, you can use the `Promise` API.
updateStaffStatus(updateStaffStatusVars).then((response) => {
  const data = response.data;
  console.log(data.staffMember_update);
});
```

### Using `UpdateStaffStatus`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateStaffStatusRef, UpdateStaffStatusVariables } from '@homemaker/dataconnect';

// The `UpdateStaffStatus` mutation requires an argument of type `UpdateStaffStatusVariables`:
const updateStaffStatusVars: UpdateStaffStatusVariables = {
  staffId: ..., 
  status: ..., 
};

// Call the `updateStaffStatusRef()` function to get a reference to the mutation.
const ref = updateStaffStatusRef(updateStaffStatusVars);
// Variables can be defined inline as well.
const ref = updateStaffStatusRef({ staffId: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateStaffStatusRef(dataConnect, updateStaffStatusVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.staffMember_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.staffMember_update);
});
```

## UpdateStaffRole
You can execute the `UpdateStaffRole` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateStaffRole(vars: UpdateStaffRoleVariables): MutationPromise<UpdateStaffRoleData, UpdateStaffRoleVariables>;

interface UpdateStaffRoleRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateStaffRoleVariables): MutationRef<UpdateStaffRoleData, UpdateStaffRoleVariables>;
}
export const updateStaffRoleRef: UpdateStaffRoleRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateStaffRole(dc: DataConnect, vars: UpdateStaffRoleVariables): MutationPromise<UpdateStaffRoleData, UpdateStaffRoleVariables>;

interface UpdateStaffRoleRef {
  ...
  (dc: DataConnect, vars: UpdateStaffRoleVariables): MutationRef<UpdateStaffRoleData, UpdateStaffRoleVariables>;
}
export const updateStaffRoleRef: UpdateStaffRoleRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateStaffRoleRef:
```typescript
const name = updateStaffRoleRef.operationName;
console.log(name);
```

### Variables
The `UpdateStaffRole` mutation requires an argument of type `UpdateStaffRoleVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateStaffRoleVariables {
  staffId: UUIDString;
  role: string;
}
```
### Return Type
Recall that executing the `UpdateStaffRole` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateStaffRoleData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateStaffRoleData {
  staffMember_update?: StaffMember_Key | null;
}
```
### Using `UpdateStaffRole`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateStaffRole, UpdateStaffRoleVariables } from '@homemaker/dataconnect';

// The `UpdateStaffRole` mutation requires an argument of type `UpdateStaffRoleVariables`:
const updateStaffRoleVars: UpdateStaffRoleVariables = {
  staffId: ..., 
  role: ..., 
};

// Call the `updateStaffRole()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateStaffRole(updateStaffRoleVars);
// Variables can be defined inline as well.
const { data } = await updateStaffRole({ staffId: ..., role: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateStaffRole(dataConnect, updateStaffRoleVars);

console.log(data.staffMember_update);

// Or, you can use the `Promise` API.
updateStaffRole(updateStaffRoleVars).then((response) => {
  const data = response.data;
  console.log(data.staffMember_update);
});
```

### Using `UpdateStaffRole`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateStaffRoleRef, UpdateStaffRoleVariables } from '@homemaker/dataconnect';

// The `UpdateStaffRole` mutation requires an argument of type `UpdateStaffRoleVariables`:
const updateStaffRoleVars: UpdateStaffRoleVariables = {
  staffId: ..., 
  role: ..., 
};

// Call the `updateStaffRoleRef()` function to get a reference to the mutation.
const ref = updateStaffRoleRef(updateStaffRoleVars);
// Variables can be defined inline as well.
const ref = updateStaffRoleRef({ staffId: ..., role: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateStaffRoleRef(dataConnect, updateStaffRoleVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.staffMember_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.staffMember_update);
});
```

## UpdateStaffShift
You can execute the `UpdateStaffShift` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateStaffShift(vars: UpdateStaffShiftVariables): MutationPromise<UpdateStaffShiftData, UpdateStaffShiftVariables>;

interface UpdateStaffShiftRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateStaffShiftVariables): MutationRef<UpdateStaffShiftData, UpdateStaffShiftVariables>;
}
export const updateStaffShiftRef: UpdateStaffShiftRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateStaffShift(dc: DataConnect, vars: UpdateStaffShiftVariables): MutationPromise<UpdateStaffShiftData, UpdateStaffShiftVariables>;

interface UpdateStaffShiftRef {
  ...
  (dc: DataConnect, vars: UpdateStaffShiftVariables): MutationRef<UpdateStaffShiftData, UpdateStaffShiftVariables>;
}
export const updateStaffShiftRef: UpdateStaffShiftRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateStaffShiftRef:
```typescript
const name = updateStaffShiftRef.operationName;
console.log(name);
```

### Variables
The `UpdateStaffShift` mutation requires an argument of type `UpdateStaffShiftVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateStaffShiftVariables {
  staffId: UUIDString;
  shiftStart: string;
  shiftEnd: string;
}
```
### Return Type
Recall that executing the `UpdateStaffShift` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateStaffShiftData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateStaffShiftData {
  staffMember_update?: StaffMember_Key | null;
}
```
### Using `UpdateStaffShift`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateStaffShift, UpdateStaffShiftVariables } from '@homemaker/dataconnect';

// The `UpdateStaffShift` mutation requires an argument of type `UpdateStaffShiftVariables`:
const updateStaffShiftVars: UpdateStaffShiftVariables = {
  staffId: ..., 
  shiftStart: ..., 
  shiftEnd: ..., 
};

// Call the `updateStaffShift()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateStaffShift(updateStaffShiftVars);
// Variables can be defined inline as well.
const { data } = await updateStaffShift({ staffId: ..., shiftStart: ..., shiftEnd: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateStaffShift(dataConnect, updateStaffShiftVars);

console.log(data.staffMember_update);

// Or, you can use the `Promise` API.
updateStaffShift(updateStaffShiftVars).then((response) => {
  const data = response.data;
  console.log(data.staffMember_update);
});
```

### Using `UpdateStaffShift`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateStaffShiftRef, UpdateStaffShiftVariables } from '@homemaker/dataconnect';

// The `UpdateStaffShift` mutation requires an argument of type `UpdateStaffShiftVariables`:
const updateStaffShiftVars: UpdateStaffShiftVariables = {
  staffId: ..., 
  shiftStart: ..., 
  shiftEnd: ..., 
};

// Call the `updateStaffShiftRef()` function to get a reference to the mutation.
const ref = updateStaffShiftRef(updateStaffShiftVars);
// Variables can be defined inline as well.
const ref = updateStaffShiftRef({ staffId: ..., shiftStart: ..., shiftEnd: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateStaffShiftRef(dataConnect, updateStaffShiftVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.staffMember_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.staffMember_update);
});
```

## UpdateStaffPhoto
You can execute the `UpdateStaffPhoto` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateStaffPhoto(vars: UpdateStaffPhotoVariables): MutationPromise<UpdateStaffPhotoData, UpdateStaffPhotoVariables>;

interface UpdateStaffPhotoRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateStaffPhotoVariables): MutationRef<UpdateStaffPhotoData, UpdateStaffPhotoVariables>;
}
export const updateStaffPhotoRef: UpdateStaffPhotoRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateStaffPhoto(dc: DataConnect, vars: UpdateStaffPhotoVariables): MutationPromise<UpdateStaffPhotoData, UpdateStaffPhotoVariables>;

interface UpdateStaffPhotoRef {
  ...
  (dc: DataConnect, vars: UpdateStaffPhotoVariables): MutationRef<UpdateStaffPhotoData, UpdateStaffPhotoVariables>;
}
export const updateStaffPhotoRef: UpdateStaffPhotoRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateStaffPhotoRef:
```typescript
const name = updateStaffPhotoRef.operationName;
console.log(name);
```

### Variables
The `UpdateStaffPhoto` mutation requires an argument of type `UpdateStaffPhotoVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateStaffPhotoVariables {
  staffId: UUIDString;
  photoUrl: string;
}
```
### Return Type
Recall that executing the `UpdateStaffPhoto` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateStaffPhotoData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateStaffPhotoData {
  staffMember_update?: StaffMember_Key | null;
}
```
### Using `UpdateStaffPhoto`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateStaffPhoto, UpdateStaffPhotoVariables } from '@homemaker/dataconnect';

// The `UpdateStaffPhoto` mutation requires an argument of type `UpdateStaffPhotoVariables`:
const updateStaffPhotoVars: UpdateStaffPhotoVariables = {
  staffId: ..., 
  photoUrl: ..., 
};

// Call the `updateStaffPhoto()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateStaffPhoto(updateStaffPhotoVars);
// Variables can be defined inline as well.
const { data } = await updateStaffPhoto({ staffId: ..., photoUrl: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateStaffPhoto(dataConnect, updateStaffPhotoVars);

console.log(data.staffMember_update);

// Or, you can use the `Promise` API.
updateStaffPhoto(updateStaffPhotoVars).then((response) => {
  const data = response.data;
  console.log(data.staffMember_update);
});
```

### Using `UpdateStaffPhoto`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateStaffPhotoRef, UpdateStaffPhotoVariables } from '@homemaker/dataconnect';

// The `UpdateStaffPhoto` mutation requires an argument of type `UpdateStaffPhotoVariables`:
const updateStaffPhotoVars: UpdateStaffPhotoVariables = {
  staffId: ..., 
  photoUrl: ..., 
};

// Call the `updateStaffPhotoRef()` function to get a reference to the mutation.
const ref = updateStaffPhotoRef(updateStaffPhotoVars);
// Variables can be defined inline as well.
const ref = updateStaffPhotoRef({ staffId: ..., photoUrl: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateStaffPhotoRef(dataConnect, updateStaffPhotoVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.staffMember_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.staffMember_update);
});
```

## UpdateStaffTelegramId
You can execute the `UpdateStaffTelegramId` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateStaffTelegramId(vars: UpdateStaffTelegramIdVariables): MutationPromise<UpdateStaffTelegramIdData, UpdateStaffTelegramIdVariables>;

interface UpdateStaffTelegramIdRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateStaffTelegramIdVariables): MutationRef<UpdateStaffTelegramIdData, UpdateStaffTelegramIdVariables>;
}
export const updateStaffTelegramIdRef: UpdateStaffTelegramIdRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateStaffTelegramId(dc: DataConnect, vars: UpdateStaffTelegramIdVariables): MutationPromise<UpdateStaffTelegramIdData, UpdateStaffTelegramIdVariables>;

interface UpdateStaffTelegramIdRef {
  ...
  (dc: DataConnect, vars: UpdateStaffTelegramIdVariables): MutationRef<UpdateStaffTelegramIdData, UpdateStaffTelegramIdVariables>;
}
export const updateStaffTelegramIdRef: UpdateStaffTelegramIdRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateStaffTelegramIdRef:
```typescript
const name = updateStaffTelegramIdRef.operationName;
console.log(name);
```

### Variables
The `UpdateStaffTelegramId` mutation requires an argument of type `UpdateStaffTelegramIdVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateStaffTelegramIdVariables {
  staffId: UUIDString;
  telegramChatId: string;
}
```
### Return Type
Recall that executing the `UpdateStaffTelegramId` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateStaffTelegramIdData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateStaffTelegramIdData {
  staffMember_update?: StaffMember_Key | null;
}
```
### Using `UpdateStaffTelegramId`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateStaffTelegramId, UpdateStaffTelegramIdVariables } from '@homemaker/dataconnect';

// The `UpdateStaffTelegramId` mutation requires an argument of type `UpdateStaffTelegramIdVariables`:
const updateStaffTelegramIdVars: UpdateStaffTelegramIdVariables = {
  staffId: ..., 
  telegramChatId: ..., 
};

// Call the `updateStaffTelegramId()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateStaffTelegramId(updateStaffTelegramIdVars);
// Variables can be defined inline as well.
const { data } = await updateStaffTelegramId({ staffId: ..., telegramChatId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateStaffTelegramId(dataConnect, updateStaffTelegramIdVars);

console.log(data.staffMember_update);

// Or, you can use the `Promise` API.
updateStaffTelegramId(updateStaffTelegramIdVars).then((response) => {
  const data = response.data;
  console.log(data.staffMember_update);
});
```

### Using `UpdateStaffTelegramId`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateStaffTelegramIdRef, UpdateStaffTelegramIdVariables } from '@homemaker/dataconnect';

// The `UpdateStaffTelegramId` mutation requires an argument of type `UpdateStaffTelegramIdVariables`:
const updateStaffTelegramIdVars: UpdateStaffTelegramIdVariables = {
  staffId: ..., 
  telegramChatId: ..., 
};

// Call the `updateStaffTelegramIdRef()` function to get a reference to the mutation.
const ref = updateStaffTelegramIdRef(updateStaffTelegramIdVars);
// Variables can be defined inline as well.
const ref = updateStaffTelegramIdRef({ staffId: ..., telegramChatId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateStaffTelegramIdRef(dataConnect, updateStaffTelegramIdVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.staffMember_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.staffMember_update);
});
```

## RemoveStaffMember
You can execute the `RemoveStaffMember` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
removeStaffMember(vars: RemoveStaffMemberVariables): MutationPromise<RemoveStaffMemberData, RemoveStaffMemberVariables>;

interface RemoveStaffMemberRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: RemoveStaffMemberVariables): MutationRef<RemoveStaffMemberData, RemoveStaffMemberVariables>;
}
export const removeStaffMemberRef: RemoveStaffMemberRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
removeStaffMember(dc: DataConnect, vars: RemoveStaffMemberVariables): MutationPromise<RemoveStaffMemberData, RemoveStaffMemberVariables>;

interface RemoveStaffMemberRef {
  ...
  (dc: DataConnect, vars: RemoveStaffMemberVariables): MutationRef<RemoveStaffMemberData, RemoveStaffMemberVariables>;
}
export const removeStaffMemberRef: RemoveStaffMemberRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the removeStaffMemberRef:
```typescript
const name = removeStaffMemberRef.operationName;
console.log(name);
```

### Variables
The `RemoveStaffMember` mutation requires an argument of type `RemoveStaffMemberVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface RemoveStaffMemberVariables {
  staffId: UUIDString;
}
```
### Return Type
Recall that executing the `RemoveStaffMember` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `RemoveStaffMemberData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface RemoveStaffMemberData {
  staffMember_delete?: StaffMember_Key | null;
}
```
### Using `RemoveStaffMember`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, removeStaffMember, RemoveStaffMemberVariables } from '@homemaker/dataconnect';

// The `RemoveStaffMember` mutation requires an argument of type `RemoveStaffMemberVariables`:
const removeStaffMemberVars: RemoveStaffMemberVariables = {
  staffId: ..., 
};

// Call the `removeStaffMember()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await removeStaffMember(removeStaffMemberVars);
// Variables can be defined inline as well.
const { data } = await removeStaffMember({ staffId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await removeStaffMember(dataConnect, removeStaffMemberVars);

console.log(data.staffMember_delete);

// Or, you can use the `Promise` API.
removeStaffMember(removeStaffMemberVars).then((response) => {
  const data = response.data;
  console.log(data.staffMember_delete);
});
```

### Using `RemoveStaffMember`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, removeStaffMemberRef, RemoveStaffMemberVariables } from '@homemaker/dataconnect';

// The `RemoveStaffMember` mutation requires an argument of type `RemoveStaffMemberVariables`:
const removeStaffMemberVars: RemoveStaffMemberVariables = {
  staffId: ..., 
};

// Call the `removeStaffMemberRef()` function to get a reference to the mutation.
const ref = removeStaffMemberRef(removeStaffMemberVars);
// Variables can be defined inline as well.
const ref = removeStaffMemberRef({ staffId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = removeStaffMemberRef(dataConnect, removeStaffMemberVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.staffMember_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.staffMember_delete);
});
```

## AddTaskInstance
You can execute the `AddTaskInstance` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
addTaskInstance(vars: AddTaskInstanceVariables): MutationPromise<AddTaskInstanceData, AddTaskInstanceVariables>;

interface AddTaskInstanceRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddTaskInstanceVariables): MutationRef<AddTaskInstanceData, AddTaskInstanceVariables>;
}
export const addTaskInstanceRef: AddTaskInstanceRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
addTaskInstance(dc: DataConnect, vars: AddTaskInstanceVariables): MutationPromise<AddTaskInstanceData, AddTaskInstanceVariables>;

interface AddTaskInstanceRef {
  ...
  (dc: DataConnect, vars: AddTaskInstanceVariables): MutationRef<AddTaskInstanceData, AddTaskInstanceVariables>;
}
export const addTaskInstanceRef: AddTaskInstanceRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the addTaskInstanceRef:
```typescript
const name = addTaskInstanceRef.operationName;
console.log(name);
```

### Variables
The `AddTaskInstance` mutation requires an argument of type `AddTaskInstanceVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AddTaskInstanceVariables {
  householdId: UUIDString;
  assignedStaffId?: UUIDString | null;
  title: string;
  dueAt?: TimestampString | null;
}
```
### Return Type
Recall that executing the `AddTaskInstance` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AddTaskInstanceData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AddTaskInstanceData {
  taskInstance_insert: TaskInstance_Key;
}
```
### Using `AddTaskInstance`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, addTaskInstance, AddTaskInstanceVariables } from '@homemaker/dataconnect';

// The `AddTaskInstance` mutation requires an argument of type `AddTaskInstanceVariables`:
const addTaskInstanceVars: AddTaskInstanceVariables = {
  householdId: ..., 
  assignedStaffId: ..., // optional
  title: ..., 
  dueAt: ..., // optional
};

// Call the `addTaskInstance()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await addTaskInstance(addTaskInstanceVars);
// Variables can be defined inline as well.
const { data } = await addTaskInstance({ householdId: ..., assignedStaffId: ..., title: ..., dueAt: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await addTaskInstance(dataConnect, addTaskInstanceVars);

console.log(data.taskInstance_insert);

// Or, you can use the `Promise` API.
addTaskInstance(addTaskInstanceVars).then((response) => {
  const data = response.data;
  console.log(data.taskInstance_insert);
});
```

### Using `AddTaskInstance`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, addTaskInstanceRef, AddTaskInstanceVariables } from '@homemaker/dataconnect';

// The `AddTaskInstance` mutation requires an argument of type `AddTaskInstanceVariables`:
const addTaskInstanceVars: AddTaskInstanceVariables = {
  householdId: ..., 
  assignedStaffId: ..., // optional
  title: ..., 
  dueAt: ..., // optional
};

// Call the `addTaskInstanceRef()` function to get a reference to the mutation.
const ref = addTaskInstanceRef(addTaskInstanceVars);
// Variables can be defined inline as well.
const ref = addTaskInstanceRef({ householdId: ..., assignedStaffId: ..., title: ..., dueAt: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = addTaskInstanceRef(dataConnect, addTaskInstanceVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.taskInstance_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.taskInstance_insert);
});
```

## CompleteTaskInstance
You can execute the `CompleteTaskInstance` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
completeTaskInstance(vars: CompleteTaskInstanceVariables): MutationPromise<CompleteTaskInstanceData, CompleteTaskInstanceVariables>;

interface CompleteTaskInstanceRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CompleteTaskInstanceVariables): MutationRef<CompleteTaskInstanceData, CompleteTaskInstanceVariables>;
}
export const completeTaskInstanceRef: CompleteTaskInstanceRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
completeTaskInstance(dc: DataConnect, vars: CompleteTaskInstanceVariables): MutationPromise<CompleteTaskInstanceData, CompleteTaskInstanceVariables>;

interface CompleteTaskInstanceRef {
  ...
  (dc: DataConnect, vars: CompleteTaskInstanceVariables): MutationRef<CompleteTaskInstanceData, CompleteTaskInstanceVariables>;
}
export const completeTaskInstanceRef: CompleteTaskInstanceRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the completeTaskInstanceRef:
```typescript
const name = completeTaskInstanceRef.operationName;
console.log(name);
```

### Variables
The `CompleteTaskInstance` mutation requires an argument of type `CompleteTaskInstanceVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CompleteTaskInstanceVariables {
  taskId: UUIDString;
  source?: string | null;
}
```
### Return Type
Recall that executing the `CompleteTaskInstance` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CompleteTaskInstanceData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CompleteTaskInstanceData {
  taskInstance_update?: TaskInstance_Key | null;
}
```
### Using `CompleteTaskInstance`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, completeTaskInstance, CompleteTaskInstanceVariables } from '@homemaker/dataconnect';

// The `CompleteTaskInstance` mutation requires an argument of type `CompleteTaskInstanceVariables`:
const completeTaskInstanceVars: CompleteTaskInstanceVariables = {
  taskId: ..., 
  source: ..., // optional
};

// Call the `completeTaskInstance()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await completeTaskInstance(completeTaskInstanceVars);
// Variables can be defined inline as well.
const { data } = await completeTaskInstance({ taskId: ..., source: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await completeTaskInstance(dataConnect, completeTaskInstanceVars);

console.log(data.taskInstance_update);

// Or, you can use the `Promise` API.
completeTaskInstance(completeTaskInstanceVars).then((response) => {
  const data = response.data;
  console.log(data.taskInstance_update);
});
```

### Using `CompleteTaskInstance`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, completeTaskInstanceRef, CompleteTaskInstanceVariables } from '@homemaker/dataconnect';

// The `CompleteTaskInstance` mutation requires an argument of type `CompleteTaskInstanceVariables`:
const completeTaskInstanceVars: CompleteTaskInstanceVariables = {
  taskId: ..., 
  source: ..., // optional
};

// Call the `completeTaskInstanceRef()` function to get a reference to the mutation.
const ref = completeTaskInstanceRef(completeTaskInstanceVars);
// Variables can be defined inline as well.
const ref = completeTaskInstanceRef({ taskId: ..., source: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = completeTaskInstanceRef(dataConnect, completeTaskInstanceVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.taskInstance_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.taskInstance_update);
});
```

## SetTaskCompletion
You can execute the `SetTaskCompletion` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
setTaskCompletion(vars: SetTaskCompletionVariables): MutationPromise<SetTaskCompletionData, SetTaskCompletionVariables>;

interface SetTaskCompletionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: SetTaskCompletionVariables): MutationRef<SetTaskCompletionData, SetTaskCompletionVariables>;
}
export const setTaskCompletionRef: SetTaskCompletionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
setTaskCompletion(dc: DataConnect, vars: SetTaskCompletionVariables): MutationPromise<SetTaskCompletionData, SetTaskCompletionVariables>;

interface SetTaskCompletionRef {
  ...
  (dc: DataConnect, vars: SetTaskCompletionVariables): MutationRef<SetTaskCompletionData, SetTaskCompletionVariables>;
}
export const setTaskCompletionRef: SetTaskCompletionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the setTaskCompletionRef:
```typescript
const name = setTaskCompletionRef.operationName;
console.log(name);
```

### Variables
The `SetTaskCompletion` mutation requires an argument of type `SetTaskCompletionVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface SetTaskCompletionVariables {
  taskId: UUIDString;
  status: string;
  completedAt?: TimestampString | null;
  source?: string | null;
}
```
### Return Type
Recall that executing the `SetTaskCompletion` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `SetTaskCompletionData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface SetTaskCompletionData {
  taskInstance_update?: TaskInstance_Key | null;
}
```
### Using `SetTaskCompletion`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, setTaskCompletion, SetTaskCompletionVariables } from '@homemaker/dataconnect';

// The `SetTaskCompletion` mutation requires an argument of type `SetTaskCompletionVariables`:
const setTaskCompletionVars: SetTaskCompletionVariables = {
  taskId: ..., 
  status: ..., 
  completedAt: ..., // optional
  source: ..., // optional
};

// Call the `setTaskCompletion()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await setTaskCompletion(setTaskCompletionVars);
// Variables can be defined inline as well.
const { data } = await setTaskCompletion({ taskId: ..., status: ..., completedAt: ..., source: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await setTaskCompletion(dataConnect, setTaskCompletionVars);

console.log(data.taskInstance_update);

// Or, you can use the `Promise` API.
setTaskCompletion(setTaskCompletionVars).then((response) => {
  const data = response.data;
  console.log(data.taskInstance_update);
});
```

### Using `SetTaskCompletion`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, setTaskCompletionRef, SetTaskCompletionVariables } from '@homemaker/dataconnect';

// The `SetTaskCompletion` mutation requires an argument of type `SetTaskCompletionVariables`:
const setTaskCompletionVars: SetTaskCompletionVariables = {
  taskId: ..., 
  status: ..., 
  completedAt: ..., // optional
  source: ..., // optional
};

// Call the `setTaskCompletionRef()` function to get a reference to the mutation.
const ref = setTaskCompletionRef(setTaskCompletionVars);
// Variables can be defined inline as well.
const ref = setTaskCompletionRef({ taskId: ..., status: ..., completedAt: ..., source: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = setTaskCompletionRef(dataConnect, setTaskCompletionVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.taskInstance_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.taskInstance_update);
});
```

## UpdateTaskDueDate
You can execute the `UpdateTaskDueDate` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateTaskDueDate(vars: UpdateTaskDueDateVariables): MutationPromise<UpdateTaskDueDateData, UpdateTaskDueDateVariables>;

interface UpdateTaskDueDateRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateTaskDueDateVariables): MutationRef<UpdateTaskDueDateData, UpdateTaskDueDateVariables>;
}
export const updateTaskDueDateRef: UpdateTaskDueDateRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateTaskDueDate(dc: DataConnect, vars: UpdateTaskDueDateVariables): MutationPromise<UpdateTaskDueDateData, UpdateTaskDueDateVariables>;

interface UpdateTaskDueDateRef {
  ...
  (dc: DataConnect, vars: UpdateTaskDueDateVariables): MutationRef<UpdateTaskDueDateData, UpdateTaskDueDateVariables>;
}
export const updateTaskDueDateRef: UpdateTaskDueDateRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateTaskDueDateRef:
```typescript
const name = updateTaskDueDateRef.operationName;
console.log(name);
```

### Variables
The `UpdateTaskDueDate` mutation requires an argument of type `UpdateTaskDueDateVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateTaskDueDateVariables {
  taskId: UUIDString;
  dueAt?: TimestampString | null;
}
```
### Return Type
Recall that executing the `UpdateTaskDueDate` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateTaskDueDateData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateTaskDueDateData {
  taskInstance_update?: TaskInstance_Key | null;
}
```
### Using `UpdateTaskDueDate`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateTaskDueDate, UpdateTaskDueDateVariables } from '@homemaker/dataconnect';

// The `UpdateTaskDueDate` mutation requires an argument of type `UpdateTaskDueDateVariables`:
const updateTaskDueDateVars: UpdateTaskDueDateVariables = {
  taskId: ..., 
  dueAt: ..., // optional
};

// Call the `updateTaskDueDate()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateTaskDueDate(updateTaskDueDateVars);
// Variables can be defined inline as well.
const { data } = await updateTaskDueDate({ taskId: ..., dueAt: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateTaskDueDate(dataConnect, updateTaskDueDateVars);

console.log(data.taskInstance_update);

// Or, you can use the `Promise` API.
updateTaskDueDate(updateTaskDueDateVars).then((response) => {
  const data = response.data;
  console.log(data.taskInstance_update);
});
```

### Using `UpdateTaskDueDate`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateTaskDueDateRef, UpdateTaskDueDateVariables } from '@homemaker/dataconnect';

// The `UpdateTaskDueDate` mutation requires an argument of type `UpdateTaskDueDateVariables`:
const updateTaskDueDateVars: UpdateTaskDueDateVariables = {
  taskId: ..., 
  dueAt: ..., // optional
};

// Call the `updateTaskDueDateRef()` function to get a reference to the mutation.
const ref = updateTaskDueDateRef(updateTaskDueDateVars);
// Variables can be defined inline as well.
const ref = updateTaskDueDateRef({ taskId: ..., dueAt: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateTaskDueDateRef(dataConnect, updateTaskDueDateVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.taskInstance_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.taskInstance_update);
});
```

## ReassignTaskInstance
You can execute the `ReassignTaskInstance` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
reassignTaskInstance(vars: ReassignTaskInstanceVariables): MutationPromise<ReassignTaskInstanceData, ReassignTaskInstanceVariables>;

interface ReassignTaskInstanceRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ReassignTaskInstanceVariables): MutationRef<ReassignTaskInstanceData, ReassignTaskInstanceVariables>;
}
export const reassignTaskInstanceRef: ReassignTaskInstanceRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
reassignTaskInstance(dc: DataConnect, vars: ReassignTaskInstanceVariables): MutationPromise<ReassignTaskInstanceData, ReassignTaskInstanceVariables>;

interface ReassignTaskInstanceRef {
  ...
  (dc: DataConnect, vars: ReassignTaskInstanceVariables): MutationRef<ReassignTaskInstanceData, ReassignTaskInstanceVariables>;
}
export const reassignTaskInstanceRef: ReassignTaskInstanceRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the reassignTaskInstanceRef:
```typescript
const name = reassignTaskInstanceRef.operationName;
console.log(name);
```

### Variables
The `ReassignTaskInstance` mutation requires an argument of type `ReassignTaskInstanceVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ReassignTaskInstanceVariables {
  taskId: UUIDString;
  assignedStaffId: UUIDString;
}
```
### Return Type
Recall that executing the `ReassignTaskInstance` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ReassignTaskInstanceData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ReassignTaskInstanceData {
  taskInstance_update?: TaskInstance_Key | null;
}
```
### Using `ReassignTaskInstance`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, reassignTaskInstance, ReassignTaskInstanceVariables } from '@homemaker/dataconnect';

// The `ReassignTaskInstance` mutation requires an argument of type `ReassignTaskInstanceVariables`:
const reassignTaskInstanceVars: ReassignTaskInstanceVariables = {
  taskId: ..., 
  assignedStaffId: ..., 
};

// Call the `reassignTaskInstance()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await reassignTaskInstance(reassignTaskInstanceVars);
// Variables can be defined inline as well.
const { data } = await reassignTaskInstance({ taskId: ..., assignedStaffId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await reassignTaskInstance(dataConnect, reassignTaskInstanceVars);

console.log(data.taskInstance_update);

// Or, you can use the `Promise` API.
reassignTaskInstance(reassignTaskInstanceVars).then((response) => {
  const data = response.data;
  console.log(data.taskInstance_update);
});
```

### Using `ReassignTaskInstance`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, reassignTaskInstanceRef, ReassignTaskInstanceVariables } from '@homemaker/dataconnect';

// The `ReassignTaskInstance` mutation requires an argument of type `ReassignTaskInstanceVariables`:
const reassignTaskInstanceVars: ReassignTaskInstanceVariables = {
  taskId: ..., 
  assignedStaffId: ..., 
};

// Call the `reassignTaskInstanceRef()` function to get a reference to the mutation.
const ref = reassignTaskInstanceRef(reassignTaskInstanceVars);
// Variables can be defined inline as well.
const ref = reassignTaskInstanceRef({ taskId: ..., assignedStaffId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = reassignTaskInstanceRef(dataConnect, reassignTaskInstanceVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.taskInstance_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.taskInstance_update);
});
```

## DeleteTaskInstance
You can execute the `DeleteTaskInstance` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteTaskInstance(vars: DeleteTaskInstanceVariables): MutationPromise<DeleteTaskInstanceData, DeleteTaskInstanceVariables>;

interface DeleteTaskInstanceRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteTaskInstanceVariables): MutationRef<DeleteTaskInstanceData, DeleteTaskInstanceVariables>;
}
export const deleteTaskInstanceRef: DeleteTaskInstanceRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteTaskInstance(dc: DataConnect, vars: DeleteTaskInstanceVariables): MutationPromise<DeleteTaskInstanceData, DeleteTaskInstanceVariables>;

interface DeleteTaskInstanceRef {
  ...
  (dc: DataConnect, vars: DeleteTaskInstanceVariables): MutationRef<DeleteTaskInstanceData, DeleteTaskInstanceVariables>;
}
export const deleteTaskInstanceRef: DeleteTaskInstanceRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteTaskInstanceRef:
```typescript
const name = deleteTaskInstanceRef.operationName;
console.log(name);
```

### Variables
The `DeleteTaskInstance` mutation requires an argument of type `DeleteTaskInstanceVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteTaskInstanceVariables {
  taskId: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteTaskInstance` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteTaskInstanceData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteTaskInstanceData {
  taskInstance_delete?: TaskInstance_Key | null;
}
```
### Using `DeleteTaskInstance`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteTaskInstance, DeleteTaskInstanceVariables } from '@homemaker/dataconnect';

// The `DeleteTaskInstance` mutation requires an argument of type `DeleteTaskInstanceVariables`:
const deleteTaskInstanceVars: DeleteTaskInstanceVariables = {
  taskId: ..., 
};

// Call the `deleteTaskInstance()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteTaskInstance(deleteTaskInstanceVars);
// Variables can be defined inline as well.
const { data } = await deleteTaskInstance({ taskId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteTaskInstance(dataConnect, deleteTaskInstanceVars);

console.log(data.taskInstance_delete);

// Or, you can use the `Promise` API.
deleteTaskInstance(deleteTaskInstanceVars).then((response) => {
  const data = response.data;
  console.log(data.taskInstance_delete);
});
```

### Using `DeleteTaskInstance`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteTaskInstanceRef, DeleteTaskInstanceVariables } from '@homemaker/dataconnect';

// The `DeleteTaskInstance` mutation requires an argument of type `DeleteTaskInstanceVariables`:
const deleteTaskInstanceVars: DeleteTaskInstanceVariables = {
  taskId: ..., 
};

// Call the `deleteTaskInstanceRef()` function to get a reference to the mutation.
const ref = deleteTaskInstanceRef(deleteTaskInstanceVars);
// Variables can be defined inline as well.
const ref = deleteTaskInstanceRef({ taskId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteTaskInstanceRef(dataConnect, deleteTaskInstanceVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.taskInstance_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.taskInstance_delete);
});
```

## RecordAttendanceEvent
You can execute the `RecordAttendanceEvent` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
recordAttendanceEvent(vars: RecordAttendanceEventVariables): MutationPromise<RecordAttendanceEventData, RecordAttendanceEventVariables>;

interface RecordAttendanceEventRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: RecordAttendanceEventVariables): MutationRef<RecordAttendanceEventData, RecordAttendanceEventVariables>;
}
export const recordAttendanceEventRef: RecordAttendanceEventRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
recordAttendanceEvent(dc: DataConnect, vars: RecordAttendanceEventVariables): MutationPromise<RecordAttendanceEventData, RecordAttendanceEventVariables>;

interface RecordAttendanceEventRef {
  ...
  (dc: DataConnect, vars: RecordAttendanceEventVariables): MutationRef<RecordAttendanceEventData, RecordAttendanceEventVariables>;
}
export const recordAttendanceEventRef: RecordAttendanceEventRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the recordAttendanceEventRef:
```typescript
const name = recordAttendanceEventRef.operationName;
console.log(name);
```

### Variables
The `RecordAttendanceEvent` mutation requires an argument of type `RecordAttendanceEventVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface RecordAttendanceEventVariables {
  householdId: UUIDString;
  staffId: UUIDString;
  eventType: string;
  source: string;
  detail?: string | null;
}
```
### Return Type
Recall that executing the `RecordAttendanceEvent` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `RecordAttendanceEventData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface RecordAttendanceEventData {
  attendanceEvent_insert: AttendanceEvent_Key;
}
```
### Using `RecordAttendanceEvent`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, recordAttendanceEvent, RecordAttendanceEventVariables } from '@homemaker/dataconnect';

// The `RecordAttendanceEvent` mutation requires an argument of type `RecordAttendanceEventVariables`:
const recordAttendanceEventVars: RecordAttendanceEventVariables = {
  householdId: ..., 
  staffId: ..., 
  eventType: ..., 
  source: ..., 
  detail: ..., // optional
};

// Call the `recordAttendanceEvent()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await recordAttendanceEvent(recordAttendanceEventVars);
// Variables can be defined inline as well.
const { data } = await recordAttendanceEvent({ householdId: ..., staffId: ..., eventType: ..., source: ..., detail: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await recordAttendanceEvent(dataConnect, recordAttendanceEventVars);

console.log(data.attendanceEvent_insert);

// Or, you can use the `Promise` API.
recordAttendanceEvent(recordAttendanceEventVars).then((response) => {
  const data = response.data;
  console.log(data.attendanceEvent_insert);
});
```

### Using `RecordAttendanceEvent`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, recordAttendanceEventRef, RecordAttendanceEventVariables } from '@homemaker/dataconnect';

// The `RecordAttendanceEvent` mutation requires an argument of type `RecordAttendanceEventVariables`:
const recordAttendanceEventVars: RecordAttendanceEventVariables = {
  householdId: ..., 
  staffId: ..., 
  eventType: ..., 
  source: ..., 
  detail: ..., // optional
};

// Call the `recordAttendanceEventRef()` function to get a reference to the mutation.
const ref = recordAttendanceEventRef(recordAttendanceEventVars);
// Variables can be defined inline as well.
const ref = recordAttendanceEventRef({ householdId: ..., staffId: ..., eventType: ..., source: ..., detail: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = recordAttendanceEventRef(dataConnect, recordAttendanceEventVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.attendanceEvent_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.attendanceEvent_insert);
});
```

## AddExpenseEntry
You can execute the `AddExpenseEntry` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
addExpenseEntry(vars: AddExpenseEntryVariables): MutationPromise<AddExpenseEntryData, AddExpenseEntryVariables>;

interface AddExpenseEntryRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddExpenseEntryVariables): MutationRef<AddExpenseEntryData, AddExpenseEntryVariables>;
}
export const addExpenseEntryRef: AddExpenseEntryRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
addExpenseEntry(dc: DataConnect, vars: AddExpenseEntryVariables): MutationPromise<AddExpenseEntryData, AddExpenseEntryVariables>;

interface AddExpenseEntryRef {
  ...
  (dc: DataConnect, vars: AddExpenseEntryVariables): MutationRef<AddExpenseEntryData, AddExpenseEntryVariables>;
}
export const addExpenseEntryRef: AddExpenseEntryRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the addExpenseEntryRef:
```typescript
const name = addExpenseEntryRef.operationName;
console.log(name);
```

### Variables
The `AddExpenseEntry` mutation requires an argument of type `AddExpenseEntryVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AddExpenseEntryVariables {
  householdId: UUIDString;
  staffId?: UUIDString | null;
  category: string;
  amount: number;
  description: string;
  receiptUrl?: string | null;
}
```
### Return Type
Recall that executing the `AddExpenseEntry` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AddExpenseEntryData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AddExpenseEntryData {
  expenseEntry_insert: ExpenseEntry_Key;
}
```
### Using `AddExpenseEntry`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, addExpenseEntry, AddExpenseEntryVariables } from '@homemaker/dataconnect';

// The `AddExpenseEntry` mutation requires an argument of type `AddExpenseEntryVariables`:
const addExpenseEntryVars: AddExpenseEntryVariables = {
  householdId: ..., 
  staffId: ..., // optional
  category: ..., 
  amount: ..., 
  description: ..., 
  receiptUrl: ..., // optional
};

// Call the `addExpenseEntry()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await addExpenseEntry(addExpenseEntryVars);
// Variables can be defined inline as well.
const { data } = await addExpenseEntry({ householdId: ..., staffId: ..., category: ..., amount: ..., description: ..., receiptUrl: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await addExpenseEntry(dataConnect, addExpenseEntryVars);

console.log(data.expenseEntry_insert);

// Or, you can use the `Promise` API.
addExpenseEntry(addExpenseEntryVars).then((response) => {
  const data = response.data;
  console.log(data.expenseEntry_insert);
});
```

### Using `AddExpenseEntry`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, addExpenseEntryRef, AddExpenseEntryVariables } from '@homemaker/dataconnect';

// The `AddExpenseEntry` mutation requires an argument of type `AddExpenseEntryVariables`:
const addExpenseEntryVars: AddExpenseEntryVariables = {
  householdId: ..., 
  staffId: ..., // optional
  category: ..., 
  amount: ..., 
  description: ..., 
  receiptUrl: ..., // optional
};

// Call the `addExpenseEntryRef()` function to get a reference to the mutation.
const ref = addExpenseEntryRef(addExpenseEntryVars);
// Variables can be defined inline as well.
const ref = addExpenseEntryRef({ householdId: ..., staffId: ..., category: ..., amount: ..., description: ..., receiptUrl: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = addExpenseEntryRef(dataConnect, addExpenseEntryVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.expenseEntry_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.expenseEntry_insert);
});
```

## UpdateExpenseEntry
You can execute the `UpdateExpenseEntry` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateExpenseEntry(vars: UpdateExpenseEntryVariables): MutationPromise<UpdateExpenseEntryData, UpdateExpenseEntryVariables>;

interface UpdateExpenseEntryRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateExpenseEntryVariables): MutationRef<UpdateExpenseEntryData, UpdateExpenseEntryVariables>;
}
export const updateExpenseEntryRef: UpdateExpenseEntryRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateExpenseEntry(dc: DataConnect, vars: UpdateExpenseEntryVariables): MutationPromise<UpdateExpenseEntryData, UpdateExpenseEntryVariables>;

interface UpdateExpenseEntryRef {
  ...
  (dc: DataConnect, vars: UpdateExpenseEntryVariables): MutationRef<UpdateExpenseEntryData, UpdateExpenseEntryVariables>;
}
export const updateExpenseEntryRef: UpdateExpenseEntryRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateExpenseEntryRef:
```typescript
const name = updateExpenseEntryRef.operationName;
console.log(name);
```

### Variables
The `UpdateExpenseEntry` mutation requires an argument of type `UpdateExpenseEntryVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateExpenseEntryVariables {
  expenseId: UUIDString;
  category: string;
  amount: number;
  description: string;
}
```
### Return Type
Recall that executing the `UpdateExpenseEntry` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateExpenseEntryData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateExpenseEntryData {
  expenseEntry_update?: ExpenseEntry_Key | null;
}
```
### Using `UpdateExpenseEntry`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateExpenseEntry, UpdateExpenseEntryVariables } from '@homemaker/dataconnect';

// The `UpdateExpenseEntry` mutation requires an argument of type `UpdateExpenseEntryVariables`:
const updateExpenseEntryVars: UpdateExpenseEntryVariables = {
  expenseId: ..., 
  category: ..., 
  amount: ..., 
  description: ..., 
};

// Call the `updateExpenseEntry()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateExpenseEntry(updateExpenseEntryVars);
// Variables can be defined inline as well.
const { data } = await updateExpenseEntry({ expenseId: ..., category: ..., amount: ..., description: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateExpenseEntry(dataConnect, updateExpenseEntryVars);

console.log(data.expenseEntry_update);

// Or, you can use the `Promise` API.
updateExpenseEntry(updateExpenseEntryVars).then((response) => {
  const data = response.data;
  console.log(data.expenseEntry_update);
});
```

### Using `UpdateExpenseEntry`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateExpenseEntryRef, UpdateExpenseEntryVariables } from '@homemaker/dataconnect';

// The `UpdateExpenseEntry` mutation requires an argument of type `UpdateExpenseEntryVariables`:
const updateExpenseEntryVars: UpdateExpenseEntryVariables = {
  expenseId: ..., 
  category: ..., 
  amount: ..., 
  description: ..., 
};

// Call the `updateExpenseEntryRef()` function to get a reference to the mutation.
const ref = updateExpenseEntryRef(updateExpenseEntryVars);
// Variables can be defined inline as well.
const ref = updateExpenseEntryRef({ expenseId: ..., category: ..., amount: ..., description: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateExpenseEntryRef(dataConnect, updateExpenseEntryVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.expenseEntry_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.expenseEntry_update);
});
```

## DeleteExpenseEntry
You can execute the `DeleteExpenseEntry` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteExpenseEntry(vars: DeleteExpenseEntryVariables): MutationPromise<DeleteExpenseEntryData, DeleteExpenseEntryVariables>;

interface DeleteExpenseEntryRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteExpenseEntryVariables): MutationRef<DeleteExpenseEntryData, DeleteExpenseEntryVariables>;
}
export const deleteExpenseEntryRef: DeleteExpenseEntryRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteExpenseEntry(dc: DataConnect, vars: DeleteExpenseEntryVariables): MutationPromise<DeleteExpenseEntryData, DeleteExpenseEntryVariables>;

interface DeleteExpenseEntryRef {
  ...
  (dc: DataConnect, vars: DeleteExpenseEntryVariables): MutationRef<DeleteExpenseEntryData, DeleteExpenseEntryVariables>;
}
export const deleteExpenseEntryRef: DeleteExpenseEntryRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteExpenseEntryRef:
```typescript
const name = deleteExpenseEntryRef.operationName;
console.log(name);
```

### Variables
The `DeleteExpenseEntry` mutation requires an argument of type `DeleteExpenseEntryVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteExpenseEntryVariables {
  expenseId: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteExpenseEntry` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteExpenseEntryData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteExpenseEntryData {
  expenseEntry_delete?: ExpenseEntry_Key | null;
}
```
### Using `DeleteExpenseEntry`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteExpenseEntry, DeleteExpenseEntryVariables } from '@homemaker/dataconnect';

// The `DeleteExpenseEntry` mutation requires an argument of type `DeleteExpenseEntryVariables`:
const deleteExpenseEntryVars: DeleteExpenseEntryVariables = {
  expenseId: ..., 
};

// Call the `deleteExpenseEntry()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteExpenseEntry(deleteExpenseEntryVars);
// Variables can be defined inline as well.
const { data } = await deleteExpenseEntry({ expenseId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteExpenseEntry(dataConnect, deleteExpenseEntryVars);

console.log(data.expenseEntry_delete);

// Or, you can use the `Promise` API.
deleteExpenseEntry(deleteExpenseEntryVars).then((response) => {
  const data = response.data;
  console.log(data.expenseEntry_delete);
});
```

### Using `DeleteExpenseEntry`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteExpenseEntryRef, DeleteExpenseEntryVariables } from '@homemaker/dataconnect';

// The `DeleteExpenseEntry` mutation requires an argument of type `DeleteExpenseEntryVariables`:
const deleteExpenseEntryVars: DeleteExpenseEntryVariables = {
  expenseId: ..., 
};

// Call the `deleteExpenseEntryRef()` function to get a reference to the mutation.
const ref = deleteExpenseEntryRef(deleteExpenseEntryVars);
// Variables can be defined inline as well.
const ref = deleteExpenseEntryRef({ expenseId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteExpenseEntryRef(dataConnect, deleteExpenseEntryVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.expenseEntry_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.expenseEntry_delete);
});
```

## DismissAlert
You can execute the `DismissAlert` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
dismissAlert(vars: DismissAlertVariables): MutationPromise<DismissAlertData, DismissAlertVariables>;

interface DismissAlertRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DismissAlertVariables): MutationRef<DismissAlertData, DismissAlertVariables>;
}
export const dismissAlertRef: DismissAlertRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
dismissAlert(dc: DataConnect, vars: DismissAlertVariables): MutationPromise<DismissAlertData, DismissAlertVariables>;

interface DismissAlertRef {
  ...
  (dc: DataConnect, vars: DismissAlertVariables): MutationRef<DismissAlertData, DismissAlertVariables>;
}
export const dismissAlertRef: DismissAlertRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the dismissAlertRef:
```typescript
const name = dismissAlertRef.operationName;
console.log(name);
```

### Variables
The `DismissAlert` mutation requires an argument of type `DismissAlertVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DismissAlertVariables {
  alertId: UUIDString;
}
```
### Return Type
Recall that executing the `DismissAlert` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DismissAlertData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DismissAlertData {
  alert_update?: Alert_Key | null;
}
```
### Using `DismissAlert`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, dismissAlert, DismissAlertVariables } from '@homemaker/dataconnect';

// The `DismissAlert` mutation requires an argument of type `DismissAlertVariables`:
const dismissAlertVars: DismissAlertVariables = {
  alertId: ..., 
};

// Call the `dismissAlert()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await dismissAlert(dismissAlertVars);
// Variables can be defined inline as well.
const { data } = await dismissAlert({ alertId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await dismissAlert(dataConnect, dismissAlertVars);

console.log(data.alert_update);

// Or, you can use the `Promise` API.
dismissAlert(dismissAlertVars).then((response) => {
  const data = response.data;
  console.log(data.alert_update);
});
```

### Using `DismissAlert`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, dismissAlertRef, DismissAlertVariables } from '@homemaker/dataconnect';

// The `DismissAlert` mutation requires an argument of type `DismissAlertVariables`:
const dismissAlertVars: DismissAlertVariables = {
  alertId: ..., 
};

// Call the `dismissAlertRef()` function to get a reference to the mutation.
const ref = dismissAlertRef(dismissAlertVars);
// Variables can be defined inline as well.
const ref = dismissAlertRef({ alertId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = dismissAlertRef(dataConnect, dismissAlertVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.alert_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.alert_update);
});
```

## CreateAlert
You can execute the `CreateAlert` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createAlert(vars: CreateAlertVariables): MutationPromise<CreateAlertData, CreateAlertVariables>;

interface CreateAlertRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateAlertVariables): MutationRef<CreateAlertData, CreateAlertVariables>;
}
export const createAlertRef: CreateAlertRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createAlert(dc: DataConnect, vars: CreateAlertVariables): MutationPromise<CreateAlertData, CreateAlertVariables>;

interface CreateAlertRef {
  ...
  (dc: DataConnect, vars: CreateAlertVariables): MutationRef<CreateAlertData, CreateAlertVariables>;
}
export const createAlertRef: CreateAlertRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createAlertRef:
```typescript
const name = createAlertRef.operationName;
console.log(name);
```

### Variables
The `CreateAlert` mutation requires an argument of type `CreateAlertVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateAlertVariables {
  householdId: UUIDString;
  staffId?: UUIDString | null;
  taskId?: UUIDString | null;
  alertType: string;
  severity: string;
  title: string;
  description: string;
}
```
### Return Type
Recall that executing the `CreateAlert` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateAlertData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateAlertData {
  alert_insert: Alert_Key;
}
```
### Using `CreateAlert`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createAlert, CreateAlertVariables } from '@homemaker/dataconnect';

// The `CreateAlert` mutation requires an argument of type `CreateAlertVariables`:
const createAlertVars: CreateAlertVariables = {
  householdId: ..., 
  staffId: ..., // optional
  taskId: ..., // optional
  alertType: ..., 
  severity: ..., 
  title: ..., 
  description: ..., 
};

// Call the `createAlert()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createAlert(createAlertVars);
// Variables can be defined inline as well.
const { data } = await createAlert({ householdId: ..., staffId: ..., taskId: ..., alertType: ..., severity: ..., title: ..., description: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createAlert(dataConnect, createAlertVars);

console.log(data.alert_insert);

// Or, you can use the `Promise` API.
createAlert(createAlertVars).then((response) => {
  const data = response.data;
  console.log(data.alert_insert);
});
```

### Using `CreateAlert`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createAlertRef, CreateAlertVariables } from '@homemaker/dataconnect';

// The `CreateAlert` mutation requires an argument of type `CreateAlertVariables`:
const createAlertVars: CreateAlertVariables = {
  householdId: ..., 
  staffId: ..., // optional
  taskId: ..., // optional
  alertType: ..., 
  severity: ..., 
  title: ..., 
  description: ..., 
};

// Call the `createAlertRef()` function to get a reference to the mutation.
const ref = createAlertRef(createAlertVars);
// Variables can be defined inline as well.
const ref = createAlertRef({ householdId: ..., staffId: ..., taskId: ..., alertType: ..., severity: ..., title: ..., description: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createAlertRef(dataConnect, createAlertVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.alert_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.alert_insert);
});
```

## RecordPayrollDeduction
You can execute the `RecordPayrollDeduction` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
recordPayrollDeduction(vars: RecordPayrollDeductionVariables): MutationPromise<RecordPayrollDeductionData, RecordPayrollDeductionVariables>;

interface RecordPayrollDeductionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: RecordPayrollDeductionVariables): MutationRef<RecordPayrollDeductionData, RecordPayrollDeductionVariables>;
}
export const recordPayrollDeductionRef: RecordPayrollDeductionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
recordPayrollDeduction(dc: DataConnect, vars: RecordPayrollDeductionVariables): MutationPromise<RecordPayrollDeductionData, RecordPayrollDeductionVariables>;

interface RecordPayrollDeductionRef {
  ...
  (dc: DataConnect, vars: RecordPayrollDeductionVariables): MutationRef<RecordPayrollDeductionData, RecordPayrollDeductionVariables>;
}
export const recordPayrollDeductionRef: RecordPayrollDeductionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the recordPayrollDeductionRef:
```typescript
const name = recordPayrollDeductionRef.operationName;
console.log(name);
```

### Variables
The `RecordPayrollDeduction` mutation requires an argument of type `RecordPayrollDeductionVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface RecordPayrollDeductionVariables {
  householdId: UUIDString;
  staffId: UUIDString;
  monthLabel: string;
  baseSalary: number;
  deductions: number;
  advances: number;
  netPay: number;
  status: string;
}
```
### Return Type
Recall that executing the `RecordPayrollDeduction` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `RecordPayrollDeductionData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface RecordPayrollDeductionData {
  payrollRun_insert: PayrollRun_Key;
}
```
### Using `RecordPayrollDeduction`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, recordPayrollDeduction, RecordPayrollDeductionVariables } from '@homemaker/dataconnect';

// The `RecordPayrollDeduction` mutation requires an argument of type `RecordPayrollDeductionVariables`:
const recordPayrollDeductionVars: RecordPayrollDeductionVariables = {
  householdId: ..., 
  staffId: ..., 
  monthLabel: ..., 
  baseSalary: ..., 
  deductions: ..., 
  advances: ..., 
  netPay: ..., 
  status: ..., 
};

// Call the `recordPayrollDeduction()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await recordPayrollDeduction(recordPayrollDeductionVars);
// Variables can be defined inline as well.
const { data } = await recordPayrollDeduction({ householdId: ..., staffId: ..., monthLabel: ..., baseSalary: ..., deductions: ..., advances: ..., netPay: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await recordPayrollDeduction(dataConnect, recordPayrollDeductionVars);

console.log(data.payrollRun_insert);

// Or, you can use the `Promise` API.
recordPayrollDeduction(recordPayrollDeductionVars).then((response) => {
  const data = response.data;
  console.log(data.payrollRun_insert);
});
```

### Using `RecordPayrollDeduction`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, recordPayrollDeductionRef, RecordPayrollDeductionVariables } from '@homemaker/dataconnect';

// The `RecordPayrollDeduction` mutation requires an argument of type `RecordPayrollDeductionVariables`:
const recordPayrollDeductionVars: RecordPayrollDeductionVariables = {
  householdId: ..., 
  staffId: ..., 
  monthLabel: ..., 
  baseSalary: ..., 
  deductions: ..., 
  advances: ..., 
  netPay: ..., 
  status: ..., 
};

// Call the `recordPayrollDeductionRef()` function to get a reference to the mutation.
const ref = recordPayrollDeductionRef(recordPayrollDeductionVars);
// Variables can be defined inline as well.
const ref = recordPayrollDeductionRef({ householdId: ..., staffId: ..., monthLabel: ..., baseSalary: ..., deductions: ..., advances: ..., netPay: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = recordPayrollDeductionRef(dataConnect, recordPayrollDeductionVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.payrollRun_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.payrollRun_insert);
});
```

## RegisterNfcTag
You can execute the `RegisterNfcTag` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
registerNfcTag(vars: RegisterNfcTagVariables): MutationPromise<RegisterNfcTagData, RegisterNfcTagVariables>;

interface RegisterNfcTagRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: RegisterNfcTagVariables): MutationRef<RegisterNfcTagData, RegisterNfcTagVariables>;
}
export const registerNfcTagRef: RegisterNfcTagRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
registerNfcTag(dc: DataConnect, vars: RegisterNfcTagVariables): MutationPromise<RegisterNfcTagData, RegisterNfcTagVariables>;

interface RegisterNfcTagRef {
  ...
  (dc: DataConnect, vars: RegisterNfcTagVariables): MutationRef<RegisterNfcTagData, RegisterNfcTagVariables>;
}
export const registerNfcTagRef: RegisterNfcTagRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the registerNfcTagRef:
```typescript
const name = registerNfcTagRef.operationName;
console.log(name);
```

### Variables
The `RegisterNfcTag` mutation requires an argument of type `RegisterNfcTagVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface RegisterNfcTagVariables {
  householdId: UUIDString;
  tagUid: string;
  tagType: string;
  label: string;
  roomId?: UUIDString | null;
  staffId?: UUIDString | null;
  taskTemplateId?: UUIDString | null;
}
```
### Return Type
Recall that executing the `RegisterNfcTag` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `RegisterNfcTagData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface RegisterNfcTagData {
  nfcTag_insert: NfcTag_Key;
}
```
### Using `RegisterNfcTag`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, registerNfcTag, RegisterNfcTagVariables } from '@homemaker/dataconnect';

// The `RegisterNfcTag` mutation requires an argument of type `RegisterNfcTagVariables`:
const registerNfcTagVars: RegisterNfcTagVariables = {
  householdId: ..., 
  tagUid: ..., 
  tagType: ..., 
  label: ..., 
  roomId: ..., // optional
  staffId: ..., // optional
  taskTemplateId: ..., // optional
};

// Call the `registerNfcTag()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await registerNfcTag(registerNfcTagVars);
// Variables can be defined inline as well.
const { data } = await registerNfcTag({ householdId: ..., tagUid: ..., tagType: ..., label: ..., roomId: ..., staffId: ..., taskTemplateId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await registerNfcTag(dataConnect, registerNfcTagVars);

console.log(data.nfcTag_insert);

// Or, you can use the `Promise` API.
registerNfcTag(registerNfcTagVars).then((response) => {
  const data = response.data;
  console.log(data.nfcTag_insert);
});
```

### Using `RegisterNfcTag`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, registerNfcTagRef, RegisterNfcTagVariables } from '@homemaker/dataconnect';

// The `RegisterNfcTag` mutation requires an argument of type `RegisterNfcTagVariables`:
const registerNfcTagVars: RegisterNfcTagVariables = {
  householdId: ..., 
  tagUid: ..., 
  tagType: ..., 
  label: ..., 
  roomId: ..., // optional
  staffId: ..., // optional
  taskTemplateId: ..., // optional
};

// Call the `registerNfcTagRef()` function to get a reference to the mutation.
const ref = registerNfcTagRef(registerNfcTagVars);
// Variables can be defined inline as well.
const ref = registerNfcTagRef({ householdId: ..., tagUid: ..., tagType: ..., label: ..., roomId: ..., staffId: ..., taskTemplateId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = registerNfcTagRef(dataConnect, registerNfcTagVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.nfcTag_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.nfcTag_insert);
});
```

## RecordNfcTap
You can execute the `RecordNfcTap` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
recordNfcTap(vars: RecordNfcTapVariables): MutationPromise<RecordNfcTapData, RecordNfcTapVariables>;

interface RecordNfcTapRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: RecordNfcTapVariables): MutationRef<RecordNfcTapData, RecordNfcTapVariables>;
}
export const recordNfcTapRef: RecordNfcTapRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
recordNfcTap(dc: DataConnect, vars: RecordNfcTapVariables): MutationPromise<RecordNfcTapData, RecordNfcTapVariables>;

interface RecordNfcTapRef {
  ...
  (dc: DataConnect, vars: RecordNfcTapVariables): MutationRef<RecordNfcTapData, RecordNfcTapVariables>;
}
export const recordNfcTapRef: RecordNfcTapRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the recordNfcTapRef:
```typescript
const name = recordNfcTapRef.operationName;
console.log(name);
```

### Variables
The `RecordNfcTap` mutation requires an argument of type `RecordNfcTapVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface RecordNfcTapVariables {
  householdId: UUIDString;
  tagId: UUIDString;
  staffId?: UUIDString | null;
  roomId?: UUIDString | null;
  taskId?: UUIDString | null;
  actionType: string;
  deviceLabel?: string | null;
}
```
### Return Type
Recall that executing the `RecordNfcTap` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `RecordNfcTapData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface RecordNfcTapData {
  nfcTapEvent_insert: NfcTapEvent_Key;
}
```
### Using `RecordNfcTap`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, recordNfcTap, RecordNfcTapVariables } from '@homemaker/dataconnect';

// The `RecordNfcTap` mutation requires an argument of type `RecordNfcTapVariables`:
const recordNfcTapVars: RecordNfcTapVariables = {
  householdId: ..., 
  tagId: ..., 
  staffId: ..., // optional
  roomId: ..., // optional
  taskId: ..., // optional
  actionType: ..., 
  deviceLabel: ..., // optional
};

// Call the `recordNfcTap()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await recordNfcTap(recordNfcTapVars);
// Variables can be defined inline as well.
const { data } = await recordNfcTap({ householdId: ..., tagId: ..., staffId: ..., roomId: ..., taskId: ..., actionType: ..., deviceLabel: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await recordNfcTap(dataConnect, recordNfcTapVars);

console.log(data.nfcTapEvent_insert);

// Or, you can use the `Promise` API.
recordNfcTap(recordNfcTapVars).then((response) => {
  const data = response.data;
  console.log(data.nfcTapEvent_insert);
});
```

### Using `RecordNfcTap`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, recordNfcTapRef, RecordNfcTapVariables } from '@homemaker/dataconnect';

// The `RecordNfcTap` mutation requires an argument of type `RecordNfcTapVariables`:
const recordNfcTapVars: RecordNfcTapVariables = {
  householdId: ..., 
  tagId: ..., 
  staffId: ..., // optional
  roomId: ..., // optional
  taskId: ..., // optional
  actionType: ..., 
  deviceLabel: ..., // optional
};

// Call the `recordNfcTapRef()` function to get a reference to the mutation.
const ref = recordNfcTapRef(recordNfcTapVars);
// Variables can be defined inline as well.
const ref = recordNfcTapRef({ householdId: ..., tagId: ..., staffId: ..., roomId: ..., taskId: ..., actionType: ..., deviceLabel: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = recordNfcTapRef(dataConnect, recordNfcTapVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.nfcTapEvent_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.nfcTapEvent_insert);
});
```

## CreateStaffCashRequest
You can execute the `CreateStaffCashRequest` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createStaffCashRequest(vars: CreateStaffCashRequestVariables): MutationPromise<CreateStaffCashRequestData, CreateStaffCashRequestVariables>;

interface CreateStaffCashRequestRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateStaffCashRequestVariables): MutationRef<CreateStaffCashRequestData, CreateStaffCashRequestVariables>;
}
export const createStaffCashRequestRef: CreateStaffCashRequestRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createStaffCashRequest(dc: DataConnect, vars: CreateStaffCashRequestVariables): MutationPromise<CreateStaffCashRequestData, CreateStaffCashRequestVariables>;

interface CreateStaffCashRequestRef {
  ...
  (dc: DataConnect, vars: CreateStaffCashRequestVariables): MutationRef<CreateStaffCashRequestData, CreateStaffCashRequestVariables>;
}
export const createStaffCashRequestRef: CreateStaffCashRequestRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createStaffCashRequestRef:
```typescript
const name = createStaffCashRequestRef.operationName;
console.log(name);
```

### Variables
The `CreateStaffCashRequest` mutation requires an argument of type `CreateStaffCashRequestVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateStaffCashRequestVariables {
  householdId: UUIDString;
  staffId?: UUIDString | null;
  inventoryItemId?: UUIDString | null;
  category: string;
  amountRequested: number;
  reason: string;
  neededBy?: TimestampString | null;
  notes?: string | null;
}
```
### Return Type
Recall that executing the `CreateStaffCashRequest` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateStaffCashRequestData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateStaffCashRequestData {
  staffCashRequest_insert: StaffCashRequest_Key;
}
```
### Using `CreateStaffCashRequest`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createStaffCashRequest, CreateStaffCashRequestVariables } from '@homemaker/dataconnect';

// The `CreateStaffCashRequest` mutation requires an argument of type `CreateStaffCashRequestVariables`:
const createStaffCashRequestVars: CreateStaffCashRequestVariables = {
  householdId: ..., 
  staffId: ..., // optional
  inventoryItemId: ..., // optional
  category: ..., 
  amountRequested: ..., 
  reason: ..., 
  neededBy: ..., // optional
  notes: ..., // optional
};

// Call the `createStaffCashRequest()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createStaffCashRequest(createStaffCashRequestVars);
// Variables can be defined inline as well.
const { data } = await createStaffCashRequest({ householdId: ..., staffId: ..., inventoryItemId: ..., category: ..., amountRequested: ..., reason: ..., neededBy: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createStaffCashRequest(dataConnect, createStaffCashRequestVars);

console.log(data.staffCashRequest_insert);

// Or, you can use the `Promise` API.
createStaffCashRequest(createStaffCashRequestVars).then((response) => {
  const data = response.data;
  console.log(data.staffCashRequest_insert);
});
```

### Using `CreateStaffCashRequest`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createStaffCashRequestRef, CreateStaffCashRequestVariables } from '@homemaker/dataconnect';

// The `CreateStaffCashRequest` mutation requires an argument of type `CreateStaffCashRequestVariables`:
const createStaffCashRequestVars: CreateStaffCashRequestVariables = {
  householdId: ..., 
  staffId: ..., // optional
  inventoryItemId: ..., // optional
  category: ..., 
  amountRequested: ..., 
  reason: ..., 
  neededBy: ..., // optional
  notes: ..., // optional
};

// Call the `createStaffCashRequestRef()` function to get a reference to the mutation.
const ref = createStaffCashRequestRef(createStaffCashRequestVars);
// Variables can be defined inline as well.
const ref = createStaffCashRequestRef({ householdId: ..., staffId: ..., inventoryItemId: ..., category: ..., amountRequested: ..., reason: ..., neededBy: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createStaffCashRequestRef(dataConnect, createStaffCashRequestVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.staffCashRequest_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.staffCashRequest_insert);
});
```

## ReviewStaffCashRequest
You can execute the `ReviewStaffCashRequest` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
reviewStaffCashRequest(vars: ReviewStaffCashRequestVariables): MutationPromise<ReviewStaffCashRequestData, ReviewStaffCashRequestVariables>;

interface ReviewStaffCashRequestRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ReviewStaffCashRequestVariables): MutationRef<ReviewStaffCashRequestData, ReviewStaffCashRequestVariables>;
}
export const reviewStaffCashRequestRef: ReviewStaffCashRequestRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
reviewStaffCashRequest(dc: DataConnect, vars: ReviewStaffCashRequestVariables): MutationPromise<ReviewStaffCashRequestData, ReviewStaffCashRequestVariables>;

interface ReviewStaffCashRequestRef {
  ...
  (dc: DataConnect, vars: ReviewStaffCashRequestVariables): MutationRef<ReviewStaffCashRequestData, ReviewStaffCashRequestVariables>;
}
export const reviewStaffCashRequestRef: ReviewStaffCashRequestRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the reviewStaffCashRequestRef:
```typescript
const name = reviewStaffCashRequestRef.operationName;
console.log(name);
```

### Variables
The `ReviewStaffCashRequest` mutation requires an argument of type `ReviewStaffCashRequestVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ReviewStaffCashRequestVariables {
  requestId: UUIDString;
  status: string;
  amountApproved?: number | null;
  notes?: string | null;
}
```
### Return Type
Recall that executing the `ReviewStaffCashRequest` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ReviewStaffCashRequestData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ReviewStaffCashRequestData {
  staffCashRequest_update?: StaffCashRequest_Key | null;
}
```
### Using `ReviewStaffCashRequest`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, reviewStaffCashRequest, ReviewStaffCashRequestVariables } from '@homemaker/dataconnect';

// The `ReviewStaffCashRequest` mutation requires an argument of type `ReviewStaffCashRequestVariables`:
const reviewStaffCashRequestVars: ReviewStaffCashRequestVariables = {
  requestId: ..., 
  status: ..., 
  amountApproved: ..., // optional
  notes: ..., // optional
};

// Call the `reviewStaffCashRequest()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await reviewStaffCashRequest(reviewStaffCashRequestVars);
// Variables can be defined inline as well.
const { data } = await reviewStaffCashRequest({ requestId: ..., status: ..., amountApproved: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await reviewStaffCashRequest(dataConnect, reviewStaffCashRequestVars);

console.log(data.staffCashRequest_update);

// Or, you can use the `Promise` API.
reviewStaffCashRequest(reviewStaffCashRequestVars).then((response) => {
  const data = response.data;
  console.log(data.staffCashRequest_update);
});
```

### Using `ReviewStaffCashRequest`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, reviewStaffCashRequestRef, ReviewStaffCashRequestVariables } from '@homemaker/dataconnect';

// The `ReviewStaffCashRequest` mutation requires an argument of type `ReviewStaffCashRequestVariables`:
const reviewStaffCashRequestVars: ReviewStaffCashRequestVariables = {
  requestId: ..., 
  status: ..., 
  amountApproved: ..., // optional
  notes: ..., // optional
};

// Call the `reviewStaffCashRequestRef()` function to get a reference to the mutation.
const ref = reviewStaffCashRequestRef(reviewStaffCashRequestVars);
// Variables can be defined inline as well.
const ref = reviewStaffCashRequestRef({ requestId: ..., status: ..., amountApproved: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = reviewStaffCashRequestRef(dataConnect, reviewStaffCashRequestVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.staffCashRequest_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.staffCashRequest_update);
});
```

## MarkStaffCashRequestPurchased
You can execute the `MarkStaffCashRequestPurchased` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
markStaffCashRequestPurchased(vars: MarkStaffCashRequestPurchasedVariables): MutationPromise<MarkStaffCashRequestPurchasedData, MarkStaffCashRequestPurchasedVariables>;

interface MarkStaffCashRequestPurchasedRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: MarkStaffCashRequestPurchasedVariables): MutationRef<MarkStaffCashRequestPurchasedData, MarkStaffCashRequestPurchasedVariables>;
}
export const markStaffCashRequestPurchasedRef: MarkStaffCashRequestPurchasedRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
markStaffCashRequestPurchased(dc: DataConnect, vars: MarkStaffCashRequestPurchasedVariables): MutationPromise<MarkStaffCashRequestPurchasedData, MarkStaffCashRequestPurchasedVariables>;

interface MarkStaffCashRequestPurchasedRef {
  ...
  (dc: DataConnect, vars: MarkStaffCashRequestPurchasedVariables): MutationRef<MarkStaffCashRequestPurchasedData, MarkStaffCashRequestPurchasedVariables>;
}
export const markStaffCashRequestPurchasedRef: MarkStaffCashRequestPurchasedRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the markStaffCashRequestPurchasedRef:
```typescript
const name = markStaffCashRequestPurchasedRef.operationName;
console.log(name);
```

### Variables
The `MarkStaffCashRequestPurchased` mutation requires an argument of type `MarkStaffCashRequestPurchasedVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface MarkStaffCashRequestPurchasedVariables {
  requestId: UUIDString;
  linkedExpenseId?: UUIDString | null;
  receiptUrl?: string | null;
  notes?: string | null;
}
```
### Return Type
Recall that executing the `MarkStaffCashRequestPurchased` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `MarkStaffCashRequestPurchasedData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface MarkStaffCashRequestPurchasedData {
  staffCashRequest_update?: StaffCashRequest_Key | null;
}
```
### Using `MarkStaffCashRequestPurchased`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, markStaffCashRequestPurchased, MarkStaffCashRequestPurchasedVariables } from '@homemaker/dataconnect';

// The `MarkStaffCashRequestPurchased` mutation requires an argument of type `MarkStaffCashRequestPurchasedVariables`:
const markStaffCashRequestPurchasedVars: MarkStaffCashRequestPurchasedVariables = {
  requestId: ..., 
  linkedExpenseId: ..., // optional
  receiptUrl: ..., // optional
  notes: ..., // optional
};

// Call the `markStaffCashRequestPurchased()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await markStaffCashRequestPurchased(markStaffCashRequestPurchasedVars);
// Variables can be defined inline as well.
const { data } = await markStaffCashRequestPurchased({ requestId: ..., linkedExpenseId: ..., receiptUrl: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await markStaffCashRequestPurchased(dataConnect, markStaffCashRequestPurchasedVars);

console.log(data.staffCashRequest_update);

// Or, you can use the `Promise` API.
markStaffCashRequestPurchased(markStaffCashRequestPurchasedVars).then((response) => {
  const data = response.data;
  console.log(data.staffCashRequest_update);
});
```

### Using `MarkStaffCashRequestPurchased`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, markStaffCashRequestPurchasedRef, MarkStaffCashRequestPurchasedVariables } from '@homemaker/dataconnect';

// The `MarkStaffCashRequestPurchased` mutation requires an argument of type `MarkStaffCashRequestPurchasedVariables`:
const markStaffCashRequestPurchasedVars: MarkStaffCashRequestPurchasedVariables = {
  requestId: ..., 
  linkedExpenseId: ..., // optional
  receiptUrl: ..., // optional
  notes: ..., // optional
};

// Call the `markStaffCashRequestPurchasedRef()` function to get a reference to the mutation.
const ref = markStaffCashRequestPurchasedRef(markStaffCashRequestPurchasedVars);
// Variables can be defined inline as well.
const ref = markStaffCashRequestPurchasedRef({ requestId: ..., linkedExpenseId: ..., receiptUrl: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = markStaffCashRequestPurchasedRef(dataConnect, markStaffCashRequestPurchasedVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.staffCashRequest_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.staffCashRequest_update);
});
```

## CreateAttendanceCorrectionRequest
You can execute the `CreateAttendanceCorrectionRequest` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createAttendanceCorrectionRequest(vars: CreateAttendanceCorrectionRequestVariables): MutationPromise<CreateAttendanceCorrectionRequestData, CreateAttendanceCorrectionRequestVariables>;

interface CreateAttendanceCorrectionRequestRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateAttendanceCorrectionRequestVariables): MutationRef<CreateAttendanceCorrectionRequestData, CreateAttendanceCorrectionRequestVariables>;
}
export const createAttendanceCorrectionRequestRef: CreateAttendanceCorrectionRequestRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createAttendanceCorrectionRequest(dc: DataConnect, vars: CreateAttendanceCorrectionRequestVariables): MutationPromise<CreateAttendanceCorrectionRequestData, CreateAttendanceCorrectionRequestVariables>;

interface CreateAttendanceCorrectionRequestRef {
  ...
  (dc: DataConnect, vars: CreateAttendanceCorrectionRequestVariables): MutationRef<CreateAttendanceCorrectionRequestData, CreateAttendanceCorrectionRequestVariables>;
}
export const createAttendanceCorrectionRequestRef: CreateAttendanceCorrectionRequestRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createAttendanceCorrectionRequestRef:
```typescript
const name = createAttendanceCorrectionRequestRef.operationName;
console.log(name);
```

### Variables
The `CreateAttendanceCorrectionRequest` mutation requires an argument of type `CreateAttendanceCorrectionRequestVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateAttendanceCorrectionRequestVariables {
  householdId: UUIDString;
  staffId: UUIDString;
  currentStatus?: string | null;
  requestedStatus: string;
  requestedFor: DateString;
  reason: string;
}
```
### Return Type
Recall that executing the `CreateAttendanceCorrectionRequest` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateAttendanceCorrectionRequestData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateAttendanceCorrectionRequestData {
  attendanceCorrectionRequest_insert: AttendanceCorrectionRequest_Key;
}
```
### Using `CreateAttendanceCorrectionRequest`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createAttendanceCorrectionRequest, CreateAttendanceCorrectionRequestVariables } from '@homemaker/dataconnect';

// The `CreateAttendanceCorrectionRequest` mutation requires an argument of type `CreateAttendanceCorrectionRequestVariables`:
const createAttendanceCorrectionRequestVars: CreateAttendanceCorrectionRequestVariables = {
  householdId: ..., 
  staffId: ..., 
  currentStatus: ..., // optional
  requestedStatus: ..., 
  requestedFor: ..., 
  reason: ..., 
};

// Call the `createAttendanceCorrectionRequest()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createAttendanceCorrectionRequest(createAttendanceCorrectionRequestVars);
// Variables can be defined inline as well.
const { data } = await createAttendanceCorrectionRequest({ householdId: ..., staffId: ..., currentStatus: ..., requestedStatus: ..., requestedFor: ..., reason: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createAttendanceCorrectionRequest(dataConnect, createAttendanceCorrectionRequestVars);

console.log(data.attendanceCorrectionRequest_insert);

// Or, you can use the `Promise` API.
createAttendanceCorrectionRequest(createAttendanceCorrectionRequestVars).then((response) => {
  const data = response.data;
  console.log(data.attendanceCorrectionRequest_insert);
});
```

### Using `CreateAttendanceCorrectionRequest`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createAttendanceCorrectionRequestRef, CreateAttendanceCorrectionRequestVariables } from '@homemaker/dataconnect';

// The `CreateAttendanceCorrectionRequest` mutation requires an argument of type `CreateAttendanceCorrectionRequestVariables`:
const createAttendanceCorrectionRequestVars: CreateAttendanceCorrectionRequestVariables = {
  householdId: ..., 
  staffId: ..., 
  currentStatus: ..., // optional
  requestedStatus: ..., 
  requestedFor: ..., 
  reason: ..., 
};

// Call the `createAttendanceCorrectionRequestRef()` function to get a reference to the mutation.
const ref = createAttendanceCorrectionRequestRef(createAttendanceCorrectionRequestVars);
// Variables can be defined inline as well.
const ref = createAttendanceCorrectionRequestRef({ householdId: ..., staffId: ..., currentStatus: ..., requestedStatus: ..., requestedFor: ..., reason: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createAttendanceCorrectionRequestRef(dataConnect, createAttendanceCorrectionRequestVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.attendanceCorrectionRequest_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.attendanceCorrectionRequest_insert);
});
```

## ReviewAttendanceCorrectionRequest
You can execute the `ReviewAttendanceCorrectionRequest` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
reviewAttendanceCorrectionRequest(vars: ReviewAttendanceCorrectionRequestVariables): MutationPromise<ReviewAttendanceCorrectionRequestData, ReviewAttendanceCorrectionRequestVariables>;

interface ReviewAttendanceCorrectionRequestRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ReviewAttendanceCorrectionRequestVariables): MutationRef<ReviewAttendanceCorrectionRequestData, ReviewAttendanceCorrectionRequestVariables>;
}
export const reviewAttendanceCorrectionRequestRef: ReviewAttendanceCorrectionRequestRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
reviewAttendanceCorrectionRequest(dc: DataConnect, vars: ReviewAttendanceCorrectionRequestVariables): MutationPromise<ReviewAttendanceCorrectionRequestData, ReviewAttendanceCorrectionRequestVariables>;

interface ReviewAttendanceCorrectionRequestRef {
  ...
  (dc: DataConnect, vars: ReviewAttendanceCorrectionRequestVariables): MutationRef<ReviewAttendanceCorrectionRequestData, ReviewAttendanceCorrectionRequestVariables>;
}
export const reviewAttendanceCorrectionRequestRef: ReviewAttendanceCorrectionRequestRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the reviewAttendanceCorrectionRequestRef:
```typescript
const name = reviewAttendanceCorrectionRequestRef.operationName;
console.log(name);
```

### Variables
The `ReviewAttendanceCorrectionRequest` mutation requires an argument of type `ReviewAttendanceCorrectionRequestVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ReviewAttendanceCorrectionRequestVariables {
  requestId: UUIDString;
  status: string;
  notes?: string | null;
}
```
### Return Type
Recall that executing the `ReviewAttendanceCorrectionRequest` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ReviewAttendanceCorrectionRequestData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ReviewAttendanceCorrectionRequestData {
  attendanceCorrectionRequest_update?: AttendanceCorrectionRequest_Key | null;
}
```
### Using `ReviewAttendanceCorrectionRequest`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, reviewAttendanceCorrectionRequest, ReviewAttendanceCorrectionRequestVariables } from '@homemaker/dataconnect';

// The `ReviewAttendanceCorrectionRequest` mutation requires an argument of type `ReviewAttendanceCorrectionRequestVariables`:
const reviewAttendanceCorrectionRequestVars: ReviewAttendanceCorrectionRequestVariables = {
  requestId: ..., 
  status: ..., 
  notes: ..., // optional
};

// Call the `reviewAttendanceCorrectionRequest()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await reviewAttendanceCorrectionRequest(reviewAttendanceCorrectionRequestVars);
// Variables can be defined inline as well.
const { data } = await reviewAttendanceCorrectionRequest({ requestId: ..., status: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await reviewAttendanceCorrectionRequest(dataConnect, reviewAttendanceCorrectionRequestVars);

console.log(data.attendanceCorrectionRequest_update);

// Or, you can use the `Promise` API.
reviewAttendanceCorrectionRequest(reviewAttendanceCorrectionRequestVars).then((response) => {
  const data = response.data;
  console.log(data.attendanceCorrectionRequest_update);
});
```

### Using `ReviewAttendanceCorrectionRequest`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, reviewAttendanceCorrectionRequestRef, ReviewAttendanceCorrectionRequestVariables } from '@homemaker/dataconnect';

// The `ReviewAttendanceCorrectionRequest` mutation requires an argument of type `ReviewAttendanceCorrectionRequestVariables`:
const reviewAttendanceCorrectionRequestVars: ReviewAttendanceCorrectionRequestVariables = {
  requestId: ..., 
  status: ..., 
  notes: ..., // optional
};

// Call the `reviewAttendanceCorrectionRequestRef()` function to get a reference to the mutation.
const ref = reviewAttendanceCorrectionRequestRef(reviewAttendanceCorrectionRequestVars);
// Variables can be defined inline as well.
const ref = reviewAttendanceCorrectionRequestRef({ requestId: ..., status: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = reviewAttendanceCorrectionRequestRef(dataConnect, reviewAttendanceCorrectionRequestVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.attendanceCorrectionRequest_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.attendanceCorrectionRequest_update);
});
```

## CreateCctvCamera
You can execute the `CreateCctvCamera` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createCctvCamera(vars: CreateCctvCameraVariables): MutationPromise<CreateCctvCameraData, CreateCctvCameraVariables>;

interface CreateCctvCameraRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateCctvCameraVariables): MutationRef<CreateCctvCameraData, CreateCctvCameraVariables>;
}
export const createCctvCameraRef: CreateCctvCameraRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createCctvCamera(dc: DataConnect, vars: CreateCctvCameraVariables): MutationPromise<CreateCctvCameraData, CreateCctvCameraVariables>;

interface CreateCctvCameraRef {
  ...
  (dc: DataConnect, vars: CreateCctvCameraVariables): MutationRef<CreateCctvCameraData, CreateCctvCameraVariables>;
}
export const createCctvCameraRef: CreateCctvCameraRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createCctvCameraRef:
```typescript
const name = createCctvCameraRef.operationName;
console.log(name);
```

### Variables
The `CreateCctvCamera` mutation requires an argument of type `CreateCctvCameraVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateCctvCameraVariables {
  householdId: UUIDString;
  roomId?: UUIDString | null;
  name: string;
  provider?: string | null;
  streamUrl?: string | null;
  notes?: string | null;
}
```
### Return Type
Recall that executing the `CreateCctvCamera` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateCctvCameraData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateCctvCameraData {
  cctvCamera_insert: CctvCamera_Key;
}
```
### Using `CreateCctvCamera`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createCctvCamera, CreateCctvCameraVariables } from '@homemaker/dataconnect';

// The `CreateCctvCamera` mutation requires an argument of type `CreateCctvCameraVariables`:
const createCctvCameraVars: CreateCctvCameraVariables = {
  householdId: ..., 
  roomId: ..., // optional
  name: ..., 
  provider: ..., // optional
  streamUrl: ..., // optional
  notes: ..., // optional
};

// Call the `createCctvCamera()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createCctvCamera(createCctvCameraVars);
// Variables can be defined inline as well.
const { data } = await createCctvCamera({ householdId: ..., roomId: ..., name: ..., provider: ..., streamUrl: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createCctvCamera(dataConnect, createCctvCameraVars);

console.log(data.cctvCamera_insert);

// Or, you can use the `Promise` API.
createCctvCamera(createCctvCameraVars).then((response) => {
  const data = response.data;
  console.log(data.cctvCamera_insert);
});
```

### Using `CreateCctvCamera`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createCctvCameraRef, CreateCctvCameraVariables } from '@homemaker/dataconnect';

// The `CreateCctvCamera` mutation requires an argument of type `CreateCctvCameraVariables`:
const createCctvCameraVars: CreateCctvCameraVariables = {
  householdId: ..., 
  roomId: ..., // optional
  name: ..., 
  provider: ..., // optional
  streamUrl: ..., // optional
  notes: ..., // optional
};

// Call the `createCctvCameraRef()` function to get a reference to the mutation.
const ref = createCctvCameraRef(createCctvCameraVars);
// Variables can be defined inline as well.
const ref = createCctvCameraRef({ householdId: ..., roomId: ..., name: ..., provider: ..., streamUrl: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createCctvCameraRef(dataConnect, createCctvCameraVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.cctvCamera_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.cctvCamera_insert);
});
```

## RecordCctvHealthEvent
You can execute the `RecordCctvHealthEvent` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
recordCctvHealthEvent(vars: RecordCctvHealthEventVariables): MutationPromise<RecordCctvHealthEventData, RecordCctvHealthEventVariables>;

interface RecordCctvHealthEventRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: RecordCctvHealthEventVariables): MutationRef<RecordCctvHealthEventData, RecordCctvHealthEventVariables>;
}
export const recordCctvHealthEventRef: RecordCctvHealthEventRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
recordCctvHealthEvent(dc: DataConnect, vars: RecordCctvHealthEventVariables): MutationPromise<RecordCctvHealthEventData, RecordCctvHealthEventVariables>;

interface RecordCctvHealthEventRef {
  ...
  (dc: DataConnect, vars: RecordCctvHealthEventVariables): MutationRef<RecordCctvHealthEventData, RecordCctvHealthEventVariables>;
}
export const recordCctvHealthEventRef: RecordCctvHealthEventRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the recordCctvHealthEventRef:
```typescript
const name = recordCctvHealthEventRef.operationName;
console.log(name);
```

### Variables
The `RecordCctvHealthEvent` mutation requires an argument of type `RecordCctvHealthEventVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface RecordCctvHealthEventVariables {
  householdId: UUIDString;
  cameraId: UUIDString;
  eventType: string;
  status: string;
  message?: string | null;
}
```
### Return Type
Recall that executing the `RecordCctvHealthEvent` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `RecordCctvHealthEventData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface RecordCctvHealthEventData {
  cctvCamera_update?: CctvCamera_Key | null;
  cctvHealthEvent_insert: CctvHealthEvent_Key;
}
```
### Using `RecordCctvHealthEvent`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, recordCctvHealthEvent, RecordCctvHealthEventVariables } from '@homemaker/dataconnect';

// The `RecordCctvHealthEvent` mutation requires an argument of type `RecordCctvHealthEventVariables`:
const recordCctvHealthEventVars: RecordCctvHealthEventVariables = {
  householdId: ..., 
  cameraId: ..., 
  eventType: ..., 
  status: ..., 
  message: ..., // optional
};

// Call the `recordCctvHealthEvent()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await recordCctvHealthEvent(recordCctvHealthEventVars);
// Variables can be defined inline as well.
const { data } = await recordCctvHealthEvent({ householdId: ..., cameraId: ..., eventType: ..., status: ..., message: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await recordCctvHealthEvent(dataConnect, recordCctvHealthEventVars);

console.log(data.cctvCamera_update);
console.log(data.cctvHealthEvent_insert);

// Or, you can use the `Promise` API.
recordCctvHealthEvent(recordCctvHealthEventVars).then((response) => {
  const data = response.data;
  console.log(data.cctvCamera_update);
  console.log(data.cctvHealthEvent_insert);
});
```

### Using `RecordCctvHealthEvent`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, recordCctvHealthEventRef, RecordCctvHealthEventVariables } from '@homemaker/dataconnect';

// The `RecordCctvHealthEvent` mutation requires an argument of type `RecordCctvHealthEventVariables`:
const recordCctvHealthEventVars: RecordCctvHealthEventVariables = {
  householdId: ..., 
  cameraId: ..., 
  eventType: ..., 
  status: ..., 
  message: ..., // optional
};

// Call the `recordCctvHealthEventRef()` function to get a reference to the mutation.
const ref = recordCctvHealthEventRef(recordCctvHealthEventVars);
// Variables can be defined inline as well.
const ref = recordCctvHealthEventRef({ householdId: ..., cameraId: ..., eventType: ..., status: ..., message: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = recordCctvHealthEventRef(dataConnect, recordCctvHealthEventVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.cctvCamera_update);
console.log(data.cctvHealthEvent_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.cctvCamera_update);
  console.log(data.cctvHealthEvent_insert);
});
```

