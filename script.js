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

                if (avatarUrl) {
                    var link = document.createElement('a');
                    link.setAttribute('target', '_blank');
                    link.setAttribute('href', "https://www.github.com/" + originalName);

                    var avatarImg = document.createElement('img');
                    avatarImg.setAttribute('src', avatarUrl);
                    avatarImg.setAttribute('alt', 'Avatar');

                    link.appendChild(avatarImg);
                    resultContainer.appendChild(link);
                } else {
                    resultContainer.textContent = "Avatar not found";
                }
            })
            .catch((error) => {
                console.log(error);
                resultContainer.textContent = "Error: " + error.message;
            });
    });
});
