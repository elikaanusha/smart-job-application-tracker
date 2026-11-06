const API = "/api/jobs";
const $ = (id) => document.getElementById(id);
let jobs = [];

async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Request failed");
  return data;
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
}
function showToast(message) {
  $("toast").textContent = message;
  $("toast").classList.add("show");
  setTimeout(() => $("toast").classList.remove("show"), 2400);
}
function render() {
  $("totalCount").textContent = jobs.length;
  $("interviewCount").textContent = jobs.filter(j => j.status === "Interview").length;
  $("selectedCount").textContent = jobs.filter(j => j.status === "Selected").length;
  $("pendingCount").textContent = jobs.filter(j => ["Applied", "Interview"].includes(j.status)).length;
  const term = $("searchInput").value.toLowerCase();
  const status = $("statusFilter").value;
  const filtered = jobs.filter(j =>
    (!status || j.status === status) &&
    (`${j.company} ${j.role} ${j.location || ""}`.toLowerCase().includes(term))
  );
  $("recordCount").textContent = `${filtered.length} records`;
  $("jobsTable").innerHTML = filtered.length ? filtered.map(j => `
    <tr>
      <td><strong>${escapeHtml(j.company)}</strong><small>${escapeHtml(j.role)}</small></td>
      <td>${escapeHtml(j.location || "—")}</td>
      <td>${j.appliedDate ? new Date(j.appliedDate).toLocaleDateString() : "—"}</td>
      <td><span class="status-pill status-${escapeHtml(j.status)}">${escapeHtml(j.status)}</span></td>
      <td><button class="action-btn" data-edit="${j._id}">Edit</button><button class="action-btn delete-btn" data-delete="${j._id}">Delete</button></td>
    </tr>`).join("") : `<tr><td colspan="5" class="empty">No applications found. Add your first opportunity.</td></tr>`;
}
async function loadJobs() {
  try { jobs = await request(API); render(); }
  catch (error) {
    $("jobsTable").innerHTML = `<tr><td colspan="5" class="empty">${escapeHtml(error.message)}. Check your server and database connection.</td></tr>`;
    showToast("Could not load applications");
  }
}
function openModal(job) {
  $("jobForm").reset();
  $("jobId").value = job?._id || "";
  $("modalTitle").textContent = job ? "Edit application" : "Add application";
  $("company").value = job?.company || "";
  $("role").value = job?.role || "";
  $("location").value = job?.location || "";
  $("jobType").value = job?.jobType || "Full-time";
  $("appliedDate").value = job?.appliedDate ? new Date(job.appliedDate).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
  $("status").value = job?.status || "Applied";
  $("notes").value = job?.notes || "";
  $("formError").textContent = "";
  $("modalBackdrop").classList.remove("hidden");
}
function closeModal() { $("modalBackdrop").classList.add("hidden"); }

$("openModalBtn").addEventListener("click", () => openModal());
$("closeModalBtn").addEventListener("click", closeModal);
$("cancelBtn").addEventListener("click", closeModal);
$("modalBackdrop").addEventListener("click", e => { if (e.target === $("modalBackdrop")) closeModal(); });
$("searchInput").addEventListener("input", render);
$("statusFilter").addEventListener("change", render);

$("jobForm").addEventListener("submit", async e => {
  e.preventDefault();
  const id = $("jobId").value;
  const payload = {
    company: $("company").value.trim(),
    role: $("role").value.trim(),
    location: $("location").value.trim(),
    jobType: $("jobType").value,
    appliedDate: $("appliedDate").value,
    status: $("status").value,
    notes: $("notes").value.trim()
  };
  try {
    await request(id ? `${API}/${id}` : API, {
      method: id ? "PATCH" : "POST",
      body: JSON.stringify(payload)
    });
    closeModal();
    await loadJobs();
    showToast(id ? "Application updated" : "Application added");
  } catch (error) { $("formError").textContent = error.message; }
});

$("jobsTable").addEventListener("click", async e => {
  const editId = e.target.dataset.edit;
  const deleteId = e.target.dataset.delete;
  if (editId) {
    const job = jobs.find(item => item._id === editId);
    if (job) openModal(job);
  }
  if (deleteId && confirm("Delete this application?")) {
    try {
      await request(`${API}/${deleteId}`, { method: "DELETE" });
      await loadJobs();
      showToast("Application deleted");
    } catch (error) { showToast(error.message); }
  }
});

loadJobs();