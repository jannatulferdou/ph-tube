console.log("index is connected");
const showLoader = () => {
  document.getElementById("loader").classList.remove("hidden");
  document.getElementById("video-container").classList.add("hidden");
};
const hideLoader = () => {
  document.getElementById("loader").classList.add("hidden");
  document.getElementById("video-container").classList.remove("hidden");
};

function removeActiveClass() {
  const activeButtons = document.getElementsByClassName("active");

  for (let btn of activeButtons) {
    btn.classList.remove("active");
  }
  console.log(activeButtons);
}

function loadCategories() {
  // fetch the data

  fetch("https://openapi.programming-hero.com/api/phero-tube/categories")
    //  2 - convart promise to json
    .then((res) => res.json())
    .then((data) => displayCategories(data.categories));
}

function loadVideos(searchText = "") {
  showLoader();
  fetch(
    `https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`
  )
    .then((response) => response.json())
    .then((data) => {
      removeActiveClass();
      document.getElementById("btn-all").classList.add("active");
      displayVideos(data.videos);
    });
}

const loadCategoriyVideos = (id) => {
  showLoader()
  const url = `https://openapi.programming-hero.com/api/phero-tube/category/${id}`;
  // console.log(url);

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      removeActiveClass();
      // no active class
      const clikedButton = document.getElementById(`btn-${id}`);
      clikedButton.classList.add("active");
      displayVideos(data.category);
    });
};

const loadVideoDetails = (videoId) => {
  console.log(videoId);
  const url = `https://openapi.programming-hero.com/api/phero-tube/video/${videoId}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => displayVideoDetails(data.video));
};

const displayVideoDetails = (video) => {
  console.log(video);
  document.getElementById("video_details").showModal();
  const detailsContainer = document.getElementById("details-container");

  detailsContainer.innerHTML = `
  <div class="card bg-base-100 image-full shadow-sm">
  <figure>
    <img
      src="${video.thumbnail}" />
  </figure>
  <div class="card-body">
    <h2 class="card-title">${video.title}</h2>
    <p>${video.description}</p>
  </div>
</div>
  `;
};

// {
//     "category_id": "1001",
//     "category": "Music"
//     }

function displayCategories(categories) {
  //   get the container
  const categoriyContainer = document.getElementById("categoriy-container");

  //   Loop operation on Array of object
  for (let cat of categories) {
    // console.log(cat);

    // create Element
    const categoriyDiv = document.createElement("div");
    categoriyDiv.innerHTML = `
    <button id="btn-${cat.category_id}" onclick="loadCategoriyVideos(${cat.category_id})" class="btn bg-[#25252515] hover:bg-[#FF1F3D] rounded py-[5px] px-[10px] md:py-[10px] md:px-5 md:text-lg hover:text-white text-[#252525b2]">${cat.category}</button>
    `;

    // Append the Element
    categoriyContainer.appendChild(categoriyDiv);
  }
}

// {
//   "category_id": "1003",
//   "video_id": "aaai",
//   "thumbnail": "https://i.ibb.co/kc8CCFs/30-rock.png",
//   "title": "30 Rock",
//   "authors": [
//       {
//           "profile_picture": "https://i.ibb.co/YZN9rQZ/tina.jpg",
//           "profile_name": "Tina Fey",
//           "verified": false
//       }
//   ],
//   "others": {
//       "views": "4.5K",
//       "posted_date": "14800"
//   },
//   "description": "'30 Rock,' led by Tina Fey, is a comedy series that has garnered 4.5K views. The show is a witty and humorous take on the behind-the-scenes antics of a fictional live comedy show. With its sharp writing and unforgettable characters, '30 Rock' is perfect for fans of smart, satirical humor and engaging storylines."
// }

const displayVideos = (videos) => {
  // get the container
  const videoContainer = document.getElementById("video-container");

  videoContainer.innerHTML = "";

  if (videos.length == 0) {
    videoContainer.innerHTML = `
     <div class="col-span-full flex flex-col justify-center items-center py-[180px]">
            <img class="mb-8 w-[140px]" src="Icon.png" alt="">
            <h1 class="text-[32px] font-bold text-center">Oops!! Sorry, There is no <br> content here</h1>
        </div>
    `;
    return;
  }

  // Loop operation on Array of object
  videos.forEach((video) => {
    // console.log(video);
    // element create
    const videoCard = document.createElement("div");

    videoCard.innerHTML = `
   <div class="card bg-base-100">
            <figure class="relative mb-4">
                <img class="w-full h-[250px] object-cover" src="${
                  video.thumbnail
                }" alt="" />
                <span class="absolute bottom-2 right-2 bg-[#171717] py-1 px-[5px] text-white text-[10px] rounded">3hrs
                    56 min ago</span>
            </figure>
            <div class="flex gap-3 px-0 py-5">
                <div class="profile">
                    <div class="avatar">
                        <div class="ring-primary ring-offset-base-100 w-6 rounded-full ring ring-offset-2">
                            <img src="${video.authors[0].profile_picture}"
                                alt="" />
                        </div>
                    </div>
                </div>
                <div class="intro">
                    <h1 class="text-[#171717] font-bold mb-2">${
                      video.title
                    }</h1>
                    <p class="text-sm text-[#17171770] mb-1 flex gap-1">
                    ${video.authors[0].profile_name}
                    ${
                      video.authors[0].verified == true
                        ? `<img class="w-5 h-5" src="https://img.icons8.com/?size=48&id=98A4yZTt9abw&format=png" alt="">`
                        : ``
                    }
                    </p>
                    <p class="text-sm text-[#17171770]">${
                      video.others.views
                    } views</p>
                </div>
            </div>
            <button onclick="loadVideoDetails('${
              video.video_id
            }')" class="btn btn-block">Show Details</button>
        </div>
   `;
    videoContainer.appendChild(videoCard);
  });
  hideLoader()
};

document.getElementById("search-input").addEventListener("keyup", (e) => {
  const input = e.target.value;
  loadVideos(input);
});

loadCategories();