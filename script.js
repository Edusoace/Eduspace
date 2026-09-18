const form = document.querySelector("#content-form");
const grid = document.querySelector("#content-grid");
const count = document.querySelector("#content-count");
const typeFilterButtons = document.querySelectorAll("[data-type-filter]");
const subjectFilterButtons = document.querySelectorAll("[data-subject-filter]");
const languageButtons = document.querySelectorAll("[data-language]");
const themeToggle = document.querySelector("#theme-toggle");
const adminDialog = document.querySelector("#admin-dialog");
const adminToggle = document.querySelector("#admin-toggle");
const adminClose = document.querySelector("#admin-close");
const adminLoginForm = document.querySelector("#admin-login-form");
const adminPassword = document.querySelector("#admin-password");
const adminError = document.querySelector("#admin-error");
const adminLoginView = document.querySelector("#admin-login-view");
const adminFormView = document.querySelector("#admin-form-view");
const contentSyncStatus = document.querySelector("#content-sync-status");
const articleDialog = document.querySelector("#article-dialog");
const articleClose = document.querySelector("#article-close");
const articleDialogTitle = document.querySelector("#article-dialog-title");
const articleDialogMeta = document.querySelector("#article-dialog-meta");
const articleDialogContent = document.querySelector("#article-dialog-content");
const quizDialog = document.querySelector("#quiz-dialog");
const quizClose = document.querySelector("#quiz-close");
const quizDialogTitle = document.querySelector("#quiz-dialog-title");
const quizDialogMeta = document.querySelector("#quiz-dialog-meta");
const quizForm = document.querySelector("#quiz-form");
const quizQuestions = document.querySelector("#quiz-questions");
const quizTimer = document.querySelector("#quiz-timer");
const quizStatus = document.querySelector("#quiz-status");
const quizSubmit = document.querySelector("#quiz-submit");

