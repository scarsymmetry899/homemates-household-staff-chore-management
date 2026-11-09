// Uses isolated QA accounts on the Firebase project selected by the caller.
// Set QA_FIREBASE_CONFIG to a web configuration file and QA_BASE_URL to the matching app.
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { randomUUID } = require("node:crypto");
const { initializeApp } = require("firebase/app");
const { getAuth, createUserWithEmailAndPassword } = require("firebase/auth");
const {
  getDataConnect,
  mutationRef,
  queryRef,
  executeQuery,
  executeMutation,
} = require("firebase/data-connect");
const { chromium } = require("playwright");
const config = JSON.parse(
  readFileSync(process.env.QA_FIREBASE_CONFIG, "utf8").replace(/^\uFEFF/, ""),
);
const base = process.env.QA_BASE_URL;
const run = randomUUID();
async function account(role) {
  const app = initializeApp(config, role);
  const email = role + "-" + run + "@example.invalid",
    password = randomUUID() + "!a";
  await createUserWithEmailAndPassword(getAuth(app), email, password);
  const dc = getDataConnect(app, {
    connector: "web",
    service: "homemaker",
    location: "us-central1",
  });
  return {
    email,
    password,
    read: async (name, vars = {}) =>
      (
        await executeQuery(queryRef(dc, name, vars), {
          fetchPolicy: "SERVER_ONLY",
        })
      ).data,
    write: async (name, vars) =>
      (await executeMutation(mutationRef(dc, name, vars))).data,
  };
}
async function login(page, user) {
  await page.getByLabel("Email address").fill(user.email);
  await page.locator("#auth-password").fill(user.password);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
}
async function testRoutines(ownerPage, owner, a, b, householdId) {
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  const end = new Date(today + "T12:00:00Z");
  end.setUTCDate(end.getUTCDate() + 13);
  await ownerPage.goto(base + "/#/tasks");
  await ownerPage.getByText("Recurring chores", { exact: true }).click();
  await ownerPage.getByRole("button", { name: "Add recurring chore" }).click();
  await ownerPage.getByLabel("Chore name").fill("Weekday breakfast");
  await ownerPage
    .getByLabel("Assigned staff", { exact: true })
    .selectOption(a.id);
  await ownerPage
    .getByLabel("Repeat until")
    .fill(end.toISOString().slice(0, 10));
  await ownerPage.getByLabel(/Due time/).fill("07:30");
  await ownerPage.getByLabel(/Instructions/).fill("Set the breakfast table");
  await ownerPage.getByRole("button", { name: "Save schedule" }).click();
  await ownerPage
    .getByText("Recurring chore scheduled.", { exact: false })
    .waitFor();
  const {
    routines: [routine],
  } = await owner.read("HouseholdRoutines", { householdId });
  const occurrences = async () =>
    (await owner.read("RoutineOccurrences", { id: routine.id })).chores;
  const list = await occurrences();
  assert.equal(list.length, 10);
  assert.equal(new Set(list.map((t) => t.occurrenceDay)).size, 10);
  const personal = (await a.read("MyStaffWork")).tasks.filter(
    (t) => t.occurrenceDay,
  );
  assert(
    personal.every(
      (t) =>
        t.dueAt.includes("T02:00:00") &&
        t.routineInstructions === "Set the breakfast table",
    ),
  );
  assert.deepEqual(
    (await b.read("RoutineOccurrences", { id: routine.id })).chores,
    [],
  );
  await assert.rejects(b.write("StopRoutine", { id: routine.id }));
  await ownerPage.getByRole("button", { name: "Edit one occurrence" }).click();
  await ownerPage.getByLabel("Staff for this date").selectOption(b.id);
  await ownerPage.getByRole("button", { name: "Save this occurrence" }).click();
  await ownerPage.getByText("Occurrence updated.", { exact: false }).waitFor();
  const backup = (await b.read("MyStaffWork")).tasks.filter(
    (t) => t.occurrenceDay,
  );
  assert.equal(backup.length, 1);
  assert.equal(backup[0].id, list[0].id);
  await b.page.getByRole("button", { name: "Refresh", exact: true }).click();
  await b.page.getByRole("button", { name: "Show all dates" }).click();
  await b.page.getByText("Set the breakfast table", { exact: true }).waitFor();
  await b.page.getByRole("button", { name: "Mark complete" }).click();
  await ownerPage.getByRole("button", { name: "Edit upcoming chores" }).click();
  await ownerPage.getByLabel("Chore name").fill("Breakfast service");
  await ownerPage.getByRole("button", { name: "Save schedule" }).click();
  await ownerPage
    .getByText("Upcoming chores updated.", { exact: false })
    .waitFor();
  const updated = await occurrences();
  assert.equal(updated.length, 9);
  assert(
    updated.every(
      (t) =>
        t.title === "Breakfast service" &&
        list.some((original) => original.id === t.id),
    ),
  );
  ownerPage.once("dialog", (d) => d.accept());
  await ownerPage.getByRole("button", { name: "Stop routine" }).click();
  await ownerPage
    .getByText("Recurring chore stopped.", { exact: false })
    .waitFor();
  assert.equal((await occurrences()).length, 0);
  const retained = (await b.read("MyStaffWork")).tasks.find(
    (t) => t.id === backup[0].id,
  );
  assert.equal(retained.status, "completed");
  assert.equal(retained.title, "Weekday breakfast");
  console.log(
    "Passed weekday generation, timezone conversion, single-date cover, staff completion, series edit, stop and historical retention.",
  );
}
async function main() {
  const owner = await account("owner"),
    a = await account("cook"),
    b = await account("driver");
  const householdId = (
    await owner.write("CreateHousehold", {
      name: "Access QA " + run.slice(0, 8),
      timezone: "Asia/Kolkata",
    })
  ).household_insert.id;
  const browser = await chromium.launch();
  try {
    const ownerPage = await browser.newPage();
    await ownerPage.goto(base);
    await login(ownerPage, owner);
    for (const [index, user] of [a, b].entries()) {
      user.name = index ? "QA Driver" : "QA Cook";
      user.title = index ? "Collect groceries" : "Prepare breakfast";
      user.salary = index ? 12700 : 18300;
      user.event = index ? "late" : "check-in";
      const staff = (
        await owner.write("AddPaidStaffMember", {
          householdId,
          month: new Intl.DateTimeFormat("en-US",{month:"long",year:"numeric",timeZone:"Asia/Kolkata"}).format(new Date()),
          name: user.name,
          role: index ? "Driver" : "Cook",
          department: "Other",
          salary: user.salary,
        })
      ).staffMember_insert;
      user.id = staff.id;
      user.task = (
        await owner.write("AddTaskInstance", {
          householdId,
          assignedStaffId: user.id,
          title: user.title,
        })
      ).taskInstance_insert.id;
      await owner.write("RecordAttendanceEvent", {
        householdId,
        staffId: user.id,
        eventType: user.event,
        source: "qa",
      });
      await ownerPage.goto(base + "/#/staff/" + user.id);
      await ownerPage
        .getByRole("button", { name: "Create invitation" })
        .click();
      user.link = await ownerPage
        .getByLabel("Private invitation link")
        .inputValue();
      user.page = await browser.newPage({
        viewport: { width: 390, height: 844 },
      });
      await user.page.goto(user.link);
      await login(user.page, user);
      await user.page
        .getByRole("button", { name: "Accept staff invitation" })
        .click();
      await user.page.getByText(user.title, { exact: true }).waitFor();
      await user.page.reload();
      await user.page.getByText(user.title, { exact: true }).waitFor();
    }
    for (const [user, other] of [
      [a, b],
      [b, a],
    ]) {
      const data = await user.read("MyStaffWork");
      assert.deepEqual(
        data.tasks.map((t) => t.id),
        [user.task],
      );
      assert.deepEqual(
        data.attendance.map((e) => e.eventType),
        [user.event],
      );
      assert.deepEqual(
        data.pay.map((p) => p.netPay),
        [user.salary],
      );
      assert.deepEqual((await user.read("MyHouseholds")).households, []);
      assert.deepEqual(
        (await user.read("OwnerStaffAccess", { staffId: other.id })).profiles,
        [],
      );
      await assert.rejects(
        user.write("CompleteMyStaffTask", { taskId: other.task }),
      );
      await assert.rejects(
        user.write("RevokeStaffLogin", { staffId: other.id }),
      );
      await assert.rejects(
        user.write("ClaimStaffLogin", {
          staffId: other.id,
          code: other.link.split("/").at(-1),
        }),
      );
      await user.page.goto(base + "/#/settings");
      await user.page.getByRole("heading", { name: "My work" }).waitFor();
      assert.equal(
        await user.page.getByText(other.title, { exact: true }).count(),
        0,
      );
      await user.page.getByRole("button", { name: "Mark complete" }).click();
      await user.page.getByText("Completed", { exact: true }).waitFor();
      assert.equal(
        (await user.read("MyStaffWork")).tasks[0].status,
        "completed",
      );
    }
    const rows = (await owner.read("MyHouseholds")).households[0]
      .taskInstances_on_household;
    assert(
      rows.length === 2 &&
        rows.every((t) => t.status === "completed" && t.completedAt),
    );
    console.log("Staff isolation and completion checks passed.");
    await testRoutines(ownerPage, owner, a, b, householdId);
    await owner.write("RevokeStaffLogin", { staffId: a.id });
    await a.page.getByRole("button", { name: "Refresh", exact: true }).click();
    await a.page.getByText(/access has ended/).waitFor();
    assert.equal((await a.read("MyStaffWork")).pay.length, 0);
    console.log(
      "Passed owner invitations, two independent staff sign-ins, reload, task/attendance/pay isolation, cross-account denial, completion and revocation.",
    );
  } finally {
    await browser.close();
  }
}
main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
