const getUrl = (artist, title) =>
    `http://ianertson.com:3500/${artist}/${title}`;

const button = document.getElementById("click");
const searchArtist = document.getElementById("input-artist");
const searchTitle = document.getElementById("input-song-title");

function updateInput() {
    const validInput =
        searchArtist.value.length >= 3 && searchTitle.value.length >= 3;

    if (validInput) {
        button.removeAttribute("disabled");
        error.removeAttribute("data-active");
    } else {
        button.setAttribute("disabled", "");
        error.setAttribute("data-active", "");
        error.innerText = "Type something to search!";
    }
}

function inputChanged() {
    updateInput();
}

searchArtist.addEventListener("keydown", inputChanged);
searchArtist.addEventListener("keyup", inputChanged);
searchTitle.addEventListener("keydown", inputChanged);
searchTitle.addEventListener("keyup", inputChanged);

updateInput();

button.addEventListener("click", async function (event) {
    document.getElementById("lyricSection").innerHTML = "";

    const artistSearch = searchArtist.value.toLowerCase();
    const titleSearch = searchTitle.value.toLowerCase();
    const url = getUrl(artistSearch, titleSearch);

    const response = await fetch(url);

    const data = await response.json();

    if (data > [0]) {
        document.getElementById("card-result-lyrics").style.display = "block";
        document.getElementById("card-result-No-Match").style.display = "none";
    } else {
        document.getElementById("card-result-No-Match").style.display = "block";
        document.getElementById("card-result-lyrics").style.display = "none";
    }

    function createElement(name, attributes) {
        const element = document.createElement(name);

        Object.keys(attributes)
            .filter((key) => key !== "children")
            .forEach(function (key) {
                element.setAttribute(key, attributes[key]);
                element[key] = attributes[key];
            });
        const children = "children" in attributes ? attributes[`children`] : [];

        children.forEach((child) => element.appendChild(child));

        return element;
    }

    function toHTMLElements(obj) {
        return createElement("article", {
            children: [createElement("p", { innerText: obj.lyrics })],
        });
    }

    const filteredResults = data.filter(function (obj) {
        return obj.lyrics.toLowerCase();
    });

    filteredResults.forEach((obj) =>
        lyricSection.appendChild(toHTMLElements(obj))
    );
});