const contentStorageKey = "eduspace-content";
const supabaseConfig = window.EDUSPACE_SUPABASE || {};
const supabaseTable = "resources";
const resourceRefreshMs = 10000;
const languageStorageKey = "eduspace-language";
const themeStorageKey = "eduspace-theme";
const quizDurations = { math: 30 * 60, history: 25 * 60, georgian: 25 * 60, english: 25 * 60 };
let quizTimerId = null;
let activeQuiz = null;
const typeLabels = {
	video: { ge: "📹 ვიდეო", en: "📹 Video", action: { ge: "ნახვა", en: "Watch" } },
	article: { ge: "📝 სტატია", en: "📝 Article", action: { ge: "წაკითხვა", en: "Read" } },
	podcast: { ge: "🎙️ პოდკასტი", en: "🎙️ Podcast", action: { ge: "მოსმენა", en: "Listen" } }
};
const subjectLabels = {
	math: { ge: "მათემატიკა", en: "Math" },
	history: { ge: "ისტორია", en: "History" },
	georgian: { ge: "ქართული", en: "Georgian" },
	english: { ge: "ინგლისური", en: "English" }
};
const quizContent = {
	math: {
		ge: [
			{ question: "1,200 ლარიდან 35% დაიხარჯა, დარჩენილი თანხიდან კი 25%. რამდენი ლარი დარჩა?", options: ["585", "630", "650", "780"], answer: 0, explanation: "1,200×0.35=420; დარჩა 780. შემდეგ 780×0.25=195; 780−195=585. სწორი პასუხია A." },
			{ question: "რომელი m-ისთვის აქვს x²−2(m+1)x+m²+4=0-ს ორმაგი ფესვი?", options: ["0", "3/2", "2", "−1"], answer: 1, explanation: "ორმაგი ფესვისთვის D=0: 4(m+1)²−4(m²+4)=0, აქედან 8m−12=0 და m=3/2. ასევე x=m+1=5/2." },
			{ question: "მართკუთხა სამკუთხედში ჰიპოტენუზაზე სიმაღლე მას 4 და 9 სმ მონაკვეთებად ყოფს. ფართობი?", options: ["26", "39", "52", "78"], answer: 1, explanation: "ჰიპოტენუზა 13-ია. კათეტების კვადრატებია 13×4 და 13×9, ამიტომ ab=78. S=ab/2=39 სმ²." },
			{ question: "f(x)=x²−6x+5-ის ნულები და წვეროა:", options: ["1,5; (3,−4)", "−1,−5; (−3,4)", "1,5; (−3,−4)", "−1,5; (3,4)"], answer: 0, explanation: "ფაქტორიზაციაა (x−1)(x−5), ხოლო წვეროს x=−b/2a=3 და f(3)=−4. ამიტომ A." },
			{ question: "გვერდებია 7, 8 და 9 სმ. ჰერონის ფორმულით ფართობი და ტიპი?", options: ["26.8 სმ²; მახვილი", "26.8 სმ²; ბლაგვი", "28 სმ²; მართკუთხა", "24 სმ²; მახვილი"], answer: 0, explanation: "p=12; S=√(12×5×4×3)=√720≈26.8. რადგან 9²<7²+8², სამკუთხედი მახვილია." }
		],
		en: [
			{ question: "A school spends 35% of 1,200 lari, then 25% of the remainder. How much is left?", options: ["585", "630", "650", "780"], answer: 0, explanation: "1,200×0.35=420, leaving 780. Then 780×0.25=195, so 780−195=585. A is correct." },
			{ question: "For which m does x²−2(m+1)x+m²+4=0 have a repeated root?", options: ["0", "3/2", "2", "−1"], answer: 1, explanation: "Set D=0: 4(m+1)²−4(m²+4)=0, hence 8m−12=0 and m=3/2. The root is m+1=5/2." },
			{ question: "An altitude divides a right triangle's hypotenuse into 4 cm and 9 cm. What is its area?", options: ["26", "39", "52", "78"], answer: 1, explanation: "The hypotenuse is 13. The leg squares are 13×4 and 13×9, so ab=78. Area=ab/2=39 cm²." },
			{ question: "For f(x)=x²−6x+5, which gives the roots and vertex?", options: ["1,5; (3,−4)", "−1,−5; (−3,4)", "1,5; (−3,−4)", "−1,5; (3,4)"], answer: 0, explanation: "Factor as (x−1)(x−5). The vertex has x=−b/2a=3 and f(3)=−4, so A." },
			{ question: "A triangle has sides 7, 8 and 9 cm. Find its area and classify it.", options: ["26.8 cm²; acute", "26.8 cm²; obtuse", "28 cm²; right", "24 cm²; acute"], answer: 0, explanation: "Heron gives √(12×5×4×3)=√720≈26.8. Since 9²<7²+8², it is acute." }
		]
	},
	history: {
		ge: [
			{ question: "წყარო: დამოუკიდებლობის აქტი 1918 წლის 26 მაისს გამოცხადდა. რომელი ვითარება იყო უშუალო წინაპირობა?", options: ["რუსეთის იმპერიისა და ამიერკავკასიის ფედერაციის დაშლა", "ბიზანტიის დაცემა", "ოსმალეთის აღდგენა", "ერთა ლიგის გაუქმება"], answer: 0, explanation: "1917 წლის რევოლუციებმა რუსეთი დაასუსტა; ფედერაციის დაშლის შემდეგ საქართველომ 26 მაისს დამოუკიდებლობა გამოაცხადა. A არის ქრონოლოგიურად და მიზეზობრივად სწორი." },
			{ question: "წყარო: მემატიანე დიდგორზე წერს „მცირეთა ლაშქრითა“ გამარჯვებას. რომელი შედეგი მოჰყვა ყველაზე პირდაპირ?", options: ["თბილისის გათავისუფლება 1122 წელს", "ანექსია 1801 წელს", "ბაგრატ III-ის გამეფება", "თამარის კორონაცია"], answer: 0, explanation: "1121 წლის დიდგორის გამარჯვებამ სელჩუკთა ძალა შეასუსტა და 1122 წელს თბილისის გათავისუფლება შესაძლებელი გახადა. დანარჩენი მოვლენები სხვა საუკუნეებს ეკუთვნის." },
			{ question: "წყარო: ვერსალის შემდეგ გერმანიას დაეკისრა რეპარაციები და სამხედრო შეზღუდვები. რა შეუწყო ამან ხელი?", options: ["უკმაყოფილებამ და ეკონომიკურმა კრიზისმა ნაციზმის გაძლიერებას", "დემოკრატიის მდგრადობამ", "კოლონიების გაფართოებამ", "მონარქიის აღდგენამ"], answer: 0, explanation: "შეზღუდვებმა კრიზისი და უკმაყოფილება გააღრმავა; ნაცისტურმა პროპაგანდამ ეს განწყობა გამოიყენა. ამიტომ A გამოხატავს მიზეზ-შედეგს." },
			{ question: "წყარო: 1921 წლის კონსტიტუციამ ქალებს ხმის მიცემის უფლება მისცა. რა დასკვნაა მართებული?", options: ["რესპუბლიკა მოქალაქეობრივ თანასწორობას იცავდა", "დოკუმენტი მხოლოდ მეფის უფლებებს აღწერდა", "ქალებს არჩევნები აეკრძალათ", "კონსტიტუცია ოკუპაციის შემდეგ შეიქმნა"], answer: 0, explanation: "ქალთა საარჩევნო უფლება პოლიტიკური თანასწორობის ინსტიტუციური დაცვის მტკიცებულებაა. კონსტიტუცია ოკუპაციამდე მიიღეს, ამიტომ A." },
			{ question: "დაალაგეთ: დიდგორი, I მსოფლიო ომი, დამოუკიდებლობა, ოკუპაცია.", options: ["დიდგორი → I მსოფლიო ომი → დამოუკიდებლობა → ოკუპაცია", "I მსოფლიო ომი → დიდგორი → დამოუკიდებლობა → ოკუპაცია", "დამოუკიდებლობა → დიდგორი → ოკუპაცია → I მსოფლიო ომი", "დიდგორი → დამოუკიდებლობა → I მსოფლიო ომი → ოკუპაცია"], answer: 0, explanation: "თარიღებია 1121, 1914, 1918 და 1921. ამ ქრონოლოგიას შეესაბამება A." }
		],
		en: [
			{ question: "Source: Georgia's Act of Independence was proclaimed on 26 May 1918. What immediately preceded it?", options: ["The collapse of Russia and the Transcaucasian federation", "The fall of Byzantium", "The restoration of the Ottoman Empire", "The abolition of the League of Nations"], answer: 0, explanation: "The 1917 revolutions weakened Russia; after the federation dissolved, Georgia declared independence. A gives the direct context." },
			{ question: "Source: A chronicler describes David the Builder's victory at Didgori with a “small army”. What followed most directly?", options: ["The liberation of Tbilisi in 1122", "The annexation of 1801", "Bagrat III's accession", "Tamar's coronation"], answer: 0, explanation: "The 1121 victory weakened Seljuk power and enabled Tbilisi's liberation in 1122. The other events belong to different periods." },
			{ question: "Source: Versailles imposed reparations and military restrictions on Germany. What did this help cause?", options: ["Resentment and economic crisis that aided Nazism", "A stable democracy", "Colonial expansion", "Restored monarchies"], answer: 0, explanation: "The terms deepened crisis and resentment, which Nazi propaganda exploited. A is the supported cause-and-effect conclusion." },
			{ question: "Source: The 1921 Constitution gave women the vote. What is the valid conclusion?", options: ["The republic sought institutional civic equality", "It described only royal powers", "It banned women from elections", "It was written after occupation"], answer: 0, explanation: "Women's suffrage is evidence of political equality, and the constitution predates occupation. Therefore A." },
			{ question: "Put these in order: Didgori, the First World War, Georgian independence, occupation.", options: ["Didgori → First World War → independence → occupation", "First World War → Didgori → independence → occupation", "Independence → Didgori → occupation → First World War", "Didgori → independence → First World War → occupation"], answer: 0, explanation: "The dates are 1121, 1914, 1918 and 1921. This sequence is A." }
		]
	},
	georgian: {
		ge: [
			{ question: "წაიკითხეთ: „მოძრაობა და მხოლოდ მოძრაობა არის, გეთაყვა, ქვეყნის ღონე და სიცოცხლე!“ ავტორის მიზანია:", options: ["უმოქმედობის კრიტიკა და პროგრესისკენ მოწოდება", "მხოლოდ ბუნების აღწერა", "წარსულის იდეალიზება", "მოგზაურობის წესების ახსნა"], answer: 0, explanation: "მოძრაობა აქ პირდაპირი გადაადგილება კი არა, საზოგადოებრივი განვითარებაა. მოწოდება ეწინააღმდეგება უმოქმედობას, ამიტომ A." },
			{ question: "„თერგი“ ილიას ტექსტში შეიძლება წავიკითხოთ როგორც მეტაფორა:", options: ["მებრძოლი, მოძრავი ეროვნული ენერგიის", "უძრავი წარსულის", "სიჩუმისა და დავიწყების", "მხოლოდ გეოგრაფიული საზღვრის"], answer: 0, explanation: "მდინარე მუდმივად მოძრაობს და ავტორი მას პროგრესთან აკავშირებს; ამით ბუნების სახე იდეის მეტაფორად იქცევა. A არის ყველაზე სრული ინტერპრეტაცია." },
			{ question: "რომელ წინადადებაშია მძიმე გამოყენებული სწორად?", options: ["მოსწავლემ, რომელმაც ტექსტი წაიკითხა, დასკვნა დაწერა.", "მოსწავლემ რომელმაც ტექსტი წაიკითხა დასკვნა დაწერა.", "მოსწავლემ რომელმაც, ტექსტი წაიკითხა, დასკვნა დაწერა.", "მოსწავლემ, რომელმაც ტექსტი წაიკითხა დასკვნა, დაწერა."], answer: 0, explanation: "მიმართებითი დამოკიდებული წინადადება „რომელმაც ტექსტი წაიკითხა“ მთავარ წინადადებაში ჩასმული განმარტებაა და ორივე მხრიდან გამოიყოფა მძიმით. A." },
			{ question: "„სჯობს სიცოცხლესა ნაზრახსა სიკვდილი სახელოვანი!“ რომელი მხატვრული ხერხი აძლიერებს აზრს?", options: ["ანტითეზა და პარადოქსული დაპირისპირება", "ონომატოპეა", "ჰიპერბოლა საგნის აღწერის გარეშე", "ალიტერაცია בלבד"], answer: 0, explanation: "სიცოცხლე და სიკვდილი, როგორც საპირისპირო ცნებები, ერთმანეთს უპირისპირდება; პარადოქსი აჩვენებს ღირსების უპირატესობას. A." },
			{ question: "ქართულ ზმნაში „მისწერა“ რომელი პირებია გამოხატული?", options: ["მან — მას — ის", "მე — შენ", "ის — მხოლოდ", "ჩვენ — თქვენ — ისინი"], answer: 0, explanation: "„მისწერა“ სამპირიანი ზმნაა: მოქმედი სუბიექტი „მან“, ირიბი ობიექტი „მას“ და პირდაპირი ობიექტი „ის“. სწორი პასუხია A." }
		],
		en: [
			{ question: "Read: “Movement, and movement alone, is the strength and life of a country.” The author's purpose is to:", options: ["Criticize passivity and call for progress", "Describe nature only", "Idealize the past", "Explain travel rules"], answer: 0, explanation: "Movement means social development rather than mere travel. The statement rejects passivity and calls for progress, so A is correct." },
			{ question: "In Ilia's text, the Terg can be read as a metaphor for:", options: ["Fighting, dynamic national energy", "An immobile past", "Silence and forgetfulness", "Only a geographical border"], answer: 0, explanation: "The river's constant movement is connected with progress, turning a natural image into an idea. A is the complete interpretation." },
			{ question: "Which Georgian sentence uses commas correctly?", options: ["მოსწავლემ, რომელმაც ტექსტი წაიკითხა, დასკვნა დაწერა.", "მოსწავლემ რომელმაც ტექსტი წაიკითხა დასკვნა დაწერა.", "მოსწავლემ რომელმაც, ტექსტი წაიკითხა, დასკვნა დაწერა.", "მოსწავლემ, რომელმაც ტექსტი წაიკითხა დასკვნა, დაწერა."], answer: 0, explanation: "The inserted relative clause is separated on both sides by commas. A correctly marks its boundaries." },
			{ question: "In “Death with honour is better than a dishonourable life,” which device strengthens the idea?", options: ["Antithesis and paradoxical contrast", "Onomatopoeia", "Hyperbole without description", "Alliteration alone"], answer: 0, explanation: "Life and death are contrasted as opposites; the paradox emphasizes the priority of dignity. A is correct." },
			{ question: "What grammatical persons are expressed by the Georgian verb “მისწერა” (he/she wrote it to him/her)?", options: ["He/she — to him/her — it", "I — you", "He/she only", "We — you — they"], answer: 0, explanation: "The verb is three-person: a subject, an indirect object, and a direct object. Therefore A." }
		]
	},
	english: {
		ge: [
			{ question: "Read: “When the town library opened a repair workshop, attendance initially fell. Six months later, however, the workshop had attracted readers who had never borrowed a book.” What is the main idea?", options: ["A new service eventually broadened the library's audience", "The library closed after six months", "Readers stopped using the workshop", "Repairing books is impossible"], answer: 0, explanation: "The contrast between the initial fall and later growth shows delayed success and a broader audience. A best summarizes the whole passage." },
			{ question: "In the passage, “initially” is closest in meaning to:", options: ["at first", "finally", "unexpectedly", "rarely"], answer: 0, explanation: "Initially refers to the beginning of a period. The later sentence creates a time contrast, so “at first” is A." },
			{ question: "Choose the correct completion: If the committee ___ the evidence earlier, it would have changed the recommendation.", options: ["had examined", "examines", "would examine", "has examined"], answer: 0, explanation: "This is a third conditional: if + past perfect, would have + past participle. Therefore “had examined” is correct." },
			{ question: "Transform without changing meaning: “People believe that the archive is secure.”", options: ["The archive is believed to be secure.", "The archive believed people to be secure.", "The archive was believing secure.", "People are believed the archive."], answer: 0, explanation: "The reporting passive uses subject + is believed + to-infinitive. “The archive is believed to be secure” preserves the meaning." },
			{ question: "Complete the sentence: The project was delayed; ___, the final report was submitted on time.", options: ["nevertheless", "because", "in addition", "for example"], answer: 0, explanation: "The second clause contrasts with the delay, so the contrast linker “nevertheless” is required. A is correct." }
		],
		en: [
			{ question: "Read: “When the town library opened a repair workshop, attendance initially fell. Six months later, however, the workshop had attracted readers who had never borrowed a book.” What is the main idea?", options: ["A new service eventually broadened the library's audience", "The library closed after six months", "Readers stopped using the workshop", "Repairing books is impossible"], answer: 0, explanation: "The contrast between the initial fall and later growth shows delayed success and a broader audience. A best summarizes the passage." },
			{ question: "In the passage, “initially” is closest in meaning to:", options: ["at first", "finally", "unexpectedly", "rarely"], answer: 0, explanation: "Initially refers to the beginning of a period. The later sentence creates a time contrast, so “at first” is A." },
			{ question: "Choose the correct completion: If the committee ___ the evidence earlier, it would have changed the recommendation.", options: ["had examined", "examines", "would examine", "has examined"], answer: 0, explanation: "This is a third conditional: if + past perfect, would have + past participle. Therefore “had examined” is correct." },
			{ question: "Transform without changing meaning: “People believe that the archive is secure.”", options: ["The archive is believed to be secure.", "The archive believed people to be secure.", "The archive was believing secure.", "People are believed the archive."], answer: 0, explanation: "The reporting passive uses subject + is believed + to-infinitive. “The archive is believed to be secure” preserves the meaning." },
			{ question: "Complete the sentence: The project was delayed; ___, the final report was submitted on time.", options: ["nevertheless", "because", "in addition", "for example"], answer: 0, explanation: "The second clause contrasts with the delay, so the contrast linker “nevertheless” is required. A is correct." }
		]
	}
};
const translations = {
	ge: {
		title: "EduSpace 🚀",
		subtitle: "ისწავლე შეზღუდვების გარეშე, მსოფლიოს ნებისმიერი წერტილიდან",
		addHeading: "ახალი რესურსის დამატება",
		libraryHeading: "გაიღრმავე შენი ცოდნა",
		labels: ["სათაური", "ტიპი", "საგანი", "აღწერა ან ბმული"],
		placeholders: ["მაგ. ალგებრის საფუძვლები", "მოკლე აღწერა ან სასარგებლო ბმული"],
		add: "დამატება", count: "რესურსი", themeLight: "ღია თემის ჩართვა", themeDark: "მუქი თემის ჩართვა",
		filters: { all: "ყველა", video: "📹 ვიდეოები", article: "📝 სტატიები", podcast: "🎙️ პოდკასტები" },
		subjectFilters: { all: "ყველა", math: "მათემატიკა", history: "ისტორია", georgian: "ქართული", english: "ინგლისური" },
		admin: "⌘ Admin", adminTitle: "Admin panel", adminDescription: "შეიყვანე ადმინისტრატორის კოდი რესურსის დასამატებლად.", adminPassword: "ადმინისტრატორის კოდი", adminLogin: "შესვლა", adminError: "კოდი არასწორია.", close: "დახურვა"
	},
	en: {
		title: "EduSpace 🚀",
		subtitle: "Learn without limits, from anywhere in the world",
		addHeading: "Add a new resource",
		libraryHeading: "Discover new knowledge",
		labels: ["Title", "Type", "Subject", "Description or link"],
		placeholders: ["e.g. The foundations of algebra", "A short description or useful link"],
		add: "Add resource", count: "resources", themeLight: "Switch to light theme", themeDark: "Switch to dark theme",
		filters: { all: "All", video: "📹 Videos", article: "📝 Articles", podcast: "🎙️ Podcasts" },
		subjectFilters: { all: "All", math: "Math", history: "History", georgian: "Georgian", english: "English" },
		admin: "⌘ Admin", adminTitle: "Admin panel", adminDescription: "Enter the admin code to add a new resource.", adminPassword: "Admin code", adminLogin: "Log in", adminError: "Incorrect code.", close: "Close"
	}
};
const starterContent = [
	{ id: "math-quadratics", type: "article", subject: "math", title: "1. მათემატიკა: კვადრატული განტოლებები, დისკრიმინანტი და ვიეტას თეორემა", description: "სრული გზამკვლევი კვადრატული სამწევრის თვისებებზე, ფესვების პოვნასა და ვიეტას თეორემის სწრაფ ტრიკებზე ეროვნული გამოცდებისთვის.", fullContent: `<h3>1. კვადრატული განტოლების ზოგადი სახე</h3><p>კვადრატული ეწოდება განტოლებას: <b>ax² + bx + c = 0</b> (სადაც a ≠ 0).</p><h3>2. დისკრიმინანტის (D) ანალიზი</h3><p>ფორმულა: <b>D = b² - 4ac</b></p><ul><li><b>D &gt; 0:</b> განტოლებას აქვს 2 განსხვავებული ნამდვილი ფესვი: x₁,₂ = (-b ± √D) / 2a</li><li><b>D = 0:</b> განტოლებას აქვს 1 გაორმაგებული ფესვი: x = -b / 2a</li><li><b>D &lt; 0:</b> განტოლებას ნამდვილ რიცხვთა სიმრავლეში ფესვები არ აქვს.</li></ul><h3>3. ვიეტას თეორემა</h3><p>როცა a = 1, განტოლება იღებს სახეს: <b>x² + px + q = 0</b></p><ul><li><b>x₁ + x₂ = -p</b></li><li><b>x₁ · x₂ = q</b></li></ul><p><i>რჩევა ტესტებისთვის:</i> თუ კოეფიციენტების ჯამი a + b + c = 0, მაშინ ერთი ფესვი ყოველთვის x₁ = 1, ხოლო მეორე x₂ = c/a.</p>` },
	{ id: "math-geometry", type: "article", subject: "math", title: "2. მათემატიკა: გეომეტრიის ძირითადი თეორემები და ფართობის ფორმულები", description: "სამკუთხედების, ოთხკუთხედებისა და წრეწირის უმნიშვნელოვანესი ფორმულების კრებული.", fullContent: `<h3>1. მართკუთხა სამკუთხედი</h3><p><b>პითაგორას თეორემა:</b> c² = a² + b²</p><p><b>ფართობი:</b> S = (a · b) / 2</p><p><b>30°-იანი კუთხის თვისება:</b> 30°-იანი კუთხის მოპირდაპირე კათეტი ჰიპოტენუზის ნახევარია (a = c / 2).</p><h3>2. ნებისმიერი სამკუთხედის ფართობის ფორმულები</h3><ul><li>S = (a · h_a) / 2</li><li>S = (a · b · sin γ) / 2</li><li><b>ჰერონის ფორმულა:</b> S = √(p(p-a)(p-b)(p-c)), სადაც p = (a+b+c)/2</li></ul><h3>3. წრეწირი და წრე</h3><p><b>წრეწირის სიგრძე:</b> L = 2πR</p><p><b>წრის ფართობი:</b> S = πR²</p>` },
	{ id: "history-silk-road", type: "article", subject: "history", title: "3. ისტორია: დიდი აბრეშუმის გზა და საქართველოს გეოპოლიტიკა", description: "სავაჭრო მარშრუტების დეტალური ანალიზი, კავკასიური დერეფანი და შავი ზღვის პორტების მნიშვნელობა.", fullContent: `<h3>1. აბრეშუმის გზის წარმოშობა და მასშტაბი</h3><p>დიდი აბრეშუმის გზა ჩამოყალიბდა ძვ.წ. II საუკუნეში ხანის დინასტიის ჩინეთში და აკავშირებდა აღმოსავლეთ აზიას ხმელთაშუაზღვისპირეთსა და ევროპასთან. მარშრუტის სიგრძე 8,000 კილომეტრს აღემატებოდა.</p><h3>2. საქართველოს ტრანზიტული ფუნქცია</h3><p>საქართველოზე გადიოდა ჩრდილოეთ კავკასიური და შავზღვისპირა შტოები.</p><ul><li><b>ფაზისი (ფოთი) და დიოსკურია (სოხუმი):</b> საზღვაო კვანძები, საიდანაც საქონელი ევროპაში იგზავნებოდა.</li><li><b>უფლისციხე და მცხეთა:</b> შიდა საქარავნო გზების გადაკვეთის წერტილები.</li></ul><h3>3. ეკონომიკური და კულტურული შედეგები</h3><p>ვაჭრობის გარდა, ამ გზით ვრცელდებოდა ტექნოლოგიები, რელიგიები და კულტურული იდეები. საქართველომ შეიძინა უმნიშვნელოვანესი სტრატეგიული ფუნქცია.</p>` },
	{ id: "history-unification", type: "article", subject: "history", title: "4. ისტორია: საქართველოს გაერთიანება (X-XI სს.) — ბაგრატ III-დან დავით აღმაშენებლამდე", description: "ერთიანი ქართული მონარქიის ჩამოყალიბების ეტაპები, შიდაფეოდალური ბრძოლები და საგამოცდო ქრონოლოგია.", fullContent: `<h3>1. ბაგრატ III — ერთიანი საქართველოს პირველი მეფე (975-1014)</h3><p>975 წელს გახდა ქართლის მმართველი, 978 წელს — აფხაზეთის მეფე, ხოლო 1008 წელს კახეთ-ჰერეთის შემოერთებით საფუძველი ჩაუყარა ერთიან ქართულ ფეოდალურ სახელმწიფოს.</p><h3>2. ბრძოლა ბიზანტიასთან და სელჩუკებთან</h3><ul><li><b>გიორგი I (1014-1027):</b> იბრძოდა ბიზანტიის იმპერატორ ბასილი II-ის წინააღმდეგ (შირიმნის ბრძოლა, 1021 წ.).</li><li><b>დიდი თურქობა (1080 წლიდან):</b> შემოსევებმა ქვეყანა დააზიანა და გიორგი II იძულებული გახდა ხარკი ეკისრა.</li></ul><h3>3. დავით IV აღმაშენებლის რეფორმები (1089-1125)</h3><ul><li><b>სამხედრო რეფორმა:</b> მუდმივი ჯარის შექმნა და ყივჩაყთა 40,000 ოჯახის ჩამოსახლება (1118 წ.).</li><li><b>საეკლესიო რეფორმა:</b> რუის-ურბნისის საეკლესიო კრება (1104 წ.).</li><li><b>დიდგორის ბრძოლა (1121 წლის 12 აგვისტო):</b> „ძლევაი საკვირველი“ და 1122 წელს თბილისის გათავისუფლება.</li></ul>` },
	{ id: "georgian-rustaveli", type: "article", subject: "georgian", title: "5. ქართული: 'ვეფხისტყაოსნის' პერსონაჟთა სისტემა და საგამოცდო თემები", description: "ტარიელის, ავთანდილისა და ფრიდონის შედარებითი ანალიზი, ანდერძის განხილვა და ესეს სტრუქტურა.", fullContent: `<h3>1. სამი რაინდის სიმბოლიკა და შედარება</h3><ul><li><b>ტარიელი:</b> გრძნობისა და ვნების განსახიერება. მისი ტრაგიზმი გამოხატავს უზომო სიყვარულსა და ტანჯვას.</li><li><b>ავთანდილი:</b> გონებისა და მოვალეობის განსახიერება, რომელიც აერთიანებს პატიოსნებას, სიბრძნესა და პრაგმატიზმს.</li><li><b>ფრიდონი:</b> მოქმედებისა და პრაქტიკულობის სიმბოლო, ერთგული მოკავშირე.</li></ul><h3>2. ავთანდილის ანდერძი — ძირითადი ციტატები</h3><blockquote>„სიცრუე და ორპირობა ავნებს ხორცსა, მერმე სულსა.“</blockquote><blockquote>„სჯობს სიცოცხლესა ნაზრახსა სიკვდილი სახელოვანი!“</blockquote><p>ანდერძში ავთანდილი ასაბუთებს, რომ მეგობრის დახმარება უფრო მაღალი მორალური მოვალეობაა.</p><h3>3. რჩევები საგამოცდო ესესთვის</h3><p>აუცილებელია ციტატის ზუსტი გამოყენება, პერსონაჟის მოტივაციის ხაზგასმა და თანამედროვეობასთან პარალელის გავლება.</p>` },
	{ id: "georgian-grammar", type: "article", subject: "georgian", title: "6. ქართული: ქართული ენის გრამატიკა — ზმნის პირები და დრო-სტადიები", description: "ზმნის სტრუქტურა, სუბიექტური და ობიექტური პირები, მწკრივები და ხშირად დაშვებული შეცდომები.", fullContent: `<h3>1. ზმნის პირიანობა</h3><p>ქართული ზმნა მრავალპირიანია. მასში ერთდროულად შეიძლება გამოხატული იყოს სუბიექტიც და ობიექტიც:</p><ul><li><b>ერთპირიანი:</b> მხოლოდ სუბიექტი აქვს (მაგ: <i>ვწერ</i>).</li><li><b>ორპირიანი:</b> სუბიექტი და ობიექტი (მაგ: <i>გიშენებ</i> — მე შენ).</li><li><b>სამპირიანი:</b> სუბიექტი, პირდაპირი და ირიბი ობიექტი (მაგ: <i>მისწერა</i> — მან მას ის).</li></ul><h3>2. მწკრივთა სისტემა</h3><p>მწკრივები ჯგუფდება სამ სერიაში: აწმყოს, წყვეტილისა და შედეგობითის ჯგუფები.</p><ul><li><b>I სერია:</b> აწმყო, უწყვეტელი, აწმყოს კავშირებითი და მომავალი.</li><li><b>II სერია:</b> წყვეტილი და II კავშირებითი.</li><li><b>III სერია:</b> I და II შედეგობითი.</li></ul><h3>3. ხშირი შეცდომები ტესტებში</h3><p>ყურადღება მიაქციეთ ზმნისძირს და ვნებითი და მოქმედებითი გვარის ფორმებს.</p>` },
	{ id: "english-conditionals", type: "article", subject: "english", title: "7. ინგლისური: Comprehensive Grammar Guide — Conditional Sentences (0, 1, 2, 3 & Mixed)", description: "პირობითი წინადადებების ყველა ტიპი, ფორმულები, გამონაკლისები და მაგალითები B2-C1 დონისთვის.", fullContent: `<h3>1. Zero Conditional</h3><p><b>Formula:</b> If + Present Simple, Present Simple</p><p><i>Example:</i> If you heat water to 100°C, it boils.</p><h3>2. First Conditional</h3><p><b>Formula:</b> If + Present Simple, Will + Verb</p><p><i>Example:</i> If I pass the national exams, I will study law at university.</p><h3>3. Second Conditional</h3><p><b>Formula:</b> If + Past Simple, Would + Verb</p><p><i>Example:</i> If I had more free time, I would learn a third language. Use <i>were</i> for all subjects: <i>If I were you...</i></p><h3>4. Third Conditional</h3><p><b>Formula:</b> If + Past Perfect, Would have + Past Participle</p><p><i>Example:</i> If I had studied harder, I would have gotten a higher score.</p><h3>5. Inversion Rules</h3><p>Instead of <i>“If you should need help...”</i> use <b>“Should you need help...”</b></p><p>Instead of <i>“If I had known...”</i> use <b>“Had I known...”</b></p>` },
	{ id: "english-essay", type: "article", subject: "english", title: "8. ინგლისური: Essay Structure & Argumentative Writing Guide", description: "ეროვნული გამოცდების ინგლისურის ესეს (120-150 სიტყვა) სტრუქტურა, სავალდებულო ფრაზები და კავშირები.", fullContent: `<h3>1. Standard 4-Paragraph Essay Structure</h3><ul><li><b>Paragraph 1: Introduction</b> — Paraphrase the topic and state your thesis.</li><li><b>Paragraph 2: Body 1</b> — First reason, explanation, and concrete example.</li><li><b>Paragraph 3: Body 2</b> — Counter-argument and explanation.</li><li><b>Paragraph 4: Conclusion</b> — Summarize main points and give a final thought.</li></ul><h3>2. Essential Linking Words</h3><p><b>Adding:</b> Furthermore, Moreover, In addition to this.</p><p><b>Contrasting:</b> However, On the other hand, Nevertheless.</p><p><b>Examples:</b> For instance, Particularly, To illustrate this.</p><p><b>Concluding:</b> To sum up, In conclusion.</p><h3>3. Golden Rules for Exam Success</h3><p>✔ Avoid contractions. Keep your word count between 120 and 150 words.</p>` },
	{ id: "georgian-davitiani", type: "article", subject: "georgian", title: "9. ქართული: 'დავითიანი' — დავით გურამიშვილის ტრაგიკული და სულიერი გზა", description: "ქართლის ჭირის ანალიზი, 'სწავლა მოსწავლეთა' და გურამიშვილის ავტობიოგრაფიული პოემის საგამოცდო საკითხები.", fullContent: `<h3>1. 'ქართლის ჭირი' — ისტორიული და მორალური ტრაგედია</h3><p>გურამიშვილი აღწერს XVIII საუკუნის პირველი ნახევრის საქართველოს მძიმე რეალობას: შინაფეოდალურ დაპირისპირებას, ლეკიანობასა და ოსმალო-ყიზილბაშთა შემოსევებს. ავტორი უბედურების მთავარ მიზეზად ზნეობრივ დაცემასა და ერთობის არარსებობას მიიჩნევს.</p><h3>2. 'სწავლა მოსწავლეთა' — განათლების იდეალი</h3><p>პოეტის მოწოდება ახალგაზრდობისადმი — ცოდნის მიღების აუცილებლობა:</p><blockquote>"ყმაწვილი უნდა სწავლობდეს საქმესა საცნობელსაო, ნუ მიჰყვება სიზარმაცეს, ნუ ეძებს საწოლსაო."</blockquote><p>გურამიშვილი ხაზს უსვამს, რომ ცოდნა არის ერთადერთი განძი, რომელსაც კაცი ვერც მტერი წაართმევს და ვერც წყალი წაიღებს.</p><h3>3. პოეტური ოსტატობა და 'სულხან-საბას' ტრადიციები</h3><p>პოემაში ოსტატურადაა შერწყმული ხალხური ლექსწყობა (შაირი) და ქრისტიანული მისტიციზმი. გურამიშვილის ხსნა უფლისადმი სასოებასა და სულიერ აღორძინებაშია.</p>` },
	{ id: "georgian-mgzavris-tserilebi", type: "article", subject: "georgian", title: "10. ქართული: ილია ჭავჭავაძის 'მგზავრის წერილები' — თაობათა დაპირისპირება", description: "მგზავრისა და ლელთ ღუნიას დიალოგი, 'მამათა და შვილთა' ბრძოლა და ეროვნული გამოღვიძების კონცეფცია.", fullContent: `<h3>1. 'მამათა და შვილთა' პრობლემა</h3><p>ნაწარმოებში მკვეთრად არის დასმული 60-იანი წლების ('შვილების') და ძველი თაობის ('მამების') იდეოლოგიური დაპირისპირება. ილია აკრიტიკებს უმოქმედობასა და წარსულის დიდებით ტკბობას.</p><h3>2. ლელთ ღუნიას სახე და მოხევეების ტრაგედია</h3><p>ლელთ ღუნია წარმოადგენს ხალხურ სიბრძნეს, თუმცა მისი ტრაგედია ჩაკეტილობასა და უიმედობაშია:</p><blockquote>"ჩვენი თაობა წავიდა, ახალს კი გზა არ უჩანს."</blockquote><p>მგზავრი (ილია) უპირისპირებს მას მოძრაობისა და პროგრესის იდეას: <i>"მოძრაობა და მხოლოდ მოძრაობა არის, გეთაყვა, ქვეყნის ღონე და სიცოცხლე!"</i></p><h3>3. თერგისა და ყაზბეგის სიმბოლიკა</h3><ul><li><b>თერგი:</b> ამბოხებული, მებრძოლი და მოძრავი ძალის სიმბოლო.</li><li><b>ყაზბეგი:</b> უძრავი, გაყინული და წარსულში ჩარჩენილი სიდიადე.</li></ul>` },
	{ id: "georgian-syntax", type: "article", subject: "georgian", title: "11. ქართული: ენათმეცნიერება — სინტაქსი და რთული წინადადებები", description: "თანწყობილი და დაქვემდებარებული რთული წინადადებები, სასვენი ნიშნების წესები საგამოცდო ტესტებისთვის.", fullContent: `<h3>1. რთული თანწყობილი წინადადება</h3><p>შედგება თანასწორუფლებიანი მარტივი წინადადებებისგან, რომლებიც უკავშირდებიან ერთმანეთს თანწყობითი კავშირებით (და, აგრეთვე, თორემ, ხოლო, მაგრამ, ან).</p><p><b>მძიმის წესი:</b> და კავშირის წინ მძიმე არ იწერება, ხოლო მაგრამ, ხოლო, თორემ კავშირების წინ მძიმე სავალდებულოა.</p><h3>2. რთული დაქვემდებარებული წინადადება</h3><p>შედგება მთავარი და დამოკიდებული წინადადებისგან. დამოკიდებული წინადადება განმარტავს მთავარის რომელიმე წევრს.</p><ul><li><b>მაქვემდებარებელი კავშირები:</b> რომ, თუ, რადგან, რათა, თუმცა.</li><li><b>მიმართებითი ნაცვალსახელები:</b> ვინც, რაც, რომელიც, სადაც.</li></ul><p><b>მძიმის წესი:</b> დამოკიდებული წინადადება მთავარისგან ყოველთვის გამოყოფილია მძიმით.</p>` },
	{ id: "english-passive-causative", type: "article", subject: "english", title: "12. ინგლისური: Advanced Grammar — Passive Voice & Causative Form", description: "ვნებითი გვარის ყველა დროის ფორმულა, ორმაგი ობიექტი და Have/Get something done სტრუქტურა.", fullContent: `<h3>1. Passive Voice Core Formula</h3><p><b>Structure:</b> Subject + Form of 'To Be' + Past Participle (V3)</p><ul><li>Present Simple: The report is written every week.</li><li>Past Simple: The contract was signed yesterday.</li><li>Present Perfect: The project has been completed.</li><li>Modals: The application must be submitted by Friday.</li></ul><h3>2. The Causative Form (Have/Get something done)</h3><p>Used when someone else performs a service for you.</p><p><b>Formula:</b> Subject + HAVE / GET + Object + Past Participle (V3)</p><ul><li><i>Active:</i> A mechanic repaired my car.</li><li><i>Causative:</i> I <b>had my car repaired</b> (by a mechanic).</li><li><i>Example:</i> She needs to <b>get her passport renewed</b>.</li></ul>` },
	{ id: "english-reading", type: "article", subject: "english", title: "13. ინგლისური: Reading Comprehension Techniques & Synonyms", description: "ტექსტის სწრაფი გააზრების (Skimming & Scanning) მეთოდები და ხშირად შეხვედრილი სინონიმები ტესტებში.", fullContent: `<h3>1. Skimming vs Scanning</h3><p><b>Skimming:</b> Reading quickly to get the general idea or gist of the paragraph without focusing on details.</p><p><b>Scanning:</b> Searching for specific information such as dates, names, statistics, and keywords.</p><h3>2. Frequent Exam Synonyms & Paraphrasing</h3><p>Exams never use the exact word from the question in the text. Look for synonyms:</p><ul><li><b>Important</b> → Crucial, Essential, Vital, Significant</li><li><b>Increase</b> → Rise, Surge, Escalate, Expand</li><li><b>Solve</b> → Resolve, Tackle, Address, Overcome</li><li><b>Ban</b> → Prohibit, Forbid, Restrict</li></ul>` },
	{ id: "math-trigonometry", type: "article", subject: "math", title: "14. მათემატიკა: ტრიგონომეტრიული ფუნქციები, იგივეობები და განტოლებები", description: "ძირითადი ტრიგონომეტრიული ფორმულები, ყოფადობის არე, პერიოდულობა და საგამოცდო ამოცანების ამოხსნის მეთოდები.", fullContent: `<h3>1. ძირითადი ტრიგონომეტრიული იგივეობა</h3><p><b>sin² α + cos² α = 1</b></p><p>აქედან გამომდინარე: sin² α = 1 - cos² α და cos² α = 1 - sin² α</p><p><b>tg α · ctg α = 1</b> (სადაც α ≠ πk/2)</p><h3>2. ორმაგი კუთხის ფორმულები</h3><ul><li><b>sin(2α) = 2 sin α · cos α</b></li><li><b>cos(2α) = cos² α - sin² α</b> = 2cos² α - 1 = 1 - 2sin² α</li><li><b>tg(2α) = (2 tg α) / (1 - tg² α)</b></li></ul><h3>3. ტრიგონომეტრიული განტოლებების ზოგადი ამონახსნები</h3><ul><li><b>sin x = a (|a| ≤ 1):</b> x = (-1)^k · arcsin(a) + πk, k ∈ Z</li><li><b>cos x = a (|a| ≤ 1):</b> x = ± arccos(a) + 2πk, k ∈ Z</li><li><b>tg x = a:</b> x = arctg(a) + πk, k ∈ Z</li></ul>` },
	{ id: "math-progressions", type: "article", subject: "math", title: "15. მათემატიკა: პროგრესიები — არითმეტიკული და გეომეტრიული", description: "n-ური წევრისა და პირველი n წევრის ჯამის ფორმულები, უსასრულოდ შემცირებადი გეომეტრიული პროგრესია.", fullContent: `<h3>1. არითმეტიკული პროგრესია</h3><p>მიმდევრობა, სადაც ყოველი მომდევნო წევრი წინა წევრზე ერთსა და იმავე d რიცხვით მეტია ან ნაკლებია.</p><p><b>n-ური წევრი:</b> a_n = a₁ + (n - 1)d</p><p><b>პირველი n წევრის ჯამი:</b> S_n = ((a₁ + a_n) / 2) · n ან S_n = ((2a₁ + (n - 1)d) / 2) · n</p><p><b>მთავარი თვისება:</b> a_n = (a_{n-1} + a_{n+1}) / 2</p><h3>2. გეომეტრიული პროგრესია</h3><p>მიმდევრობა, სადაც ყოველი მომდევნო წევრი მიიღება წინა წევრის ერთსა და იმავე <b>q</b> რიცხვზე გამრავლებით (q ≠ 0, q ≠ 1).</p><ul><li><b>n-ური წევრი:</b> b_n = b₁ · q^(n-1)</li><li><b>პირველი n წევრის ჯამი:</b> S_n = (b₁ · (q^n - 1)) / (q - 1)</li><li><b>უსასრულოდ შემცირებადი პროგრესიის ჯამი (|q| &lt; 1):</b> S = b₁ / (1 - q)</li></ul>` },
	{ id: "history-world-wars", type: "article", subject: "history", title: "16. ისტორია: პირველი და მეორე მსოფლიო ომები — მიზეზები და შედეგები", description: "სამხედრო ბლოკების ჩამოყალიბება, გარდამტეხი ბრძოლები, ვერსალის სისტემა და გაეროს შექმნა.", fullContent: `<h3>1. პირველი მსოფლიო ომი (1914-1918)</h3><p><b>ბლოკები:</b> ანტანტა (დიდი ბრიტანეთი, საფრანგეთი, რუსეთი) და სამთა/ოთხთა კავშირი (გერმანია, ავსტრია-უნგრეთი, ოსმალეთი, ბულგარეთი).</p><p><b>საბაბი:</b> 1914 წლის 28 ივნისს სარაევოში ავსტრიის ერცჰერცოგ ფრანც ფერდინანდის მკვლელობა.</p><p><b>შედეგი:</b> 1919 წლის ვერსალის ზავი, ოთხი იმპერიის დაშლა და ერთა ლიგის შექმნა.</p><h3>2. მეორე მსოფლიო ომი (1939-1945)</h3><p><b>დასაწყისი:</b> 1939 წლის 1 სექტემბერი — გერმანიის თავდასხმა პოლონეთზე.</p><p><b>გარდამტეხი ბრძოლები:</b></p><ul><li><b>სტალინგრადის ბრძოლა (1942-1943):</b> გარდატეხა აღმოსავლეთ ფრონტზე.</li><li><b>ელ-ალამეინის ბრძოლა (1942):</b> გარდატეხა ჩრდილოეთ აფრიკაში.</li><li><b>ნორმანდიის დესანტი — D-Day (1944 წლის 6 ივნისი):</b> მეორე ფრონტის გახსნა ევროპაში.</li></ul><p><b>დასასრული:</b> 1945 წლის 2 მაისი — ბერლინის დაცემა; 2 სექტემბერი — იაპონიის კაპიტულაცია. ომის შემდეგ შეიქმნა გაერო (UN).</p>` },
	{ id: "history-democratic-republic", type: "article", subject: "history", title: "17. ისტორია: საქართველოს დემოკრატიული რესპუბლიკა (1918-1921)", description: "დამოუკიდებლობის გამოცხადება, 1921 წლის კონსტიტუცია, საბჭოთა ოკუპაცია და მარო მაყაშვილის გმირობა.", fullContent: `<h3>1. დამოუკიდებლობის გამოცხადება და საგარეო პოლიტიკა</h3><p>1918 წლის 26 მაისს ნოე ჟორდანიამ გამოაცხადა საქართველოს დამოუკიდებლობა. 1920 წლის 7 მაისს საბჭოთა რუსეთმა ცნო საქართველოს დამოუკიდებლობა მოსკოვის ხელშეკრულებით, თუმცა პირობა მალევე დაარღვია.</p><h3>2. 1921 წლის 21 თებერვლის კონსტიტუცია</h3><p>დამფუძნებელმა კრებამ მიიღო იმ დროისთვის ევროპაში ერთ-ერთი ყველაზე პროგრესული კონსტიტუცია, რომელმაც უზრუნველყო ქალთა არჩევნებში მონაწილეობის უფლება, სიკვდილით დასჯის გაუქმება და უმცირესობათა უფლებები.</p><h3>3. საბჭოთა ოკუპაცია (1921 წლის თებერვალი-მარტი)</h3><p>1921 წლის 12 თებერვალს წითელი არმია შემოიჭრა საქართველოში. ტაბახმელა-კოჯრის მიდამოებში იუნკერებმა და მოხალისეებმა, მათ შორის მარო მაყაშვილმა, გმირული წინააღმდეგობა გაუწიეს.</p><p>25 თებერვალს წითელმა არმიამ აიღო თბილისი. მთავრობა იძულებული გახდა ემიგრაციაში წასულიყო და დაიწყო საბჭოთა ოკუპაცია.</p>` }
];

