const fs = require('fs');
const path = require('path');

// Read the text file
const filePath = path.join(__dirname, 'xddsadsad.txt');
const content = fs.readFileSync(filePath, 'utf-8');

// Process the file to get unique diseases
const processDiseases = (content) => {
    // Split by lines and filter out empty lines and single letters (like 'A', 'B', etc.)
    const lines = content.split('\n').filter(line => line.trim() !== '' && line.length > 1);
    
    // Create a Set to automatically handle duplicates
    const uniqueDiseases = new Set();
    
    // Add each line to the Set (duplicates will be ignored)
    lines.forEach(line => {
        const disease = line.trim();
        if (disease.length > 1) { // Ignore single letters
            uniqueDiseases.add(disease);
        }
    });
    
    return Array.from(uniqueDiseases).sort();
};

// Get the unique diseases
const diseases = processDiseases(content);

// Read the current index.html
const indexPath = path.join(__dirname, 'index.html');
let htmlContent = fs.readFileSync(indexPath, 'utf-8');

// Create a new diseases array with the existing structure
const newDiseasesArray = diseases.map(disease => {
    // Create a basic structure for each disease
    // You might want to enhance this with more details later
    return `    {
        name: "${disease}",
        category: "Obecné", // Default category, can be updated later
        severity: "Mírná", // Default severity
        symptoms: ["Příznaky nejsou specifikovány"],
        causes: ["Příčiny nejsou specifikovány"],
        treatment: ["Léčba není specifikována"],
        prevention: ["Prevence není specifikována"],
        description: "Popis nemoci bude doplněn."
    }`;
});

// Create the new diseases array string
const newDiseasesString = `const diseases = [
${newDiseasesArray.join(',\n')}
];`;

// Update the HTML file
const updatedContent = htmlContent.replace(
    /const diseases = \[[\s\S]*?\];/,
    newDiseasesString
);

// Write the updated content back to the file
fs.writeFileSync(indexPath, updatedContent, 'utf-8');

console.log(`Successfully processed ${diseases.length} unique diseases.`);
console.log('index.html has been updated with the new diseases array.');
