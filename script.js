document.addEventListener("DOMContentLoaded", function() {
    var form = document.getElementById('myForm');
    var searchInput = document.getElementById("search");
    var resultContainer = document.getElementById('results');
    var suggestionsContainer = document.getElementById('suggestions');

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        var search = searchInput.value;

        var originalName = search.trim();

        resultContainer.innerHTML = "";
        suggestionsContainer.innerHTML = "";

        fetch("https://api.github.com/users/" + originalName, {
            headers: {
                Accept: "application/vnd.github.v3+json"
            }
        })
            .then((response) => {
                if (response.status === 404) {
                    throw new Error("User not found");
                } else if (!response.ok) {
                    throw new Error("Error fetching data");
                }
                return response.json();
            })
            .then((data) => {
                console.log(data);

                var avatarUrl = data.avatar_url;
                var username = data.login;
                var repoLink = data.html_url;

                if (avatarUrl) {
                    var avatarImg = document.createElement('img');
                    avatarImg.setAttribute('src', avatarUrl);
                    avatarImg.setAttribute('alt', 'Avatar');
                    avatarImg.classList.add('avatar-img');
                    resultContainer.appendChild(avatarImg);
                } else {
                    resultContainer.textContent = "Avatar not found";
                }

                var usernameElement = document.createElement('p');
                usernameElement.textContent = "Username: " + username;
                resultContainer.appendChild(usernameElement);

                var repoLinkElement = document.createElement('p');
                var link = document.createElement('a');
                link.setAttribute('target', '_blank');
                link.setAttribute('href', repoLink);
                link.textContent = "Repository Link";
                repoLinkElement.appendChild(link);
                resultContainer.appendChild(repoLinkElement);
            })
            .catch((error) => {
                console.log(error);
                resultContainer.textContent = "Error: " + error.message;
            });
    });

    searchInput.addEventListener('input', function() {
        var search = searchInput.value;

        if (search.trim() === "") {
            suggestionsContainer.innerHTML = "";
            return;
        }

        fetch("https://api.github.com/search/users?q=" + search)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error fetching data");
                }
                return response.json();
            })
            .then((data) => {
                console.log(data);

                suggestionsContainer.innerHTML = "";

                var users = data.items;

                users.forEach((user) => {
                    var suggestionLink = document.createElement('a');
                    suggestionLink.setAttribute('target', '_blank');
                    suggestionLink.setAttribute('href', user.html_url);
                    suggestionLink.textContent = user.login;

                    var suggestionItem = document.createElement('p');
                    suggestionItem.appendChild(suggestionLink);

                    suggestionsContainer.appendChild(suggestionItem);
                });
            })
            .catch((error) => {
                console.log(error);
                suggestionsContainer.textContent = "Error: " + error.message;
            });
    });
});