const starterVersionKey = "eduspace-starter-version";
const starterVersion = "4";
const storedResources = JSON.parse(localStorage.getItem(contentStorageKey) || "null");
const seedResources = starterContent.map((resource) => ({ ...resource, lang: resource.lang || "ge" }));
let resources = (localStorage.getItem(starterVersionKey) === starterVersion && storedResources?.some((resource) => resource.fullContent)
	? storedResources
	: seedResources).map((resource) => ({
	...resource,
	lang: resource.lang || (typeof resource.title === "object" && resource.title.en ? "en" : "ge")
}));
let resourceRefreshId = null;
let currentTypeFilter = "all";
let currentSubjectFilter = "all";
let currentLanguage = localStorage.getItem(languageStorageKey) === "en" ? "en" : "ge";
let currentTheme = localStorage.getItem(themeStorageKey) === "light" ? "light" : "dark";

function cacheResources() {
	localStorage.setItem(contentStorageKey, JSON.stringify(resources));
	localStorage.setItem(starterVersionKey, starterVersion);
}

function hasSupabaseConfig() {
	return Boolean(supabaseConfig.url && supabaseConfig.anonKey && !supabaseConfig.url.includes("YOUR_PROJECT_ID") && !supabaseConfig.anonKey.includes("YOUR_SUPABASE_ANON_KEY"));
}

