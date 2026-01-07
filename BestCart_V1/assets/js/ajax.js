async function readJsonSafe(res) {
  const text = await res.text();
  const info = `HTTP ${res.status} ${res.statusText}${res.redirected ? " (redirected)" : ""}`;

  if (!text || !text.trim()) {
    throw new Error(
      "Server returned empty response. " + info + ". Check controller path and PHP error log."
    );
  }

  try {
    return JSON.parse(text);
  } catch (e) {
    const preview = text.trim().slice(0, 300);
    throw new Error(
      "Server did not return JSON. " + info + ". Response starts with: " + preview
    );
  }
}

async function ajaxPostForm(form, submitter) {
  const fd = new FormData(form);
  if (submitter && submitter.name) {
    fd.append(submitter.name, submitter.value || "1");
  }

  const res = await fetch(form.action, {
    method: "POST",
    body: fd,
    headers: { "X-Requested-With": "XMLHttpRequest" }
  });

  if (!res.ok) {
    const text = await res.text();
    const preview = (text || "").trim().slice(0, 300);
    throw new Error(`Request failed. HTTP ${res.status}. ${preview}`);
  }

  const json = await readJsonSafe(res);
  if (!json.status) throw new Error(json.message || "Failed");

  if (json.data && json.data.redirect) {
    window.location.href = json.data.redirect;
    return json;
  }

  return json;
}

async function ajaxGetLink(a) {
  const res = await fetch(a.href, {
    method: "GET",
    headers: { "X-Requested-With": "XMLHttpRequest" }
  });

  const json = await readJsonSafe(res);
  if (!json.status) throw new Error(json.message || "Failed");
  return json;
}

document.addEventListener("submit", async (e) => {
  const form = e.target;
  if (!form.matches("form[data-ajax='true']")) return;

  e.preventDefault();

  try {
    const json = await ajaxPostForm(form, e.submitter);

    if (form.dataset.reset === "true") form.reset();

    if (!(json && json.data && json.data.redirect)) {
      alert((json && json.message) || "Success ✅");
    }

    if (form.dataset.remove) {
      const el = document.querySelector(form.dataset.remove);
      if (el) el.remove();
    }
  } catch (err) {
    alert(err.message || "Request failed");
  }
});

document.addEventListener("click", async (e) => {
  const a = e.target.closest("a[data-ajax-link='true']");
  if (!a) return;

  e.preventDefault();

  if (a.dataset.confirm === "true") {
    const ok = confirm("Are you sure?");
    if (!ok) return;
  }

  try {
    const json = await ajaxGetLink(a);

    if (a.dataset.remove) {
      const el = document.querySelector(a.dataset.remove);
      if (el) el.remove();
    }

    alert(json.message || "Done ✅");
  } catch (err) {
    alert(err.message || "Request failed");
  }
});
