const { createClient } = supabase;

const db = createClient(
  window.SUPABASE_URL,
  window.SUPABASE_ANON_KEY
);


// ===============================
// STORY ID
// ===============================

const pathParts =
  location.pathname
    .split("/")
    .filter(Boolean);

const storyId =
  pathParts[pathParts.length - 1] ||
  new URLSearchParams(location.search).get("id");


// ===============================
// HELPERS
// ===============================

function setText(id, value) {

  const element =
    document.getElementById(id);

  if (element) {
    element.textContent =
      value ?? "";
  }

}


function showError(message) {

  const app =
    document.getElementById("app");

  if (!app) return;

  app.innerHTML = `
    <section class="scene active">

      <div class="big">
        💔
      </div>

      <h2>
        Oops...
      </h2>

      <p>
        ${message}
      </p>

      <a
        href="/"
        class="primary"
      >
        Create a Love Story
      </a>

    </section>
  `;

}


// ===============================
// MUSIC
// ===============================

const music =
  document.getElementById("bgMusic");

const musicButton =
  document.getElementById("musicToggle");

const musicHint =
  document.getElementById("musicHint");

let musicPlaying = false;


async function startMusic() {

  if (!music) return;

  try {

    music.volume = 0.35;

    await music.play();

    musicPlaying = true;

    if (musicButton) {
      musicButton.classList.add("playing");
    }

    if (musicHint) {
      musicHint.classList.add("hide");
    }

  } catch (error) {

    console.log(
      "Browser blocked automatic music."
    );

  }

}


function stopMusic() {

  if (!music) return;

  music.pause();

  music.currentTime = 0;

  musicPlaying = false;

  if (musicButton) {
    musicButton.classList.remove("playing");
  }

}


if (musicButton) {

  musicButton.onclick =
    async function () {

      if (musicPlaying) {

        stopMusic();

      } else {

        await startMusic();

      }

    };

}



// ===============================
// SCENE NAVIGATION
// ===============================

const scenes =
  Array.from(
    document.querySelectorAll(".scene")
  );

let currentScene = 0;


function showScene(number) {

  if (
    number < 0 ||
    number >= scenes.length
  ) {
    return;
  }


  scenes.forEach(
    scene => {
      scene.classList.remove("active");
    }
  );


  currentScene = number;


  scenes[currentScene]
    .classList
    .add("active");


  burst();

}


function nextScene() {

  if (
    currentScene <
    scenes.length - 1
  ) {

    showScene(
      currentScene + 1
    );

  }

}



// ===============================
// NEXT BUTTONS
// ===============================

document
  .querySelectorAll(".next")
  .forEach(
    button => {

      button.addEventListener(
        "click",
        async function () {

          if (
            this.id === "beginBtn"
          ) {

            await startMusic();

          }

          nextScene();

        }
      );

    }
  );



// ===============================
// LETTER
// ===============================

const openLetter =
  document.getElementById(
    "openLetter"
  );


if (openLetter) {

  openLetter.onclick =
    async function () {

      const message =
        document.getElementById(
          "mainMessage"
        );

      const next =
        document.getElementById(
          "letterNext"
        );


      if (message) {

        message.classList.remove(
          "hidden"
        );

      }


      this.classList.add(
        "hidden"
      );


      if (next) {

        next.classList.remove(
          "hidden"
        );

      }


      await startMusic();

      burst();

    };

}



// ===============================
// HIDDEN HEART GAME
// ===============================

const flowerButtons =
  document.querySelectorAll(
    ".flowers button"
  );


flowerButtons.forEach(
  button => {

    button.addEventListener(
      "click",
      function () {

        const result =
          document.getElementById(
            "gameResult"
          );

        const next =
          document.getElementById(
            "gameNext"
          );


        if (
          this.classList.contains(
            "target"
          )
        ) {

          const loveName =
            document.getElementById(
              "loveName"
            )?.textContent ||
            "you";


          if (result) {

            result.textContent =
              `♥ This heart belongs to ${loveName}. ${loveName}, you are loved.`;

          }


          if (next) {

            next.classList.remove(
              "hidden"
            );

          }


          burst();

        } else {

          if (result) {

            result.textContent =
              "Not this one... try again 🌸";

          }

        }

      }
    );

  }
);



// ===============================
// ROSE
// ===============================

const touchRose =
  document.getElementById(
    "touchRose"
  );


if (touchRose) {

  touchRose.onclick =
    function () {

      const loveName =
        document.getElementById(
          "loveName"
        )?.textContent ||
        "you";


      const message =
        document.getElementById(
          "roseMessage"
        );


      const next =
        document.getElementById(
          "roseNext"
        );


      if (message) {

        message.textContent =
          `${loveName}, you are very special. ❤️`;

        message.classList.remove(
          "hidden"
        );

      }


      this.classList.add(
        "hidden"
      );


      if (next) {

        next.classList.remove(
          "hidden"
        );

      }


      burst();

    };

}



