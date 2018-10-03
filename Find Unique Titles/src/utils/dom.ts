export const createTrackersSelect = (trackers: Array<string>) => {
  let select_dom = document.createElement("select");
  select_dom.style.margin = "0 5px";
  const opt = document.createElement("option");
  opt.disabled = true;
  opt.selected = true;
  opt.innerHTML = "Select target tracker";
  select_dom.appendChild(opt);
  for (let i = 0; i < trackers.length; i++) {
    const opt = document.createElement("option");
    opt.value = trackers[i];
    opt.innerHTML = trackers[i];
    select_dom.appendChild(opt);
  }
  return select_dom;
};

export const addCounter = () => {
  let div = document.createElement("div");
  div.className = "counter_div";
  div.innerHTML =
    'Checked: <span class="checked_count">0</span>/<span class="total_torrents_count">0</span> | New content: <span class="new_content_count">0</span>';
  div.style.padding = "9px 26px";
  div.style.position = "fixed";
  div.style.top = "50px";
  div.style.right = "50px";
  div.style.background = "#eaeaea";
  div.style.borderRadius = "9px";
  div.style.fontSize = "17px";
  div.style.color = "#111";
  div.style.cursor = "pointer";
  div.style.border = "2px solid #111";
  div.style.display = "none";
  div.style.zIndex = "4591363";

  div.addEventListener("click", () => (div.style.display = "none"));
  document.body.appendChild(div);
};

export const updateCount = (count: number) => {
  document.querySelector(".checked_count")!!.textContent = String(count);
};
export const updateTotalCount = (count: number) => {
  document.querySelector(".total_torrents_count")!!.textContent = String(count);
};

export const updateNewContent = (count: number) => {
  document.querySelector(".new_content_count")!!.textContent = String(count);
};
