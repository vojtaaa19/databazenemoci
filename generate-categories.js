const fs = require('fs');
const path = require('path');

// Načtení dat z index.html
const indexPath = path.join(__dirname, 'index.html');
const htmlContent = fs.readFileSync(indexPath, 'utf-8');

// Extrahování databáze nemocí
const diseasesMatch = htmlContent.match(/const diseases = \[([\s\S]*?)\];/);
if (!diseasesMatch) {
    console.error('Nepodařilo se najít databázi nemocí v index.html');
    process.exit(1);
}

// Získání unikátních kategorií
const categories = new Set();
try {
    // Extrahování kategorií z databáze nemocí
    const diseasesArray = eval(`[${diseasesMatch[1]}]`);
    diseasesArray.forEach(disease => {
        if (disease && disease.category) {
            // Rozdělení kategorií, pokud jsou oddělené lomítkem
            const cats = disease.category.split('/').map(cat => cat.trim());
            cats.forEach(cat => categories.add(cat));
        }
    });
} catch (error) {
    console.error('Chyba při zpracování databáze nemocí:', error);
    process.exit(1);
}

// Funkce pro získání popisu kategorie
function getCategoryDescription(category) {
    const descriptions = {
        'Infekční': 'Infekční nemoci jsou způsobeny patogeny, jako jsou bakterie, viry, houby nebo parazité. Mohou se šířit z člověka na člověka, prostřednictvím potravin, vody, hmyzu nebo jiných nosičů.',
        'Kožní': 'Kožní onemocnění postihují kůži, vlasy a nehty. Mohou být způsobeny infekcemi, alergiemi, autoimunitními poruchami nebo vnějšími vlivy.',
        'Neurologické': 'Neurologické poruchy postihují nervový systém, včetně mozku, míchy a periferních nervů. Mohou způsobovat problémy s pohybem, řečí, pamětí a dalšími funkcemi.',
        'Kardiovaskulární': 'Kardiovaskulární onemocnění postihují srdce a cévy. Patří mezi ně ischemická choroba srdeční, vysoký krevní tlak, srdeční selhání a další stavy.',
        'Dýchací': 'Nemoci dýchacího ústrojí postihují plíce a dýchací cesty. Mohou být akutní, jako je zápal plic, nebo chronické, jako je astma nebo chronická obstrukční plicní nemoc (CHOPN).',
        'Trávicí': 'Nemoci trávicího ústrojí postihují jícen, žaludek, střeva, játra, žlučník a slinivku břišní. Mohou způsobovat bolesti břicha, nevolnost, zvracení, průjem nebo zácpu.',
        'Metabolické': 'Metabolické poruchy ovlivňují chemické procesy v těle, které přeměňují potravu na energii. Patří mezi ně diabetes, obezita, dna a další stavy.',
        'Endokrinní': 'Endokrinní poruchy souvisejí s hormonální nerovnováhou. Postihují žlázy s vnitřní sekrecí, jako je štítná žláza, nadledviny nebo slinivka břišní.',
        'Muskuloskeletální': 'Muskuloskeletální onemocnění postihují kosti, klouby, svaly a pojivovou tkáň. Mohou způsobovat bolest, ztuhlost a omezení pohybu.',
        'Urologické': 'Urologické problémy postihují močový systém včetně ledvin, močovodů, močového měchýře a močové trubice. Mezi časté obtíže patří infekce močových cest, ledvinové kameny a problémy s močením.',
        'Gynekologické': 'Gynekologické potíže se týkají ženského reprodukčního systému. Zahrnují menstruační poruchy, infekce, endometriózu, myomy a další stavy.',
        'Onkologické': 'Onkologická onemocnění zahrnují různé typy nádorů, které mohou být benigní nebo maligní. Včasná diagnóza a léčba jsou klíčové pro úspěšnou léčbu.',
        'Psychiatrické': 'Duševní poruchy ovlivňují myšlení, náladu a chování. Patří mezi ně deprese, úzkostné poruchy, bipolární porucha a schizofrenie.',
        'Alergologické': 'Alergické reakce vznikají při přecitlivělosti imunitního systému na běžné látky. Projevují se různými způsoby, od mírné rýmy až po život ohrožující anafylaktický šok.',
        'Imunologické': 'Poruchy imunitního systému mohou způsobit jeho nedostatečnou činnost (imunodeficience) nebo naopak nadměrnou reakci (autoimunitní onemocnění).',
        'Genetické': 'Genetické poruchy jsou způsobeny změnami v DNA. Mohou být dědičné nebo vzniknout spontánně. Projevují se různými způsoby a mohou postihnout jakýkoli systém v těle.',
        'Vývojové': 'Vývojové poruchy ovlivňují vývoj dítěte v různých oblastech, jako je řeč, pohyb, učení a sociální dovednosti. Často se projevují v raném dětství.',
        'Vrozené': 'Vrozené vady jsou přítomny již při narození. Mohou být způsobeny genetickými faktory, infekcemi během těhotenství nebo vystavením škodlivým látkám.'
    };

    return descriptions[category] || `Kategorie ${category} zahrnuje různé zdravotní stavy a nemoci, které souvisejí s touto oblastí medicíny. Pro podrobnější informace o konkrétních nemocech prosím vyberte z výše uvedeného seznamu.`;
}

