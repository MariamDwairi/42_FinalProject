const PRICE = 1000;
let wallet = 5000;
const fmt = n => "$" + n.toLocaleString("en-US");
const num = n => n.toLocaleString("en-US");

function buy(qty) {
  const realTotal = PRICE * qty;      // what it should cost
  const total = (PRICE * qty) | 0;    // VULNERABLE: wraps to signed 32-bit
  let status;
  if (total <= wallet) {
    wallet -= total;
    status = "Purchased";
  } else {
    status = "Not enough funds";
  }
  return { realTotal, total, status };
}

function buySafe(qty) {
  const realTotal = PRICE * qty;      // what it should cost
  if (!Number.isSafeInteger(qty) || qty < 1 || qty > 100) {   // FIX: reject unreasonable quantities
    return { realTotal, total: realTotal, status: "Order rejected: quantity exceeds the maximum allowed per customer (100)." };
  }
  const total = PRICE * qty;          // no truncation
  let status;
  if (total <= wallet) {
    wallet -= total;
    status = "Purchased";
  } else {
    status = "Not enough funds";
  }
  return { realTotal, total, status };
}

// Builds the explanation text from the real numbers
function explanationLines(qty, r) {
  const WRAP = 4294967296;            // 2^32
  const SIGNED_MAX = 2147483647;      // 2^31 - 1
  const kind = r.total < 0 ? "negative" : "small positive";

  const lines = [
    ["What this payload is",
      "It sends a huge quantity so the total wraps around to a " + kind + " number."],
    ["Number entered",
      num(qty) + " (the quantity)."],
    ["Real total",
      num(PRICE) + " × " + num(qty) + " = " + num(r.realTotal) + "."],
    ["Why it breaks",
      "A signed 32-bit integer holds at most " + num(SIGNED_MAX) +
      ". The real total is bigger, so it wraps: " +
      num(r.realTotal) + " − " + num(WRAP) + " = " + num(r.total) + "."]
  ];

  if (r.status === "Purchased") {
    if (r.total < 0) {
      lines.push(["Result",
        "The check " + num(r.total) + " <= wallet passes, and wallet -= " + num(r.total) +
        " adds money, so the wallet goes UP."]);
    } else {
      lines.push(["Result",
        "The check " + num(r.total) + " <= wallet passes, so you pay only " + fmt(r.total) +
        " for something that should cost " + fmt(r.realTotal) + "."]);
    }
  } else {
    lines.push(["Result",
      "The wrapped total (" + fmt(r.total) + ") was still higher than your wallet, " +
      "so the purchase was refused. Reload the page to reset the wallet."]);
  }
  return lines;
}

const toggle = document.getElementById("vulnToggle");
const stateLabel = document.getElementById("vulnState");
const explainBox = document.getElementById("explain");

toggle.addEventListener("change", () => {
  stateLabel.textContent = toggle.checked ? "ON" : "OFF";
});

document.querySelectorAll(".payload").forEach(btn => {
  btn.addEventListener("click", () => {
    const qty = Number(btn.dataset.qty);   // quantity comes from the button
    const box = document.getElementById("result");
    if (!Number.isFinite(qty)) { box.textContent = "Invalid payload."; return; }

    box.innerHTML = "";
    explainBox.innerHTML = "";
    explainBox.style.display = "none";     // hidden unless the switch is ON

    // Switch OFF: run the fixed code, the purchase does not go through
    if (!toggle.checked) {
      const r = buySafe(qty);
      const msg = document.createElement("div");
      msg.className = "bad";
      msg.textContent = r.status;
      box.append(msg);
      return;
    }

    // Switch ON: run the vulnerable purchase
    const r = buy(qty);
    const wrapped = r.total !== r.realTotal;

    const lines = [
      ["Quantity", String(qty)],
      ["Real total", fmt(r.realTotal)],
      ["Stored total (int32)", fmt(r.total)],
      ["Status", r.status],
      ["Wallet now", fmt(wallet)]
    ];
    for (const [k, v] of lines) {
      const d = document.createElement("div");
      d.className = "row out";
      const a = document.createElement("span"); a.textContent = k;
      const b = document.createElement("span"); b.textContent = v;
      d.append(a, b);
      box.append(d);
    }
    if (wrapped) {
      const w = document.createElement("div");
      w.className = "bad";
      w.textContent = "Overflow: the stored total does not match the real total.";
      box.append(w);
    }
    document.getElementById("wallet").textContent = fmt(wallet);

    // Fill and show the explanation box under the result box
    const title = document.createElement("strong");
    title.textContent = "Explanation";
    explainBox.append(title);
    for (const [k, v] of explanationLines(qty, r)) {
      const p = document.createElement("p");
      p.className = "hint";
      const label = document.createElement("strong");
      label.textContent = k + ": ";
      p.append(label, document.createTextNode(v));
      explainBox.append(p);
    }
    explainBox.style.display = "block";
  });
});