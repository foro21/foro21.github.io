// Cargar los mensajes cuando la página se carga
window.onload = function() {
    loadMessages();
};

// Función para cargar los mensajes desde el servidor
function loadMessages() {
    fetch('/posts')
        .then(response => response.json())
        .then(posts => {
            const postsContainer = document.getElementById('posts-container');
            postsContainer.innerHTML = ''; // Limpiar los posts antes de agregar nuevos

            posts.forEach(post => {
                const postElement = document.createElement('div');
                postElement.classList.add('post');
                postElement.innerHTML = `
                    <p><strong>${post.username}</strong> (${new Date(post.timestamp).toLocaleString()}):</p>
                    <p>${post.message}</p>
                    ${post.file ? `<img src="${post.file}" alt="Archivo subido" style="max-width: 200px;"/>` : ''}
                `;
                postsContainer.appendChild(postElement);
            });
        });
}

// Manejar el envío del formulario
const form = document.getElementById('message-form');
form.addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData(form);

    fetch('/submit', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(() => {
        loadMessages(); // Recargar los mensajes después de enviar
        form.reset(); // Limpiar el formulario
    })
    .catch(error => console.error('Error:', error));
});
