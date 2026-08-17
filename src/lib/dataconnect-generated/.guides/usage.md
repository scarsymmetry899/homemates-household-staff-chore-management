# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { upsertCurrentUser, createHousehold, myHouseholds, addStaffMember, createHomemateProfile, createRoomZone, createInventoryItem, createPayrollProfile, updateStaffStatus, updateStaffRole } from '@homemaker/dataconnect';


// Operation UpsertCurrentUser:  For variables, look at type UpsertCurrentUserVars in ../index.d.ts
const { data } = await UpsertCurrentUser(dataConnect, upsertCurrentUserVars);

// Operation CreateHousehold:  For variables, look at type CreateHouseholdVars in ../index.d.ts
const { data } = await CreateHousehold(dataConnect, createHouseholdVars);

// Operation MyHouseholds: 
const { data } = await MyHouseholds(dataConnect);

// Operation AddStaffMember:  For variables, look at type AddStaffMemberVars in ../index.d.ts
const { data } = await AddStaffMember(dataConnect, addStaffMemberVars);

// Operation CreateHomemateProfile:  For variables, look at type CreateHomemateProfileVars in ../index.d.ts
const { data } = await CreateHomemateProfile(dataConnect, createHomemateProfileVars);

// Operation CreateRoomZone:  For variables, look at type CreateRoomZoneVars in ../index.d.ts
const { data } = await CreateRoomZone(dataConnect, createRoomZoneVars);

// Operation CreateInventoryItem:  For variables, look at type CreateInventoryItemVars in ../index.d.ts
const { data } = await CreateInventoryItem(dataConnect, createInventoryItemVars);

// Operation CreatePayrollProfile:  For variables, look at type CreatePayrollProfileVars in ../index.d.ts
const { data } = await CreatePayrollProfile(dataConnect, createPayrollProfileVars);

// Operation UpdateStaffStatus:  For variables, look at type UpdateStaffStatusVars in ../index.d.ts
const { data } = await UpdateStaffStatus(dataConnect, updateStaffStatusVars);

// Operation UpdateStaffRole:  For variables, look at type UpdateStaffRoleVars in ../index.d.ts
const { data } = await UpdateStaffRole(dataConnect, updateStaffRoleVars);


```