function supabaseHeaders() {
	return { apikey: supabaseConfig.anonKey, Authorization: `Bearer ${supabaseConfig.anonKey}`, "Content-Type": "application/json" };
}

function mapResourceRow(row) {
	return {
		...row,
		id: row.id,
		title: row.title,
		description: row.description,
		fullContent: row.full_content || row.fullContent || "",
		link: row.link || "",
		lang: row.lang || "ge"
	};
}

async function loadResources({ silent = false } = {}) {
	if (!hasSupabaseConfig()) return;
	try {
		const response = await fetch(`${supabaseConfig.url}/rest/v1/${supabaseTable}?select=*&order=created_at.desc`, { headers: supabaseHeaders() });
		if (!response.ok) throw new Error(`Supabase returned ${response.status}`);
		const remoteResources = (await response.json()).map(mapResourceRow);
		if (remoteResources.length) {
			resources = remoteResources;
			cacheResources();
			renderCards();
		}
		if (!silent) contentSyncStatus.textContent = currentLanguage === "ge" ? "რესურსები სინქრონიზებულია." : "Resources synchronized.";
	} catch (error) {
		if (!silent) contentSyncStatus.textContent = currentLanguage === "ge" ? "სერვერთან დაკავშირება ვერ მოხერხდა; ნაჩვენებია შენახული რესურსები." : "Could not connect to the server; showing cached resources.";
		console.error("Unable to load resources from Supabase.", error);
	}
}

