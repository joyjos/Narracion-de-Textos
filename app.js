// Importar dependencias
import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";
import fs from "fs";
import path from "path";

// Cargar configuración API Key
dotenv.config();

// Cargar Express
const app = express();
const PORT = process.env.PORT || 3000;

// Servir FrontEnd
app.use("/", express.static("public"));

// Middleware para procesar JSON (convierto JSON a un Objeto de JavaScript)
app.use(express.json());

// Instancia de OpenAI y pasarle el API Key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

console.log("API KEY:", process.env.OPENAI_API_KEY);

// Ruta/endpoint/url
app.post("/api/speak", async (req, res) => {
  // Funcionalidad de narrar con IA
  const { text, speaker } = req.body;

  if (!text) return res.status(400).json({ error: "Debes mandar un texto" });
  // Llamar al LLM o modelo de OpenAI

  try {
    const completion = await openai.audio.speech.create({
      model: "tts-1",
      voice: speaker,
      input: text,
      response_format: "mp3",
    });

    // Convierto lo que me devuelve en un archivo temporal
    const audioBuffer = Buffer.from(await completion.arrayBuffer());
    const audioFilePath = path.join(process.cwd(), "temp_audio.mp3");
    fs.writeFileSync(audioFilePath, audioBuffer);

    res.setHeader("Content-Type", "audio/mp3");
    res.sendFile(audioFilePath, (error) => {
      if (error) {
        console.log("Error al enviar el audio", error);
      }

      // Elimino el archivo temporal
      fs.unlinkSync(audioFilePath);
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error al narrar" });
  }

});

// Servir el BackEnd
app.listen(PORT, () => {
  console.log("Servidor corriendo correctamente en http://localhost:" + PORT);
});
