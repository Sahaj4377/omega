const axios = require("axios");
const rf = require("roboflow"); // Import Roboflow library

// Roboflow configuration
rf.config({ apiKey: "JG5GARYM8y0ghghBbeAk" });
const model = rf.workspace("sahajprojects").project("omega-plantheight").version(1).model;
const roboflowUrl = model.predictionUrl(); // Get prediction URL from model

function fetchImagesAndAnalyze() {
  axios
    .get("https://api.github.com/repos/Sahaj4377/omega/git/trees/main?recursive=1")
    .then((response) => {
      const imagePaths = response.data.tree.filter(
        (file) => file.type === "blob" && file.path.startsWith("images/")
      );
      const imageUrls = imagePaths.map(
        (path) => `https://raw.githubusercontent.com/Sahaj4377/omega/main/${path.path}`
      );

      analyzeImages(imageUrls);
    })
    .catch((error) => {
      console.error("Error fetching images:", error.message);
    });
}

function analyzeImages(imageUrls) {
  imageUrls.forEach(async (imageUrl) => {
    try {
      const response = await model.predict(imageUrl); // Use model.predict for Roboflow prediction

      const plantHeight = response.predictions[0].plant_height; // Access model output
      const recommendedTDS = calculateTds(plantHeight);

      // Add plant data to the table
      const tableBody = document.getElementById("plantTableBody");
      const newRow = document.createElement("tr");
      newRow.innerHTML = `
          <td><img src="<span class="math-inline">\{imageUrl\}" style\="max\-width\: 100px; max\-height\: 100px;"\></td\>
<td\></span>{plantHeight.toFixed(2)}</td>
          <td>${recommendedTDS}</td>
      `;
      tableBody.appendChild(newRow);
    } catch (error) {
      console.error("Error processing image:", error.message);
      // Display an error message to the user
    }
  });
}

function calculateTds(plantHeight) {
  if (plant_height_inches >= 0.0 && plant_height_inches < 1.0) {
    return 200;
  } else if (plant_height_inches >= 1.0 && plant_height_inches < 2.0) {
    return 300;
  } else if (plant_height_inches >= 2.0 && plant_height_inches < 3.5) {
    return 400;
  } else if (plant_height_inches >= 3.5 && plant_height_inches < 5.0) {
    return 600;
  } else {
    return 800;
  }
}

// Initial image analysis
fetchImagesAndAnalyze();

// Check for new images periodically (e.g., every 5 minutes)
setInterval(fetchImagesAndAnalyze
