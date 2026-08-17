# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `web`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*MyHouseholds*](#myhouseholds)
- [**Mutations**](#mutations)
  - [*UpsertCurrentUser*](#upsertcurrentuser)
  - [*CreateHousehold*](#createhousehold)
  - [*AddStaffMember*](#addstaffmember)
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
  - [*RegisterNfcTag*](#registernfctag)
  - [*RecordNfcTap*](#recordnfctap)

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

