//@ts-check
var eotaiImages = require("../public/eotai_images.json");
var materialsArray = [
    "oil painting",
    "cinematic etching",
    "watercolour painting",
    "gouache illustration",
    "lithography",
    "pastel drawing",
    "ink drawing",
    "acrylic painting",
    //	"crayon drawing",
    //	"watercolor",
    //	"collage",
    //  "pencil sketching",
    //  "etching",
];

var stylesArray = [
	"realistic",
	"modern",
	"pop art",
	"synthwave",
	"abstract",
	"art nouveau",
	"pre-raphaelite",
	"surreal art",
	"pixel art",
	// "distorted pixel art",
	"flat woodblock prints",
	"ornamental curvilinear lines",
    "concept art",
	"conceptual art",
	"digital art",
	"art deco",
	"cubism",
	"folk art", 
    "dadaist",
    "rococo",
    "concept art",
    "fauvist"
];

function addMaterials(myJSON) {
    //create and add a material property for each feature in the json file
    for (var i = 0; i < myJSON.length; i++) {
        for (var j = 0; j < materialsArray.length; j++) {
            if (myJSON[i].prompt.includes(materialsArray[j])) {
                myJSON[i].material = materialsArray[j];
                break;
            }
        }
    }
    return myJSON;
}

function addStyles(myJSON) {
    //create and add a material property for each feature in the json file
    for (var i = 0; i < myJSON.length; i++) {
        for (var j = 0; j < stylesArray.length; j++) {
            if (myJSON[i].prompt.includes(stylesArray[j])) {
                myJSON[i].style = stylesArray[j];
                break;
            }
        }
    }
    return myJSON;
}

function processJSON(myJSON) {
    const tmp = addMaterials(myJSON);
    updatedEotaiImages = addStyles(tmp);
    return updatedEotaiImages;
}

function checkForMisses(myJSON) {
    var eotaiImages_extended = myJSON;
    var materialMisses = 0;
    var styleMisses = 0;
    for (var i = 0; i < eotaiImages_extended.length; i++) {
        if (eotaiImages_extended[i].material == undefined) {
            console.log("Missing material", eotaiImages_extended[i].prompt);
            materialMisses++;
        }
        if (eotaiImages_extended[i].style == undefined) {
            console.log("Missing style", eotaiImages_extended[i].prompt);
            styleMisses++;
        }
    }
    return {
        materialMisses: materialMisses, // Fixed the variable name here
        styleMisses: styleMisses
    };
}

var fs = require("fs");
var path = require("path");
var filePath = path.join(__dirname, "../public/eotai_images_extended.json");

function writeFile(filePath, data) {
    fs.writeFile(filePath, data, function (err) {
        if (err) {
            throw err;
        }
        console.log("JSON data is saved.");
    });
}

console.log("Processing Materials");
var updatedEotaiImages = processJSON(eotaiImages);

var missesCounts = checkForMisses(updatedEotaiImages);
console.log("Material misses:", missesCounts.materialMisses);
console.log("Style misses:", missesCounts.styleMisses);

console.log("Writing to file");
var data = JSON.stringify(updatedEotaiImages);
writeFile(filePath, data);
