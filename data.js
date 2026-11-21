// Each team: name, attack, midfield, defence, color, stars (plain text names)
const NATIONS = [
 {n:'Egypt',a:84,m:80,d:78,c:'#c8102e',s:['Mohamed Salah','Omar Marmoush','Mostafa Mohamed']},
 {n:'France',a:92,m:88,d:88,c:'#1d4ed8',s:['Kylian Mbappe','Antoine Griezmann','Aurelien Tchouameni']},
 {n:'Portugal',a:90,m:89,d:86,c:'#b91c1c',s:['Cristiano Ronaldo','Bruno Fernandes','Rafael Leao']},
 {n:'Argentina',a:91,m:89,d:87,c:'#60a5fa',s:['Lionel Messi','Lautaro Martinez','Julian Alvarez']},
 {n:'Brazil',a:91,m:87,d:85,c:'#facc15',s:['Vinicius Junior','Rodrygo','Raphinha']},
 {n:'England',a:90,m:90,d:86,c:'#e5e7eb',s:['Harry Kane','Jude Bellingham','Bukayo Saka']},
 {n:'Spain',a:88,m:91,d:86,c:'#dc2626',s:['Lamine Yamal','Rodri','Nico Williams']},
 {n:'Germany',a:87,m:89,d:85,c:'#f3f4f6',s:['Jamal Musiala','Florian Wirtz','Kai Havertz']},
 {n:'Morocco',a:82,m:81,d:83,c:'#15803d',s:['Achraf Hakimi','Hakim Ziyech','Youssef En-Nesyri']},
 {n:'Netherlands',a:86,m:86,d:87,c:'#f97316',s:['Virgil van Dijk','Cody Gakpo','Frenkie de Jong']},
 {n:'Norway',a:88,m:80,d:76,c:'#b91c1c',s:['Erling Haaland','Martin Odegaard']},
 {n:'Belgium',a:85,m:86,d:82,c:'#991b1b',s:['Kevin De Bruyne','Romelu Lukaku']},
 {n:'Italy',a:84,m:85,d:87,c:'#2563eb',s:['Gianluigi Donnarumma','Nicolo Barella']},
 {n:'Senegal',a:83,m:80,d:82,c:'#16a34a',s:['Sadio Mane','Kalidou Koulibaly']},
 {n:'Nigeria',a:82,m:79,d:78,c:'#22c55e',s:['Victor Osimhen','Ademola Lookman']},
 {n:'Algeria',a:80,m:79,d:77,c:'#15803d',s:['Riyad Mahrez','Ismael Bennacer']},
 {n:'Tunisia',a:76,m:77,d:76,c:'#dc2626',s:['Hannibal Mejbri']},
 {n:'Saudi Arabia',a:75,m:75,d:74,c:'#166534',s:['Salem Al-Dawsari']},
 {n:'Japan',a:80,m:81,d:79,c:'#1e40af',s:['Takefusa Kubo','Kaoru Mitoma']},
 {n:'South Korea',a:81,m:79,d:78,c:'#dc2626',s:['Son Heung-min','Lee Kang-in']},
 {n:'USA',a:79,m:78,d:77,c:'#1e3a8a',s:['Christian Pulisic','Weston McKennie']},
 {n:'Mexico',a:78,m:77,d:76,c:'#15803d',s:['Santiago Gimenez','Edson Alvarez']},
 {n:'Croatia',a:81,m:85,d:80,c:'#dc2626',s:['Luka Modric','Josko Gvardiol']},
 {n:'Uruguay',a:82,m:82,d:81,c:'#7dd3fc',s:['Federico Valverde','Darwin Nunez']}
];