async function insertResource(resource) {
	const response = await fetch(`${supabaseConfig.url}/rest/v1/${supabaseTable}`, {
		method: "POST",
		headers: { ...supabaseHeaders(), Prefer: "return=representation" },
		body: JSON.stringify({ id: resource.id, type: resource.type, subject: resource.subject, title: resource.title, description: resource.description, full_content: resource.fullContent || null, link: resource.link || null, lang: resource.lang })
	});
	if (!response.ok) throw new Error(`Supabase returned ${response.status}`);
	return mapResourceRow((await response.json())[0]);
}

function startResourceRefresh() {
	if (!hasSupabaseConfig()) return;
	resourceRefreshId = window.setInterval(() => loadResources({ silent: true }), resourceRefreshMs);
}

function applyTranslations() {
	const translation = translations[currentLanguage];
	document.documentElement.lang = currentLanguage === "ge" ? "ka" : "en";
	document.title = `${translation.title} | ${currentLanguage === "ge" ? "სასწავლო ჰაბი" : "Learning Hub"}`;
	document.querySelector("#app-title").textContent = translation.title;
	document.querySelector("#app-subtitle").textContent = translation.subtitle;
	adminToggle.textContent = translation.admin;
	document.querySelector("#admin-dialog-title").textContent = translation.adminTitle;
	document.querySelector("#admin-description").textContent = translation.adminDescription;
	document.querySelector("#admin-password-label").textContent = translation.adminPassword;
	document.querySelector("#admin-login-button").textContent = translation.adminLogin;
	adminError.textContent = translation.adminError;
	adminClose.setAttribute("aria-label", translation.close);
	articleClose.setAttribute("aria-label", translation.close);
	document.querySelector("#add-heading").textContent = translation.addHeading;
	document.querySelector("#library-heading").textContent = translation.libraryHeading;
	document.querySelectorAll("#content-form label span").forEach((label, index) => { label.textContent = translation.labels[index]; });
	document.querySelector("#content-title").placeholder = translation.placeholders[0];
	document.querySelector("#content-description").placeholder = translation.placeholders[1];
	document.querySelector("#add-button").lastChild.textContent = ` ${translation.add}`;
	document.querySelector("#content-type").querySelectorAll("option").forEach((option) => { option.textContent = typeLabels[option.value][currentLanguage]; });
	document.querySelector("#content-subject").querySelectorAll("option").forEach((option) => { option.textContent = subjectLabels[option.value][currentLanguage]; });
	document.querySelector("#type-filter-group").setAttribute("aria-label", currentLanguage === "ge" ? "რესურსების ტიპის ფილტრი" : "Resource type filters");
	document.querySelector("#subject-filter-group").setAttribute("aria-label", currentLanguage === "ge" ? "საგნის ფილტრი" : "Subject filters");
	themeToggle.textContent = currentTheme === "dark" ? "☀️" : "🌙";
	themeToggle.setAttribute("aria-label", currentTheme === "dark" ? translation.themeLight : translation.themeDark);
	typeFilterButtons.forEach((button) => { button.textContent = translation.filters[button.dataset.typeFilter]; });
	subjectFilterButtons.forEach((button) => { button.textContent = translation.subjectFilters[button.dataset.subjectFilter]; });
	languageButtons.forEach((button) => { button.classList.toggle("active", button.dataset.language === currentLanguage); });
}