// ===============================
// REPLAY
// ===============================

const replayButton =
  document.getElementById(
    "replayBtn"
  );


if (replayButton) {

  replayButton.onclick =
    function () {

      stopMusic();

      location.reload();

    };

}



// ===============================
// MEMORY THEMES
// ===============================

const themeButtons =
  document.querySelectorAll(
    ".theme-btn"
  );


themeButtons.forEach(
  button => {

    button.addEventListener(
      "click",
      function () {

        themeButtons.forEach(
          b => {
            b.classList.remove(
              "active"
            );
          }
        );


        this.classList.add(
          "active"
        );


        const collage =
          document.getElementById(
            "memories"
          );


        if (collage) {

          collage.className =
            "collage " +
            this.dataset.theme;

        }

      }
    );

  }
);



// ===============================
// FLOATING HEARTS
// ===============================

function burst() {

  const container =
    document.getElementById(
      "hearts"
    );


  if (!container) return;


  for (
    let i = 0;
    i < 7;
    i++
  ) {

    const heart =
      document.createElement(
        "span"
      );


    heart.className =
      "heart";


    heart.textContent =
      [
        "♥",
        "💕",
        "♡",
        "✨"
      ][
        Math.floor(
          Math.random() * 4
        )
      ];


    heart.style.left =
      Math.random() * 100 +
      "%";


    heart.style.fontSize =
      (
        14 +
        Math.random() * 18
      ) +
      "px";


    container.appendChild(
      heart
    );


    setTimeout(
      () => {
        heart.remove();
      },
      5000
    );

  }

}



// ===============================
// LOAD STORY FROM SUPABASE
// ===============================

async function loadStory() {

  if (
    !storyId ||
    storyId === "story.html"
  ) {

    showError(
      "This love story link is incomplete."
    );

    return;

  }


  try {

    const {
      data: story,
      error
    } =
      await db
        .from("love_stories")
        .select("*")
        .eq(
          "id",
          storyId
        )
        .single();


    if (error) {

      throw error;

    }


    // Names

    setText(
      "yourName",
      story.your_name
    );


    setText(
      "loveName",
      story.love_name
    );


    // Messages

    setText(
      "mainMessage",
      story.main_message
    );


    setText(
      "r1",
      story.reason1
    );


    setText(
      "r2",
      story.reason2
    );


    setText(
      "r3",
      story.reason3
    );


    setText(
      "finalMessage",
      story.final_message
    );


    // Signature

    setText(
      "signName",
      story.your_name
    );


    setText(
      "signLove",
      story.love_name
    );



    // ===============================
    // DATE
    // ===============================

    const start =
      new Date(
        story.start_date +
        "T00:00:00"
      );


    setText(
      "dateText",

      start.toLocaleDateString(
        undefined,
        {
          day: "numeric",
          month: "long",
          year: "numeric"
        }
      )

    );



    // ===============================
    // DAY COUNTER
    // ===============================

    function updateCounter() {

      const days =
        Math.max(
          0,

          Math.floor(

            (
              Date.now() -
              start.getTime()
            )
            /
            86400000

          )

        );


      setText(
        "counter",

        `${days.toLocaleString()} Days Together ♥`

      );

    }


    updateCounter();


    setInterval(
      updateCounter,
      60000
    );



    // ===============================
    // PHOTOS
    // ===============================

    await loadPhotos();


  }

  catch (error) {

    console.error(
      "Story loading error:",
      error
    );


    /*
      Do NOT stop the buttons
      if only the photos fail.
    */

    console.log(
      "Story data loaded, but another part failed."
    );

  }

}



// ===============================
// LOAD PHOTOS
// ===============================

async function loadPhotos() {

  const memoryBox =
    document.getElementById(
      "memories"
    );


  if (!memoryBox) return;


  try {

    const {
      data: photos,
      error
    } =
      await db
        .from("love_photos")
        .select(
          "storage_path,sort_order"
        )
        .eq(
          "story_id",
          storyId
        )
        .order(
          "sort_order"
        );


    if (error) {

      console.error(
        "Photo error:",
        error
      );

      return;

    }


    if (
      photos &&
      photos.length > 0
    ) {

      photos.forEach(
        photo => {

          const {
            data
          } =
            db
              .storage
              .from(
                window.SUPABASE_BUCKET
              )
              .getPublicUrl(
                photo.storage_path
              );


          const image =
            document.createElement(
              "img"
            );


          image.src =
            data.publicUrl;


          image.alt =
            "Memory";


          memoryBox.appendChild(
            image
          );

        }
      );


    } else {

      memoryBox.innerHTML = `
        <div class="big">
          ♥
        </div>
      `;

    }

  }

  catch (error) {

    console.error(
      "Photo loading failed:",
      error
    );

  }

}



// ===============================
// START
// ===============================

loadStory();


// Initial heart animation

setTimeout(
  burst,
  1000
);


// More hearts

setInterval(
  burst,
  5000
);
