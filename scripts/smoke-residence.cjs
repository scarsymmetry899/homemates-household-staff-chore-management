// Run against a loopback Vite development server with Firebase disabled.
const assert = require("node:assert/strict");
const { chromium } = require("playwright");
const { reachByTouch } = require("./mobile-reachability.cjs");
const base = "http://127.0.0.1:4186/";

async function walk(browser, width) {
  const height = width === 320 ? 568 : 860;
  const ctx = await browser.newContext({ viewport: {width, height}, isMobile:width < 768, hasTouch: width < 768, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  const touch = width < 768 ? await ctx.newCDPSession(page) : null;
  const reach = async (target, name) => { if (touch) await reachByTouch(page,touch,target,name); };
  const errors = [];
  page.on("pageerror", e => errors.push(e.message));
  let count = 0;
  const btn = name => page.getByRole("button", {name, exact:true});
  async function screen(name) {
    await page.getByRole("heading").first().waitFor();
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), name + " overflows");
    if(width < 768) {
      const scope = page.locator('[role="dialog"]:visible').last();
      const content = await scope.count() ? scope : await page.locator("main").count() ? page.locator("main") : page.locator("#root");
      const controls = content.locator('button:visible,select:visible,summary:visible,a[href]:visible');
      await reach(controls.last(),name);
      const small = await page.locator("input:visible,textarea:visible,select:visible").evaluateAll(fields =>
        fields.filter(f => !["checkbox","radio","range"].includes(f.type) && parseFloat(getComputedStyle(f).fontSize)<16)
          .map(f => f.getAttribute("aria-label") || f.name || f.tagName));
      assert.deepEqual(small,[],name+" has touch inputs below 16px");
    }
    count++;
  }
  const visit = async route => { await page.goto(base+"#"+route); await page.locator("main").waitFor(); };
  try {
    await page.goto(base);
    await page.getByText(/Demo mode.*Firebase keys/).waitFor();
    await screen("Sign in"); await btn("Create account").click(); await screen("Create account");
    await page.getByLabel("Full name").fill("QA owner");
    await page.getByLabel("Email address").fill("qa@example.invalid");
    await page.locator("#auth-password").fill("example-only-password");
    await page.evaluate(()=>localStorage.setItem("homemaker_demo_mode","true"));
    await btn("Create account").click(); await page.locator("main").waitFor(); await page.reload();
    for (const route of ["/","/staff","/staff/1","/tasks","/expenses","/inventory","/payroll","/insights","/alerts","/household","/settings"]) {
      await visit(route); await screen(route);
    }
    if (width < 768) {
      await visit("/tasks"); await visit("/settings");
      const panel = page.locator("#main-content");
      const {clientHeight, scrollHeight} = await panel.evaluate(el => ({clientHeight:el.clientHeight, scrollHeight:el.scrollHeight}));
      assert(scrollHeight > clientHeight, `Settings must scroll inside the phone viewport (content: ${scrollHeight}, panel: ${clientHeight})`);
      const cdp = await ctx.newCDPSession(page);
      try {
        async function swipe(start, end) {
          const send = (type, y) => cdp.send("Input.dispatchTouchEvent", {type, touchPoints:y == null ? [] : [{x:width/2,y}]});
          await send("touchStart",start);
          for (let i=1;i<=8;i++) { await send("touchMove",start+(end-start)*i/8); await page.waitForTimeout(20); }
          await send("touchEnd");
        }
        const start = Math.round(height * .72), end = Math.round(height * .3);
        await swipe(start,end);
        await page.waitForFunction(() => document.querySelector("#main-content").scrollTop > 50);
        for (let i=0;i<20 && !(await panel.evaluate(el=>el.scrollHeight-el.clientHeight-el.scrollTop<2));i++) await swipe(start,end);
        await page.waitForFunction(() => {const el=document.querySelector("#main-content"); return el.scrollHeight-el.clientHeight-el.scrollTop<2;});
        const bottom = await panel.evaluate(el=>el.scrollTop);
        await swipe(end,start);
        await page.waitForFunction(y=>document.querySelector("#main-content").scrollTop<y-50,bottom);
      } finally { await cdp.detach(); }
    }
    await btn("Open AI home assistant").click(); await page.getByRole("dialog").waitFor();
    await page.getByRole("dialog").locator("input").fill("QA draft"); await screen("Assistant");
    await page.keyboard.press("Escape");
    if (touch) {
      // Exercise expanded forms with the remaining height of a phone with its keyboard up.
      await page.setViewportSize({width,height:375});
      await visit("/staff"); await btn("Add staff member").click();
      await page.getByLabel("Full name (required)").fill("Scroll test");
      await reach(btn("Add staff member").last(),"Add staff form");
      await visit("/staff/1"); await btn("+ Add Deduction").click();
      await page.getByPlaceholder("Amount (₹)").focus(); await reach(btn("Apply Deduction"),"Deduction form");
      await visit("/household");
      for (const [section, action] of [["Residents","Add Homemate"],["Rooms & Zones","Add Room"]]) {
        const group = page.locator("section").filter({has:page.getByRole("heading",{name:section,exact:true})});
        await group.getByRole("button",{name:"Add",exact:true}).click();
        await group.locator("input").first().focus(); await reach(btn(action),section+" form");
      }
      await visit("/inventory"); await btn("Add Supply Item").click();
      await page.locator("main input").first().focus(); await reach(btn("Add Item"),"Inventory form");
      await page.setViewportSize({width,height});
    }
    await visit("/expenses"); await btn("Log an Expense").click(); await page.getByPlaceholder("Amount (₹)").fill("45");
    await btn("Groceries").click();
    await page.getByPlaceholder("Description",{exact:true}).fill("QA rice"); await reach(btn("Add Expense"),"Expense form"); await btn("Add Expense").click();
    await page.getByText("QA rice",{exact:true}).first().waitFor();
    await visit("/tasks"); await btn("Assign task").click();
    await page.locator("main select").first().selectOption({index:1}); await page.getByPlaceholder("Task description").fill("QA clean kitchen");
    await reach(btn("Create & Assign Task"),"Task form"); await btn("Create & Assign Task").click();
    await btn("Mark complete: QA clean kitchen").click(); await btn("Mark pending: QA clean kitchen").waitFor();
    await visit("/insights"); await btn("daily").click();
    const cell = page.getByRole("button",{name:/^Elena Moretti, \d{4}-\d{2}-\d{2}:/}).first();
    await cell.scrollIntoViewIfNeeded();
    const rect=await cell.boundingBox(), x=rect.x+rect.width/2, y=rect.y+rect.height/2;
    if (width < 768) {
      const cdp = await ctx.newCDPSession(page);
      await cdp.send("Input.dispatchTouchEvent",{type:"touchStart",touchPoints:[{x,y}]});
      await page.getByRole("dialog").waitFor({timeout:2500});
      await cdp.send("Input.dispatchTouchEvent",{type:"touchEnd",touchPoints:[]}); await cdp.detach();
    } else {
      await page.mouse.move(x,y); await page.mouse.down(); await page.getByRole("dialog").waitFor({timeout:2500}); await page.mouse.up();
    }
    await page.keyboard.press("Escape");
    await cell.focus(); await page.keyboard.press("Enter");
    await page.getByRole("radio",{name:/^late$/i}).check();
    if(width < 768) {
      await page.setViewportSize({width:844,height:390});
      const dialog = page.getByRole("dialog");
      await page.waitForFunction(() => {
        const rect = document.querySelector('[role="dialog"]').getBoundingClientRect();
        return rect.top >= -1 && rect.bottom <= innerHeight + 1;
      });
      await reach(dialog.getByRole("button",{name:"Save attendance"}),"Landscape attendance editor");
      await page.setViewportSize({width,height});
    }
    await reach(btn("Save attendance"),"Attendance editor"); await btn("Save attendance").click(); await page.getByRole("dialog").waitFor({state:"hidden"});
    await page.reload(); await btn("daily").click(); await page.getByRole("button",{name:/^Elena Moretti, .*: late$/}).waitFor();
    await page.evaluate(()=>{ localStorage.setItem("homemaker_app_role","staff"); localStorage.setItem("homemaker_active_staff_id","1"); });
    await page.reload();
    for(const route of ["/","/tasks","/payroll"]){await visit(route);await screen("Staff "+route);}
    await page.getByText("Pay statement",{exact:true}).waitFor();
    if (touch) {
      await visit("/"); await page.setViewportSize({width,height:375});
      for (const [opener, action] of [[/^Request Cash/i,"Send Request"],[/^Report Issue/i,"Send For Owner Review"]]) {
        await page.getByRole("button",{name:opener}).click();
        await reach(btn(action),action+" form");
      }
      await page.setViewportSize({width,height});
    }
    // Isolate the first-run gate in the demo fixture, retaining the actual six-step form and controls.
    await page.route("**/src/App.tsx*",async r=>{
      const original=await r.fetch();const body=await original.text();
      await r.fulfill({response:original,body:body.replace("if (!setupComplete)", "if (true)")});
    });
    await page.reload();
    for(const step of ["Household","Residents","Rooms","Staff","Inventory","Review"]){
      await btn(step).click();
      if (touch && ["Residents","Rooms","Staff","Inventory"].includes(step)) await btn("Add").click();
      await screen("Setup "+step);
    }
    assert.equal(count,23);assert.deepEqual(errors,[]);
    console.log(width+"px: 23 screen states, signup, expense, task, attendance hold/cancel/keyboard save/reload and staff pay passed.");
  }finally{await ctx.close();}
}
(async()=>{const browser=await chromium.launch();try{for(const width of [320,390,1280])await walk(browser,width);}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});
