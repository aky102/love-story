const { createClient } = supabase;


const db = createClient(
  window.SUPABASE_URL,
  window.SUPABASE_ANON_KEY
);


const id =
  location.pathname
    .split("/")
    .filter(Boolean)
    .pop()
  ||
  new URLSearchParams(location.search)
    .get("id");



/* ========================= */
/* BASIC FUNCTIONS */
/* ========================= */

function setText(
  elementId,
  value
) {

  const el =
    document.getElementById(
      elementId
    );

  if (el) {

    el.textContent =
      value ?? "";

  }

}



function showError(message) {

  document.getElementById("app").innerHTML = `

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
        class="primary"
        href="/"
      >
        Create a Love Story
      </a>

    </section>

  `;

}



/* ========================= */
/* MUSIC */
/* ========================= */

const music =
  document.getElementById(
    "bgMusic"
  );

const musicToggle =
  document.getElementById(
    "musicToggle"
  );

const musicHint =
  document.getElementById(
    "musicHint"
  );


let musicPlaying = false;



async function startMusic() {

  try {

    music.volume = 0.35;

    await music.play();

    musicPlaying = true;

    musicToggle
      .classList
      .add("playing");

    musicHint
      .classList
      .add("hide");

  }

  catch (error) {

    console.log(
      "Music waiting for user interaction."
    );

  }

}



function stopMusic() {

  music.pause();

  musicPlaying = false;

  musicToggle
    .classList
    .remove("playing");

}



musicToggle.onclick =
  async () => {

    if (musicPlaying) {

      stopMusic();

    }

    else {

      await startMusic();

    }

  };



/* ========================= */
/* LOAD STORY */
/* ========================= */

async function loadStory() {

  if (
    !id ||
    id === "story.html"
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
        .eq("id", id)
        .single();


    if (error)
      throw error;



    /* Names */

    setText(
      "yourName",
      story.your_name
    );


    setText(
      "loveName",
      story.love_name
    );



    /* Messages */

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



    /* Signature */

    setText(
      "signName",
      story.your_name
    );


    setText(
      "signLove",
      story.love_name
    );



    /* Date */

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



    /* Days counter */

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



    /* ========================= */
    /* PHOTOS */
    /* ========================= */

    const {
      data: photos,
      error: photoError
    } =
      await db
        .from("love_photos")
        .select(
          "storage_path,sort_order"
        )
        .eq(
          "story_id",
          id
        )
        .order(
          "sort_order"
        );


    if (photoError)
      throw photoError;



    const memoryBox =
      document.getElementById(
        "memories"
      );



    if (
      photos &&
      photos.length
    ) {

      photos.forEach(
        (photo) => {

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


          const img =
            document.createElement(
              "img"
            );


          img.src =
            data.publicUrl;


          img.alt =
            "Memory";


          memoryBox.appendChild(
            img
          );

        }
      );


    }

    else {

      memoryBox.innerHTML = `

        <div class="empty-memory">

          ♥
          <br>

          <span>
            No memories added yet.
          </span>

        </div>

      `;

    }



    /* Start interactions */

    initInteractions(
      story.love_name
    );


  }

  catch (error) {

    console.error(
      error
    );


    showError(
      "This story could not be loaded. Check the link or database settings."
    );

  }

}



/* ========================= */
/* INTERACTIONS */
/* ========================= */

function initInteractions(
  loveName
) {

  const scenes =
    [
      ...
      document.querySelectorAll(
        ".scene"
      )
    ];


  let currentScene = 0;



  function goNext() {

    if (
      currentScene <
      scenes.length - 1
    ) {

      scenes[
        currentScene
      ]
        .classList
        .remove("active");


      currentScene++;


      scenes[
        currentScene
      ]
        .classList
        .add("active");


      burst();

    }

  }



  /* Next buttons */

  document
    .querySelectorAll(
      ".next"
    )
    .forEach(
      button => {

        button.onclick =
          async () => {

            /*
             Start music when
             visitor begins story.
            */

            if (
              button.id ===
              "beginBtn"
            ) {

              await startMusic();

            }


            goNext();

          };

      }
    );



  /* Letter */

  document
    .getElementById(
      "openLetter"
    )
    .onclick =
      async () => {

        document
          .getElementById(
            "mainMessage"
          )
          .classList
          .remove(
            "hidden"
          );


        document
          .getElementById(
            "openLetter"
          )
          .classList
          .add(
            "hidden"
          );


        document
          .getElementById(
            "letterNext"
          )
          .classList
          .remove(
            "hidden"
          );


        if (
          !musicPlaying
        ) {

          await startMusic();

        }


        burst();

      };



  /* Hidden heart */

  document
    .querySelectorAll(
      ".flowers button"
    )
    .forEach(
      button => {

        button.onclick =
          () => {

            if (
              button
                .classList
                .contains(
                  "target"
                )
            {

              document
                .getElementById(
                  "gameResult"
                )
                .textContent =

                `♥ This heart belongs to ${loveName}. ${loveName}, you are loved.`;



              document
                .getElementById(
                  "gameNext"
                )
                .classList
                .remove(
                  "hidden"
                );


              burst();

            }

            else {

              document
                .getElementById(
                  "gameResult"
                )
                .textContent =
                "Not this one... try again 🌸";

            }

          };

      }
    );



  /* Rose */

  document
    .getElementById(
      "touchRose"
    )
    .onclick =
      () => {

        document
          .getElementById(
            "roseMessage"
          )
          .textContent =

          `${loveName}, you are very special. ❤️`;


        document
          .getElementById(
            "roseMessage"
          )
          .classList
          .remove(
            "hidden"
          );


        document
          .getElementById(
            "touchRose"
          )
          .classList
          .add(
            "hidden"
          );


        document
          .getElementById(
            "roseNext"
          )
          .classList
          .remove(
            "hidden"
          );


        burst();

      };



  /* ========================= */
  /* COLLAGE THEMES */
  /* ========================= */

  document
    .querySelectorAll(
      ".theme-btn"
    )
    .forEach(
      button => {

        button.onclick =
          () => {

            document
              .querySelectorAll(
                ".theme-btn"
              )
              .forEach(
                btn =>
                  btn
                    .classList
                    .remove(
                      "active"
                    )
              );


            button
              .classList
              .add(
                "active"
              );


            const collage =
              document.getElementById(
                "memories"
              );


            collage.className =
              "collage " +
              button.dataset.theme;

          };

      }
    );



  /* Replay */

  document
    .getElementById(
      "replayBtn"
    )
    .onclick =
      () => {

        stopMusic();

        location.reload();

      };



  /* Floating hearts */

  setInterval(
    burst,
    5000
  );

}



/* ========================= */
/* FLOATING HEARTS */
/* ========================= */

function burst() {

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
        "✨",
        "♡"
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


    document
      .getElementById(
        "hearts"
      )
      .appendChild(
        heart
      );


    setTimeout(
      () => heart.remove(),
      5000
    );

  }

}



loadStory();
