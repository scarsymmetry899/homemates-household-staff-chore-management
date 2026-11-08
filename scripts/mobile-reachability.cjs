// Send browser touch gestures. Locator.click()/scrollIntoView() can silently
// reveal clipped elements and would hide the exact regression this checks.
async function reachByTouch(page, session, target, name) {
  await target.waitFor({ state: "visible" });
  let lastPosition;
  for (let attempt = 0; attempt < 36; attempt++) {
    const state = await target.evaluate(el => {
      const r = el.getBoundingClientRect();
      const x = r.left + r.width / 2;
      const y = r.top + r.height / 2;
      const visible = r.top >= 0 && r.bottom <= innerHeight && r.left >= 0 && r.right <= innerWidth &&
        [r.top + 2, y, r.bottom - 2].every(probe => el.contains(document.elementFromPoint(x, probe)));
      const sheet = el.closest('[role="dialog"],.native-sheet');
      const bounds = sheet?.getBoundingClientRect();
      return { visible, y, x: innerWidth / 2, height: innerHeight,
        top: Math.max(75, bounds?.top ?? 0), bottom: Math.min(innerHeight - (sheet ? 8 : 95), bounds?.bottom ?? innerHeight),
        label: el.getAttribute("aria-label") || el.innerText || el.title || el.tagName };
    });
    if (state.visible) {
      console.log("Reachable:", name, "—", state.label.trim().slice(0, 60));
      return;
    }
    if (attempt > 1 && Math.abs(state.y - lastPosition) < 1) {
      const obstruction = await page.evaluate(({x,bottom}) => document.elementFromPoint(x,bottom-40)?.outerHTML.slice(0,240),state);
      throw Error(name + ": touch scrolling stopped before reaching " + JSON.stringify({...state,obstruction}));
    }
    lastPosition = state.y;
    const middle = (state.top + state.bottom) / 2;
    const distance = Math.sign(state.y - middle) * Math.min((state.bottom - state.top) * .75, Math.abs(state.y - middle));
    const start = middle + distance / 2;
    const send = (type, y) => session.send("Input.dispatchTouchEvent", {
      type, touchPoints: y === undefined ? [] : [{x:state.x, y}]
    });
    await send("touchStart", start);
    for (let n = 1; n <= 8; n++) await send("touchMove", start - distance * n / 8);
    await page.waitForTimeout(100); // release without flinging past the target
    await send("touchEnd");
    await page.waitForTimeout(100);
  }
  throw Error(name + ": swipe limit exceeded");
}
module.exports = { reachByTouch };
