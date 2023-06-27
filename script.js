document.addEventListener("DOMContentLoaded", function() {
    var form = document.getElementById('myForm');
    var resultContainer = document.getElementById('results');

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        var search = document.getElementById("search").value;

        var originalName = search.trim();

        resultContainer.innerHTML = "";

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
});