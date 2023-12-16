function authorizeSpotify() {
    const clientId = 'client-id-here'; // Replace with your actual client ID
    const redirectUri = 'http://127.0.0.1:5500/playlists.html'; // Replace with your actual redirect URI
 
    window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user-read-private%20playlist-read-private&response_type=code`;
 }
 
 function getAuthorizationCode() {
    const queryParams = new URLSearchParams(window.location.search);
    return queryParams.get('code');
 }
 
async function exchangeCodeForToken(code) {
    const clientId = 'client-id-here'; // Replace with your actual client ID
    const clientSecret = 'secret-here'; // Replace with your actual client secret
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

    // Sort playlists alphabetically by name
    const sortedPlaylists = playlists.sort((a, b) => a.name.localeCompare(b.name));

    sortedPlaylists.forEach(playlist => {
        const playlistRow = document.createElement('tr');
        playlistRow.innerHTML = `
            <td>${playlist.name}</td>
            <td>${playlist.tracks.total}</td>
            <td><a class="sort-button" href="#" onclick="sortPlaylist('${playlist.id}')"><i class="fa-solid fa-sort"></i> Sort</a></td>
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