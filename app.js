const cardContainer = document.getElementById("card-container");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const messageDisplay = document.getElementById("messageDisplay");

let allVideos = [];

getData();

// getData  from api and saving to allvideo array
async function getData() {
  messageDisplay.textContent = "Please Wait...";

  const response = await fetch(
    "https://api.freeapi.app/api/v1/public/youtube/videos"
  );
  const data = await response.json();
  const videoData = data.data.data;

  //adding data to allvideo array
  videoData.map((data) => {
    let title = data.items.snippet.title;
    if (title.length >= 20) title = `${title.substring(0, 30)}...`;
    const image = data.items.snippet.thumbnails.high.url;
    const channelTitle = data.items.snippet.channelTitle;
    const link = `https://www.youtube.com/watch?v=${data.items.id}`;
    allVideos = [...allVideos, { title, image, channelTitle, link }];
  });

  // display all cards
  showCards(allVideos);
}

// displaying all cards
function showCards(arr) {
  cardContainer.innerHTML = "";

  if (arr.length > 0) messageDisplay.classList.add("hidden");

  arr.map((video) => {
    const card = showACard({
      title: video.title,
      image: video.image,
      channelTitle: video.channelTitle,
      link: video.link,
    });

    // adding Single card to main div to dispaly
    cardContainer.appendChild(card);
  });
}

// Creating a card
function showACard({ title, image, channelTitle, link }) {
  //main card container
  const card = document.createElement("div");
  card.className =
    "rounded-xl bg-zinc-700  shadow-xl border-1 border-zinc-600 w-fit";

  //image element
  const img = document.createElement("img");
  img.className = "rounded-tr-xl rounded-tl-xl h-52 w-72";
  img.src = image;
  img.alt = "Youtube thumbnail";

  //content container
  const contentDiv = document.createElement("div");
  contentDiv.className = "flex flex-col px-2 py-1";

  //title label
  const titleLabel = document.createElement("label");
  titleLabel.className = "text-white text-lg";
  titleLabel.textContent = title;

  //channel label
  const channelLabel = document.createElement("label");
  channelLabel.className = "text-zinc-400 text-sm";
  channelLabel.textContent = channelTitle;

  // Assemble the card
  contentDiv.appendChild(titleLabel);
  contentDiv.appendChild(channelLabel);

  card.addEventListener("click", function () {
    window.open(link, "_blank");
  });

  card.appendChild(img);
  card.appendChild(contentDiv);

  return card;
}

//when user input
searchInput.addEventListener("input", searchVideo);

searchBtn.addEventListener("click", searchVideo);

function searchVideo() {
  // get inserted value
  const query = searchInput.value.trim();
  if (!query) {
    //if  nothing is typed then show all videos
    showCards(allVideos);
    return;
  }

  let searchVideos = [];

  searchVideos = allVideos.filter((video) => {
    return video.title.toLowerCase().includes(query.toLowerCase());
  });

  if (searchVideos.length <= 0) {
    messageDisplay.classList.remove("hidden");
    messageDisplay.textContent = "No Video Found";
  }

  // showing founded videos
  showCards(searchVideos);
}
