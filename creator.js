const { createClient } = supabase;
const db = createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);

const form = document.getElementById("loveForm");
const statusEl = document.getElementById("status");
const result = document.getElementById("result");
const createBtn = document.getElementById("createBtn");

function validConfig() {
  return !window.SUPABASE_URL.includes("PASTE_") &&
         !window.SUPABASE_ANON_KEY.includes("PASTE_");
}
function safeName(s) {
  return s.toLowerCase().replace(/[^a-z0-9_-]/g,"-").slice(0,40);
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  statusEl.textContent = "";
  if (!validConfig()) {
    statusEl.textContent = "First add your Supabase URL and publishable/anon key in config.js.";
    return;
  }

  createBtn.disabled = true;
  createBtn.textContent = "Creating... ❤️";

  try {
    const storyId = crypto.randomUUID().replaceAll("-","").slice(0,12);
    const story = {
      id: storyId,
      your_name: document.getElementById("yourName").value.trim(),
      love_name: document.getElementById("loveName").value.trim(),
      start_date: document.getElementById("startDate").value,
      main_message: document.getElementById("mainMessage").value.trim(),
      reason1: document.getElementById("reason1").value.trim(),
      reason2: document.getElementById("reason2").value.trim() || "The little things you do make me smile.",
      reason3: document.getElementById("reason3").value.trim() || "Because you are simply you. ❤️",
      final_message: document.getElementById("finalMessage").value.trim()
    };

    const { error: insertError } = await db.from("love_stories").insert(story);
    if (insertError) throw insertError;

    const files = [...document.getElementById("photos").files];
    for (let i=0; i<files.length; i++) {
      const file = files[i];
      if (file.size > 5 * 1024 * 1024) throw new Error(`${file.name} is larger than 5 MB.`);
      const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
      const path = `${storyId}/${String(i).padStart(2,"0")}-${Date.now()}.${ext}`;
      const { error: uploadError } = await db.storage.from(window.SUPABASE_BUCKET)
        .upload(path, file, { contentType: file.type, upsert: false });
      if (uploadError) throw uploadError;

      const { error: photoError } = await db.from("love_photos").insert({
        story_id: storyId,
        storage_path: path,
        sort_order: i
      });
      if (photoError) throw photoError;
    }

    const link = `${location.origin}/love/${storyId}`;
    document.getElementById("shareLink").value = link;
    document.getElementById("openLink").href = link;
    result.classList.remove("hidden");
    statusEl.textContent = "Created successfully ❤️";
    createBtn.textContent = "Create Another Story";
    createBtn.disabled = false;
  } catch (err) {
    console.error(err);
    statusEl.textContent = "Could not create the story: " + (err.message || err);
    createBtn.disabled = false;
    createBtn.textContent = "Create My Love Link ❤️";
  }
});

document.getElementById("copyBtn").onclick = async () => {
  const input = document.getElementById("shareLink");
  await navigator.clipboard.writeText(input.value);
  document.getElementById("copyBtn").textContent = "Copied ❤️";
  setTimeout(()=>document.getElementById("copyBtn").textContent="Copy Link 🔗",1600);
};
