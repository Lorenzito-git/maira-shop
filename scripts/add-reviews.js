const fs = require("fs");
const path = require("path");

const productsPath = path.join(__dirname, "../data/products.json");
const products = JSON.parse(fs.readFileSync(productsPath, "utf8"));

const reviewTemplates = [
  [
    { author: "Martin K.", rating: 5, title: "Spokojenost", text: "Používám už několik měsíců, kvalita odpovídá popisu. Doporučuju." },
    { author: "Lucie P.", rating: 4, title: "Dobrý poměr cena/kvalita", text: "Zatím bez výhrad. Doručení bylo rychlé, produkt v pořádku." }
  ],
  [
    { author: "Pavel S.", rating: 5, title: "Přesně podle očekávání", text: "Jednoduché, funkční. Přidal jsem do pravidelného režimu a nelituju." },
    { author: "Eva M.", rating: 4, title: "Funguje jak má", text: "Žádné zbytečnosti, přesně to co potřebuju. Budu objednávat znovu." }
  ],
  [
    { author: "Jan V.", rating: 5, title: "Spolehlivá volba", text: "Kvalitní zpracování, používám denně. Oceňuju jednoduchost." },
    { author: "Tereza H.", rating: 4, title: "Doporučuji", text: "Dobře vyvážený produkt, sedí mi do tréninku i do běžného dne." }
  ],
  [
    { author: "David Č.", rating: 5, title: "Skvělá investice", text: "Po prvním týdnu jsem věděl, že zůstanu u této značky. Kvalita na prvním místě." },
    { author: "Kateřina J.", rating: 4, title: "Pohodlné a praktické", text: "Používám pravidelně, vše bez problémů. Ráda doporučím dál." }
  ],
  [
    { author: "Tomáš B.", rating: 5, title: "Žádné zklamání", text: "Očekával jsem solidní produkt a dostal jsem víc. Budu objednávat znovu." },
    { author: "Andrea L.", rating: 4, title: "Dobře zvolené", text: "Sedí mi velikost i použití. Po čase stále spokojená." }
  ]
];

function getReviewsForProduct(p, index) {
  const id = (p.id || "").toLowerCase();
  const title = (p.title || "").toLowerCase();
  const cat = (p.category || "").toLowerCase();
  const t = reviewTemplates[index % reviewTemplates.length];
  const r1 = { ...t[0], title: productSpecificTitle(p, 0), text: productSpecificText(p, 0) };
  const r2 = { ...t[1], title: productSpecificTitle(p, 1), text: productSpecificText(p, 1) };
  return [r1, r2];
}

