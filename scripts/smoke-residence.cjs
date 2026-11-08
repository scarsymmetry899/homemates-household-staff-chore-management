// Run against a loopback Vite development server with Firebase disabled.
const assert = require("node:assert/strict");
const { chromium } = require("playwright");
const base = "http://127.0.0.1:4186/";

async function walk(browser, width) {
  const ctx = await browser.newContext({ viewport: {width, height: 860}, hasTouch: width < 768, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", e => errors.push(e.message));
  let count = 0;
  const btn = name => page.getByRole("button", {name, exact:true});
  async function screen(name) {
    await page.getByRole("heading").first().waitFor();
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), name + " overflows");
    if(width < 768) {
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
        await swipe(620,260);
        await page.waitForFunction(() => document.querySelector("#main-content").scrollTop > 50);
        for (let i=0;i<20 && !(await panel.evaluate(el=>el.scrollHeight-el.clientHeight-el.scrollTop<2));i++) await swipe(620,260);
        await page.waitForFunction(() => {const el=document.querySelector("#main-content"); return el.scrollHeight-el.clientHeight-el.scrollTop<2;});
        const bottom = await panel.evaluate(el=>el.scrollTop);
        await swipe(260,620);
        await page.waitForFunction(y=>document.querySelector("#main-content").scrollTop<y-50,bottom);
      } finally { await cdp.detach(); }
    }
    await btn("Open AI home assistant").click(); await page.getByRole("dialog").waitFor(); await screen("Assistant");
    await page.keyboard.press("Escape");
    await visit("/expenses"); await btn("Log an Expense").click(); await page.getByPlaceholder("Amount (₹)").fill("45");
    await btn("Groceries").click();
    await page.getByPlaceholder("Description",{exact:true}).fill("QA rice"); await btn("Add Expense").click();
    await page.getByText("QA rice",{exact:true}).first().waitFor();
    await visit("/tasks"); await btn("Assign task").click();
    await page.locator("main select").first().selectOption({index:1}); await page.getByPlaceholder("Task description").fill("QA clean kitchen");
    await btn("Create & Assign Task").click();
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
      const box = await dialog.boundingBox();
      assert(box.y >= -1 && box.y+box.height <= 391,"Dialog must fit short landscape viewport");
      await page.setViewportSize({width,height:860});
    }
    await btn("Save attendance").click(); await page.getByRole("dialog").waitFor({state:"hidden"});
    await page.reload(); await btn("daily").click(); await page.getByRole("button",{name:/^Elena Moretti, .*: late$/}).waitFor();
    await page.evaluate(()=>{ localStorage.setItem("homemaker_app_role","staff"); localStorage.setItem("homemaker_active_staff_id","1"); });
    await page.reload();
    for(const route of ["/","/tasks","/payroll"]){await visit(route);await screen("Staff "+route);}
    await page.getByText("Pay statement",{exact:true}).waitFor();
    // Isolate the first-run gate in the demo fixture, retaining the actual six-step form and controls.
    await page.route("**/src/App.tsx*",async r=>{
      const original=await r.fetch();const body=await original.text();
      await r.fulfill({response:original,body:body.replace("if (!setupComplete)", "if (true)")});
    });
    await page.reload();
    for(const step of ["Household","Residents","Rooms","Staff","Inventory","Review"]){
      await btn(step).click();await screen("Setup "+step);
    }
    assert.equal(count,23);assert.deepEqual(errors,[]);
    console.log(width+"px: 23 screen states, signup, expense, task, attendance hold/cancel/keyboard save/reload and staff pay passed.");
  }finally{await ctx.close();}
}
(async()=>{const browser=await chromium.launch();try{for(const width of [390,1280])await walk(browser,width);}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});
