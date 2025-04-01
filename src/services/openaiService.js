import axios from "axios";
import { Platform } from "react-native";
import * as FileSystem from "expo-file-system";
import { OPENAI_API_KEY } from "../config/apiConfig";

export const getBase64FromImageUri = async (imageUri) => {
  try {
    if (!imageUri || typeof imageUri !== "string") {
      throw new Error("URI d'image invalide");
    }

    console.log("URI de l'image:", imageUri);
    if (imageUri.startsWith("data:")) {
      const base64 = imageUri.split(",")[1];
      console.log("Image déjà en base64, longueur:", base64.length);
      return base64;
    }

    if (Platform.OS !== "web") {
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      console.log(
        "Image convertie en base64 (mobile), longueur:",
        base64.length
      );
      return base64;
    } else {
      throw new Error(
        "Sur le web, l'URI devrait déjà être au format data:image"
      );
    }
  } catch (error) {
    console.error("Erreur lors de la conversion de l'image en base64:", error);
    throw error;
  }
};

export const analyzeProblemImagesWithGPT = async (imageUris) => {
  try {
    const content = [
      {
        type: "text",
        text: "Décrivez ce problème de plomberie en détail, analysez les causes possibles et suggérez un diagnostic professionnel. Soyez précis et technique, comme le ferait un plombier expérimenté face à cette situation. Ne fais pas de conclusion. Ne donne pas de conseils.",
      },
    ];

    for (const imageUri of imageUris) {
      let imageUrl;

      if (imageUri.startsWith("data:")) {
        imageUrl = imageUri;
      } else {
        const base64Image = await getBase64FromImageUri(imageUri);
        imageUrl = `data:image/jpeg;base64,${base64Image}`;
      }

      content.push({
        type: "image_url",
        image_url: {
          url: imageUrl,
        },
      });
    }

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "Vous êtes un plombier expert qui analyse des problèmes de plomberie à partir d'images.",
          },
          {
            role: "user",
            content: content,
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Erreur lors de l'analyse des images du problème:", error);
    throw error;
  }
};

export const analyzeActionImagesWithGPT = async (imageUris) => {
  try {
    const content = [
      {
        type: "text",
        text: "Décrivez les actions de réparation effectuées par le plombier sur ces images. Détaillez le processus, les matériaux utilisés et les techniques employées. Rédigez comme un rapport professionnel d'intervention. Ne fais pas de conclusion. Ne donne pas de conseil, Ne donne pas de recommandation et ne fais pas la partie presentation client signature, lieu adresse, etc...",
      },
    ];

    for (const imageUri of imageUris) {
      let imageUrl;

      if (imageUri.startsWith("data:")) {
        imageUrl = imageUri;
      } else {
        const base64Image = await getBase64FromImageUri(imageUri);
        imageUrl = `data:image/jpeg;base64,${base64Image}`;
      }

      content.push({
        type: "image_url",
        image_url: {
          url: imageUrl,
        },
      });
    }

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "Vous êtes un plombier expert qui rédige des rapports sur les interventions réalisées. Soyez professionnel et technique.",
          },
          {
            role: "user",
            content: content,
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Erreur lors de l'analyse des images d'intervention:", error);
    throw error;
  }
};

export const reformulateTextWithGPT = async (text) => {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "Vous êtes un expert en plomberie. Votre tâche est de reformuler le texte fourni dans un langage professionnel et technique approprié pour un rapport d'intervention. Ne fournis pas de conseils",
          },
          {
            role: "user",
            content: text,
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Erreur lors de la reformulation du texte:", error);
    throw error;
  }
};
