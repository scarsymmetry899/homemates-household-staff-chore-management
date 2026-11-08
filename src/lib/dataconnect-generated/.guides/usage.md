# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { ownerAttendancePeriod, setOwnerDayAttendance, saveAttendanceAndPay, setAppLanguage, ensureMonthlyPayroll, postCashPurchase, addPaidStaffMember, addManualPayDeduction, findStaffAttendanceTag, upsertCurrentUser } from '@homemaker/dataconnect';


// Operation OwnerAttendancePeriod:  For variables, look at type OwnerAttendancePeriodVars in ../index.d.ts
const { data } = await OwnerAttendancePeriod(dataConnect, ownerAttendancePeriodVars);

// Operation SetOwnerDayAttendance:  For variables, look at type SetOwnerDayAttendanceVars in ../index.d.ts
const { data } = await SetOwnerDayAttendance(dataConnect, setOwnerDayAttendanceVars);

// Operation SaveAttendanceAndPay:  For variables, look at type SaveAttendanceAndPayVars in ../index.d.ts
const { data } = await SaveAttendanceAndPay(dataConnect, saveAttendanceAndPayVars);

// Operation SetAppLanguage:  For variables, look at type SetAppLanguageVars in ../index.d.ts
const { data } = await SetAppLanguage(dataConnect, setAppLanguageVars);

// Operation EnsureMonthlyPayroll:  For variables, look at type EnsureMonthlyPayrollVars in ../index.d.ts
const { data } = await EnsureMonthlyPayroll(dataConnect, ensureMonthlyPayrollVars);

// Operation PostCashPurchase:  For variables, look at type PostCashPurchaseVars in ../index.d.ts
const { data } = await PostCashPurchase(dataConnect, postCashPurchaseVars);

// Operation AddPaidStaffMember:  For variables, look at type AddPaidStaffMemberVars in ../index.d.ts
const { data } = await AddPaidStaffMember(dataConnect, addPaidStaffMemberVars);

// Operation AddManualPayDeduction:  For variables, look at type AddManualPayDeductionVars in ../index.d.ts
const { data } = await AddManualPayDeduction(dataConnect, addManualPayDeductionVars);

// Operation FindStaffAttendanceTag:  For variables, look at type FindStaffAttendanceTagVars in ../index.d.ts
const { data } = await FindStaffAttendanceTag(dataConnect, findStaffAttendanceTagVars);

// Operation UpsertCurrentUser:  For variables, look at type UpsertCurrentUserVars in ../index.d.ts
const { data } = await UpsertCurrentUser(dataConnect, upsertCurrentUserVars);


```