function productSpecificTitle(p, which) {
  const n = p.title || "";
  if (n.includes("Protein") || n.includes("Whey")) return which === 0 ? "Přesně to, co potřebuju" : "Jednoduchost na prvním místě";
  if (n.includes("BCAA")) return which === 0 ? "Citrónová chuť bez chemie" : "Praktické na dlouhé tréninky";
  if (n.includes("Creatine") || n.includes("Kreatin")) return which === 0 ? "Žádná nasycovací fáze" : "Bez příchuti = žádný problém";
  if (n.includes("Pre-Workout") || n.includes("Preworkout")) return which === 0 ? "Nakopne to správně" : "Beru jen před těžkými tréninky";
  if (n.includes("Electrolyte") || n.includes("Elektrolyt")) return which === 0 ? "V horku nezbytnost" : "Tabletky do lahve = pohodlí";
  if (n.includes("Collagen") || n.includes("Kolagen")) return which === 0 ? "Klouby a kůže v pohodě" : "Přidávám do kávy denně";
  if (n.includes("Omega") || n.includes("D3") || n.includes("Magnesium") || n.includes("Zinc") || n.includes("Vitamin")) return which === 0 ? "Denní základ" : "Jedna tableta a hotovo";
  if (n.includes("Tee") || n.includes("Triko")) return which === 0 ? "Konečně triko, které nedrží" : "Nosím i mimo gym";
  if (n.includes("Hoodie") || n.includes("Mikina")) return which === 0 ? "Kapuce, která nespadne" : "Vrstvitelná klasika";
  if (n.includes("Shorts") || n.includes("Šortky")) return which === 0 ? "Konečně šortky na leg day" : "Nosím na běh i do fitka";
  if (n.includes("Leggings") || n.includes("Legíny")) return which === 0 ? "Neprosvítají ani v dřepu" : "Pohodlné a drží tvar";
  if (n.includes("Towel") || n.includes("Ručník")) return which === 0 ? "Rychle schne, skladný" : "Vždy v tašce";
  if (n.includes("Straps") || n.includes("Lifting")) return which === 0 ? "Deadlift bez omezení" : "Drží, nepřetrhnou se";
  if (n.includes("Bands") || n.includes("gumy")) return which === 0 ? "Sada na doma i do fitka" : "Různé tuhosti = univerzální";
  if (n.includes("Wraps") || n.includes("zápěstí")) return which === 0 ? "Stabilita u bench pressu" : "Pohodlné suché zipy";
  if (n.includes("Bottle") || n.includes("Láhve") || n.includes("Shaker")) return which === 0 ? "Pořád s sebou" : "Neproteče, snadno mytelný";
  if (n.includes("Oats") || n.includes("Oves")) return which === 0 ? "Základ snídaně" : "V kaši i v pečení";
  if (n.includes("Peanut") || n.includes("Arašíd")) return which === 0 ? "Bez zbytečného cukru" : "Na chleba i do shaku";
  if (n.includes("Bar") || n.includes("tyčink")) return which === 0 ? "Svačina po tréninku" : "Dobrá chuť, žádný odpad";
  if (n.includes("Belt") || n.includes("opasek")) return which === 0 ? "Bezpečný dřep a mrtvý" : "Kvalitní kůže";
  if (n.includes("Knee") || n.includes("kolena")) return which === 0 ? "Teplo a opora" : "Pohodlné při dřepech";
  if (n.includes("Duffel") || n.includes("taška")) return which === 0 ? "Všechno se vejde" : "Oddíly dávají smysl";
  if (n.includes("Foam") || n.includes("roller")) return which === 0 ? "Po tréninku nutnost" : "Uvolní záda i nohy";
  if (n.includes("Yoga") || n.includes("Mat")) return which === 0 ? "Neskřípe a nedrží" : "Stabilní při planku";
  if (n.includes("Cap") || n.includes("čepice")) return which === 0 ? "Sedí a nedrží teplo" : "Nastavitelná";
  if (n.includes("Socks") || n.includes("ponožk")) return which === 0 ? "Pohodlné na celý trénink" : "Tři páry = vystačí";
  if (n.includes("Sleep") || n.includes("Spánek")) return which === 0 ? "Lepší usínání" : "Bez ranní otupělosti";
  if (n.includes("EAA")) return which === 0 ? "Kompletní aminokyseliny" : "Piju během tréninku";
  if (n.includes("Prep") || n.includes("meal")) return which === 0 ? "Když nestíhám oběd" : "Kompletní jídlo za minutu";
  if (n.includes("Mug") || n.includes("mugcake")) return which === 0 ? "Večerní dezert bez výčitek" : "Sladká tečka s bílkovinami";
  return which === 0 ? "Spokojenost" : "Doporučuji";
}