function createCard(resource) {
	const card = document.createElement("article");
	card.className = "resource-card";
	card.style.setProperty("--card-accent", { math: "#f59e0b", history: "#f97316", georgian: "#34d399", english: "#38bdf8" }[resource.subject]);
	const meta = document.createElement("div");
	meta.className = "card-meta";
	const typeBadge = document.createElement("span");
	typeBadge.className = "type-badge";
	typeBadge.textContent = typeLabels[resource.type][currentLanguage];
	const subjectBadge = document.createElement("span");
	subjectBadge.className = "subject-badge";
	subjectBadge.textContent = subjectLabels[resource.subject][currentLanguage];
	meta.append(typeBadge, subjectBadge);
	const title = document.createElement("h3");
	title.textContent = getLocalizedValue(resource.title);
	const description = document.createElement("p");
	description.textContent = getLocalizedValue(resource.description);
	const actions = document.createElement("div");
	actions.className = "card-actions";
	const theoryAction = document.createElement("button");
	theoryAction.className = "resource-action theory-action";
	theoryAction.textContent = currentLanguage === "ge" ? "თეორიის წაკითხვა ↗" : "Read theory ↗";
	theoryAction.type = "button";
	theoryAction.addEventListener("click", () => {
		if (resource.type === "article" || resource.fullContent) openArticle(resource);
		else if (resource.link) window.open(resource.link, "_blank", "noopener,noreferrer");
	});
	const practiceAction = document.createElement("button");
	practiceAction.className = "resource-action practice-action";
	practiceAction.textContent = currentLanguage === "ge" ? "სავარჯიშო / ტესტი" : "Practice / Quiz";
	practiceAction.type = "button";
	practiceAction.addEventListener("click", () => openQuiz(resource));
	actions.append(theoryAction, practiceAction);
	card.append(meta, title, description, actions);
	return card;
}