// Funkce pro generování HTML stránky kategorie
function generateCategoryPage(category, diseases) {
    return `<!DOCTYPE html>
<html lang="cs">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${category} - Kategorie nemocí | Zdravotní Encyklopedie</title>
    <meta name="description" content="Přehled nemocí v kategorii ${category}. Kompletní informace o příznacích, léčbě a prevenci.">
    <meta name="keywords" content="${category}, nemoci, příznaky, léčba, prevence, zdraví, ${category.toLowerCase()}">
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>
<body class="bg-gray-50 min-h-screen">
    <!-- Header -->
    <header class="bg-white shadow-sm sticky top-0 z-50">
        <div class="container mx-auto px-4 py-4 flex justify-between items-center">
            <a href="/" class="text-2xl font-bold text-primary">Zdravotní Encyklopedie</a>
            <nav>
                <a href="/" class="text-gray-600 hover:text-primary">Domů</a>
            </nav>
        </div>
    </header>

    <!-- Hlavní obsah -->
    <main class="container mx-auto px-4 py-8">
        <div class="max-w-4xl mx-auto">
            <h1 class="text-3xl font-bold mb-6">${category}</h1>
            
            <div class="bg-white rounded-lg shadow p-6 mb-8">
                <p class="text-gray-700 mb-6">V této kategorii naleznete přehled nemocí týkajících se ${category.toLowerCase()}. Každá nemoc obsahuje podrobné informace o příznacích, léčbě a prevenci.</p>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${diseases.map(disease => `
                        <a href="/#${disease.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}" 
                           class="block p-4 border rounded-lg hover:shadow-md transition-shadow">
                            <h3 class="font-semibold text-lg text-primary">${disease.name}</h3>
                            <p class="text-sm text-gray-600">${disease.symptoms ? disease.symptoms.slice(0, 3).join(', ') + '...' : 'Příznaky nejsou specifikovány'}</p>
                        </a>
                    `).join('')}
                </div>
            </div>
            
            <div class="bg-white rounded-lg shadow p-6">
                <h2 class="text-xl font-semibold mb-4">O kategorii ${category}</h2>
                <p class="text-gray-700">${getCategoryDescription(category)}</p>
            </div>
        </div>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white py-8 mt-12">
        <div class="container mx-auto px-4">
            <div class="flex flex-col md:flex-row justify-between items-center">
                <div class="mb-4 md:mb-0">
                    <h3 class="text-xl font-bold mb-2">Zdravotní Encyklopedie</h3>
                    <p class="text-gray-400">Kompletní přehled nemocí a zdravotních potíží</p>
                </div>
                <div class="flex space-x-4">
                    <a href="/o-nas" class="text-gray-300 hover:text-white">O nás</a>
                    <a href="/kontakt" class="text-gray-300 hover:text-white">Kontakt</a>
                    <a href="/ochrana-osobnich-udaju" class="text-gray-300 hover:text-white">Ochrana osobních údajů</a>
                </div>
            </div>
            <div class="border-t border-gray-700 mt-6 pt-6 text-center text-gray-400 text-sm">
                &copy; ${new Date().getFullYear()} Všechna práva vyhrazena
            </div>
        </div>
    </footer>
</body>
</html>`;
}

// Hlavní funkce pro generování stránek kategorií
async function generateCategoryPages() {
    try {
        // Získání databáze nemocí
        const diseasesArray = eval(`[${diseasesMatch[1]}]`);
        
        // Vytvoření složky pro kategorie, pokud neexistuje
        const categoriesDir = path.join(__dirname, 'kategorie');
        if (!fs.existsSync(categoriesDir)) {
            fs.mkdirSync(categoriesDir, { recursive: true });
        }

        // Vytvoření souboru sitemap.xml
        let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n    <url>\n        <loc>https://databazenemoci.fun/</loc>\n        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n        <changefreq>weekly</changefreq>\n        <priority>1.0</priority>\n    </url>`;

        // Pro každou kategorii vytvořit stránku
        for (const category of categories) {
            // Filtrování nemocí podle kategorie
            const categoryDiseases = diseasesArray.filter(disease => 
                disease && disease.category && disease.category.split('/').some(cat => cat.trim() === category)
            );

            if (categoryDiseases.length > 0) {
                // Vytvoření názvu souboru (odstranění diakritiky a speciálních znaků)
                const filename = category
                    .toLowerCase()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-+|-+$/g, '') + '.html';
                
                const filePath = path.join(categoriesDir, filename);
                
                // Vytvoření obsahu stránky
                const pageContent = generateCategoryPage(category, categoryDiseases);
                
                // Uložení stránky
                fs.writeFileSync(filePath, pageContent, 'utf-8');
                console.log(`Vytvořena stránka pro kategorii: ${category} (${filename})`);

                // Přidání do sitemapy
                sitemap += `\n    <url>\n        <loc>https://databazenemoci.fun/kategorie/${filename}</loc>\n        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n        <changefreq>monthly</changefreq>\n        <priority>0.8</priority>\n    </url>`;
            }
        }

        // Dokončení sitemapy
        sitemap += '\n</urlset>';

        // Uložení sitemapy
        fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), sitemap, 'utf-8');
        console.log('Vytvořena sitemapa: sitemap.xml');

        console.log('\nVšechny kategorie byly úspěšně vygenerovány!');
    } catch (error) {
        console.error('Došlo k chybě při generování stránek kategorií:', error);
    }
}

// Spuštění generování stránek
generateCategoryPages();