function productSpecificText(p, which) {
  const n = p.title || "";
  if (n.includes("Protein") || n.includes("Whey")) return which === 0 ? "Beru po tréninku, chuť vanilka jemná. Míchám s vodou, za minutu hotovo. Žádný sediment." : "Jedna dávka ráno do kaše – nechutná to jako chemie. Méně sladké než jiné značky.";
  if (n.includes("BCAA")) return which === 0 ? "Piju během tréninku místo vody. Po hodině a půl necítím takový propad. V dietě obzvlášť." : "Dva bloky crossfitu za sebou – BCAA mi pomáhají držet se až do konce. Míchám do 500 ml.";
  if (n.includes("Kreatin") || n.includes("Creatine")) return which === 0 ? "5 g denně, žádná nasycovací fáze. Síla a objem se zvedly během pár týdnů. Nejjednodušší doplněk." : "Čistý kreatin bez příchuti, dávám do ranního shaku. Necítím chuť. Jedna odměrka denně.";
  if (n.includes("Pre-Workout")) return which === 0 ? "Beru 20 min před tréninkem. Nakopne to, ne třes. Tropical chuť v pohodě." : "Nedávám si ho na každý trénink – jen když potřebuju plný fokus. Efekt zůstává.";
  if (n.includes("Electrolyte") || n.includes("Elektrolyt")) return which === 0 ? "V létě bez nich nedám dlouhý trénink. Jedna tableta do lahve, piju průběžně." : "Šumivé tablety – hodím do vody a mám ionťák. Pohodlné na cesty.";
  if (n.includes("Tee") || n.includes("Triko")) return which === 0 ? "Střih sedí při bench i dřepech. Bavlna s elastanem drží tvar. Barva po praní drží." : "Nosím na trénink i mimo. Unisex S je na mě volnější, záměrně. Per na 30 °C.";
  if (n.includes("Hoodie")) return which === 0 ? "Kapuce nespadne ani při dřepech. Po roce nošení barva drží. Na cestu do fitka i zpět." : "M – volnější fit. Na rozcvičku na sobě, pak do tašky. Per na 30 °C.";
  if (n.includes("Shorts")) return which === 0 ? "U dřepů a leg pressu perfektní. Lehké, rychle schnou. Kapsa na klíče. Stejná velikost jako kalhoty." : "Běh i posilovna. Střih nesedí na tělo, ale to chci. Po praní se nesrazily.";
  if (n.includes("Leggings")) return which === 0 ? "Neprosvítají v dřepu. Vysoký pas drží. Silový trénink i jóga – jeden kousek na oboje." : "Velikost S – pohodlné, ne utažené. Po několika praních stále vypadají dobře.";
  if (n.includes("Towel")) return which === 0 ? "Rychle schne, skladný v tašce. Na lavičku ideální velikost. Savý materiál." : "Vždy v gym tašce. Per s podobnými barvami. Žádné žmolky.";
  if (n.includes("Straps")) return which === 0 ? "Deadlift a řady – zápěstí už nebolí. Pevná tkanina, po měsících pořád drží." : "Nepřetrhnou se, snadné nasazení. Pro strongman a těžké tahy nutnost.";
  if (n.includes("Bands") || n.includes("gumy")) return which === 0 ? "Čtyři tuhosti v sadě. Domů i do fitka. Rozcvička i izolace – univerzální." : "Mini bands na glutes a boky. Lehké přibalit. Kvalitní elastan.";
  if (n.includes("Wraps")) return which === 0 ? "Bench press a tlaky – zápěstí v bezpečí. Suchý zip drží. 60 cm délka stačí." : "Pohodlné, neškrtí. Sundávám mezi sériemi, nasazení rychlé.";
  if (n.includes("Bottle") || n.includes("Láhve")) return which === 0 ? "Nerez, 1 l. Neproteče. Po tréninku jen propláchnout." : "BPA free, lehký. Pořád s sebou – trénink i kancelář.";
  if (n.includes("Shaker")) return which === 0 ? "700 ml stačí na protein i pre-workout. Víčko těsní. Mytí v pohodě." : "Žádný zápach po mléce. Odměrka se vejde dovnitř. Praktický.";
  if (n.includes("Oats") || n.includes("Oves")) return which === 0 ? "Základ snídaně – kaše za pár minut. 2 kg vydrží. Bez přidaného cukru." : "Do kaše i do pečení. Jemná struktura. Doplnění sacharidů jednoduše.";
  if (n.includes("Peanut") || n.includes("Arašíd")) return which === 0 ? "100 % arašídy, bez palmového oleje. Na chleba i do shaku. 1 kg výhodné." : "Konzistence krémová. Snídaně i svačina. Dobré makro.";
  if (n.includes("Bar") || n.includes("tyčink")) return which === 0 ? "Po tréninku nebo na cestu. Čokoládová chuť v pohodě. 12 kusů v balení." : "Dobrá svačina bez zbytečného cukru. Jedna tyčinka zasytí.";
  if (n.includes("Belt")) return which === 0 ? "10 cm šířka, kůže. Dřep a mrtvý bezpečnější. Nastavení rychlé." : "Kvalitní provedení. Po roce nošení stále jako nový.";
  if (n.includes("Knee")) return which === 0 ? "7 mm neopren. Teplo a lehká opora. Dřepy pohodlnější." : "Nasadím před leg day, sundám po. Nesjíždí. Per ve vodě.";
  if (n.includes("Duffel")) return which === 0 ? "35 l, oddíl na boty a na mokré. Všechno se vejde – oblečení, láhev, strava." : "Pevné dno, kvalitní zip. Do fitka i na víkend.";
  if (n.includes("Foam") || n.includes("roller")) return which === 0 ? "Po tréninku záda a nohy. 33 cm délka, tvrdší – po zvyknutí ideální." : "Uvolní trapézy i hamstringy. Skladný v rohu.";
  if (n.includes("Yoga") || n.includes("Mat")) return which === 0 ? "6 mm tloušťka, neskřípe. Plank a jóga stabilní. 180 cm na výšku." : "Nedrží vlhkost, snadno utřít. Lehký na přenášení.";
  if (n.includes("Cap") || n.includes("čepice")) return which === 0 ? "Snapback, nastavitelná. Sedí, nedrží zbytečné teplo. Minimalistický design." : "Na trénink i ven. Jedna velikost pro všechny.";
  if (n.includes("Socks") || n.includes("ponožk")) return which === 0 ? "Tři páry v balení. Pohodlné, nekloužou v botě. Po praní drží tvar." : "Bavlna s elastanem. Na silovku i kardio. Výhodné balení.";
  if (n.includes("Sleep")) return which === 0 ? "Beru před spaním. Usínám rychleji, ráno bez otupělosti. Bez těžkých chemikálií." : "Melatonin + hořčík + byliny. Kombinace sedí.";
  if (n.includes("EAA")) return which === 0 ? "Kompletní spektrum aminokyselin. Piju během tréninku. Berry chuť příjemná." : "Místo BCAA – komplexnější. 400 g vydrží na dlouho.";
  if (n.includes("Prep") || n.includes("meal")) return which === 0 ? "Když nestíhám oběd – smíchám s vodou, za pár minut teplé jídlo. Makro v pohodě." : "Jedna porce = kompletní jídlo. Praktické na cestách.";
  if (n.includes("Mug") || n.includes("mugcake")) return which === 0 ? "Večer chuť na sladké – mug cake v mikrovlnce za minutu. Víc bílkovin než sušenka." : "Sladká tečka po tréninku. Bez hromady cukru. Jednoduchá příprava.";
  return which === 0 ? "Používám pravidelně, kvalita odpovídá. Doporučuji." : "Dobrý poměr cena/kvalita. Zatím bez výhrad.";
}

let changed = 0;
products.forEach((p, i) => {
  if (Array.isArray(p.reviews) && p.reviews.length >= 2) return;
  p.reviews = getReviewsForProduct(p, i);
  changed++;
});

fs.writeFileSync(productsPath, JSON.stringify(products, null, 2) + "\n", "utf8");
console.log("Added reviews to", changed, "products.");
