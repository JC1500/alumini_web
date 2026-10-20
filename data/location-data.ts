export type LocationData = Record<
  string,
  Record<string, string[]>
>;

export const locationData: LocationData = {
 Uttarakhand: {
    // Garhwal Division
    Dehradun: ["Dehradun", "Rishikesh", "Vikasnagar", "Mussoorie", "Doiwala", "Chakrata"],
    Haridwar: ["Haridwar", "Roorkee", "Manglaur", "Laksar", "Bhagwanpur"],
    Uttarkashi: ["Uttarkashi", "Barkot", "Purola", "Chinyalisaur", "Mori"],
    Chamoli: ["Gopeshwar", "Joshimath", "Karnaprayag", "Gauchar", "Gairhsain"],
    Rudraprayag: ["Rudraprayag", "Augustmuni", "Ukhimath", "Kedarnath"],
    TehriGarhwal: ["New Tehri", "Chamba", "Narendranagar", "Devprayag", "Dhanaulti"],
    PauriGarhwal: ["Pauri", "Kotdwar", "Srinagar", "Lansdowne", "Satpuli"],

    // Kumaon Division
    Almora: ["Almora", "Ranikhet", "Dwarahat", "Chaukhutia", "Someshwar"],
    Bageshwar: ["Bageshwar", "Kapkote", "Kanda", "Garur"],
    Champawat: ["Champawat", "Tanakpur", "Lohaghat", "Banbasa"],
    Nainital: ["Nainital", "Haldwani", "Ramnagar", "Bhimtal", "Bhowali", "Lalkuan"],
    Pithoragarh: ["Pithoragarh", "Dharchula", "Didihat", "Munsyari", "Gangolihat"],
    UdhamSinghNagar: ["Rudrapur", "Kashipur", "Kichha", "Khatima", "Sitarganj", "Jaspur"]
  },

  Delhi: {
    CentralDelhi: ["Patel Nagar", "Karol Bagh", "Paharganj", "Rajendra Nagar"],
    CentralNorthDelhi: ["Shakur Basti", "Shalimar Bagh", "Model Town", "Ashok Vihar"],
    EastDelhi: ["Gandhi Nagar", "Vishwas Nagar", "Patparganj", "Preet Vihar", "Mayur Vihar", "Laxmi Nagar"],
    NewDelhi: ["Connaught Place", "Chanakyapuri", "Delhi Cantonment", "Parliament Street", "Vasant Vihar"],
    NorthDelhi: ["Burari", "Adarsh Nagar", "Badli", "Civil Lines", "Timarpur"],
    NorthEastDelhi: ["Karawal Nagar", "Gokal Puri", "Yamuna Vihar", "Shahdara", "Seelampur"],
    NorthWestDelhi: ["Kirari", "Nangloi Jat", "Rohini", "Pitampura", "Kanjhawala"],
    OldDelhi: ["Sadar Bazar", "Chandni Chowk", "Daryaganj", "Kashmere Gate"],
    OuterNorthDelhi: ["Mundka", "Narela", "Bawana", "Alipur"],
    SouthDelhi: ["Saket", "Mehrauli", "Chhatarpur", "Malviya Nagar", "Hauz Khas", "Deoli"],
    SouthEastDelhi: ["Jangpura", "Kalkaji", "Badarpur", "Defence Colony", "Lajpat Nagar", "Sarita Vihar"],
    SouthWestDelhi: ["Najafgarh", "Matiala", "Dwarka", "Bijwasan", "Kapashera"],
    WestDelhi: ["Vikaspuri", "Janakpuri", "Rajouri Garden", "Punjabi Bagh", "Tilak Nagar"]
  },

  Maharashtra: {
    // Konkan Division
    MumbaiCity: ["Fort", "Colaba", "Dadar", "Worli", "Malabar Hill", "Byculla"],
    MumbaiSuburban: ["Bandra", "Andheri", "Borivali", "Kurla", "Malad", "Ghatkopar", "Powai"],
    Thane: ["Thane", "Kalyan-Dombivli", "Bhiwandi", "Mira-Bhayandar", "Ulhasnagar", "Navi Mumbai"],
    Palghar: ["Palghar", "Vasai-Virar", "Dahanu", "Wada", "Jawhar", "Boisar"],
    Raigad: ["Alibaug", "Panvel", "Karjat", "Mahad", "Khopoli", "Pen", "Mangaon"],
    Ratnagiri: ["Ratnagiri", "Chiplun", "Rajapur", "Guhagar", "Dapoli", "Khed"],
    Sindhudurg: ["Oros", "Malvan", "Sawantwadi", "Kankavli", "Vengurla", "Devgad"],

    // Pune Division
    Pune: ["Pune", "Pimpri-Chinchwad", "Baramati", "Shirur", "Lonavala", "Daund", "Haveli"],
    Satara: ["Satara", "Karad", "Mahabaleshwar", "Wai", "Phaltan", "Panchgani"],
    Sangli: ["Sangli", "Miraj", "Islampur", "Vita", "Tasgaon", "Jath"],
    Solapur: ["Solapur", "Pandharpur", "Barshi", "Akkalkot", "Sangola", "Kurduvadi"],
    Kolhapur: ["Kolhapur", "Ichalkaranji", "Kagal", "Gadhinglaj", "Panhala", "Shiroda"],

    // Nashik Division
    Nashik: ["Nashik", "Malegaon", "Sinnar", "Igatpuri", "Trimbakeshwar", "Niphad", "Yeola"],
    Ahilyanagar: ["Ahilyanagar", "Shirdi", "Sangamner", "Rahuri", "Kopargaon", "Shrigonda"],
    Dhule: ["Dhule", "Shirpur", "Sakri", "Shindkheda"],
    Jalgaon: ["Jalgaon", "Bhusawal", "Amalner", "Chalisgaon", "Chopda", "Pachora"],
    Nandurbar: ["Nandurbar", "Navapur", "Shahada", "Dhadgaon", "Taloda", "Akkalkuwa"],

    // Chhatrapati Sambhajinagar Division (Marathwada)
    ChhatrapatiSambhajinagar: ["Chhatrapati Sambhajinagar", "Paithan", "Sillod", "Gangapur", "Vaijapur", "Kannad"],
    Jalna: ["Jalna", "Ambad", "Partur", "Bhokardan", "Jafrabad"],
    Beed: ["Beed", "Parli", "Ambejogai", "Majalgaon", "Georai"],
    Latur: ["Latur", "Udgir", "Ausa", "Nilanga", "Ahmedpur"],
    Dharashiv: ["Dharashiv", "Tuljapur", "Omerga", "Bhoom", "Paranda"],
    Nanded: ["Nanded", "Degloor", "Kinwat", "Mukhed", "Kandhar", "Biloli"],
    Parbhani: ["Parbhani", "Gangakhed", "Jintur", "Pathri", "Selu"],
    Hingoli: ["Hingoli", "Basmath", "Kalamnuri", "Aundha Nagnath", "Sengaon"],

    // Amravati Division
    Amravati: ["Amravati", "Achalpur", "Chandur Railway", "Warud", "Morshi", "Dharni"],
    Akola: ["Akola", "Akot", "Telhara", "Murtizapur", "Balapur"],
    Washim: ["Washim", "Karanja Lad", "Risod", "Mangrulpir"],
    Buldhana: ["Buldhana", "Khamgaon", "Shegaon", "Malkapur", "Mehkar", "Chikhli"],
    Yavatmal: ["Yavatmal", "Pusad", "Pandharkawada", "Umarkhed", "Wani", "Darwha"],

    // Nagpur Division
    Nagpur: ["Nagpur", "Kamptee", "Ramtek", "Umred", "Hingna", "Katol", "Saoner"],
    Wardha: ["Wardha", "Hinganghat", "Arvi", "Deoli", "Pulgaon"],
    Bhandara: ["Bhandara", "Tumsar", "Sakoli", "Pauni"],
    Gondia: ["Gondia", "Tirora", "Deori", "Amgaon"],
    Chandrapur: ["Chandrapur", "Ballarpur", "Warora", "Rajura", "Bhadrawati"],
    Gadchiroli: ["Gadchiroli", "Aheri", "Armori", "Chamorshi", "Kurkheda"]
  },

  Karnataka: {
    // Bengaluru Division
    BengaluruUrban: ["Bengaluru", "Yelahanka", "Anekal", "Kengeri", "Electronic City"],
    BengaluruRural: ["Doddaballapura", "Devanahalli", "Hoskote", "Nelamangala"],
    Chikkaballapura: ["Chikkaballapura", "Gauribidanur", "Sidlaghatta", "Chintamani", "Bagepalli"],
    Chitradurga: ["Chitradurga", "Challakere", "Hiriyur", "Hosadurga", "Holalkere"],
    Davanagere: ["Davanagere", "Harihar", "Honnali", "Channagiri", "Jagalur"],
    Kolar: ["Kolar", "Bangarapet", "Malur", "Srinivaspur", "Mulbagal"],
    Ramanagara: ["Ramanagara", "Channapatna", "Kanakapura", "Magadi"],
    Shivamogga: ["Shivamogga", "Bhadravathi", "Sagar", "Shikaripura", "Thirthahalli"],
    Tumakuru: ["Tumakuru", "Tiptur", "Madhugiri", "Kunigal", "Sira", "Gubbi"],

    // Belagavi Division
    Bagalkote: ["Bagalkote", "Badami", "Ilkal", "Jamkhandi", "Mudhol", "Guledgudda"],
    Belagavi: ["Belagavi", "Gokak", "Chikodi", "Athani", "Bailhongal", "Nipani"],
    Dharwad: ["Hubballi", "Dharwad", "Navalgund", "Kalghatgi", "Kundgol"],
    Gadag: ["Gadag", "Betageri", "Ron", "Mundargi", "Shirahatti"],
    Haveri: ["Haveri", "Ranebennur", "Byadgi", "Savanur", "Shiggaon"],
    UttaraKannada: ["Karwar", "Sirsi", "Bhatkal", "Kumta", "Dandeli", "Honnavar"],
    Vijayapura: ["Vijayapura", "Indi", "Muddebihal", "Sindagi", "Basavana Bagewadi"],

    // Kalaburagi Division
    Ballari: ["Ballari", "Siruguppa", "Sandur", "Kurugodu"],
    Bidar: ["Bidar", "Basavakalyan", "Bhalki", "Humnabad", "Aurad"],
    Kalaburagi: ["Kalaburagi", "Sedam", "Chittapur", "Aland", "Afzalpur", "Jevargi"],
    Koppal: ["Koppal", "Gangavathi", "Kushtagi", "Yelburga", "Karatagi"],
    Raichur: ["Raichur", "Sindhanur", "Manvi", "Devadurga", "Lingasugur"],
    Vijayanagara: ["Hosapete", "Hampi", "Kudligi", "Hagaribommanahalli", "Harapanahalli", "Kotturu"],
    Yadgir: ["Yadgir", "Shahapur", "Shorapur", "Gurmatkal"],

    // Mysuru Division
    Chamarajanagar: ["Chamarajanagar", "Kollegal", "Gundlupet", "Yelandur"],
    Chikkamagaluru: ["Chikkamagaluru", "Kadur", "Tarikere", "Mudigere", "Sringeri"],
    DakshinaKannada: ["Mangaluru", "Puttur", "Bantwal", "Belthangady", "Sullia", "Moodabidri"],
    Hassan: ["Hassan", "Sakleshpur", "Channarayapatna", "Arsikere", "Belur", "Holenarasipura"],
    Kodagu: ["Madikeri", "Virajpet", "Somwarpet", "Kushalnagar"],
    Mandya: ["Mandya", "Maddur", "Srirangapatna", "Malavalli", "Pandavapura", "Nagamangala"],
    Mysuru: ["Mysuru", "Nanjangud", "Hunsur", "T. Narsipur", "K.R. Nagar"],
    Udupi: ["Udupi", "Kundapura", "Karkala", "Brahmavar", "Byndoor"]
  },

  UttarPradesh: {
    // Agra Division
    Agra: ["Agra", "Fatehpur Sikri", "Etmadpur", "Kheragarh", "Bah"],
    Firozabad: ["Firozabad", "Shikohabad", "Tundla", "Jasrana"],
    Mainpuri: ["Mainpuri", "Bhongaon", "Karhal", "Kishni"],
    Mathura: ["Mathura", "Vrindavan", "Goverdhan", "Chhata", "Raya"],

    // Aligarh Division
    Aligarh: ["Aligarh", "Khair", "Atrauli", "Iglas", "Gabhana"],
    Etah: ["Etah", "Jalesar", "Aliganj", "Marthara"],
    Hathras: ["Hathras", "Sadabad", "Sikandra Rao", "Sasni"],
    Kasganj: ["Kasganj", "Ganjduundwara", "Soron", "Patiyali"],

    // Ayodhya Division
    AmbedkarNagar: ["Akbarpur", "Tanda", "Jalalpur", "Alapur"],
    Amethi: ["Amethi", "Gauriganj", "Jagdishpur", "Musafirkhana"],
    Ayodhya: ["Ayodhya", "Faizabad", "Rudauli", "Bikapur", "Milkipur"],
    Barabanki: ["Barabanki", "Nawabganj", "Fatehpur", "Haidergarh", "Ram Sanehi Ghat"],
    Sultanpur: ["Sultanpur", "Kadipur", "Lambhua", "Jaisinghpur"],

    // Azamgarh Division
    Azamgarh: ["Azamgarh", "Sagri", "Lalganj", "Phoolpur", "Nizamabad"],
    Ballia: ["Ballia", "Rasra", "Bansdih", "Belthara Road", "Baireria"],
    Mau: ["Mau", "Ghosi", "Muhammadabad Gohna", "Maunath Bhanjan"],

    // Bareilly Division
    Bareilly: ["Bareilly", "Aonla", "Baheri", "Faridpur", "Nawabganj"],
    Budaun: ["Budaun", "Ujhani", "Sahaswan", "Bisauli", "Dataganj"],
    Pilibhit: ["Pilibhit", "Bisalpur", "Puranpur", "Barkhera"],
    Shahjahanpur: ["Shahjahanpur", "Powayan", "Tilhar", "Jalalabad"],

    // Basti Division
    Basti: ["Basti", "Harraiya", "Bhanpur", "Rudhauli"],
    SantKabirNagar: ["Khalilabad", "Dhanghata", "Mehdawal"],
    Siddharthnagar: ["Naugarh", "Bansi", "Domariyaganj", "Shohratgarh"],

    // Chitrakoot Division
    Banda: ["Banda", "Atarra", "Naraini", "Baberu"],
    Chitrakoot: ["Chitrakoot Dham (Karwi)", "Rajapur", "Manikpur"],
    Hamirpur: ["Hamirpur", "Rath", "Maudaha", "Sarila"],
    Mahoba: ["Mahoba", "Charkhari", "Kulpahar"],

    // Devipatan Division
    Bahraich: ["Bahraich", "Nanpara", "Kaisarganj", "Mahasi"],
    Balrampur: ["Balrampur", "Tulsipur", "Utraula"],
    Gonda: ["Gonda", "Colonelganj", "Tarabganj", "Mankapur"],
    Shravasti: ["Bhinga", "Ikona"],

    // Gorakhpur Division
    Deoria: ["Deoria", "Salempur", "Bhatpar Rani", "Rudrapur"],
    Gorakhpur: ["Gorakhpur", "Bansgaon", "Sahjanwa", "Chauri Chaura"],
    Kushinagar: ["Padrauna", "Kasia", "Hata", "Tamkuhi Raj"],
    Maharajganj: ["Maharajganj", "Nautanwa", "Phenda", "Nichlaul"],

    // Jhansi Division
    Jalaun: ["Orai", "Jalaun", "Konch", "Kalpi"],
    Jhansi: ["Jhansi", "Mauranipur", "Babina", "Moth"],
    Lalitpur: ["Lalitpur", "Mahroni", "Talbehat"],

    // Kanpur Division
    Auraiya: ["Auraiya", "Bidhuna", "Dibiyapur"],
    Etawah: ["Etawah", "Jaswantnagar", "Bharthana", "Saifai"],
    Farrukhabad: ["Fatehgarh", "Farrukhabad", "Kaimganj", "Amritpur"],
    Kannauj: ["Kannauj", "Chhibramau", "Tirwa"],
    KanpurDehat: ["Akbarpur", "Rura", "Bhognipur", "Sikandra"],
    KanpurNagar: ["Kanpur", "Bilhaur", "Ghatampur", "Bithoor"],

    // Lucknow Division
    Hardoi: ["Hardoi", "Shahabad", "Sandila", "Bilgram"],
    LakhimpurKheri: ["Lakhimpur", "Gola Gokarannath", "Palia Kalan", "Mohammadi"],
    Lucknow: ["Lucknow", "Malihabad", "Mohanlalganj", "Bakshi Ka Talab"],
    Raebareli: ["Raebareli", "Lalganj", "Bachhrawan", "Salon"],
    Sitapur: ["Sitapur", "Biswan", "Laharpur", "Misrikh"],
    Unnao: ["Unnao", "Shuklaganj", "Bangarmau", "Purwa"],

    // Meerut Division
    Baghpat: ["Baghpat", "Baraut", "Khekra"],
    Bulandshahr: ["Bulandshahr", "Khurja", "Anupshahr", "Sikandrabad"],
    GautamBuddhaNagar: ["Noida", "Greater Noida", "Dadri", "Jewar"],
    Ghaziabad: ["Ghaziabad", "Loni", "Modi Nagar", "Sahibabad"],
    Hapur: ["Hapur", "Garhmukteshwar", "Dhaulana"],
    Meerut: ["Meerut", "Sardhana", "Mawana"],

    // Mirzapur Division
    Bhadohi: ["Bhadohi", "Gyanpur", "Gopiganj"],
    Mirzapur: ["Mirzapur", "Chunar", "Vindhyachal", "Lalganj"],
    Sonbhadra: ["Robertsganj", "Renukoot", "Anpara", "Obra"],

    // Moradabad Division
    Amroha: ["Amroha", "Gajraula", "Hasanpur", "Dhanaura"],
    Bijnor: ["Bijnor", "Najibabad", "Nagina", "Chandpur", "Dhampur"],
    Moradabad: ["Moradabad", "Thakurdwara", "Bilari", "Kanth"],
    Rampur: ["Rampur", "Tanda", "Milak", "Suar"],
    Sambhal: ["Sambhal", "Chandausi", "Gunnaur"],

    // Prayagraj Division
    Fatehpur: ["Fatehpur", "Bindki", "Khaga"],
    Kaushambi: ["Manjhanpur", "Sirathu", "Chail"],
    Pratapgarh: ["Pratapgarh", "Kunda", "Patti", "Raniganj"],
    Prayagraj: ["Prayagraj", "Phulpur", "Naini", "Soraon", "Handia"],

    // Saharanpur Division
    Muzaffarnagar: ["Muzaffarnagar", "Khatauli", "Budhana", "Jansath"],
    Saharanpur: ["Saharanpur", "Deoband", "Nakur", "Rampur Maniharan"],
    Shamli: ["Shamli", "Kairana", "Thana Bhawan"],

    // Varanasi Division
    Chandauli: ["Chandauli", "Mughalsarai", "Sakaldiha", "Chakia"],
    Ghazipur: ["Ghazipur", "Zamania", "Saidpur", "Mohammadabad"],
    Jaunpur: ["Jaunpur", "Shahganj", "Machhlishahr", "Mariahu"],
    Varanasi: ["Varanasi", "Ramnagar", "Pindra", "Sevapuri"]
  },
  Rajasthan: {
    // Ajmer Division
    Ajmer: ["Ajmer", "Kishangarh", "Nasirabad", "Kekri", "Pushkar"],
    Beawar: ["Beawar", "Jaitaran", "Raipur", "Masooda", "Vijaynagar"],
    Bhilwara: ["Bhilwara", "Shahpura", "Mandal", "Asind", "Mandalgarh"],
    DidwanaKuchaman: ["Didwana", "Kuchaman City", "Makrana", "Nawa", "Ladnun"],
    Nagaur: ["Nagaur", "Merta City", "Degana", "Parbatsar", "Jayal"],
    Shahpura: ["Shahpura", "Jahajpur", "Kotdi", "Phooliyakala"],
    Tonk: ["Tonk", "Niwai", "Deoli", "Malpura", "Todaraisingh"],

    // Bharatpur Division
    Bharatpur: ["Bharatpur", "Bayana", "Kumher", "Nadbai", "Nagar"],
    Deeg: ["Deeg", "Kaman", "Pahadi", "Nagar"],
    Dholpur: ["Dholpur", "Bari", "Rajakhera", "Baseri"],
    GangapurCity: ["Gangapur City", "Wazirpur", "Bamanwas", "Toda Bhim"],
    Karauli: ["Karauli", "Hindaun", "Sapotra", "Mandarayal"],
    SawaiMadhopur: ["Sawai Madhopur", "Bonli", "Chauth Ka Barwara", "Khandar"],

    // Bikaner Division
    Anupgarh: ["Anupgarh", "Gharshana", "Rawla", "Shri Vijaynagar"],
    Bikaner: ["Bikaner", "Nokha", "Lunkaransar", "Khajuwala", "Shri Dungargarh"],
    Churu: ["Churu", "Sardarshahar", "Sujangarh", "Ratangarh", "Rajgarh"],
    Hanumangarh: ["Hanumangarh", "Nohar", "Bhadra", "Pilibanga", "Rawatsar"],
    SriGanganagar: ["Sri Ganganagar", "Suratgarh", "Raisinghnagar", "Sadulshahar"],

    // Jaipur Division
    Alwar: ["Alwar", "Rajgarh", "Lachhmangarh", "Ramgarh"],
    Dausa: ["Dausa", "Lalsot", "Bandikui", "Mahwa", "Sikrai"],
    Dudu: ["Dudu", "Mozamabad", "Phagi"],
    Jaipur: ["Jaipur", "Amer", "Sanganer", "Chomu"],
    JaipurRural: ["Chomu", "Phulera", "Sambhar Lake", "Bassi", "Jamwa Ramgarh"],
    KhairthalTijara: ["Khairthal", "Tijara", "Kishangarh Bas", "Bhiwadi"],
    KotputliBehror: ["Kotputli", "Behror", "Neemrana", "Bansur"],
    Jhunjhunu: ["Jhunjhunu", "Nawalgarh", "Khetri", "Chirawa", "Bisauli"],
    Sikar: ["Sikar", "Fatehpur", "Lachhmangarh", "Dantaramgarh", "Sri Madhopur"],
    NeemKaThana: ["Neem Ka Thana", "Khetri", "Udaipurwati", "Patan"],

    // Jodhpur Division
    Balotra: ["Balotra", "Siwana", "Pachpadra", "Baytu"],
    Barmer: ["Barmer", "Chohtan", "Gudamalani", "Shiv"],
    Jaisalmer: ["Jaisalmer", "Pokhran", "Fatehgarh"],
    Jalore: ["Jalore", "Ahore", "Bhinmal", "Sayla"],
    Jodhpur: ["Jodhpur", "Luni"],
    JodhpurRural: ["Bilara", "Bhopalgarh", "Osian", "Shergarh"],
    Phalodi: ["Phalodi", "Lohawat", "Aau", "Bap"],
    Pali: ["Pali", "Sumerpur", "Sojat", "Bali", "Falna"],
    Sanchore: ["Sanchore", "Bagoda", "Chitalwana", "Raniwada"],
    Sirohi: ["Sirohi", "Mount Abu", "Abu Road", "Sheoganj", "Reodar"],

    // Kota Division
    Baran: ["Baran", "Chhabra", "Atru", "Anta", "Kishanganj"],
    Bundi: ["Bundi", "Nainwa", "Keshoraipatan", "Hindoli", "Indergarh"],
    Jhalawar: ["Jhalawar", "Jhalrapatan", "Bhawani Mandi", "Khanpur", "Aklera"],
    Kota: ["Kota", "Ramganj Mandi", "Sangod", "Ladpura"],

    // Udaipur Division
    Banswara: ["Banswara", "Kushalgarh", "Ghatol", "Garhi"],
    Chittorgarh: ["Chittorgarh", "Nimbahera", "Rawatbhata", "Bari Sadri"],
    Dungarpur: ["Dungarpur", "Sagwara", "Aspur", "Bichhiwara"],
    Pratapgarh: ["Pratapgarh", "Chhoti Sadri", "Dhariyawad", "Arnod"],
    Rajsamand: ["Rajsamand", "Nathdwara", "Kankroli", "Amet", "Kumbhalgarh"],
    Salumbar: ["Salumbar", "Sarada", "Semari", "Lasadiya"],
    Udaipur: ["Udaipur", "Girwa", "Mavli", "Kherwara", "Gogunda"]
  },
  HimachalPradesh: {
    // Kangra Division
    Chamba: ["Chamba", "Dalhousie", "Khajjiar", "Bharmour", "Pangi", "Salooni"],
    Kangra: ["Dharamshala", "Palampur", "Kangra", "Nurpur", "Dehra Gopipur", "Baijnath"],
    Una: ["Una", "Amb", "Bangana", "Haroli", "Gagret"],

    // Mandi Division
    Bilaspur: ["Bilaspur", "Ghumarwin", "Shri Naina Devi", "Jhandutta"],
    Hamirpur: ["Hamirpur", "Nadaun", "Sujanpur", "Bhoranj", "Barsar"],
    Kullu: ["Kullu", "Manali", "Bhuntar", "Banjar", "Anni", "Nirmand"],
    LahaulAndSpiti: ["Keylong", "Kaza", "Udaipur", "Tabo"],
    Mandi: ["Mandi", "Sundernagar", "Jogindernagar", "Sarkaghat", "Karsog"],

    // Shimla Division
    Kinnaur: ["Reckong Peo", "Kalpa", "Nichar", "Pooh", "Sangla"],
    Shimla: ["Shimla", "Rampur", "Rohru", "Theog", "Jubbal", "Kotkhai"],
    Sirmaur: ["Nahan", "Paonta Sahib", "Rajgarh", "Shillai", "Renukaji"],
    Solan: ["Solan", "Baddi", "Nalagarh", "Kasauli", "Arki", "Kandaghat"]
  },
  MadhyaPradesh: {
    // Bhopal Division
    Bhopal: ["Bhopal", "Berasia", "Kolar"],
    Raisen: ["Raisen", "Mandi Bamora", "Sanchi", "Gauharanj", "Begumganj"],
    Rajgarh: ["Rajgarh", "Biaora", "Narsinghgarh", "Sarangpur"],
    Sehore: ["Sehore", "Ashta", "Ichhawar", "Budhni", "Nasrullaganj"],
    Vidisha: ["Vidisha", "Basoda", "Sironj", "Kurwai", "Ganj Basoda"],

    // Chambal Division
    Bhind: ["Bhind", "Bhind Nagar", "Ater", "Lahar", "Mehgaon", "Gohad"],
    Morena: ["Morena", "Ambah", "Porsa", "Joura", "Sabalgarh"],
    Sheopur: ["Sheopur", "Vijaypur", "Karatwa"],

    // Gwalior Division
    Ashoknagar: ["Ashoknagar", "Chanderi", "Mungaoli", "Isagarh"],
    Datia: ["Datia", "Seondha", "Bhander"],
    Guna: ["Guna", "Raghogarh", "Chhabra", "Aron", "Kumbhraj"],
    Gwalior: ["Gwalior", "Dabra", "Bhantarwar", "Morar"],
    Shivpuri: ["Shivpuri", "Karera", "Pohri", "Kolaras", "Pichhore"],

    // Indore Division
    Alirajpur: ["Alirajpur", "Jobat", "Kattiwada"],
    Barwani: ["Barwani", "Sendhwa", "Anjad", "Pansemal"],
    Burhanpur: ["Burhanpur", "Nepanagar", "Khaknar"],
    Dhar: ["Dhar", "Pithampur", "Dharampuri", "Manawar", "Badnawar", "Sardarpur"],
    Indore: ["Indore", "Mhow (Dr. Ambedkar Nagar)", "Sanwer", "Depalpur"],
    Jhabua: ["Jhabua", "Thandla", "Petlawad", "Ranapur"],
    Khandwa: ["Khandwa", "Pandhana", "Punasa", "Harsud"],
    Khargone: ["Khargone", "Maheshwar", "Barwaha", "Kasrawad", "Sanawad"],

    // Jabalpur Division
    Balaghat: ["Balaghat", "Waraseoni", "Katangi", "Baihar", "Malanjkhand"],
    Chhindwara: ["Chhindwara", "Parasia", "Junardeo", "Amarwara", "Sausar"],
    Dindori: ["Dindori", "Shahpura", "Mehandwani"],
    Jabalpur: ["Jabalpur", "Sihora", "Patan", "Panagar", "Kundam"],
    Katni: ["Katni", "Murwara", "Vijayraghavgarh", "Bahoriband", "Barhi"],
    Mandla: ["Mandla", "Nainpur", "Bichar", "Bichhiya"],
    Narsinghpur: ["Narsinghpur", "Gadarwara", "Gotegaon", "Kareli"],
    Pandhurna: ["Pandhurna", "Sausar"],
    Seoni: ["Seoni", "Lakhnadon", "Ghansor", "Keolari"],

    // Narmadapuram Division
    Betul: ["Betul", "Multai", "Sarni", "Amla", "Bhainsdehi"],
    Harda: ["Harda", "Timarni", "Khirkiya"],
    Narmadapuram: ["Narmadapuram", "Itarsi", "Pipariya", "Soagpur", "Pachmarhi"],

    // Rewa Division
    Mauganj: ["Mauganj", "Hanumana", "Naigarhi"],
    Maihar: ["Maihar", "Amarpatan", "Ramnagar"],
    Rewa: ["Rewa", "Teonthar", "Sirmour", "Gurh", "Mangawan"],
    Satna: ["Satna", "Nagod", "Chitrakoot", "Uchehara"],
    Sidhi: ["Sidhi", "Gopadbanas", "Churhat", "Rampur Naikin"],
    Singrauli: ["Waidhan", "Singrauli", "Chitrangi", "Deosar"],

    // Sagar Division
    Chhatarpur: ["Chhatarpur", "Khajuraho", "Nowgong", "Rajnagar", "Baxwaha"],
    Damoh: ["Damoh", "Hatta", "Patharia", "Tendukheda"],
    Niwari: ["Niwari", "Orchha", "Prithvipur"],
    Panna: ["Panna", "Devendranagar", "Pawar", "Ajaigarh"],
    Sagar: ["Sagar", "Bina", "Khurai", "Surkhi", "Deori", "Garhakota"],
    Tikamgarh: ["Tikamgarh", "Jatara", "Palera", "Baldeogarh"],

    // Shahdol Division
    Anuppur: ["Anuppur", "Kotma", "Rajendragram", "Jaithari"],
    Shahdol: ["Shahdol", "Soagpur", "Beohari", "Jaisinghnagar"],
    Umaria: ["Umaria", "Pali", "Manpur", "Nowrozabad"],

    // Ujjain Division
    AgarMalwa: ["Agar", "Susner", "Nalkheda", "Badod"],
    Dewas: ["Dewas", "Sonkatch", "Bagli", "Kannod", "Khategaon"],
    Mandsaur: ["Mandsaur", "Sitamau", "Bhanpura", "Garoth", "Malhargarh"],
    Neemuch: ["Neemuch", "Jawad", "Manasa", "Singoli"],
    Ratlam: ["Ratlam", "Jaora", "Sailana", "Alot", "Rawatbhata"],
    Shajapur: ["Shajapur", "Shujalpur", "Kalapipal", "Mohan Barodia"],
    Ujjain: ["Ujjain", "Nagda", "Khachrod", "Mahidpur", "Tarana", "Badnagar"]
  },
  Goa: {
    NorthGoa: ["Panaji (Panjim)", "Mapusa", "Bicholim", "Ponda", "Pernem", "Valpoi", "Calangute", "Candolim"],
    SouthGoa: ["Margao (Madgaon)", "Vasco da Gama", "Mormugao", "Quepem", "Sanguem", "Canacona", "Curchorem", "Dharbandora"]
  },
  Telangana: {
    Adilabad: ["Adilabad", "Utnoor", "Boath", "Bela"],
    BhadradriKothagudem: ["Kothagudem", "Bhadrachalam", "Palwancha", "Yellandu", "Manuguru"],
    Hanumakonda: ["Hanumakonda", "Kazipet", "Hanamkonda", "Inavolu"],
    Hyderabad: ["Hyderabad", "Secunderabad", "Charminar", "Khairatabad", "Ameerpet", "Jubilee Hills"],
    Jagtial: ["Jagtial", "Korutla", "Metpally", "Dharmapuri"],
    Jangaon: ["Jangaon", "Station Ghanpur", "Palakurthi"],
    JayashankarBhupalpally: ["Bhupalpally", "Kataram", "Mahadevpur"],
    JogulambaGadwal: ["Gadwal", "Alampur", "Ieeja"],
    Kamareddy: ["Kamareddy", "Banswada", "Yellareddy"],
    Karimnagar: ["Karimnagar", "Huzurabad", "Jammikunta", "Choppadandi"],
    Khammam: ["Khammam", "Wyra", "Sathupally", "Madhira"],
    KumuramBheemAsifabad: ["Asifabad", "Kagaznagar", "Sirpur"],
    Mahabubabad: ["Mahabubabad", "Dornakal", "Thorrur"],
    Mahabubnagar: ["Mahabubnagar", "Jadcherla", "Bhutpur", "Devarkadra"],
    Mancherial: ["Mancherial", "Bellampalle", "Mandamarri", "Chennur"],
    Medak: ["Medak", "Toopran", "Narsapur", "Ramayampet"],
    MedchalMalkajgiri: ["Malkajgiri", "Kukatpally", "Quthbullapur", "Medchal", "Uppal", "Alwal"],
    Mulugu: ["Mulugu", "Eturnagaram", "Venkatapur", "Tadvai"],
    Nagarkurnool: ["Nagarkurnool", "Achampet", "Kalwakurthy", "Kollapur"],
    Nalgonda: ["Nalgonda", "Miryalaguda", "Devarakonda", "Nakrekal"],
    Narayanpet: ["Narayanpet", "Makthal", "Kosgi"],
    Nirmal: ["Nirmal", "Bhainsa", "Khanapur"],
    Nizamabad: ["Nizamabad", "Armoor", "Bodhan", "Balkonda"],
    Peddapalli: ["Peddapalli", "Ramagundam", "Godavarikhani", "Manthani"],
    RajannaSircilla: ["Sircilla", "Vemulawada"],
    RangaReddy: ["Shamshabad", "Rajendranagar", "Ibrahimpatnam", "Serilingampally", "Hayathnagar", "Maheshwaram"],
    Sangareddy: ["Sangareddy", "Patancheru", "Zaheerabad", "Narayankhed"],
    Siddipet: ["Siddipet", "Gajwel", "Husnabad", "Dubbak"],
    Suryapet: ["Suryapet", "Kodad", "Huzurnagar", "Tungaturthi"],
    Vikarabad: ["Vikarabad", "Tandur", "Pargi", "Kodangal"],
    Wanaparthy: ["Wanaparthy", "Pebbair", "Atmakur"],
    Warangal: ["Warangal", "Narsampet", "Parkal", "Wardhannapet"],
    YadadriBhuvanagiri: ["Bhongir (Bhuvanagiri)", "Yadagirigutta", "Choutuppal", "Aler"]
  },
  Jharkhand: {
    // Palamu Division
    Garhwa: ["Garhwa", "Nagar Untari", "Ranka", "Majhiaon"],
    Latehar: ["Latehar", "Chandwa", "Balumath", "Mahuadanr"],
    Palamu: ["Medininagar (Daltonganj)", "Chhatarpur", "Hussainabad", "Lesliganj"],

    // Santhal Pargana Division
    Deoghar: ["Deoghar", "Madhupur", "Sarath"],
    Dumka: ["Dumka", "Jarmundi", "Ranishwar", "Shikaripara"],
    Godda: ["Godda", "Mahagama", "Poreyahat"],
    Jamtara: ["Jamtara", "Nala", "Narayanpur"],
    Pakur: ["Pakur", "Littipara", "Amrapara", "Hiranpur"],
    Sahibganj: ["Sahibganj", "Rajmahal", "Barharwa"],

    // South Chota Nagpur Division
    Gumla: ["Gumla", "Chainpur", "Raidih", "Sisai"],
    Khunti: ["Khunti", "Torpa", "Murhu", "Karra"],
    Lohardaga: ["Lohardaga", "Kuru", "Bhandra"],
    Ranchi: ["Ranchi", "Kanke", "Hatia", "Bundu", "Ormanjhi", "Silli", "Nagri"],
    Simdega: ["Simdega", "Kolebira", "Thethaitangar"],

    // Kolhan Division
    EastSinghbhum: ["Jamshedpur", "Ghatshila", "Chakulia", "Baharagora", "Musabani"],
    SeraikelaKharsawan: ["Seraikela", "Adityapur", "Chandil", "Kharsawan"],
    WestSinghbhum: ["Chaibasa", "Chakradharpur", "Noamundi", "Jhinkpani"],

    // North Chota Nagpur Division
    Bokaro: ["Bokaro Steel City", "Chas", "Bermo (Phusro)", "Gomia"],
    Chatra: ["Chatra", "Hunterganj", "Simaria", "Itkhori"],
    Dhanbad: ["Dhanbad", "Jharia", "Katras", "Nirsa", "Sindri"],
    Giridih: ["Giridih", "Dumri", "Bagodar", "Rajdhanwar"],
    Hazaribagh: ["Hazaribagh", "Barhi", "Barkagaon", "Chorparan"],
    Koderma: ["Koderma", "Jhumri Telaiya", "Domchanch"],
    Ramgarh: ["Ramgarh Cantonment", "Bhurkunda", "Patratu", "Gola"]
  },
  Haryana: {
    // Ambala Division
    Ambala: ["Ambala", "Ambala Cantt", "Naraingarh", "Barara"],
    Kurukshetra: ["Kurukshetra", "Thanesar", "Pehowa", "Shahbad"],
    Panchkula: ["Panchkula", "Kalka", "Pinjore", "Raipur Rani"],
    Yamunanagar: ["Yamunanagar", "Jagadhri", "Radaur", "Chhachhrauli"],

    // Faridabad Division
    Faridabad: ["Faridabad", "Ballabhgarh", "NIT Faridabad"],
    Nuh: ["Nuh", "Ferozepur Jhirka", "Punahana", "Taoru"],
    Palwal: ["Palwal", "Hodal", "Hathin"],

    // Gurugram Division
    Gurugram: ["Gurugram", "Manesar", "Pataudi", "Sohna", "Farrukhnagar"],
    Mahendragarh: ["Narnaul", "Mahendragarh", "Kanina", "Ateli"],
    Rewari: ["Rewari", "Bawal", "Dharuhera", "Kosli"],

    // Hisar Division
    Fatehabad: ["Fatehabad", "Tohana", "Ratia"],
    Hisar: ["Hisar", "Hansi", "Barwala", "Adampur", "Uklana"],
    Jind: ["Jind", "Narwana", "Safidon", "Uchana", "Julana"],
    Sirsa: ["Sirsa", "Dabwali", "Rania", "Ellenabad"],

    // Karnal Division
    Kaithal: ["Kaithal", "Guhla", "Pundri", "Kalayat"],
    Karnal: ["Karnal", "Gharaunda", "Assandh", "Taraori", "Indri"],
    Panipat: ["Panipat", "Samalkha", "Israna"],

    // Rohtak Division
    Bhiwani: ["Bhiwani", "Tosham", "Bawani Khera", "Loharu"],
    CharkhiDadri: ["Charkhi Dadri", "Badhra"],
    Jhajjar: ["Jhajjar", "Bahadurgarh", "Beri", "Matanhail"],
    Rohtak: ["Rohtak", "Meham", "Kalanaur", "Sampla"],
    Sonipat: ["Sonipat", "Ganaur", "Gohana", "Rai", "Kharkhoda"]
  },
  Punjab: {
    // Faridkot Division
    Bathinda: ["Bathinda", "Rampura Phul", "Talwandi Sabo", "Mauri"],
    Faridkot: ["Faridkot", "Kotkapura", "Jaitu"],
    Mansa: ["Mansa", "Budhlada", "Sardulgarh"],

    // Firozpur Division
    Fazilka: ["Fazilka", "Abohar", "Jalalabad"],
    Firozpur: ["Firozpur", "Zira", "Guru Har Sahai"],
    Moga: ["Moga", "Baghapurana", "Nihal Singh Wala", "Dharamkot"],
    SriMuktsarSahib: ["Muktsar", "Malout", "Gidderbaha"],

    // Jalandhar Division
    Amritsar: ["Amritsar", "Ajnala", "Baba Bakala", "Majitha"],
    Gurdaspur: ["Gurdaspur", "Batala", "Dera Baba Nanak", "Dhariwal"],
    Hoshiarpur: ["Hoshiarpur", "Dasuya", "Mukerian", "Garhshankar"],
    Jalandhar: ["Jalandhar", "Nakodar", "Phillaur", "Shahkot", "Adampur"],
    Kapurthala: ["Kapurthala", "Phagwara", "Sultanpur Lodhi", "Bhulath"],
    Pathankot: ["Pathankot", "Dhar Kalan", "Sujanpur"],
    ShahidBhagatSinghNagar: ["Nawanshahr", "Banga", "Balachaur"],
    TarnTaran: ["Tarn Taran", "Patti", "Khadoor Sahib"],

    // Patiala Division
    Barnala: ["Barnala", "Tapa", "Mehal Kalan"],
    FatehgarhSahib: ["Sirhind-Fatehgarh Sahib", "Mandi Gobindgarh", "Khamanon", "Amloh"],
    Ludhiana: ["Ludhiana", "Khanna", "Jagraon", "Samrala", "Raikot", "Payal"],
    Malerkotla: ["Malerkotla", "Ahmedgarh", "Amargarh"],
    Patiala: ["Patiala", "Nabaha", "Rajpura", "Samana", "Patran"],
    Sangrur: ["Sangrur", "Sunam", "Dhuri", "Moonak", "Lehra"],

    // Roopnagar Division
    Rupnagar: ["Rupnagar (Ropar)", "Anandpur Sahib", "Nangal", "Chamkaur Sahib"],
    SASNagar: ["Sahibzada Ajit Singh Nagar (Mohali)", "Kharar", "Dera Bassi", "Zirakpur"]
  },
  Sikkim: {
    Gangtok: ["Gangtok", "Singtam", "Ranipool", "Tadong"],
    Gyalshing: ["Gyalshing", "Pelling", "Yuksom", "Dentam"],
    Mangan: ["Mangan", "Chungthang", "Lachen", "Lachung"],
    Namchi: ["Namchi", "Jorethang", "Ravangla", "Melli"],
    Pakyong: ["Pakyong", "Rangpo", "Rhenock"],
    Soreng: ["Soreng", "Nayabazar", "Dharamdin"]
  },
  Gujarat: {
    Ahmedabad: ["Ahmedabad", "Sanand", "Dholka", "Dhandhuka", "Viramgam", "Bavla"],
    Amreli: ["Amreli", "Dhari", "Rajula", "Savarkundla", "Babra", "Jafrabad"],
    Anand: ["Anand", "Nadiad", "Petlad", "Khambhat", "Borsad", "Umreth"],
    Aravalli: ["Modasa", "Bhiloda", "Bayad", "Meghraj"],
    Banaskantha: ["Palanpur", "Deesa", "Danta", "Tharad", "Dhanera", "Kankrej"],
    Bharuch: ["Bharuch", "Ankleshwar", "Jambusar", "Jhagadia", "Vagra"],
    Bhavnagar: ["Bhavnagar", "Palitana", "Mahuva", "Sihor", "Gariadhar"],
    Botad: ["Botad", "Gadhada", "Barwala", "Ranpur"],
    ChhotaUdepur: ["Chhota Udepur", "Bodeli", "Jetpur Pavi", "Sankheda"],
    Dahod: ["Dahod", "Jhalod", "Devgadh Baria", "Garbada", "Fatepura"],
    Dang: ["Ahwa", "Waghai", "Subir"],
    DevbhumiDwarka: ["Khambhalia", "Dwarka", "Okha", "Kalyanpur", "Bhanvad"],
    Gandhinagar: ["Gandhinagar", "Kalol", "Mansa", "Dehgam"],
    GirSomnath: ["Veraval", "Somnath", "Una", "Kodinar", "Talala"],
    Jamnagar: ["Jamnagar", "Dhrol", "Kalavad", "Jamjodhpur"],
    Junagadh: ["Junagadh", "Keshod", "Manavadar", "Malia", "Visavadar"],
    Kheda: ["Nadiad", "Kheda", "Kapadvanj", "Mahudha", "Thasra"],
    Kutch: ["Bhuj", "Gandhidham", "Anjar", "Mandvi", "Mundra", "Naliya", "Rapar"],
    Mahisagar: ["Lunawada", "Santrampur", "Balasinor", "Virpur"],
    Mehsana: ["Mehsana", "Vadnagar", "Visnagar", "Kadi", "Unjha", "Becharaji"],
    Morbi: ["Morbi", "Wankaner", "Halvad", "Maliya", "Tankara"],
    Narmada: ["Rajpipla", "Dediapada", "Tilakwada", "Sagbara"],
    Navsari: ["Navsari", "Gandevi", "Chikhli", "Bansda", "Jalalpore"],
    Panchmahal: ["Godhra", "Halol", "Kalol", "Derol"],
    Patan: ["Patan", "Sidhpur", "Radhanpur", "Harij", "Chanasma"],
    Porbandar: ["Porbandar", "Ranavav", "Kutiyana"],
    Rajkot: ["Rajkot", "Jetpur", "Gondal", "Dhoraji", "Jasdan"],
    Sabarkantha: ["Himatnagar", "Idar", "Khedbrahma", "Prantij", "Vadali"],
    Surat: ["Surat", "Bardoli", "Kamrej", "Vyara", "Olpad", "Mandroi"],
    Surendranagar: ["Surendranagar", "Wadhwan", "Dhrangadhra", "Limbdi", "Chotila"],
    Tapi: ["Vyara", "Songadh", "Nijhar", "Valod", "Uchchhal"],
    Vadodara: ["Vadodara", "Padra", "Dabhoi", "Karjan", "Savli", "Waghodia"],
    Valsad: ["Valsad", "Vapi", "Pardi", "Dharampur", "Umbergaon"]
  },
  WestBengal: {
    Alipurduar: ["Alipurduar", "Falakata", "Madarihat", "Kumargram", "Kalchini"],
    Bankura: ["Bankura", "Bishnupur", "Khatra", "Barjora"],
    PaschimBardhaman: ["Asansol", "Durgapur", "Raniganj", "Kulti"],
    PurbaBardhaman: ["Bardhaman", "Kalna", "Katwa", "Memari"],
    Birbhum: ["Suri", "Bolpur", "Rampurhat", "Sainthia"],
    CoochBehar: ["Cooch Behar", "Dinhata", "Mathabhanga", "Tufanganj", "Mekhliganj"],
    DakshinDinajpur: ["Balurghat", "Gangarampur", "Buniadpur"],
    Darjeeling: ["Darjeeling", "Siliguri", "Kurseong", "Mirik"],
    Hooghly: ["Chinsurah", "Chandannagar", "Serampore", "Rishra", "Tarakeswar", "Arambagh"],
    Howrah: ["Howrah", "Bally", "Uluberia", "Bagnan", "Amta"],
    Jalpaiguri: ["Jalpaiguri", "Dhupguri", "Malbazar", "Maynaguri"],
    Jhargram: ["Jhargram", "Gopiballavpur", "Belpahari"],
    Kalimpong: ["Kalimpong", "Pedong", "Gorubathan"],
    Kolkata: ["Kolkata", "Alipore", "Bhowanipore", "Salt Lake", "Park Street", "Jadavpur"],
    Malda: ["English Bazar (Malda)", "Old Malda", "Chanchal", "Gazole"],
    Murshidabad: ["Baharampur", "Jiaganj", "Jangipur", "Kandi", "Domkal", "Lalgola"],
    Nadia: ["Krishnanagar", "Kalyani", "Ranaghat", "Nabadwip", "Santipur"],
    North24Parganas: ["Barasat", "Bidhannagar (Salt Lake)", "Barrackpore", "Basirhat", "Bongaon"],
    PaschimMedinipur: ["Midnapore", "Kharagpur", "Ghatal", "Garhbeta"],
    PurbaMedinipur: ["Tamluk", "Haldia", "Digha", "Contai", "Egra"],
    Purulia: ["Purulia", "Raghunathpur", "Jhalda", "Manbazar"],
    South24Parganas: ["Alipore", "Baruipur", "Canning", "Diamond Harbour", "Kakdwip"],
    UttarDinajpur: ["Raiganj", "Islampur", "Dalkhola", "Kaliyaganj"]
  },
  AndhraPradesh: {
    AlluriSitharamaRaju: ["Paderu", "Araku Valley", "Rampachodavaram", "Chintoor"],
    Anakapalli: ["Anakapalli", "Chodavaram", "Yelamanchili", "Payakaraopet"],
    Ananthapuramu: ["Ananthapuramu", "Tadpatri", "Guntakal", "Rayadurg"],
    Annamayya: ["Rayachoti", "Madanapalle", "Rajampet"],
    Bapatla: ["Bapatla", "Chirala", "Repalle", "Addanki"],
    Chittoor: ["Chittoor", "Palamaner", "Nagari", "Punganur"],
    EastGodavari: ["Rajahmundry", "Nidadavole", "Kovvur", "Anaparthi"],
    Eluru: ["Eluru", "Jangareddigudem", "Nuzvid", "Kaikaluru"],
    Guntur: ["Guntur", "Tenali", "Mangalagiri", "Ponnur"],
    Kakinada: ["Kakinada", "Peddapuram", "Pithapuram", "Tuni"],
    Konaseema: ["Amalapuram", "Ramachandrapuram", "Razole", "Kothapeta"],
    Krishna: ["Machilipatnam", "Gudivada", "Pedana", "Pamarru"],
    Kurnool: ["Kurnool", "Yemmiganur", "Adoni", "Pathikonda"],
    NTR: ["Vijayawada", "Jaggayyapeta", "Nandigama", "Tiruvuru"],
    Nandyal: ["Nandyal", "Dhone", "Allagadda", "Nandikotkur", "Atmakur"],
    Palnadu: ["Narasaraopet", "Sattenapalle", "Gurazala", "Vinukonda"],
    ParvathipuramManyam: ["Parvathipuram", "Salur", "Palakonda"],
    Prakasam: ["Ongole", "Markapur", "Kanigiri", "Giddalur"],
    SriPottiSriramuluNellore: ["Nellore", "Kavali", "Gudur", "Atmakur"],
    SriSathyaSai: ["Puttaparthi", "Dharmavaram", "Kadiri", "Hindupur"],
    Srikakulam: ["Srikakulam", "Palasa", "Amadalavalasa", "Tekkali"],
    Tirupati: ["Tirupati", "Srikalahasti", "Gudur", "Sullurpeta"],
    Visakhapatnam: ["Visakhapatnam", "Gajuwaka", "Bheemunipatnam", "Pendurthi"],
    Vizianagaram: ["Vizianagaram", "Bobbili", "Cheepurupalli", "Gajapathinagaram"],
    WestGodavari: ["Bhimavaram", "Tadepalligudem", "Tanuku", "Narsapuram", "Palakollu"],
    YSRKadapa: ["Kadapa", "Proddatur", "Jammalamadugu", "Badvel", "Pulivendula"]
  },
  ArunachalPradesh: {
    Anjaw: ["Hawai", "Hayuliang", "Manchal"],
    Bichom: ["Naprung", "Bana", "Lada"],
    Changlang: ["Changlang", "Miao", "Jairampur", "Bordumsa"],
    DibangValley: ["Anini", "Etalin", "Mypi"],
    EastKameng: ["Seppa", "Chayang Tajo", "Bameng"],
    EastSiang: ["Pasighat", "Ruksin", "Mebo"],
    Kamle: ["Raga", "Dollungmukh"],
    KeyiPanyor: ["Yachuli", "Yazali"],
    KraDaadi: /* Jamin */ ["Jamin", "Palin", "Chambang"],
    KurungKumey: ["Koloriang", "Nyapin", "Sangram"],
    LepaRada: ["Basar", "Tirbin", "Sora"],
    Lohit: ["Tezu", "Sunpura"],
    Longding: ["Longding", "Kanubari", "Pangchao"],
    LowerDibangValley: ["Roing", "Dambuk", "Hunli"],
    LowerSiang: ["Likabali", "Nari", "Koyu"],
    LowerSubansiri: ["Ziro", "Yachuli"],
    Namsai: ["Namsai", "Chowkham", "Lathao"],
    PakkeKessang: ["Lemmi", "Pakke-Kessang", "Seijosa"],
    PapumPare: ["Yupia", "Itanagar", "Naharlagun", "Doimukh"],
    ShiYomi: ["Tato", "Mechuka", "Monigong"],
    Siang: ["Pangin", "Boleng", "Rumgong"],
    Tawang: ["Tawang", "Lumla", "Jang"],
    Tirap: ["Khonsa", "Deomali", "Namsang"],
    UpperSiang: ["Yingkiong", "Tuting", "Geku"],
    UpperSubansiri: ["Daporijo", "Dumporijo", "Nacho"],
    WestKameng: ["Bomdila", "Dirang", "Rupa", "Bhalukpong"],
    WestSiang: ["Aalo", "Yomcha", "Kamba"]
  },
  Assam: {
    Bajali: ["Pathsala", "Bhawanipur"],
    Baksa: ["Mushalpur", "Tamulpur", "Salbari"],
    Barpeta: ["Barpeta", "Howly", "Sorbhog", "Sarthebari"],
    Biswanath: ["Biswanath Chariali", "Gohpur", "Borgang"],
    Bongaigaon: ["Bongaigaon", "Abhayapuri", "Manikpur"],
    Cachar: ["Silchar", "Lakhipur", "Sonai", "Katigorah"],
    Charaideo: ["Sonari", "Moran", "Mahmara"],
    Chirang: ["Kajalgaon", "Bijni", "Sidli"],
    Darrang: ["Mangaldoi", "Sipajhar", "Kharupetia"],
    Dhemaji: ["Dhemaji", "Silapathar", "Jonai"],
    Dhubri: ["Dhubri", "Gauripur", "Bilasipara", "Golakganj"],
    Dibrugarh: ["Dibrugarh", "Tingkhong", "Naharkatia", "Duliyajan", "Moranhat"],
    DimaHasao: ["Haflong", "Umrangso", "Mahur", "Maibang"],
    Goalpara: ["Goalpara", "Dudhnoi", "Lakhipur"],
    Golaghat: ["Golaghat", "Dergaon", "Bokakhat", "Sarupathar"],
    Hailakandi: ["Hailakandi", "Lala", "Algapur"],
    Hojai: ["Hojai", "Lanka", "Doboka"],
    Jorhat: ["Jorhat", "Mariani", "Titabor", "Teok"],
    Kamrup: ["Amingaon", "Rangana", "Bayan", "Chaygaon", "Hajo"],
    KamrupMetropolitan: ["Guwahati", "Dispur", "Chandrapur", "Sonapur"],
    KarbiAnglong: ["Diphu", "Bokajan", "Howraghat"],
    Karimganj: ["Karimganj", "Badarpur", "Ram Krishna Nagar"],
    Kokrajhar: ["Kokrajhar", "Gossaigaon", "Dotma"],
    Lakhimpur: ["North Lakhimpur", "Bihpuria", "Narayanpur", "Dhakuakhana"],
    Majuli: ["Garamur", "Kamalabari"],
    Morigaon: ["Morigaon", "Jagiroad", "Bhuragaon"],
    Nagaon: ["Nagaon", "Koliabor", "Raha", "Dhing"],
    Nalbari: ["Nalbari", "Tihu", "Barkhetri"],
    Sivasagar: ["Sivasagar", "Nazira", "Amguri", "Demow"],
    Sonitpur: ["Tezpur", "Dhekiajuli", "Jamugurihat"],
    SouthSalmaraMankachar: ["Hatsingimari", "Mankachar"],
    Tamulpur: ["Tamulpur", "Goreswar"],
    Tinsukia: ["Tinsukia", "Digboi", "Margherita", "Doomdooma"],
    Udalguri: ["Udalguri", "Tangla", "Harisinga", "Rowta"],
    WestKarbiAnglong: ["Hamren", "Baithalangso"]
  },
  Bihar: {
    Araria: ["Araria", "Forbesganj", "Jogbani"],
    Arwal: ["Arwal", "Kaler", "Karpi"],
    Aurangabad: ["Aurangabad", "Daudnagar", "Obra", "Nabinagar"],
    Banka: ["Banka", "Amarpur", "Bodhgaya"],
    Begusarai: ["Begusarai", "Barauni", "Teghra", "Bakhri"],
    Bhagalpur: ["Bhagalpur", "Kahalgaon", "Naugachhia", "Sultanganj"],
    Bhojpur: ["Ara", "Jagdispur", "Piro", "Bihiya"],
    Buxar: ["Buxar", "Dumraon", "Simri"],
    Darbhanga: ["Darbhanga", "Benipur", "Baheri", "Biraul"],
    EastChamparan: ["Motihari", "Raxaul", "Areraj", "Chakia", "Dhaka"],
    Gaya: ["Gaya", "Bodh Gaya", "Sherghati", "Tekari"],
    Gopalganj: ["Gopalganj", "Mirganj", "Barauli"],
    Jamui: ["Jamui", "Jhajha", "Sikandra"],
    Jehanabad: ["Jehanabad", "Makhdumpur", "Ghoshi"],
    Kaimur: ["Bhabua", "Mohania", "Ramgarh"],
    Katihar: ["Katihar", "Barsoi", "Manihari"],
    Khagaria: ["Khagaria", "Gogri", "Parbatta"],
    Kishanganj: ["Kishanganj", "Bahadurganj", "Thakurganj"],
    Lakhisarai: ["Lakhisarai", "Barahiya", "Pipariya"],
    Madhepura: ["Madhepura", "Udakishunganj", "Murliganj"],
    Madhubani: ["Madhubani", "Jhanjharpur", "Benipatti", "Jaynagar"],
    Munger: ["Munger", "Jamalpur", "Kharagpur"],
    Muzaffarpur: ["Muzaffarpur", "Hajipur", "Kanti", "Motipur"],
    Nalanda: ["Bihar Sharif", "Rajgir", "Hilsa", "Nalanda"],
    Nawada: ["Nawada", "Rajauli", "Hisua"],
    Patna: ["Patna", "Danapur", "Phulwari Sharif", "Patna Sahib", "Barh", "Masaurhi", "Mokama"],
    Purnia: ["Purnia", "Banmankhi", "Dhamdaha"],
    Rohtas: ["Sasaram", "Dehri", "Bikramganj"],
    Saharsa: ["Saharsa", "Simri Bakhtiyarpur"],
    Samastipur: ["Samastipur", "Dalsinghsarai", "Rosera", "Pusa"],
    Saran: ["Chhapra", "Sonpur", "Marhaura", "Revelganj"],
    Sheikhpura: ["Sheikhpura", "Barbigha"],
    Sheohar: ["Sheohar", "Tariyani"],
    Sitamarhi: ["Sitamarhi", "Pupri", "Bairgania"],
    Siwan: ["Siwan", "Maharajganj", "Mairwa"],
    Supaul: ["Supaul", "Triveniganj", "Nirmali"],
    Vaishali: ["Hajipur", "Mahnar", "Lalganj"],
    WestChamparan: ["Bettiah", "Bagaha", "Narkatiaganj"]
  },
  Chhattisgarh: {
    Balod: ["Balod", "Dalli Rajhara", "Gurur", "Gunderdehi"],
    BalodaBazar: ["Baloda Bazar", "Bhatapara", "Simga", "Kasdol"],
    Balrampur: ["Balrampur", "Ramanujganj", "Wadrafnagar"],
    Bastar: ["Jagdalpur", "Bastanar", "Bhanpuri"],
    Bemetara: ["Bemetara", "Navagarh", "Berla", "Saja"],
    Bijapur: ["Bijapur", "Bhairamgarh", "Bhopalpattanam"],
    Bilaspur: ["Bilaspur", "Kota", "Takhatpur", "Bilha"],
    Dantewada: ["Dantewada", "Gidam", "Kirandul", "Bade Bacheli"],
    Dhamtari: ["Dhamtari", "Kurud", "Nagri"],
    Durg: ["Durg", "Bhilai", "Patan", "Kumhari"],
    Gariaband: ["Gariaband", "Rajim", "Chhura", "Deobhog"],
    GaurelaPendraMarwahi: ["Gaurela", "Pendra", "Marwahi"],
    JanjgirChampa: ["Janjgir", "Champa", "Naila", "Akaltara", "Nawagarh"],
    Jashpur: ["Jashpur Nagar", "Kunkuri", "Pathalgaon", "Bagicha"],
    Kabirdham: ["Kawardha", "Pandariya", "Bodla"],
    Kanker: ["Kanker", "Charama", "Bhanupratappur", "Antagarh"],
    KhairagarhChhuikhadanGandai: ["Khairagarh", "Chhuikhadan", "Gandai"],
    Kondagaon: ["Kondagaon", "Keshkal", "Farasgaon"],
    Korba: ["Korba", "Katghora", "Pali", "Deepka"],
    Koriya: ["Baikunthpur", "Sonhat"],
    Mahasamund: ["Mahasamund", "Pithora", "Saraipali", "Basna"],
    ManendragarhChirmiriBharatpur: ["Manendragarh", "Chirmiri", "Bharatpur"],
    MohlaManpurAmbagarhChowki: ["Mohla", "Manpur", "Ambagarh Chowki"],
    Mungeli: ["Mungeli", "Lormi", "Patharia"],
    Narayanpur: ["Narayanpur", "Orcha"],
    Raigarh: ["Raigarh", "Gharghoda", "Kharsia", "Lailunga"],
    Raipur: ["Raipur", "Abhanpur", "Arang", "Tilda Newra"],
    Rajnandgaon: ["Rajnandgaon", "Dongargarh", "Dongargaon"],
    Sakti: ["Sakti", "Jaijaipur", "Malkharoda"],
    SarangarhBilaigarh: ["Sarangarh", "Bilaigarh", "Baramkela"],
    Sukma: ["Sukma", "Konta", "Chhintagufa"],
    Surajpur: ["Surajpur", "Bhaiyathan", "Pratappur", "Bishrampur"],
    Surguja: ["Ambikapur", "Sitapur", "Udaypur", "Lundra"]
  },
  Kerala: {
    Alappuzha: ["Alappuzha", "Cherthala", "Kayamkulam", "Chengannur", "Haripad", "Mavelikkara"],
    Ernakulam: ["Kochi", "Kochi City", "Aluva", "Muvattupuzha", "Angamaly", "Perumbavoor", "Paravur"],
    Idukki: ["Thodupuzha", "Munnar", "Kattappana", "Adimali", "Nedumkandam"],
    Kannur: ["Kannur", "Thalassery", "Payyanur", "Mattannur", "Iritty", "Taliparamba"],
    Kasaragod: ["Kasaragod", "Kanhangad", "Nileshwaram", "Uppala"],
    Kollam: ["Kollam", "Punalur", "Karunagappally", "Paravur", "Kottarakkara"],
    Kottayam: ["Kottayam", "Changanassery", "Pala", "Vaikom", "Ettumanoor"],
    Kozhikode: ["Kozhikode", "Vatakara", "Koyilandy", "Ramanattukara", "Feroke"],
    Malappuram: ["Malappuram", "Manjeri", "Tirur", "Perinthalmanna", "Ponnani", "Nilambur"],
    Palakkad: ["Palakkad", "Ottapalam", "Shoranur", "Chittur", "Mannarkkad"],
    Pathanamthitta: ["Pathanamthitta", "Tiruvalla", "Adoor", "Ranni", "Pandalam"],
    Thiruvananthapuram: ["Thiruvananthapuram", "Neyyattinkara", "Attingal", "Varkala", "Nedumangad"],
    Thrissur: ["Thrissur", "Guruvayur", "Irinjalakuda", "Chalakudy", "Kodungallur"],
    Wayanad: ["Kalpetta", "Mananthavady", "Sultan Bathery"]
  },
  Manipur: {
    Bishnupur: ["Bishnupur", "Moirang", "Nambol"],
    Chandel: ["Chandel", "Chakpikarong"],
    Churachandpur: ["Churachandpur (Lamka)", "Singngat", "Thanlon"],
    ImphalEast: ["Porompat", "Lamlai", "Keirao Bitra"],
    ImphalWest: ["Imphal", "Lamsang", "Patsoi", "Wangoi"],
    Jiribam: ["Jiribam", "Borobekra"],
    Kakching: ["Kakching", "Wabagai", "Sugnoo"],
    Kamjong: ["Kamjong", "Sahamphung", "Kasom Khullen"],
    Kangpokpi: ["Kangpokpi", "Saikul", "Saitu Gamphazol"],
    Noney: ["Noney (Longmai)", "Khoupum", "Nungba"],
    Pherzawl: ["Pherzawl", "Vangai Range", "Tipaimukh"],
    Senapati: ["Senapati", "Mao", "Tadubi", "Paomata"],
    Tamenglong: ["Tamenglong", "Tamei", "Tousem"],
    Tengnoupal: ["Tengnoupal", "Moreh", "Machhi"],
    Thoubal: ["Thoubal", "Lilong", "Yairipok"],
    Ukhrul: ["Ukhrul", "Lungchhai", "Chingai"]
  },
  Meghalaya: {
    EastGaroHills: ["Williamnagar", "Rongjeng", "Songsak"],
    EastJaintiaHills: ["Khliehriat", "Sutnga", "Saipung"],
    EastKhasiHills: ["Shillong", "Sohra (Cherrapunji)", "Pynursla", "Mawsynram"],
    EasternWestKhasiHills: ["Mairang", "Mawthadraishan"],
    NorthGaroHills: ["Resubelpara", "Mendipathar", "Kharkutta"],
    RiBhoi: ["Nongpoh", "Umsning", "Byrnihat"],
    SouthGaroHills: ["Baghmara", "Chokpot", "Gasuapara"],
    SouthWestGaroHills: ["Ampati", "Zikzak", "Betasing"],
    SouthWestKhasiHills: ["Mawkyrwat", "Ranikor"],
    WestGaroHills: ["Tura", "Phulbari", "Dadenggre", "Tikrikilla"],
    WestJaintiaHills: ["Jowai", "Amlarem", "Thadlaskein"],
    WestKhasiHills: ["Nongstoin", "Mawshynrut"]
  },
  Mizoram: {
    Aizawl: ["Aizawl", "Darlawn", "Sairang", "Tlangnuam"],
    Champhai: ["Champhai", "Khawbung", "Vaphai"],
    Hnahthial: ["Hnahthial", "South Vanlaiphai"],
    Khawzawl: ["Khawzawl", "Rabung"],
    Kolasib: ["Kolasib", "Vairengte", "Bairabi"],
    Lawngtlai: ["Lawngtlai", "Sangau", "Chawngte"],
    Lunglei: ["Lunglei", "Tlabung", "Tawipui"],
    Mamit: ["Mamit", "Zawlnuam", "West Phaileng"],
    Saitual: ["Saitual", "Ngopa"],
    Serchhip: ["Serchhip", "Thenzawl", "North Vanlaiphai"],
    Siaha: ["Siaha", "Tipa (Tuipang)"]
  },
  Nagaland: {
    Chumoukedima: ["Chumoukedima", "Medziphema", "Diphupar"],
    Dimapur: ["Dimapur", "Purana Bazar"],
    Kiphire: ["Kiphire", "Pungro", "Seyochung"],
    Kohima: ["Kohima", "Tseminyu", "Jakhama"],
    Longleng: ["Longleng", "Tamlu"],
    Mokokchung: ["Mokokchung", "Tuli", "Changtongya", "Mangkolemba"],
    Mon: ["Mon", "Tizit", "Aboi", "Tobu"],
    Niuland: ["Niuland", "Kuhuboto"],
    Noklak: ["Noklak", "Thonoknyu"],
    Peren: ["Peren", "Jalukie", "Tening"],
    Phek: ["Phek", "Pfutsero", "Chozuba", "Meluri"],
    Shamator: ["Shamator", "Chessore"],
    Tseminyu: ["Tseminyu", "Tseminyu South"],
    Tuensang: ["Tuensang", "Longkhim", "Noksen"],
    Wokha: ["Wokha", "Bhandari", "Sanis"],
    Zunheboto: ["Zunheboto", "Satakha", "Suruhuto", "Pughoboto"]
  },
  Odisha: {
    Angul: ["Angul", "Talcher", "Pallahara", "Athamallik"],
    Balangir: ["Balangir", "Titilagarh", "Patnagarh", "Kantabanji"],
    Balasore: ["Balasore", "Jaleswar", "Soro", "Basta"],
    Bargarh: ["Bargarh", "Padampur", "Attabira", "Barpali"],
    Bhadrak: ["Bhadrak", "Dhamra", "Chandbali", "Basudevpur"],
    Boudh: ["Boudh", "Kantamal", "Harbhanga"],
    Cuttack: ["Cuttack", "Athagarh", "Banki", "Salipur", "Choudwar"],
    Deogarh: ["Deogarh", "Barkote", "Reamal"],
    Dhenkanal: ["Dhenkanal", "Kamakhyanagar", "Bhuban", "Hindol"],
    Gajapati: ["Paralakhemundi", "Kasinagara", "R.Udayagiri"],
    Ganjam: ["Berhampur", "Chhatrapur", "Hinjilicut", "Aska", "Bhanjanagar"],
    Jagatsinghpur: ["Jagatsinghpur", "Paradeep", "Tirtol"],
    Jajpur: ["Jajpur", "Vyasanagar (Jajpur Road)", "Chandikhole"],
    Jharsuguda: ["Jharsuguda", "Brajarajnagar", "Belpahar"],
    Kalahandi: ["Bhawanipatna", "Junagarh", "Dharamgarh", "Kesinga"],
    Kandhamal: ["Phulbani", "Baliguda", "G.Udayagiri"],
    Kendrapara: ["Kendrapara", "Pattamundai", "Rajnagar"],
    Keonjhar: ["Keonjhar", "Barbil", "Joda", "Anandapur"],
    Khordha: ["Bhubaneswar", "Khordha", "Jatni", "Banapur"],
    Koraput: ["Koraput", "Jeypore", "Sunabeda", "Kotpad"],
    Malkangiri: ["Malkangiri", "Balimela", "Chitrakonda"],
    Mayurbhanj: ["Baripada", "Rairangpur", "Karanjia", "Udala"],
    Nabarangpur: ["Nabarangpur", "Umerkote", "Khatiguda"],
    Nayagarh: ["Nayagarh", "Ranpur", "Khandapada"],
    Nuapada: ["Nuapada", "Khariar", "Khariar Road"],
    Puri: ["Puri", "Konark", "Pipili", "Nimapada"],
    Rayagada: ["Rayagada", "Gunupur", "Muniguda"],
    Sambalpur: ["Sambalpur", "Burla", "Hirakud", "Rairakhol"],
    Sonepur: ["Sonepur", "Birmaharajpur", "Tarbha"],
    Sundargarh: ["Rourkela", "Sundargarh", "Rajgangpur", "Biramitrapur"]
  },
  TamilNadu: {
    Ariyalur: ["Ariyalur", "Udayarpalayam", "Sendurai"],
    Chengalpattu: ["Chengalpattu", "Tambaram", "Mahabalipuram", "Chromepet", "Madurantakam"],
    Chennai: ["Chennai", "Guindy", "T. Nagar", "Adyar", "Velachery", "Mylapore", "Anna Nagar"],
    Coimbatore: ["Coimbatore", "Pollachi", "Mettupalayam", "Sulur", "Valparai"],
    Cuddalore: ["Cuddalore", "Chidambaram", "Panruti", "Neyveli", "Vriddhachalam"],
    Dharmapuri: ["Dharmapuri", "Harur", "Palacode", "Pennagaram"],
    Dindigul: ["Dindigul", "Palani", "Kodaikanal", "Oddanchatram"],
    Erode: ["Erode", "Gobichettipalayam", "Bhavani", "Sathyamangalam", "Perundurai"],
    Kallakurichi: ["Kallakurichi", "Tirukkoyilur", "Sankarapuram", "Ulundurpet"],
    Kanchipuram: ["Kanchipuram", "Sriperumbudur", "Uthiramerur"],
    Kanyakumari: ["Nagercoil", "Kanyakumari", "Padmanabhapuram", "Marthandam", "Thuckalay"],
    Karur: ["Karur", "Kulithalai", "Aravakurichi"],
    Krishnagiri: ["Krishnagiri", "Hosur", "Denkanikottai", "Pochampalli"],
    Madurai: ["Madurai", "Melur", "Thirumangalam", "Usilampatti"],
    Mayiladuthurai: ["Mayiladuthurai", "Sirkazhi", "Tharangambadi"],
    Nagapattinam: ["Nagapattinam", "Velankanni", "Vedaranyam"],
    Namakkal: ["Namakkal", "Rasipuram", "Tiruchengode", "Paramathi-Velur"],
    Nilgiris: ["Udhagamandalam (Ooty)", "Coonoor", "Kotagiri", "Gudalur"],
    Perambalur: ["Perambalur", "Veppanthattai", "Kunnam"],
    Pudukkottai: ["Pudukkottai", "Aranthangi", "Viralimalai", "Avudaiyarkoil"],
    Ramanathapuram: ["Ramanathapuram", "Rameswaram", "Paramakudi", "Keezhakarai"],
    Ranipet: ["Ranipet", "Arakkonam", "Walajapet", "Arcot"],
    Salem: ["Salem", "Attur", "Mettur", "Omalur", "Sankari"],
    Sivaganga: ["Sivaganga", "Karaikudi", "Devakottai", "Manamadurai"],
    Tenkasi: ["Tenkasi", "Sankarankovil", "Kadayanallur", "Shenkottai"],
    Thanjavur: ["Thanjavur", "Kumbakonam", "Pattukkottai", "Orathanadu"],
    Theni: ["Theni", "Periyakulam", "Bodinayakanur", "Cumbum"],
    Thoothukudi: ["Thoothukudi (Tuticorin)", "Tiruchendur", "Kovilpatti", "Ottapidaram"],
    Tiruchirappalli: ["Tiruchirappalli (Trichy)", "Srirangam", "Lalgudi", "Manapparai", "Thuraiyur"],
    Tirunelveli: ["Tirunelveli", "Palayamkottai", "Ambasamudram", "Nanguneri"],
    Tirupathur: ["Tirupathur", "Vaniyambadi", "Ambur"],
    Tiruppur: ["Tiruppur", "Avinashi", "Dharapuram", "Udumalaipettai"],
    Tiruvallur: ["Tiruvallur", "Avadi", "Ponneri", "Poonamallee", "Tiruttani"],
    Tiruvannamalai: ["Tiruvannamalai", "Arani", "Cheyyar", "Chengam"],
    Tiruvarur: ["Tiruvarur", "Mannargudi", "Thiruthuraipoondi"],
    Vellore: ["Vellore", "Katpadi", "Gudiyatham"],
    Viluppuram: ["Viluppuram", "Tindivanam", "Gingee"],
    Virudhunagar: ["Virudhunagar", "Sivakasi", "Rajapalayam", "Satur", "Aruppukottai"]
  },
  Tripura: {
    Dhalai: ["Ambassa", "Kamalpur", "Gandacherra", "Longtharai Valley"],
    Gomati: ["Udaipur", "Amarpur", "Karbook"],
    Khowai: ["Khowai", "Teliamura"],
    NorthTripura: ["Dharmanagar", "Kanchanpur", "Panisagar"],
    Sepahijala: ["Bishramganj", "Sonamura", "Jatrapur"],
    SouthTripura: ["Belonia", "Santirbazar", "Sabroom"],
    Unakoti: ["Kailashahar", "Kumarghat"],
    WestTripura: ["Agartala", "Jirania", "Mohanpur"]
  },
  // 1. Jammu & Kashmir (20 Districts)
  JammuAndKashmir: {
    // Jammu Division
    Doda: ["Doda", "Bhaderwah", "Gandoh", "Thathri"],
    Jammu: ["Jammu", "Akhnoor", "RS Pura", "Bishnah", "Nagrota"],
    Kathua: ["Kathua", "Hiranagar", "Basohli", "Billawar"],
    Kishtwar: ["Kishtwar", "Paddar", "Chhatroo", "Marwah"],
    Poonch: ["Poonch", "Surankote", "Mendhar", "Mandi"],
    Rajouri: ["Rajouri", "Nowshera", "Kalakote", "Sunderbani", "Budhal"],
    Ramban: ["Ramban", "Banihal", "Batote", "Gool"],
    Reasi: ["Reasi", "Katra", "Mahore", "Pouni"],
    Samba: ["Samba", "Vijaypur", "Ramgarh", "Gagwal"],
    Udhampur: ["Udhampur", "Ramnagar", "Chenani", "Majalta"],

    // Kashmir Division
    Anantnag: ["Anantnag", "Pahalgam", "Bijbehara", "Kokernag", "Dooru"],
    Bandipora: ["Bandipora", "Gurez", "Sumbal"],
    Baramulla: ["Baramulla", "Sopore", "Gulmarg", "Pattan", "Uri"],
    Budgam: ["Budgam", "Beerwah", "Chadoora", "Magam", "Khansahib"],
    Ganderbal: ["Ganderbal", "Kangan", "Sonamarg", "Tulmulla"],
    Kulgam: ["Kulgam", "D H Pora", "Devsar", "Qazigund"],
    Kupwara: ["Kupwara", "Handwara", "Tangdhar", "Sogam"],
    Pulwama: ["Pulwama", "Pampore", "Tral", "Awantipora"],
    Shopian: ["Shopian", "Zainapora", "Keller"],
    Srinagar: ["Srinagar", "Hazratbal", "Pantha Chowk", "Eidgah"]
  },

  // 2. Ladakh (8 Districts)
  Ladakh: {
    Changthang: ["Nyoma", "Durbuk", "Hanle", "Tangtse"],
    Drass: ["Drass", "Thasgam", "Bhimbat"],
    Kargil: ["Kargil", "Shakar Chiktan", "Sodh"],
    Leh: ["Leh", "Thiksey", "Hemis", "Shey"],
    Nubra: ["Diskit", "Hunder", "Turtuk", "Panamik"],
    Sankoo: ["Sankoo", "Trespone", "Panikhar"],
    Sham: ["Khaltsi", "Bazgo", "Likir", "Aryan Valley"],
    Zanskar: ["Padum", "Phey", "Karsha", "Cha"]
  },

  // 3. Andaman and Nicobar Islands (3 Districts)
  AndamanAndNicobarIslands: {
    SouthAndaman: ["Port Blair", "Ferrargunj", "Garacharma"],
    NorthAndMiddleAndaman: ["Mayabunder", "Diglipur", "Rangat"],
    Nicobar: ["Car Nicobar", "Nancowry", "Campbell Bay"]
  },

  // 4. Chandigarh (1 District)
  Chandigarh: {
    Chandigarh: ["Chandigarh City", "Manimajra", "Industrial Area"]
  },

  // 5. Dadra and Nagar Haveli and Daman and Diu (3 Districts)
  DadraAndNagarHaveliAndDamanAndDiu: {
    DadraAndNagarHaveli: ["Silvassa", "Khanvel", "Rakholi"],
    Daman: ["Daman", "Moti Daman", "Nani Daman"],
    Diu: ["Diu", "Ghoghla", "Bucharwada"]
  },

  // 6. Lakshadweep (1 District)
  Lakshadweep: {
    Lakshadweep: ["Kavaratti", "Agatti", "Minicoy", "Amini", "Kalpeni", "Kadmat"]
  },

  // 7. Puducherry (4 Districts)
  Puducherry: {
    Puducherry: ["Puducherry", "Ozhukarai", "Villianur", "Bahour"],
    Karaikal: ["Karaikal", "Thirunallar", "Kottucherry"],
    Mahe: ["Mahe", "Cherukallayi"],
    Yanam: ["Yanam"]
  }
};