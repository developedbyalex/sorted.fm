function authorizeSpotify() {
    const clientId = '1e66a4dd5716470cb5db6af35dd8d816'; // Replace with your actual client ID
    const redirectUri = 'http://127.0.0.1:5500/playlists.html'; // Replace with your actual redirect URI

    window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user-read-private%20playlist-read-private&response_type=code`;
}

function getAuthorizationCode() {
    const queryParams = new URLSearchParams(window.location.search);
    return queryParams.get('code');
}

function exchangeCodeForToken(code) {
    const clientId = '1e66a4dd5716470cb5db6af35dd8d816'; // Replace with your actual client ID
    const clientSecret = 'b14d492074f147ca8f36cc3506fc0de9'; // Replace with your actual client secret
    const redirectUri = 'http://127.0.0.1:5500/playlists.html'; // Replace with your actual redirect URI

    return fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret),
        },
        body: new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: redirectUri,
        }),
    })
    .then(response => response.json())
    .then(data => data.access_token)
    .catch(error => console.error('Error exchanging code for token:', error));
}

function fetchPlaylists(token) {
    fetch('https://api.spotify.com/v1/me/playlists', {
        headers: {
            'Authorization': 'Bearer ' + token,
        },
    })
    .then(response => response.json())
    .then(data => {
        displayPlaylists(data.items);
    })
    .catch(error => console.error('Error fetching playlists:', error));
}

function displayPlaylists(playlists) {
    const playlistBody = document.getElementById('playlist-body');
    playlistBody.innerHTML = '';

    playlists.forEach(playlist => {
        const playlistRow = document.createElement('tr');
        playlistRow.innerHTML = `
            <td>${playlist.name}</td>
            <td>${playlist.owner.display_name}</td>
            <td>${playlist.tracks.total}</td>
        `;
        playlistBody.appendChild(playlistRow);
    });
}

function displayUserProfileImage(imageUrl) {
    const userContainer = document.getElementById('user-container');
    userContainer.innerHTML = `<img src="${imageUrl}" alt="Profile Picture" class="profile-picture">`;
}

document.addEventListener('DOMContentLoaded', function () {
    const code = getAuthorizationCode();
    if (code) {
        exchangeCodeForToken(code)
            .then(token => {
                fetchPlaylists(token);
                // Call another function to get and display user's profile picture
                // Replace 'getUserProfileImage' with your actual function
                getUserProfileImage(token);
            })
            .catch(error => console.error('Error fetching playlists:', error));
    }
});

// Add a function to get and display user's profile picture
function getUserProfileImage(token) {
    fetch('https://api.spotify.com/v1/me', {
        headers: {
            'Authorization': 'Bearer ' + token,
        },
    })
    .then(response => response.json())
    .then(data => {
        // Replace 'images' with the actual property containing user's images in the response
        const imageUrl = data.images && data.images.length > 0 ? data.images[0].url : '';
        displayUserProfileImage(imageUrl);
    })
    .catch(error => console.error('Error fetching user profile:', error));
}
