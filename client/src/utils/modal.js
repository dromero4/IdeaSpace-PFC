export function showToast(messages, type) {
    const toast = document.getElementById("toast");
    const toastMessage = document.getElementById("toast-message");

    // Limpiar el contenido del toast
    toastMessage.innerHTML = '';  // Limpiar el contenedor de mensajes

    // Añadir cada mensaje de error o éxito en un nuevo <div>
    if (Array.isArray(messages)) {
        messages.forEach(msg => {
            const msgDiv = document.createElement('div');
            msgDiv.textContent = msg;
            toastMessage.appendChild(msgDiv);
        });
    } else {
        toastMessage.textContent = messages; // Si solo es un mensaje
    }

    // Limpiar clases anteriores
    toast.classList.remove("error", "success", "hidden");

    // Añadir la clase correspondiente
    toast.classList.add(type);  // Tipo puede ser 'error' o 'success'

    // Mostrar el toast
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
        toast.classList.add("hidden");
    }, 5000);
}