function getLocalizedValue(value) {
	return typeof value === "string" ? value : value[currentLanguage] || value.ge || Object.values(value)[0] || "";
}

function getResourceContent(value) {
	return getLocalizedValue(value);
}

function openArticle(resource) {
	articleDialogTitle.textContent = getLocalizedValue(resource.title);
	articleDialogMeta.textContent = `${typeLabels[resource.type][currentLanguage]} · ${subjectLabels[resource.subject][currentLanguage]}`;
	articleDialogContent.innerHTML = getResourceContent(resource.fullContent) || `<p>${getLocalizedValue(resource.description)}</p>`;
	articleDialog.showModal();
}

function getQuizCopy() {
	return currentLanguage === "ge"
		? { title: "საგამოცდო სავარჯიშო", meta: "ეროვნული გამოცდების ტიპის ტესტი", submit: "პასუხების შემოწმება", timeout: "დრო ამოიწურა. პასუხები ავტომატურად გაიგზავნა.", result: (score, total) => `შედეგი: ${score} / ${total}` }
		: { title: "Exam-style practice", meta: "National exam-style quiz", submit: "Check answers", timeout: "Time is up. Your answers were submitted automatically.", result: (score, total) => `Result: ${score} / ${total}` };
}

function formatTime(seconds) {
	return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

function renderQuizQuestions(questions) {
	quizQuestions.replaceChildren();
	questions.forEach((item, questionIndex) => {
		const fieldset = document.createElement("fieldset");
		fieldset.className = "quiz-question";
		const legend = document.createElement("legend");
		legend.textContent = `${questionIndex + 1}. ${item.question}`;
		fieldset.appendChild(legend);
		item.options.forEach((option, optionIndex) => {
			const label = document.createElement("label");
			label.className = "quiz-option";
			label.innerHTML = `<input type="radio" name="question-${questionIndex}" value="${optionIndex}"> <span>${option}</span>`;
			fieldset.appendChild(label);
		});
		const explanation = document.createElement("p");
		explanation.className = "quiz-explanation";
		explanation.hidden = true;
		explanation.textContent = item.explanation;
		fieldset.appendChild(explanation);
		quizQuestions.appendChild(fieldset);
	});
}

function stopQuizTimer() {
	if (quizTimerId) window.clearInterval(quizTimerId);
	quizTimerId = null;
}

function finishQuiz({ timedOut = false } = {}) {
	if (!activeQuiz) return;
	stopQuizTimer();
	let score = 0;
	activeQuiz.questions.forEach((question, index) => {
		const selected = quizForm.querySelector(`input[name="question-${index}"]:checked`);
		if (selected && Number(selected.value) === question.answer) score += 1;
	});
	quizQuestions.querySelectorAll(".quiz-explanation").forEach((explanation) => { explanation.hidden = false; });
	quizForm.querySelectorAll("input").forEach((input) => { input.disabled = true; });
	quizSubmit.disabled = true;
	quizStatus.hidden = false;
	quizStatus.classList.toggle("timeout", timedOut);
	quizStatus.textContent = timedOut ? `${getQuizCopy().timeout} ${getQuizCopy().result(score, activeQuiz.questions.length)}` : getQuizCopy().result(score, activeQuiz.questions.length);
}

function openQuiz(resource) {
	stopQuizTimer();
	const questions = quizContent[resource.subject]?.[currentLanguage] || quizContent.math[currentLanguage];
	activeQuiz = { resource, questions };
	const copy = getQuizCopy();
	quizDialogTitle.textContent = copy.title;
	quizDialogMeta.textContent = `${copy.meta} · ${subjectLabels[resource.subject][currentLanguage]}`;
	quizSubmit.textContent = copy.submit;
	quizStatus.hidden = true;
	quizStatus.classList.remove("timeout");
	quizTimer.classList.remove("warning");
	quizQuestions.replaceChildren();
	renderQuizQuestions(questions);
	quizForm.querySelectorAll("input").forEach((input) => { input.disabled = false; });
	quizSubmit.disabled = false;
	let remainingSeconds = quizDurations[resource.subject] || quizDurations.math;
	quizTimer.textContent = formatTime(remainingSeconds);
	quizTimerId = window.setInterval(() => {
		remainingSeconds -= 1;
		quizTimer.textContent = formatTime(Math.max(remainingSeconds, 0));
		if (remainingSeconds <= 60) quizTimer.classList.add("warning");
		if (remainingSeconds <= 0) finishQuiz({ timedOut: true });
	}, 1000);
	quizDialog.showModal();
}

function renderCards() {
	grid.replaceChildren();
	const visibleResources = resources.filter((resource) => {
		const matchesType = currentTypeFilter === "all" || resource.type === currentTypeFilter;
		const matchesSubject = currentSubjectFilter === "all" || resource.subject === currentSubjectFilter;
		return matchesType && matchesSubject;
	});
	visibleResources.forEach((resource) => grid.appendChild(createCard(resource)));
	count.textContent = `${visibleResources.length} ${translations[currentLanguage].count}`;
}

form.addEventListener("submit", async (event) => {
	event.preventDefault();
	const title = document.querySelector("#content-title").value.trim();
	const description = document.querySelector("#content-description").value.trim();
	if (!title || !description) return;
	const resource = {
		id: crypto.randomUUID(),
		lang: currentLanguage,
		type: document.querySelector("#content-type").value,
		subject: document.querySelector("#content-subject").value,
		title: { [currentLanguage]: title },
		description: { [currentLanguage]: description },
		link: description.startsWith("http") ? description : ""
	};
	const submitButton = document.querySelector("#add-button");
	submitButton.disabled = true;
	contentSyncStatus.textContent = currentLanguage === "ge" ? "იტვირთება..." : "Saving...";
	try {
		if (hasSupabaseConfig()) {
			const savedResource = await insertResource(resource);
			resources.unshift(savedResource);
			contentSyncStatus.textContent = currentLanguage === "ge" ? "რესურსი ყველასთვის გამოქვეყნდა." : "Resource published for everyone.";
		} else {
			resources.unshift(resource);
			contentSyncStatus.textContent = currentLanguage === "ge" ? "Supabase ჯერ არ არის კონფიგურირებული; რესურსი მხოლოდ ამ მოწყობილობაზე შეინახა." : "Supabase is not configured; resource was saved only on this device.";
		}
		cacheResources();
		renderCards();
		form.reset();
		lockAdminPanel();
		adminDialog.close();
	} catch (error) {
		contentSyncStatus.textContent = currentLanguage === "ge" ? "რესურსის შენახვა ვერ მოხერხდა." : "The resource could not be saved.";
		console.error("Unable to insert resource into Supabase.", error);
	} finally {
		submitButton.disabled = false;
	}
});

function lockAdminPanel() {
	adminLoginView.hidden = false;
	adminFormView.hidden = true;
	adminError.hidden = true;
	adminLoginForm.reset();
}

adminLoginForm.addEventListener("submit", (event) => {
	event.preventDefault();
	if (adminPassword.value !== "eduspace") {
		adminError.hidden = false;
		adminPassword.select();
		return;
	}
	adminLoginView.hidden = true;
	adminFormView.hidden = false;
	adminPassword.value = "";
	document.querySelector("#content-title").focus();
});

adminToggle.addEventListener("click", () => {
	lockAdminPanel();
	adminDialog.showModal();
});

adminClose.addEventListener("click", () => {
	lockAdminPanel();
	adminDialog.close();
});

adminDialog.addEventListener("click", (event) => {
	if (event.target === adminDialog) {
		lockAdminPanel();
		adminDialog.close();
	}
});

typeFilterButtons.forEach((button) => button.addEventListener("click", () => {
	currentTypeFilter = button.dataset.typeFilter;
	typeFilterButtons.forEach((filterButton) => filterButton.classList.toggle("active", filterButton === button));
	renderCards();
}));

subjectFilterButtons.forEach((button) => button.addEventListener("click", () => {
	currentSubjectFilter = button.dataset.subjectFilter;
	subjectFilterButtons.forEach((filterButton) => filterButton.classList.toggle("active", filterButton === button));
	renderCards();
}));

languageButtons.forEach((button) => button.addEventListener("click", () => {
	currentLanguage = button.dataset.language;
	localStorage.setItem(languageStorageKey, currentLanguage);
	applyTranslations();
	renderCards();
}));

themeToggle.addEventListener("click", () => {
	currentTheme = currentTheme === "dark" ? "light" : "dark";
	localStorage.setItem(themeStorageKey, currentTheme);
	document.body.classList.toggle("light-theme", currentTheme === "light");
	applyTranslations();
});

articleClose.addEventListener("click", () => articleDialog.close());

articleDialog.addEventListener("click", (event) => {
	if (event.target === articleDialog) articleDialog.close();
});

quizForm.addEventListener("submit", (event) => {
	event.preventDefault();
	finishQuiz();
});

quizClose.addEventListener("click", () => {
	stopQuizTimer();
	quizDialog.close();
});

quizDialog.addEventListener("click", (event) => {
	if (event.target === quizDialog) {
		stopQuizTimer();
		quizDialog.close();
	}
});

quizDialog.addEventListener("close", stopQuizTimer);

cacheResources();
document.body.classList.toggle("light-theme", currentTheme === "light");
applyTranslations();
renderCards();
loadResources();
startResourceRefresh();


// Admin Panel Logic
document.addEventListener('DOMContentLoaded', () => {
  const adminBtns = document.querySelectorAll('button');
  const adminPanel = document.getElementById('admin-panel');
  const closeAdminBtn = document.getElementById('close-admin');
  const addArticleForm = document.getElementById('add-article-form');

  adminBtns.forEach(btn => {
    if (btn.textContent.includes('Admin')) {
      btn.addEventListener('click', () => adminPanel?.classList.remove('hidden'));
    }
  });

  closeAdminBtn?.addEventListener('click', () => adminPanel?.classList.add('hidden'));

  addArticleForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('article-title').value;
    const subject = document.getElementById('article-subject').value;
    const language = document.getElementById('article-language').value;
    const content = document.getElementById('article-content').value;

    if (typeof supabase === 'undefined') {
      alert('Supabase client is not initialized!');
      return;
    }

    const { data, error } = await supabase
      .from('articles')
      .insert([{ title, subject, language, content }]);

    if (error) {
      alert('შეცდომა: ' + error.message);
    } else {
      alert('სტატია წარმატებით დაემატა!');
      addArticleForm.reset();
      adminPanel.classList.add('hidden');
      location.reload();
    }
  });
});


// Delete Article Logic
async function deleteArticle(id) {
  if (!confirm('ნამდვილად გსურთ ამ სტატიის წაშლა?')) return;

  if (typeof supabase === 'undefined') {
    alert('Supabase client is not initialized!');
    return;
  }

  const { error } = await supabase
    .from('articles')
    .delete()
    .eq('id', id);

  if (error) {
    alert('შეცდომა წაშლისას: ' + error.message);
  } else {
    alert('სტატია წარმატებით წაიშალა!');
    location.reload();
  }
}
