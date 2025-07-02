let sendButton = document.querySelector("#sendButton");

const messagesContainer = document.querySelector(".chat__messages");

sendButton.addEventListener("click", async () => {
  let inputText = document.querySelector("#inputText");

  // Valor a narrar
  const text = inputText.value.trim();

  // Lenguaje de destino
  const targetSpeaker = document.querySelector("#targetSpeaker").value;

  if (!text) return false;

  // Meter el mensaje del usuario a la caja de mensajes
  const userMesagge = document.createElement("div");
  userMesagge.className = "chat__message chat__message--user";
  userMesagge.textContent = text;

  messagesContainer.appendChild(userMesagge);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  // Mensaje de cargando
  const loading = document.createElement("div");
  userMesagge.className = "chat__message chat__message--bot";
  userMesagge.textContent = "Narrando...";

  messagesContainer.appendChild(loading);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  // Petición Ajax al BackEnd
  try {
    const response = await fetch("/api/speak", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: text,
        speaker: targetSpeaker,
      }),
    });

    if (response.ok) {
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      // Agregar el mensaje de la IA al chat
      //const botMessage = document.createElement("div");
      const botMessage = loading;
      botMessage.className = "chat__message chat__message--bot";
      botMessage.innerHTML = `
            <audio controls>
                <source src="${audioUrl}" type="audio/mp3">
                Tu navegador no puede reproducir audios
            </audio>
      `;

      messagesContainer.appendChild(botMessage);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  } catch (error) {
    console.log("Error:", error);
  }

  // Agregar el mensaje de la IA al chat

  // Vaciar el input de tipo text
  inputText.value = "";
});