const LEAGUES = {
 'Egyptian Premier League':[
  {n:'Al Ahly',a:78,m:77,d:76,c:'#dc2626',s:['Wessam Abou Ali','Emam Ashour']},
  {n:'Zamalek',a:76,m:75,d:74,c:'#f3f4f6',s:['Ahmed Sayed Zizo','Mahmoud Hamada']},
  {n:'Pyramids',a:77,m:76,d:75,c:'#38bdf8',s:['Fiston Mayele','Ramadan Sobhi']},
  {n:'Al Masry',a:70,m:70,d:69,c:'#16a34a',s:[]},
  {n:'Ismaily',a:69,m:69,d:68,c:'#facc15',s:[]},
  {n:'Future FC',a:70,m:70,d:69,c:'#6366f1',s:[]},
  {n:'Enppi',a:68,m:68,d:68,c:'#f97316',s:[]},
  {n:'Ceramica Cleopatra',a:69,m:69,d:68,c:'#a855f7',s:[]}
 ],
 'English League':[
  {n:'Manchester Blue',a:90,m:90,d:87,c:'#7dd3fc',s:['Erling Haaland','Phil Foden']},
  {n:'Liverpool Reds',a:89,m:88,d:87,c:'#dc2626',s:['Mohamed Salah','Virgil van Dijk']},
  {n:'London Gunners',a:88,m:88,d:88,c:'#ef4444',s:['Bukayo Saka','Declan Rice']},
  {n:'Manchester Red',a:84,m:83,d:81,c:'#b91c1c',s:['Bruno Fernandes']},
  {n:'Chelsea Blues',a:84,m:84,d:82,c:'#1d4ed8',s:['Cole Palmer']}
 ],
 'Spanish League':[
  {n:'Madrid Whites',a:93,m:91,d:88,c:'#f3f4f6',s:['Khaled El Kady','Vinicius Junior','Jude Bellingham','Kylian Mbappe'],custom:{name:'Khaled El Kady',num:19,photo:'khaled.png'}},
  {n:'Barcelona Blaugrana',a:90,m:89,d:85,c:'#1e40af',s:['Lamine Yamal','Robert Lewandowski','Raphinha']},
  {n:'Madrid Atletico',a:85,m:85,d:87,c:'#dc2626',s:['Antoine Griezmann']},
  {n:'Sevilla',a:78,m:77,d:76,c:'#f3f4f6',s:[]}
 ],
 'Italian League':[
  {n:'Milan Rossoneri',a:84,m:83,d:82,c:'#dc2626',s:['Rafael Leao']},
  {n:'Inter Nerazzurri',a:86,m:85,d:86,c:'#1e3a8a',s:['Lautaro Martinez']},
  {n:'Turin Zebras',a:82,m:82,d:82,c:'#e5e7eb',s:[]},
  {n:'Napoli',a:82,m:81,d:80,c:'#38bdf8',s:[]}
 ],
 'German League':[
  {n:'Munich Bavaria',a:90,m:88,d:86,c:'#dc2626',s:['Harry Kane','Jamal Musiala']},
  {n:'Leverkusen',a:86,m:86,d:84,c:'#b91c1c',s:['Florian Wirtz']},
  {n:'Dortmund Yellows',a:83,m:82,d:80,c:'#facc15',s:[]}
 ],
 'French League':[
  {n:'Paris Saints',a:88,m:86,d:83,c:'#1e3a8a',s:['Ousmane Dembele','Achraf Hakimi']},
  {n:'Marseille',a:79,m:78,d:77,c:'#38bdf8',s:[]},
  {n:'Monaco',a:79,m:78,d:77,c:'#dc2626',s:[]}
 ],
 'Saudi League':[
  {n:'Riyadh Blue',a:82,m:80,d:78,c:'#1d4ed8',s:[]},
  {n:'Riyadh Yellow',a:84,m:81,d:79,c:'#facc15',s:['Cristiano Ronaldo']},
  {n:'Jeddah Union',a:80,m:79,d:77,c:'#facc15',s:['Karim Benzema']}
 ]
};

const ALL_CLUBS = [];
for (const lg in LEAGUES) LEAGUES[lg].forEach(t => ALL_CLUBS.push(Object.assign({league:lg}, t)));

function teamsOfType(type){ return type === 'nat' ? NATIONS : ALL_CLUBS; }
