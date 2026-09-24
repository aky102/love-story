const { createClient } = supabase;
const db = createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);

const id = location.pathname.split("/").filter(Boolean).pop() || new URLSearchParams(location.search).get("id");

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value ?? "";
}
function showError(message) {
  document.getElementById("app").innerHTML =
    `<section class="scene active"><h2>❤️</h2><p>${message}</p></section>`;
}

async function loadStory() {
  if (!id || id === "story.html") return showError("This love story link is incomplete.");
  try {
    const { data: story, error } = await db.from("love_stories")
      .select("*").eq("id", id).single();
    if (error) throw error;

    setText("yourName", story.your_name);
    setText("loveName", story.love_name);
    setText("mainMessage", story.main_message);
    setText("r1", story.reason1);
    setText("r2", story.reason2);
    setText("r3", story.reason3);
    setText("finalMessage", story.final_message);
    setText("signName", story.your_name);
    setText("signLove", story.love_name);

    const start = new Date(story.start_date + "T00:00:00");
    setText("dateText", start.toLocaleDateString(undefined,{day:"numeric",month:"long",year:"numeric"}));
    const updateCounter = () => {
      const days = Math.max(0, Math.floor((Date.now() - start.getTime()) / 86400000));
      setText("counter", `${days.toLocaleString()} Days Together ❤️`);
    };
    updateCounter(); setInterval(updateCounter,60000);

    const { data: photos, error: photoError } = await db.from("love_photos")
      .select("storage_path,sort_order").eq("story_id",id).order("sort_order");
    if (photoError) throw photoError;

    const memoryBox = document.getElementById("memories");
    if (photos?.length) {
      for (const p of photos) {
        const { data } = db.storage.from(window.SUPABASE_BUCKET).getPublicUrl(p.storage_path);
        const img = document.createElement("img");
        img.src = data.publicUrl;
        img.alt = "";
        memoryBox.appendChild(img);
      }
      let n=0;
      const imgs=[...memoryBox.querySelectorAll("img")];
      imgs[0].classList.add("shown");
      if (imgs.length>1) setInterval(()=>{
        imgs[n].classList.remove("shown");
        n=(n+1)%imgs.length;
        imgs[n].classList.add("shown");
      },3000);
    } else {
      memoryBox.innerHTML = '<div class="big">❤️</div>';
    }

    initInteractions(story.love_name);
  } catch (e) {
    console.error(e);
    showError("This story could not be loaded. Check the link or database settings.");
  }
}

function initInteractions(loveName) {
  const scenes=[...document.querySelectorAll(".scene")];
  let i=0;
  document.querySelectorAll(".next").forEach(b=>b.onclick=()=>{
    if(i<scenes.length-1){scenes[i].classList.remove("active");i++;scenes[i].classList.add("active");}
  });

  document.getElementById("openLetter").onclick=()=>{
    document.getElementById("mainMessage").classList.remove("hidden");
    document.getElementById("openLetter").classList.add("hidden");
    document.getElementById("letterNext").classList.remove("hidden");
  };

  document.querySelectorAll(".flowers button").forEach(b=>b.onclick=()=>{
    if(b.classList.contains("target")){
      document.getElementById("gameResult").textContent=`❤️ You found it! This heart belongs to ${loveName}.`;
      document.getElementById("gameNext").classList.remove("hidden");
      burst();
    } else document.getElementById("gameResult").textContent="Not this one... try again 🌸";
  });

  document.getElementById("touchRose").onclick=()=>{
    document.getElementById("roseMessage").textContent=`${loveName}, you are very special. ❤️`;
    document.getElementById("roseMessage").classList.remove("hidden");
    document.getElementById("touchRose").classList.add("hidden");
    document.getElementById("roseNext").classList.remove("hidden");
    burst();
  };
  setInterval(burst,4500);
}
function burst(){
  for(let i=0;i<8;i++){
    const h=document.createElement("span");
    h.className="heart";h.textContent=["❤️","💕","✨"][Math.floor(Math.random()*3)];
    h.style.left=Math.random()*100+"%";
    h.style.fontSize=(14+Math.random()*18)+"px";
    document.getElementById("hearts").appendChild(h);
    setTimeout(()=>h.remove(),5000);
  }
}
loadStory();
