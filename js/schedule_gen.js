// UPSC CSE 2027 Schedule Generator Engine

function getLocalDateString(date = new Date()) {
  const pad = (n) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}
window.getLocalDateString = getLocalDateString;

/**
 * Question Bank mapped to topic IDs for Daily Answer Writing (AW)
 */
const QuestionBank = {
  // GS 1 Art & Culture
  "gs1_art_culture": [
    "Q1: Assess the significance of Temple architecture under the Chola dynasty. How did it reflect their socio-cultural life? (150 words)",
    "Q2: Discuss the major schools of ancient Indian philosophy, highlighting the distinction between orthodox and heterodox schools. (250 words)",
    "Q3: Gandhara sculpture owed as much to the Romans as to the Greeks. Critically analyze. (150 words)",
    "Q4: Explain the architectural and artistic features of Rock-cut architecture in India with examples. (250 words)",
    "Q5: Highlight the cultural and literary contributions of the Gupta period. Why is it termed the Golden Age? (250 words)"
  ],
  // GS 1 Ancient & Medieval
  "gs1_ancient_medieval": [
    "Q1: Evaluate the socio-economic factors that led to the rise of Buddhism and Jainism in the 6th century BCE. (150 words)",
    "Q2: Analyze the administrative features of the Vijayanagara Empire with special reference to the Nayankara system. (250 words)",
    "Q3: Discuss the evolution of the Bhakti movement in India. How did it act as a force for social reform? (250 words)",
    "Q4: Critically examine the agrarian and market reforms of Alauddin Khalji. (150 words)",
    "Q5: Assess the impact of the Sufi movement on Indian society and its synthesis with local traditions. (150 words)"
  ],
  // GS 1 Modern History
  "gs1_modern_history": [
    "Q1: Why did the Battle of Buxar prove to be more decisive than the Battle of Plassey for British expansion in India? (150 words)",
    "Q2: Critically evaluate the impact of British economic policies on the traditional Indian handicraft industry. (250 words)",
    "Q3: Explain the significance of the 1857 Revolt. Was it a planned national war of independence or a mutiny? (250 words)",
    "Q4: Examine the role of socio-religious reform movements in the 19th century in preparing the ground for nationalism. (150 words)",
    "Q5: Discuss the drain of wealth theory propounded by Dadabhai Naoroji and its role in early nationalist awakening. (150 words)"
  ],
  // GS 1 Freedom Struggle
  "gs1_freedom_struggle": [
    "Q1: Compare and contrast the methods and objectives of the Moderates and Extremists in the Indian national movement. (250 words)",
    "Q2: How did the Swadeshi movement mark a major departure from the earlier methods of political struggle? (150 words)",
    "Q3: Analyze the role of Mahatma Gandhi in transforming the Indian national movement into a mass movement. (250 words)",
    "Q4: Examine the significance of the Non-Cooperation Movement and the reasons for its sudden withdrawal. (150 words)",
    "Q5: Discuss the role of revolutionary nationalists in the freedom struggle. How did they differ from the Congress line? (250 words)"
  ],
  // GS 1 Post-Independence
  "gs1_post_independence": [
    "Q1: Discuss the challenges faced by India during the linguistic reorganization of states in the 1950s. (250 words)",
    "Q2: Analyze the factors leading to the declaration of Emergency in 1975 and its lessons for Indian democracy. (250 words)",
    "Q3: How was the integration of princely states, especially Hyderabad and Kashmir, achieved? Discuss the role of Sardar Patel. (250 words)"
  ],
  // GS 1 World History
  "gs1_world_history": [
    "Q1: Explain how the Industrial Revolution altered the socio-economic landscape of Europe in the 19th century. (250 words)",
    "Q2: Discuss the causes and global geopolitical consequences of the First World War. (250 words)",
    "Q3: Critically analyze the philosophy of Marxism and its implementation in post-revolution Russia. (250 words)"
  ],
  // GS 1 Indian Society
  "gs1_indian_society": [
    "Q1: 'Caste system in India is acquiring new forms while retaining its ancient rigidity.' Discuss. (250 words)",
    "Q2: Explain the impact of demographic dividend on India's growth. What are the key bottlenecks in reaping its benefits? (150 words)",
    "Q3: Critically analyze the causes and consequences of rural-to-urban migration in India. (250 words)",
    "Q4: Discuss the role of women's organizations in addressing gender issues in post-independence India. (150 words)",
    "Q5: 'Poverty is not just a lack of income but a deprivation of capability.' Discuss in the Indian context. (250 words)"
  ],
  // GS 1 Globalization
  "gs1_globalization_effects": [
    "Q1: Discuss the impact of globalization on the elderly population and family structures in India. (150 words)",
    "Q2: How does regionalism act as a double-edged sword in Indian polity? Explain with examples. (250 words)",
    "Q3: Distinguish between communalism and secularism. How does communalism pose a threat to national integration? (250 words)"
  ],
  // GS 1 Physical Geography
  "gs1_physical_geography": [
    "Q1: Explain the theory of Plate Tectonics and how it accounts for the formation of fold mountains. (250 words)",
    "Q2: Discuss the factors influencing the origin and development of tropical cyclones. (150 words)",
    "Q3: Analyze the vertical temperature profile of the atmosphere and its climatic significance. (250 words)",
    "Q4: Explain the mechanism of the Indian Monsoon and the role of the El Nino phenomenon. (250 words)",
    "Q5: What are ocean currents? Explain the factors responsible for their circulation. (150 words)"
  ],
  // GS 1 Resource Distribution
  "gs1_resource_distribution": [
    "Q1: Account for the concentration of iron and steel industries in the Chota Nagpur plateau region. (150 words)",
    "Q2: Discuss the global distribution of petroleum reserves and the geopolitical shifts associated with it. (250 words)",
    "Q3: Analyze the factors responsible for the location of the IT industry in Silicon Valley and Bengaluru. (150 words)"
  ],
  // GS 1 Geophysical Phenomena
  "gs1_geophysical_phenomena": [
    "Q1: Discuss the causes and distribution of earthquakes in India. Highlight India's seismic zones. (250 words)",
    "Q2: Explain the mechanism of Landslides in the Himalayan and Western Ghats regions. Compare them. (250 words)",
    "Q3: How is global warming causing changes in critical geographical features? Discuss with reference to glaciers and coral reefs. (250 words)"
  ],

  // GS 2 Constitution Basics
  "gs2_constitution_basics": [
    "Q1: Explain the significance of the Basic Structure doctrine in maintaining the balance of power in Indian democracy. (250 words)",
    "Q2: How does the Indian constitution combine rigidity and flexibility? Discuss with examples of amendment procedures. (150 words)",
    "Q3: Discuss the constitutional significance of the Preamble. Can it be amended under Article 368? (150 words)",
    "Q4: Analyze the friction between Fundamental Rights and Directive Principles of State Policy. How has the judiciary resolved it? (250 words)",
    "Q5: Critically examine the federal features of the Indian Constitution. Is India a quasi-federal state? (250 words)"
  ],
  // GS 2 Union & States
  "gs2_union_states": [
    "Q1: Discuss the role of the Governor as a constitutional head and a federal link, highlighting recent controversies. (250 words)",
    "Q2: Examine the issues and challenges facing local governments (PRIs) in financial autonomy and functional devolution. (250 words)",
    "Q3: How does the GST Council reflect the principles of cooperative federalism? Discuss. (150 words)"
  ],
  // GS 2 Separation of Powers
  "gs2_separation_powers": [
    "Q1: Critically evaluate the working of the separation of powers between the Judiciary and the Executive in India. (250 words)",
    "Q2: What is Judicial Activism? How does it differ from Judicial Overreach? Discuss with examples. (250 words)",
    "Q3: Explain the role of the tribunal system in India and the challenges regarding their independence. (150 words)"
  ],
  // GS 2 Parliament
  "gs2_parliament_legislatures": [
    "Q1: Critically examine the declining productivity and scrutiny of bills in the Indian Parliament. (250 words)",
    "Q2: Discuss the significance of parliamentary committees in ensuring executive accountability. (150 words)",
    "Q3: Explain the anti-defection law (10th Schedule). Has it succeeded in checking political defections? Discuss loopholes. (250 words)"
  ],
  // GS 2 Executive & Judiciary
  "gs2_judiciary_executive": [
    "Q1: Analyze the process of judicial appointments in India. Discuss the debate between the Collegium system and NJAC. (250 words)",
    "Q2: Explain the role of Pressure Groups in influencing policymaking and government decisions in India. (150 words)",
    "Q3: Assess the power of the President of India to grant pardons under Article 72. (150 words)"
  ],
  // GS 2 Representation of People's Act
  "gs2_rp_act": [
    "Q1: Discuss the key provisions of the Representation of the People Act, 1951, regarding disqualification of legislators. (250 words)",
    "Q2: How does the RP Act, 1951, ensure free and fair elections in India? What are the key reform areas? (250 words)"
  ],
  // GS 2 Constitutional & Statutory Bodies
  "gs2_constitutional_bodies": [
    "Q1: Examine the constitutional role and independence of the Comptroller and Auditor General (CAG) of India. (250 words)",
    "Q2: Discuss the mandate and functions of the Election Commission of India. How does it tackle model code of conduct violations? (250 words)",
    "Q3: Explain the role of the Finance Commission in fiscal federalism. Highlight key terms of reference of the latest commission. (250 words)"
  ],
  // GS 2 Government Policies & Schemes
  "gs2_schemes_policies": [
    "Q1: Critically evaluate the implementation of the PM-KISAN scheme in promoting farmers' welfare. (250 words)",
    "Q2: Explain the digital push in welfare delivery in India. Discuss the benefits and challenges of DBT and Aadhaar. (250 words)",
    "Q3: Analyze the performance of Ayushman Bharat PM-JAY in reducing out-of-pocket expenditure on health. (250 words)"
  ],
  // GS 2 Development Sector
  "gs2_development_sector": [
    "Q1: Discuss the role of Self-Help Groups (SHGs) in women's empowerment and rural development. (150 words)",
    "Q2: Critically examine the regulatory framework governing NGOs in India, with reference to FCRA regulations. (250 words)"
  ],
  // GS 2 Social Justice
  "gs2_social_justice": [
    "Q1: Discuss the welfare measures taken by the government for the upliftment of Scheduled Castes and Scheduled Tribes. (250 words)",
    "Q2: Assess the effectiveness of the Rights of Persons with Disabilities Act, 2016. (150 words)",
    "Q3: Analyze the challenges in implementing child protection laws in India. (150 words)"
  ],
  // GS 2 Health, Education & HR
  "gs2_health_education": [
    "Q1: Discuss the key features of the National Education Policy (NEP) 2020. How does it aim to reform primary and higher education? (250 words)",
    "Q2: Analyze the structural bottlenecks in India's public healthcare infrastructure. How can public-private partnership help? (250 words)",
    "Q3: Explain the concept of Skill India. How can it bridge the gap between education and employability? (150 words)"
  ],
  // GS 2 Poverty & Hunger
  "gs2_poverty_hunger": [
    "Q1: India ranks low on the Global Hunger Index despite being food surplus. Critically analyze the reasons. (250 words)",
    "Q2: Discuss the multidimensional nature of poverty in India and the role of NITI Aayog's MPI in measuring it. (250 words)"
  ],
  // GS 2 Governance
  "gs2_governance_transparency": [
    "Q1: Explain how the Right to Information (RTI) Act, 2005, has empowered citizens and enhanced administrative accountability. (250 words)",
    "Q2: Discuss the significance and challenges of implementing Citizens' Charters in government offices. (150 words)",
    "Q3: Critically examine the role of e-governance in minimizing corruption and improving service delivery. (250 words)"
  ],
  // GS 2 Civil Services
  "gs2_civil_services": [
    "Q1: Explain the role of civil services in maintaining continuity and stability in a democratic setup. (150 words)",
    "Q2: Discuss the need for lateral entry into civil services. What are the merits and concerns associated with it? (250 words)"
  ],
  // GS 2 IR Neighbors
  "gs2_ir_neighbors": [
    "Q1: Discuss the strategic and economic significance of India's 'Neighbourhood First' policy. (250 words)",
    "Q2: Analyze the border disputes and security challenges in India-China relations in recent years. (250 words)",
    "Q3: Assess the impact of political instability in Bangladesh on India's security and regional interests. (150 words)"
  ],
  // GS 2 IR Bilateral & Global
  "gs2_ir_bilateral_global": [
    "Q1: Discuss the geopolitical and strategic significance of the QUAD grouping for India in the Indo-Pacific region. (250 words)",
    "Q2: Explain the significance of the India-Middle East-Europe Economic Corridor (IMEC) as an alternative to BRI. (250 words)",
    "Q3: Assess the growing partnership between India and the United States in defense and critical technologies. (150 words)"
  ],
  // GS 2 IR Developed & Developing
  "gs2_ir_developed_developing": [
    "Q1: How does the US-China trade rivalry impact the trade interests of developing countries like India? (250 words)",
    "Q2: Discuss the role and influence of the Indian Diaspora in enhancing India's soft power and diplomatic relations. (150 words)"
  ],
  // GS 2 IR Institutions
  "gs2_ir_institutions": [
    "Q1: Critically evaluate the need for reforms in the United Nations Security Council (UNSC) to reflect contemporary realities. (250 words)",
    "Q2: Explain the role of WTO in international trade. What are the key points of dispute between developed and developing nations? (250 words)"
  ],

  // GS 3 Economy Growth
  "gs3_growth_employment": [
    "Q1: Distinguish between economic growth and economic development. How can India achieve jobless-less growth? (250 words)",
    "Q2: Discuss the challenges in resource mobilization for capital expenditure in India. (150 words)",
    "Q3: Critically analyze the current state of employment in India, with reference to the rise of the gig economy. (250 words)"
  ],
  // GS 3 Inclusive Growth
  "gs3_inclusive_growth": [
    "Q1: What is inclusive growth? Discuss the key pillars of inclusive growth in India's development strategy. (250 words)",
    "Q2: Explain the role of financial inclusion schemes like PM Jan Dhan Yojana in achieving social empowerment. (150 words)"
  ],
  // GS 3 Budgeting
  "gs3_budgeting": [
    "Q1: Explain the concept of Fiscal Deficit. What are the implications of high fiscal deficit on the economy? (250 words)",
    "Q2: Critically evaluate the structure and benefits of GST in simplifying India's indirect tax regime. (250 words)"
  ],
  // GS 3 Agriculture Cropping
  "gs3_agriculture_cropping": [
    "Q1: Discuss the major cropping patterns in India and the factors driving shifts towards commercial crops. (250 words)",
    "Q2: Explain the various methods of micro-irrigation and their role in sustainable water management in agriculture. (250 words)",
    "Q3: Analyze the bottlenecks in agricultural marketing in India. How can e-NAM resolve these? (250 words)"
  ],
  // GS 3 Agriculture MSP
  "gs3_agriculture_msp_subsidies": [
    "Q1: Discuss the economic and ecological consequences of open-ended procurement and high MSP on wheat and rice. (250 words)",
    "Q2: Explain the debate surrounding farm subsidies in India. How do these subsidies impact WTO negotiations? (250 words)",
    "Q3: Critically evaluate the functioning and limitations of the Public Distribution System (PDS) in India. (250 words)"
  ],
  // GS 3 Food Processing
  "gs3_food_processing": [
    "Q1: Discuss the scope and significance of the food processing industry in doubling farmers' income in India. (250 words)",
    "Q2: Analyze the supply chain bottlenecks facing the food processing sector in India. (150 words)"
  ],
  // GS 3 Land Reforms
  "gs3_land_reforms": [
    "Q1: Evaluate the success of land reforms in India, particularly ceiling laws and tenancy reforms. (250 words)",
    "Q2: How did land reforms contribute to agricultural growth and rural poverty alleviation? (150 words)"
  ],
  // GS 3 Liberalization & Infrastructure
  "gs3_liberalization": [
    "Q1: Assess the impact of the 1991 economic reforms on the industrial growth of India. (250 words)",
    "Q2: Discuss the Public-Private Partnership (PPP) models in infrastructure development, highlighting the HAM model. (250 words)",
    "Q3: What is the PM Gati Shakti National Master Plan? How does it aim to achieve integrated infrastructure development? (250 words)"
  ],
  // GS 3 Science & Tech
  "gs3_science_tech": [
    "Q1: Discuss the contributions of Indian scientists in the field of space research, with reference to Chandrayaan and Gaganyaan. (250 words)",
    "Q2: Explain the concept of 'indigenization of technology' in the defense sector. What are the key initiatives? (250 words)"
  ],
  // GS 3 IT, Space, Computers
  "gs3_it_space_computers": [
    "Q1: Discuss the ethical and security challenges posed by the rapid adoption of Artificial Intelligence (AI). (250 words)",
    "Q2: What is Biotechnology? Discuss its applications in agriculture (GM crops) and medicine. (250 words)",
    "Q3: Explain the concept of Intellectual Property Rights (IPR) and its significance for Indian startups. (150 words)"
  ],
  // GS 3 Environment & Conservation
  "gs3_environment_conservation": [
    "Q1: Critically evaluate India's commitments and progress under the Paris Agreement (COP21) and Glasgow Summit. (250 words)",
    "Q2: Discuss the causes and impacts of Air Pollution in urban India. Suggest a comprehensive strategy to tackle it. (250 words)",
    "Q3: Explain the concept of Environmental Impact Assessment (EIA). Critically evaluate the draft EIA notification, 2020. (250 words)"
  ],
  // GS 3 Disaster Management
  "gs3_disaster_management": [
    "Q1: Discuss India's vulnerability to disasters. Highlight the role of the National Disaster Management Authority (NDMA). (250 words)",
    "Q2: Suggest structural and non-structural measures for mitigating Urban Flooding in India's metro cities. (250 words)",
    "Q3: Explain the mechanism of Glacial Lake Outburst Floods (GLOFs) and mitigation strategies. (150 words)"
  ],
  // GS 3 Internal Security Extremism
  "gs3_internal_security_extremism": [
    "Q1: Analyze the linkages between lack of development and the spread of Left-Wing Extremism (LWE) in India. (250 words)",
    "Q2: What are the main factors behind tribal alienation in Central India? How has it fueled Naxalism? (250 words)"
  ],
  // GS 3 Security State & Non-state
  "gs3_security_state_nonstate": [
    "Q1: Discuss the threats posed by state-sponsored cyber warfare to India's critical information infrastructure. (250 words)",
    "Q2: Critically examine the role of cross-border infiltration in Jammu and Kashmir and security measures taken. (250 words)"
  ],
  // GS 3 Security Cyber & Media
  "gs3_security_cyber_media": [
    "Q1: Discuss the role of social media in spreading fake news and inciting communal violence. How should it be regulated? (250 words)",
    "Q2: Explain the concept of Money Laundering. Discuss the provisions of the PMLA, 2002, and its enforcement challenges. (250 words)"
  ],
  // GS 3 Security Borders
  "gs3_security_borders": [
    "Q1: Discuss the challenges in management of India's long and porous international borders. (250 words)",
    "Q2: Assess the role of the Border Security Force (BSF) and other border guarding forces in security management. (150 words)",
    "Q3: Explain the linkages between organized crime, drug trafficking, and terrorism in the golden crescent and golden triangle. (250 words)"
  ],

  // GS 4 Ethics Human Interface
  "gs4_ethics_human_interface": [
    "Q1: 'Ethics is knowing the difference between what you have a right to do and what is right to do.' Comment. (150 words)",
    "Q2: Discuss the role of family and educational institutions in inculcating values in young minds. (150 words)",
    "Q3: Explain the dimensions of ethics in private vs public relationships with suitable examples. (150 words)"
  ],
  // GS 4 Attitude
  "gs4_attitude": [
    "Q1: What is Attitude? How does it influence human behavior? Can an attitude be changed? (150 words)",
    "Q2: Differentiate between moral attitude and political attitude. Explain with real-world examples. (150 words)",
    "Q3: Explain the role of persuasion in administration. How can a public servant persuade citizens to adopt hygiene practices? (150 words)"
  ],
  // GS 4 Aptitude
  "gs4_aptitude_foundational": [
    "Q1: Integrity is the most crucial value of a public servant. Discuss the distinction between intellectual and moral integrity. (150 words)",
    "Q2: Discuss how compassion towards the weaker sections is a essential value for an administrator in a developing country like India. (150 words)",
    "Q3: What do you understand by 'objectivity' in public service? Why is it considered a foundational value? (150 words)"
  ],
  // GS 4 Emotional Intelligence
  "gs4_emotional_intelligence": [
    "Q1: What is Emotional Intelligence (EI)? How does it help a public servant in conflict resolution and crisis management? (150 words)",
    "Q2: Differentiate between empathy and sympathy. How does emotional intelligence enhance empathy in civil servants? (150 words)"
  ],
  // GS 4 Philosophers Thinkers
  "gs4_philosophers_thinkers": [
    "Q1: 'An unexamined life is not worth living.' Analyze this statement of Socrates in the context of civil services. (150 words)",
    "Q2: Discuss Gandhiji's concept of 'Seven Social Sins' and its relevance in contemporary administrative ethics. (150 words)",
    "Q3: Explain Kant's Deontological ethics and compare it with Utilitarianism in public decision-making. (150 words)"
  ],
  // GS 4 Public Service Values
  "gs4_public_service_values": [
    "Q1: Explain the ethical dilemmas faced by public servants in balancing developmental goals with environmental preservation. (150 words)",
    "Q2: What is the Nolan Committee's Seven Principles of Public Life? Discuss any three with administrative examples. (150 words)",
    "Q3: Critically discuss the ethical issues involved in corporate funding of political parties. (150 words)"
  ],
  // GS 4 Probity Governance
  "gs4_probity_governance": [
    "Q1: Differentiate between Code of Conduct and Code of Ethics. Why does India need a comprehensive Code of Ethics? (150 words)",
    "Q2: What is Work Culture? How can a healthy work culture improve efficiency and citizen-centric service delivery? (150 words)",
    "Q3: Discuss the challenges in implementing the Citizen's Charter in government departments. (150 words)"
  ],
  // GS 4 Case Studies
  "gs4_case_studies": [
    "Q1: [Case Study] You are the DM of a district where a major public protest has erupted against a chemical factory causing pollution. The factory belongs to an influential politician, and closing it down will cause unemployment for 500 local families. How will you resolve this dilemma? (250 words)",
    "Q2: [Case Study] A junior officer reports corruption in a flagship welfare scheme under a senior colleague who is your close friend and mentor. The junior has concrete evidence. Discuss the course of action you will take. (250 words)",
    "Q3: [Case Study] During a natural disaster, a relief camp has run out of supplies. A local group offers to supply food but demands that their religious banners be displayed. The situation is urgent. What ethical issues are involved, and what will you do? (250 words)"
  ],

  // PSIR Paper 1A
  "psir1_theory_meaning": [
    "Q1: Examine the normative approach to political theory. How does it differ from empirical approaches? (250 words)",
    "Q2: Discuss the post-behavioural revolution. How did it seek to make political science relevant? (250 words)"
  ],
  "psir1_state_theories": [
    "Q1: Critically examine the Marxist theory of the State. How does it differ from the liberal-pluralist perspective? (250 words)",
    "Q2: Explain the feminist critique of the state. How do feminists view the public-private divide? (250 words)"
  ],
  "psir1_justice": [
    "Q1: Critically evaluate John Rawls's Difference Principle in his Theory of Justice. (250 words)",
    "Q2: Discuss the communitarian critique of Rawlsian liberalism, with reference to Michael Sandel and Michael Walzer. (250 words)"
  ],
  "psir1_equality": [
    "Q1: Examine the relationship between freedom and equality. Can equality be achieved without sacrificing liberty? (250 words)",
    "Q2: Critically evaluate the justification for affirmative action as a tool for achieving substantive equality. (250 words)"
  ],
  "psir1_rights": [
    "Q1: Discuss the three generations of human rights. How do they reflect changing historical contexts? (250 words)",
    "Q2: Critically evaluate Dworkin's thesis that 'rights are trumps'. (250 words)"
  ],
  "psir1_democracy": [
    "Q1: Compare the representative model of democracy with participatory and deliberative models. (250 words)",
    "Q2: Discuss the concept of the 'democratic deficit' in the era of globalization. (250 words)"
  ],
  "psir1_power": [
    "Q1: Analyze Steven Lukes's three-dimensional view of power. (250 words)",
    "Q2: Discuss Gramsci's concept of Hegemony and its role in sustaining capitalist rule. (250 words)",
    "Q3: Explain Michel Foucault's concept of power-knowledge and bio-power. (250 words)"
  ],
  "psir1_ideologies": [
    "Q1: Examine the core tenets of Classical Liberalism and Neo-liberalism. Contrast them. (250 words)",
    "Q2: Discuss the core concepts of Marxism, particularly historical materialism and alienation. (250 words)",
    "Q3: Evaluate Feminism as a political ideology. Distinguish between liberal, radical, and socialist feminism. (250 words)"
  ],
  "psir1_western_thought": [
    "Q1: 'State is individual writ large.' Examine Plato's concept of ideal state. (250 words)",
    "Q2: 'Aristotle is the father of political science.' Critically analyze this statement. (250 words)",
    "Q3: Discuss Machiavelli's advice to the Prince on statecraft, morality, and power. (250 words)",
    "Q4: Compare Hobbes's and Locke's social contract theories, highlighting their views on sovereignty. (250 words)",
    "Q5: Analyze JS Mill's views on representative government and his status as a 'reluctant democrat'. (250 words)",
    "Q6: Examine Marx's critique of capitalism and his concept of communism. (250 words)",
    "Q7: Discuss Hannah Arendt's analysis of totalitarianism and her concept of active citizenship. (250 words)"
  ],
  "psir1_indian_thought": [
    "Q1: Examine Kautilya's Saptanga theory of the state and its relevance to modern statecraft. (250 words)",
    "Q2: Discuss Mahatma Gandhi's concept of Satyagraha, Swaraj, and Trusteeship. (250 words)",
    "Q3: Analyze B.R. Ambedkar's critique of the caste system and his vision of social democracy. (250 words)"
  ],

  // PSIR Paper 1B
  "psir1_indian_nationalism": [
    "Q1: Critically evaluate the Marxist perspective on the Indian National Movement. (250 words)",
    "Q2: How did militant and revolutionary movements impact the strategy of the mainstream freedom struggle? (250 words)"
  ],
  "psir1_constitution_making": [
    "Q1: Discuss the debate on the nature of representation in the Constituent Assembly. Was it a representative body? (250 words)",
    "Q2: Examine the ideological legacies of the British rule in the making of the Indian Constitution. (250 words)"
  ],
  "psir1_constitution_salient": [
    "Q1: Explain the evolution of the basic structure doctrine in Indian constitutional history. (250 words)",
    "Q2: Critically evaluate the exercise of judicial review by the Supreme Court of India. (250 words)"
  ],
  "psir1_grassroots_democracy": [
    "Q1: Has the 73rd Constitutional Amendment succeeded in transferring 'power to the people'? Critically evaluate. (250 words)",
    "Q2: Discuss the socio-political challenges faced by women representatives in local bodies (PRIs). (250 words)"
  ],
  "psir1_federalism": [
    "Q1: Analyze the changing dynamics of centre-state relations in India in the era of coalition politics vs single-party dominance. (250 words)",
    "Q2: Examine the main demands for regional autonomy in India. Are these demands threat to national integration? (250 words)"
  ],
  "psir1_statutory_bodies": [
    "Q1: Critically examine the role of the National Human Rights Commission (NHRC) in protecting human rights in India. (250 words)",
    "Q2: Assess the constitutional independence and effectiveness of the Comptroller and Auditor General (CAG). (250 words)"
  ],
  "psir1_planning_development": [
    "Q1: Compare the Nehruvian model of development with the Gandhian alternative. (250 words)",
    "Q2: Critically evaluate the impact of 1991 economic reforms on the agrarian classes and land relations in India. (250 words)"
  ],
  "psir1_social_identities": [
    "Q1: Discuss the role of caste in Indian elections. Has modernization reduced caste consciousness? (250 words)",
    "Q2: Analyze the rise of communalism in Indian politics, highlighting the debate between secularism and majoritarianism. (250 words)"
  ],
  "psir1_social_movements": [
    "Q1: Explain the features and achievements of the environmental movements in India (e.g., Narmada Bachao, Chipko). (250 words)",
    "Q2: Discuss the evolution of the Dalit movement in post-independence India and its political empowerment strategy. (250 words)"
  ],

  // PSIR Paper 2A
  "psir2_comparative_nature": [
    "Q1: Critically evaluate the political economy approach to the study of comparative politics. (250 words)",
    "Q2: Discuss the limitations of the comparative method in political analysis. (250 words)"
  ],
  "psir2_state_comparative": [
    "Q1: Compare the characteristics of the State in capitalist and socialist economies. (250 words)",
    "Q2: Analyze the nature and challenges of the Post-Colonial State in developing societies. (250 words)"
  ],
  "psir2_politics_representation": [
    "Q1: Compare the role of political parties in advanced industrial democracies with those in developing societies. (250 words)",
    "Q2: Discuss the role of social movements as agents of political change in developing nations. (250 words)"
  ],
  "psir2_globalization_comparative": [
    "Q1: How has globalization affected the state sovereignty in developing countries? Discuss the state responses. (250 words)"
  ],
  "psir2_ir_approaches": [
    "Q1: Compare classical realism with neo-realism (structural realism) in international relations. (250 words)",
    "Q2: Critically examine the Neo-liberal institutionalism approach to international relations. (250 words)",
    "Q3: Discuss the Marxist and World Systems approaches to international relations. (250 words)"
  ],
  "psir2_ir_concepts": [
    "Q1: Define National Interest. How is it formulated, and how do realist and liberal views differ? (250 words)",
    "Q2: Discuss the concept of Balance of Power. Is it still relevant in a unipolar/multipolar world? (250 words)",
    "Q3: Critically analyze the concept of Collective Security under the UN charter. How does it differ from collective defense? (250 words)"
  ],
  "psir2_world_order": [
    "Q1: Evaluate the achievements and failures of the Non-Aligned Movement (NAM) during the Cold War. (250 words)",
    "Q2: Discuss the rise of Unipolarity post-Cold War and the emerging challenges of a Multipolar world. (250 words)",
    "Q3: Is NAM still relevant for India in the contemporary international order? Argue your case. (250 words)"
  ],
  "psir2_international_economy": [
    "Q1: Critically examine the evolution of the WTO and the main disputes between the Global North and Global South. (250 words)",
    "Q2: Discuss the demands for a New International Economic Order (NIEO). Did it achieve its goals? (250 words)"
  ],
  "psir2_united_nations": [
    "Q1: Critically evaluate the performance of the UN in conflict resolution and peacekeeping. (250 words)",
    "Q2: Discuss the arguments in favor of reforming the UN Security Council (UNSC). (250 words)"
  ],
  "psir2_regionalisation": [
    "Q1: Analyze the factors leading to the success of the EU and compare it with SAARC's performance. (250 words)",
    "Q2: Discuss the strategic and economic significance of ASEAN in regional integration in Southeast Asia. (250 words)"
  ],
  "psir2_global_concerns": [
    "Q1: Discuss the debate between universal human rights and cultural relativism. (250 words)",
    "Q2: Analyze the international politics of Climate Change and the conflicts in implementing climate actions. (250 words)"
  ],

  // PSIR Paper 2B
  "psir2_ifp_determinants": [
    "Q1: Discuss the major determinants of India's Foreign Policy, highlighting the role of geography and history. (250 words)",
    "Q2: Examine the continuity and changes in India's Foreign Policy since the end of the Cold War. (250 words)"
  ],
  "psir2_nam_relevance": [
    "Q1: Analyze India's contribution to NAM. How has India's policy of non-alignment evolved into 'Strategic Autonomy'? (250 words)"
  ],
  "psir2_india_south_asia": [
    "Q1: Discuss the obstacles in achieving regional cooperation in South Asia. Why is SAARC practically defunct? (250 words)",
    "Q2: Explain India's 'Act East' policy. How does it differ from the earlier 'Look East' policy? (250 words)",
    "Q3: Critically analyze the river water disputes between India and its neighbors (e.g., Teesta water dispute). (250 words)"
  ],
  "psir2_india_global_south": [
    "Q1: Discuss India's traditional relations with Africa and the recent changes under India-Africa Forums. (250 words)",
    "Q2: Assess India's role as a leader/voice of the Global South in WTO and G20 negotiations. (250 words)"
  ],
  "psir2_india_powers": [
    "Q1: Critically examine the structural drivers of India-US strategic partnership in the 21st century. (250 words)",
    "Q2: Assess India's relations with China. Can economic cooperation coexist with boundary tensions? (250 words)",
    "Q3: Discuss India's relationship with Russia. Is Russia still a time-tested ally for India in the changing geopolitical landscape? (250 words)"
  ],
  "psir2_india_un": [
    "Q1: Argue India's case for a permanent seat in the UN Security Council. What are the major roadblocks? (250 words)"
  ],
  "psir2_indian_ocean": [
    "Q1: Discuss the growing geopolitical rivalries in the Indian Ocean Region (IOR) and India's maritime strategy. (250 words)",
    "Q2: Assess the role of initiatives like SAGAR and Indian Ocean Rim Association (IORA) in India's maritime diplomacy. (250 words)"
  ],
  "psir2_nuclear_policy": [
    "Q1: Critically evaluate India's Nuclear Doctrine. Discuss the arguments for and against the 'No First Use' policy. (250 words)",
    "Q2: Discuss India's position on NPT and CTBT and how India achieved exceptional status under the civil nuclear deal. (250 words)"
]
};

function getQuestionBankKey(id) {
  if (!id) return "";

  // ── GS 1 ──
  if (id.startsWith("gs1_")) {
    if (!id.includes("_p")) return id; // already a named key
    const page = parseInt(id.split("_p")[1]);
    // Ancient & Art (p3)
    if (page === 3) return "gs1_art_culture";
    // Ancient to Medieval History (p4-p6)
    if (page >= 4 && page <= 6) return "gs1_ancient_medieval";
    // Modern History (p7)
    if (page === 7) return "gs1_modern_history";
    // Post Independence (p8)
    if (page === 8) return "gs1_post_independence";
    // World History (p9-p12)
    if (page >= 9 && page <= 12) return "gs1_world_history";
    // Physical Geography (p16-p22)
    if (page >= 16 && page <= 22) return "gs1_physical_geography";
    // Human & Economic Geography / Resource Distribution (p23-p28)
    if (page >= 23 && page <= 28) return "gs1_resource_distribution";
    // Indian Society (p31)
    if (page === 31) return "gs1_indian_society";
    // Globalization & Society (p32)
    if (page === 32) return "gs1_globalization_effects";
  }

  // ── GS 2 ──
  if (id.startsWith("gs2_")) {
    if (!id.includes("_p")) return id;
    const page = parseInt(id.split("_p")[1]);
    // Polity / Constitution (p34-p38)
    if (page >= 34 && page <= 38) return "gs2_constitution_basics";
    // Governance / Civil Services (p40-p42)
    if (page >= 40 && page <= 42) return "gs2_civil_services";
    // E-governance / Governance transparency (p43-p44)
    if (page === 43 || page === 44) return "gs2_governance_transparency";
    // Federal relations / Union-States (p45)
    if (page === 45) return "gs2_union_states";
    // Welfare schemes / Social Justice (p46)
    if (page === 46) return "gs2_schemes_policies";
    // International Relations — neighbors (p51-p52)
    if (page === 51 || page === 52) return "gs2_ir_neighbors";
    // IR — bilateral/multilateral/institutions (p53-p54)
    if (page === 53 || page === 54) return "gs2_ir_bilateral_global";
  }

  // ── GS 3 ──
  if (id.startsWith("gs3_")) {
    if (!id.includes("_p")) return id;
    const page = parseInt(id.split("_p")[1]);
    if (page === 56) return "gs3_growth_employment";
    if (page === 57) return "gs3_inclusive_growth";
    if (page === 58 || page === 59) return "gs3_budgeting";
    if (page === 60) return "gs3_land_reforms";
    if (page === 61 || page === 62) return "gs3_agriculture_cropping";
    if (page === 63) return "gs3_food_processing";
    if (page === 65 || page === 66) return "gs3_science_tech";
    if (page >= 67 && page <= 71) return "gs3_it_space_computers";
    if (page >= 73 && page <= 77) return "gs3_environment_conservation";
    if (page === 80 || page === 81) return "gs3_internal_security_extremism";
    if (page === 83) return "gs3_disaster_management";
  }

  // ── GS 4 ──
  if (id.startsWith("gs4_")) {
    if (!id.includes("_p")) return id;
    const page = parseInt(id.split("_p")[1]);
    if (page === 84) return "gs4_ethics_human_interface";
    if (page === 85) return "gs4_philosophers_thinkers";
    if (page === 86) return "gs4_emotional_intelligence";
    if (page === 87) return "gs4_public_service_values";
    if (page === 88) return "gs4_case_studies";
  }

  // ── PSIR 1 ──
  if (id.startsWith("psir1_")) {
    if (!id.includes("_t")) return id; // already a named key like psir1_theory_meaning
    const topicNum = parseInt(id.split("_t")[1]);
    if (topicNum === 1)  return "psir1_theory_meaning";
    if (topicNum === 2)  return "psir1_state_theories";
    if (topicNum === 3)  return "psir1_justice";
    if (topicNum === 4)  return "psir1_equality";
    if (topicNum === 5)  return "psir1_rights";
    if (topicNum === 6)  return "psir1_democracy";
    if (topicNum === 7)  return "psir1_power";
    if (topicNum === 8)  return "psir1_ideologies";
    if (topicNum === 9)  return "psir1_indian_thought";
    if (topicNum === 10) return "psir1_western_thought";
    if (topicNum === 11) return "psir1_indian_nationalism";
    if (topicNum === 12) return "psir1_constitution_making";
    if (topicNum === 13 || topicNum === 14) return "psir1_constitution_salient";
    if (topicNum === 15) return "psir1_grassroots_democracy";
    if (topicNum === 16) return "psir1_statutory_bodies";
    if (topicNum === 17) return "psir1_federalism";
    if (topicNum === 18) return "psir1_planning_development";
    if (topicNum === 19 || topicNum === 20) return "psir1_social_identities";
    if (topicNum === 21) return "psir1_social_movements";
  }

  // ── PSIR 2 ──
  if (id.startsWith("psir2_")) {
    if (!id.includes("_t")) return id; // already a named key
    const topicNum = parseInt(id.split("_t")[1]);
    if (topicNum === 1)  return "psir2_comparative_nature";
    if (topicNum === 2)  return "psir2_state_comparative";
    if (topicNum === 3)  return "psir2_politics_representation";
    if (topicNum === 4)  return "psir2_globalization_comparative";
    if (topicNum === 5)  return "psir2_ir_approaches";
    if (topicNum === 6)  return "psir2_ir_concepts";
    if (topicNum === 7)  return "psir2_world_order";
    if (topicNum === 8)  return "psir2_international_economy";
    if (topicNum === 9)  return "psir2_united_nations";
    if (topicNum === 10) return "psir2_regionalisation";
    if (topicNum === 11) return "psir2_global_concerns";
    if (topicNum === 12) return "psir2_ifp_determinants";
    if (topicNum === 13) return "psir2_nam_relevance";
    if (topicNum === 14) return "psir2_india_south_asia";
    if (topicNum === 15) return "psir2_india_global_south";
    if (topicNum === 16) return "psir2_india_powers";
    if (topicNum === 17) return "psir2_india_un";
    if (topicNum === 18) return "psir2_indian_ocean";
    if (topicNum === 19) return "psir2_nuclear_policy";
  }

  return id;
}

/**
 * Weekly rotation map of syllabus topics per Phase.
 * There are 5 phases covering June 1, 2026 to May 20, 2027 (~354 days).
 */
const WeeklyRotations = {
  // Phase 1 (June 1 - Aug 31, 2026): Mains & Optional Rev 1 (13 Weeks)
  1: [
    { week: 1, gs: ["gs1_art_culture", "gs1_ancient_medieval"], psir: ["psir1_theory_meaning", "psir1_state_theories"] },
    { week: 2, gs: ["gs1_modern_history", "gs1_freedom_struggle"], psir: ["psir1_justice", "psir1_equality"] },
    { week: 3, gs: ["gs1_indian_society", "gs1_globalization_effects"], psir: ["psir1_rights", "psir1_democracy"] },
    { week: 4, gs: ["gs1_physical_geography", "gs1_geophysical_phenomena"], psir: ["psir1_power", "psir1_ideologies"] },
    { week: 5, gs: ["gs2_constitution_basics", "gs2_union_states"], psir: ["psir1_western_thought"] },
    { week: 6, gs: ["gs2_separation_powers", "gs2_parliament_legislatures"], psir: ["psir1_indian_thought"] },
    { week: 7, gs: ["gs2_judiciary_executive", "gs2_constitutional_bodies"], psir: ["psir1_indian_nationalism", "psir1_constitution_making"] },
    { week: 8, gs: ["gs2_schemes_policies", "gs2_social_justice"], psir: ["psir1_constitution_salient", "psir1_federalism"] },
    { week: 9, gs: ["gs2_health_education", "gs2_poverty_hunger"], psir: ["psir1_grassroots_democracy", "psir1_statutory_bodies"] },
    { week: 10, gs: ["gs3_growth_employment", "gs3_budgeting"], psir: ["psir1_planning_development", "psir1_social_identities", "psir1_social_movements"] },
    { week: 11, gs: ["gs3_agriculture_cropping", "gs3_agriculture_msp_subsidies", "gs3_food_processing"], psir: ["psir2_comparative_nature", "psir2_state_comparative"] },
    { week: 12, gs: ["gs3_liberalization", "gs3_science_tech", "gs3_it_space_computers"], psir: ["psir2_politics_representation", "psir2_globalization_comparative"] },
    { week: 13, gs: ["gs3_environment_conservation", "gs3_disaster_management", "gs3_internal_security_extremism"], psir: ["psir2_ir_approaches", "psir2_ir_concepts"] }
  ],
  // Phase 2 (Sep 1 - Nov 30, 2026): Mains & Optional Rev 2 (13 Weeks)
  2: [
    { week: 14, gs: ["gs1_art_culture", "gs1_ancient_medieval", "gs1_modern_history"], psir: ["psir1_theory_meaning", "psir1_state_theories"] },
    { week: 15, gs: ["gs1_freedom_struggle", "gs1_post_independence", "gs1_world_history"], psir: ["psir1_western_thought"] },
    { week: 16, gs: ["gs1_indian_society", "gs1_globalization_effects", "gs1_physical_geography", "gs1_geophysical_phenomena"], psir: ["psir1_indian_thought", "psir1_justice", "psir1_equality", "psir1_rights"] },
    { week: 17, gs: ["gs2_constitution_basics", "gs2_union_states", "gs2_separation_powers"], psir: ["psir1_democracy", "psir1_power", "psir1_ideologies"] },
    { week: 18, gs: ["gs2_parliament_legislatures", "gs2_judiciary_executive", "gs2_constitutional_bodies"], psir: ["psir1_indian_nationalism", "psir1_constitution_making", "psir1_constitution_salient"] },
    { week: 19, gs: ["gs2_schemes_policies", "gs2_social_justice", "gs2_governance_transparency"], psir: ["psir1_federalism", "psir1_grassroots_democracy", "psir1_statutory_bodies"] },
    { week: 20, gs: ["gs2_ir_neighbors", "gs2_ir_bilateral_global", "gs2_ir_institutions"], psir: ["psir1_planning_development", "psir1_social_identities", "psir1_social_movements"] },
    { week: 21, gs: ["gs3_growth_employment", "gs3_budgeting", "gs3_liberalization"], psir: ["psir2_comparative_nature", "psir2_state_comparative", "psir2_politics_representation"] },
    { week: 22, gs: ["gs3_agriculture_cropping", "gs3_agriculture_msp_subsidies", "gs3_food_processing"], psir: ["psir2_globalization_comparative", "psir2_ir_approaches", "psir2_ir_concepts"] },
    { week: 23, gs: ["gs3_science_tech", "gs3_it_space_computers", "gs3_environment_conservation", "gs3_disaster_management"], psir: ["psir2_world_order", "psir2_international_economy"] },
    { week: 24, gs: ["gs3_internal_security_extremism", "gs3_security_state_nonstate", "gs3_security_cyber_media", "gs3_security_borders"], psir: ["psir2_united_nations", "psir2_regionalisation", "psir2_global_concerns"] },
    { week: 25, gs: ["gs4_ethics_human_interface", "gs4_attitude", "gs4_aptitude_foundational", "gs4_emotional_intelligence"], psir: ["psir2_ifp_determinants", "psir2_nam_relevance"] },
    { week: 26, gs: ["gs4_philosophers_thinkers", "gs4_public_service_values", "gs4_probity_governance", "gs4_case_studies"], psir: ["psir2_india_south_asia", "psir2_india_global_south", "psir2_india_powers", "psir2_india_un", "psir2_indian_ocean", "psir2_nuclear_policy"] }
  ],
  // Phase 3 (Dec 1, 2026 - Feb 15, 2027): Overlap Revision (11 Weeks)
  3: [
    { week: 27, gs: ["gs2_constitution_basics", "gs2_union_states"], psir: ["psir1_constitution_salient", "psir1_federalism"] },
    { week: 28, gs: ["gs2_parliament_legislatures", "gs2_judiciary_executive", "gs2_constitutional_bodies"], psir: ["psir1_grassroots_democracy", "psir1_statutory_bodies"] },
    { week: 29, gs: ["gs3_growth_employment", "gs3_budgeting", "gs3_liberalization"], psir: ["psir1_planning_development"] },
    { week: 30, gs: ["gs3_agriculture_cropping", "gs3_agriculture_msp_subsidies"], psir: ["psir2_international_economy"] },
    { week: 31, gs: ["gs1_modern_history", "gs1_freedom_struggle"], psir: ["psir1_indian_nationalism"] },
    { week: 32, gs: ["gs1_physical_geography", "gs1_geophysical_phenomena"], psir: [] },
    { week: 33, gs: ["gs3_environment_conservation", "gs3_disaster_management"], psir: ["psir2_global_concerns"] },
    { week: 34, gs: ["gs3_science_tech", "gs3_it_space_computers"], psir: [] },
    { week: 35, gs: ["gs2_ir_neighbors", "gs2_ir_bilateral_global"], psir: ["psir2_india_south_asia", "psir2_india_powers"] },
    { week: 36, gs: ["gs2_ir_institutions", "gs3_security_borders"], psir: ["psir2_united_nations", "psir2_indian_ocean", "psir2_nuclear_policy"] },
    { week: 37, gs: ["gs4_ethics_human_interface", "gs4_attitude", "gs4_case_studies"], psir: ["psir1_indian_thought", "psir1_western_thought"] }
  ],
  // Phase 4 (Feb 16 - Apr 15, 2027): Prelims Revision 1 (8 Weeks)
  4: [
    { week: 38, gs: ["gs2_constitution_basics", "gs2_union_states", "gs2_separation_powers", "gs2_parliament_legislatures", "gs2_judiciary_executive", "gs2_constitutional_bodies"], psir: ["psir1_constitution_salient", "psir1_federalism"] },
    { week: 39, gs: ["gs3_growth_employment", "gs3_budgeting", "gs3_liberalization", "gs3_inclusive_growth"], psir: [] },
    { week: 40, gs: ["gs1_modern_history", "gs1_freedom_struggle", "gs1_ancient_medieval", "gs1_art_culture"], psir: [] },
    { week: 41, gs: ["gs1_physical_geography", "gs1_resource_distribution", "gs1_geophysical_phenomena"], psir: [] },
    { week: 42, gs: ["gs3_environment_conservation", "gs3_disaster_management"], psir: [] },
    { week: 43, gs: ["gs3_science_tech", "gs3_it_space_computers"], psir: [] },
    { week: 44, gs: ["gs2_ir_neighbors", "gs2_ir_bilateral_global", "gs2_ir_institutions"], psir: ["psir2_india_south_asia", "psir2_india_powers", "psir2_indian_ocean"] },
    { week: 45, gs: ["gs2_schemes_policies", "gs2_social_justice", "gs2_poverty_hunger"], psir: [] }
  ],
  // Phase 5 (Apr 16 - May 20, 2027): Prelims Revision 2 (5 Weeks)
  5: [
    { week: 46, gs: ["gs2_constitution_basics", "gs2_union_states", "gs2_parliament_legislatures", "gs2_constitutional_bodies"], psir: [] },
    { week: 47, gs: ["gs3_growth_employment", "gs3_budgeting", "gs3_agriculture_cropping", "gs3_agriculture_msp_subsidies"], psir: [] },
    { week: 48, gs: ["gs1_modern_history", "gs1_freedom_struggle", "gs1_art_culture", "gs1_physical_geography"], psir: [] },
    { week: 49, gs: ["gs3_environment_conservation", "gs3_science_tech", "gs2_schemes_policies"], psir: [] },
    { week: 50, gs: ["gs2_ir_neighbors", "gs2_ir_bilateral_global", "gs3_security_borders", "gs3_disaster_management"], psir: [] }
  ]
};

const CurrentAffairsThemes = [
  "Newspaper Analysis: Read editorial on Federalism debates in GST / Inter-state river disputes.",
  "Newspaper Analysis: Read editorial on agricultural subsidies & WTO challenges.",
  "Newspaper Analysis: Read editorial on digital public infrastructure (DPI) & public service delivery.",
  "Newspaper Analysis: Read editorial on India's strategic relations in the Indo-Pacific & QUAD developments.",
  "Newspaper Analysis: Read editorial on clean energy transition, carbon borders, and COP goals.",
  "Newspaper Analysis: Read editorial on judicial independence, appointment of judges, and Collegium vs NJAC.",
  "Newspaper Analysis: Read editorial on Artificial Intelligence governance, deepfakes, and ethical safeguards.",
  "Newspaper Analysis: Read editorial on India's maritime strategy in the Indian Ocean & anti-piracy efforts.",
  "Newspaper Analysis: Read editorial on internal security, border management, and cyber terrorism threats.",
  "Newspaper Analysis: Read editorial on social justice, gender parity, and women empowerment schemes."
];

const EssayThemes = [
  "Essay Theme: 'The path to self-discovery begins with a deep questioning of social norms.' (Philosophical)",
  "Essay Theme: 'Technology makes a good servant but a dangerous master.' (S&T / Ethical)",
  "Essay Theme: 'Cooperative federalism: A structural necessity rather than a political option for India.' (GS2/Polity)",
  "Essay Theme: 'Economic growth without social justice is a recipe for internal conflict.' (GS3/Society)",
  "Essay Theme: 'Climate justice: The moral obligation of the global north towards the global south.' (Environment/IR)",
  "Essay Theme: 'Education is the most powerful weapon which you can use to change the world.' (Social/Governance)",
  "Essay Theme: 'In a democracy, the office of the citizen is higher than the office of the President.' (Polity/Ethics)"
];

function getGSQuestionsForTopic(topicId) {
  const key = getQuestionBankKey(topicId);
  let qList = [];
  if (typeof window !== 'undefined' && window.RealPYQsBank && window.RealPYQsBank[key]) {
    qList = window.RealPYQsBank[key];
  } else if (typeof RealPYQsBank !== 'undefined' && RealPYQsBank[key]) {
    qList = RealPYQsBank[key];
  }
  if (!qList || qList.length === 0) {
    qList = QuestionBank[key] || [];
  }
  return qList;
}

/**
 * Core Function to generate the entire study schedule.
 */
function generateSchedule() {
  const startDate = new Date(2026, 5, 12); // June 12, 2026 (Month is 0-indexed: 5 = June)
  const endDate = new Date(2027, 4, 20);   // May 20, 2027 (4 = May)
  
  const schedule = [];
  let currentDate = new Date(startDate);
  let dayCounter = 1;
  let studyDayIndex = 0; // Tracks non-Sundays for topic assignment

  // Programmatically extract all GS & PSIR topics in order from SyllabusData
  const gsRawTopics = [];
  ["gs1", "gs2", "gs3", "gs4"].forEach(paper => {
    SyllabusData[paper].topics.forEach(t => {
      gsRawTopics.push({
        id: t.id,
        paper: paper,
        title: t.title,
        priority: t.priority || "Medium",
        details: t.micro_topics ? t.micro_topics.slice(0, 5).join(", ") + "..." : "",
        books: t.books || "Standard reference books"
      });
    });
  });

  const psirRawTopics = [];
  ["psir1", "psir2"].forEach(paper => {
    SyllabusData[paper].topics.forEach(t => {
      psirRawTopics.push({
        id: t.id,
        paper: paper,
        title: t.title,
        details: t.details || "",
        books: t.books || "OP Gauba / Andrew Heywood"
      });
    });
  });

  // Create a strict 82-study-day sequence for GS (1st Cycle) by mapping the pages and adding revision slots
  const gs1stCycleSequence = [];
  
  // MAPPING GS 1 (25 pages + 3 revision days = 28 days)
  const gs1Pages = SyllabusData.gs1.topics; // 25 pages
  gs1Pages.forEach(p => {
    gs1stCycleSequence.push({
      id: p.id,
      paper: "gs1",
      title: p.title,
      priority: p.priority || "Medium",
      details: p.micro_topics ? p.micro_topics.slice(0, 5).join(", ") + "..." : "",
      books: p.books || "Standard reference books"
    });
  });
  // Add 3 revision days
  for (let r = 1; r <= 3; r++) {
    gs1stCycleSequence.push({
      id: "gs1_rev",
      paper: "gs1",
      title: `GS 1 Revision - Day ${r}`,
      priority: "High",
      details: "Consolidate 1-page notes for GS1 (History, Geography, Society) and practice PYQs.",
      books: "My 1-page notes",
      micro_topics: ["Revise History notes", "Revise Geography notes", "Revise Society notes", "Review weak areas"]
    });
  }

  // MAPPING GS 2 (16 pages + 3 revision days = 19 days)
  const gs2Pages = SyllabusData.gs2.topics; // 16 pages
  gs2Pages.forEach(p => {
    gs1stCycleSequence.push({
      id: p.id,
      paper: "gs2",
      title: p.title,
      priority: p.priority || "Medium",
      details: p.micro_topics ? p.micro_topics.slice(0, 5).join(", ") + "..." : "",
      books: p.books || "Standard reference books"
    });
  });
  // Add 3 revision days
  for (let r = 1; r <= 3; r++) {
    gs1stCycleSequence.push({
      id: "gs2_rev",
      paper: "gs2",
      title: `GS 2 Revision - Day ${r}`,
      priority: "High",
      details: "Consolidate 1-page notes for GS2 (Polity, Governance, IR) and practice PYQs.",
      books: "My 1-page notes",
      micro_topics: ["Revise Polity notes", "Revise Governance notes", "Revise International Relations notes", "Review weak areas"]
    });
  }

  // MAPPING GS 3 (23 pages + 3 revision days = 26 days)
  const gs3Pages = SyllabusData.gs3.topics; // 23 pages
  gs3Pages.forEach(p => {
    gs1stCycleSequence.push({
      id: p.id,
      paper: "gs3",
      title: p.title,
      priority: p.priority || "Medium",
      details: p.micro_topics ? p.micro_topics.slice(0, 5).join(", ") + "..." : "",
      books: p.books || "Standard reference books"
    });
  });
  // Add 3 revision days
  for (let r = 1; r <= 3; r++) {
    gs1stCycleSequence.push({
      id: "gs3_rev",
      paper: "gs3",
      title: `GS 3 Revision - Day ${r}`,
      priority: "High",
      details: "Consolidate 1-page notes for GS3 (Economy, S&T, Environment, Security, Disaster) and practice PYQs.",
      books: "My 1-page notes",
      micro_topics: ["Revise Economy notes", "Revise S&T notes", "Revise Environment & Security notes", "Review weak areas"]
    });
  }

  // MAPPING GS 4 (5 pages + 4 revision days = 9 days)
  const gs4Pages = SyllabusData.gs4.topics; // 5 pages
  gs4Pages.forEach(p => {
    gs1stCycleSequence.push({
      id: p.id,
      paper: "gs4",
      title: p.title,
      priority: p.priority || "Medium",
      details: p.micro_topics ? p.micro_topics.slice(0, 5).join(", ") + "..." : "",
      books: p.books || "Standard reference books"
    });
  });
  // Add 4 revision/mock days
  for (let r = 1; r <= 4; r++) {
    gs1stCycleSequence.push({
      id: "gs4_rev",
      paper: "gs4",
      title: r <= 2 ? `GS 4 Revision - Day ${r}` : `GS 4 Full-Length Mock Exam ${r-2}`,
      priority: "High",
      details: r <= 2 ? "Consolidate 1-page notes for GS4 (Ethics, Integrity, Aptitude)." : "Write a full-length GS4 mock test under timed exam conditions.",
      books: "My 1-page notes",
      micro_topics: r <= 2 ? ["Revise Ethics theories", "Revise Case study frameworks", "Review definitions & quotes"] : ["Attempt full mock test", "Self-evaluate using topper papers", "Review timing issues"]
    });
  }


  // Create a strict 82-study-day sequence for PSIR (1 topic every 2 days = 41 topic slots)
  const psir1stCycleSequence = [];
  // Add all 40 PSIR topics
  psirRawTopics.forEach(t => {
    psir1stCycleSequence.push({
      id: t.id,
      paper: t.paper,
      title: t.title,
      details: t.details || "",
      books: t.books || "OP Gauba / Andrew Heywood"
    });
  });
  // Add 1 revision day (which counts as 1 slot = 2 study days)
  psir1stCycleSequence.push({
    id: "psir_rev",
    paper: "psir2",
    title: "PSIR Overall Syllabus Revision",
    details: "Review 1-page notes across all PSIR Paper 1 and Paper 2 topics.",
    books: "My 1-page notes"
  });


  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const dateString = getLocalDateString(currentDate);
    
    // Determine the Study Phase details based on restructured dates
    let phaseNum = 1;
    let phaseName = "";
    let phaseDescription = "";
    
    if (currentDate <= new Date(2026, 8, 15)) { // June 12 - Sept 15, 2026
      phaseNum = 1;
      phaseName = "Phase 1: 1st Reading Cycle";
      phaseDescription = "Cover 1 GS topic daily, 1 PSIR topic in 2 days. Make 1-page notes, analyze PYQs, write answers.";
    } else if (currentDate <= new Date(2026, 10, 30)) { // Sept 16 - Nov 30, 2026
      phaseNum = 2;
      phaseName = "Phase 2: Mains Rev-2 & Mocks";
      phaseDescription = "2nd Mains & PSIR revision. Weekly Essay writing and full length mains mock blocks.";
    } else if (currentDate <= new Date(2027, 1, 15)) { // Dec 1, 2026 - Feb 15, 2027
      phaseNum = 3;
      phaseName = "Phase 3: Overlap Revision";
      phaseDescription = "1st Prelims + 3rd Mains (Core Overlap) Revision. Heavy on overlap subjects.";
    } else if (currentDate <= new Date(2027, 3, 15)) { // Feb 16 - Apr 15, 2027
      phaseNum = 4;
      phaseName = "Phase 4: Dedicated Prelims Revision";
      phaseDescription = "Dedicated Prelims static revision + CSAT practice + Sectional Mock Tests.";
    } else { // Apr 16 - May 20, 2027
      phaseNum = 5;
      phaseName = "Phase 5: Prelims Revision 2";
      phaseDescription = "Prelims Final Sprint. Full-length mock tests, PYQ revision, CSAT, and mapping.";
    }

    // Calculate week number relative to June 12
    const diffTime = Math.abs(currentDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const currentWeekNum = Math.floor(diffDays / 7) + 1;

    // Check if Sunday (Buffer Day)
    if (dayOfWeek === 0) {
      schedule.push({
        dayIndex: dayCounter,
        date: dateString,
        dayOfWeekName: "Sunday",
        phaseNum: phaseNum,
        phaseName: phaseName,
        isBuffer: true,
        weekNum: currentWeekNum,
        title: "Sunday Buffer & Backlog Day",
        tasks: [
          { id: `day_${dayCounter}_t1`, category: "Buffer", text: "Consolidate all 1-page notes from the week.", duration: "2 hours", completed: false },
          { id: `day_${dayCounter}_t2`, category: "Buffer", text: "Clear backlog tasks from the current week.", duration: "2-3 hours", completed: false },
          { id: `day_${dayCounter}_t3`, category: "Buffer", text: "CA Review: Consolidate the week's newspaper points.", duration: "1.5 hours", completed: false },
          { id: `day_${dayCounter}_t4`, category: "Buffer", text: "Physical/Mental Recharge: Rest and recover.", duration: "1 hour", completed: false }
        ],
        answers: []
      });
      currentDate.setDate(currentDate.getDate() + 1);
      dayCounter++;
      continue;
    }

    // It's a study day (Monday to Saturday)
    const tasks = [];
    const answers = [];

    // Assign GS Topic dynamically
    const gsTopicObj = gs1stCycleSequence[studyDayIndex % gs1stCycleSequence.length] || gsRawTopics[studyDayIndex % gsRawTopics.length];
    
    // Assign PSIR Topic: 1 topic in 2 study days
    const psirTopicIndex = Math.floor(studyDayIndex / 2) % psir1stCycleSequence.length;
    const psirTopicObj = psir1stCycleSequence[psirTopicIndex] || psirRawTopics[psirTopicIndex % psirRawTopics.length];
    const psirSubDay = (studyDayIndex % 2 === 0) ? 1 : 2;

    if (phaseNum === 1) {
      // PHASE 1 STUDY DAY (RESTRICTURED TARGET CHECKLISTS)
      
      // 1. GS Tasks
      tasks.push({
        id: `day_${dayCounter}_gs_cover`,
        category: "General Studies",
        text: `GS Study: Covered "${gsTopicObj.title}"`,
        books: gsTopicObj.books || "Standard books",
        duration: "3.0 hours",
        priority: gsTopicObj.priority || "Medium",
        completed: false
      });
      tasks.push({
        id: `day_${dayCounter}_gs_pyq`,
        category: "General Studies",
        text: `GS PYQs: Analyzed last 5 years' PYQs on "${gsTopicObj.title}"`,
        duration: "0.5 hours",
        priority: gsTopicObj.priority || "Medium",
        completed: false
      });
      tasks.push({
        id: `day_${dayCounter}_gs_notes`,
        category: "General Studies",
        text: `GS Notes: Made 1-page micro-notes for "${gsTopicObj.title}"`,
        duration: "0.5 hours",
        priority: gsTopicObj.priority || "Medium",
        completed: false
      });

      // 2. PSIR Tasks
      tasks.push({
        id: `day_${dayCounter}_psir_cover`,
        category: "PSIR Optional",
        text: `PSIR Study: Progressed on "${psirTopicObj.title}" (Day ${psirSubDay}/2)`,
        books: psirTopicObj.books || "OP Gauba / Andrew Heywood",
        duration: "1.5 hours",
        completed: false
      });
      tasks.push({
        id: `day_${dayCounter}_psir_pyq`,
        category: "PSIR Optional",
        text: `PSIR PYQs: Analyzed last 5 years' PYQs on "${psirTopicObj.title}"`,
        duration: "0.5 hours",
        completed: false
      });
      tasks.push({
        id: `day_${dayCounter}_psir_notes`,
        category: "PSIR Optional",
        text: `PSIR Notes: Made 1-page micro-notes for "${psirTopicObj.title}"`,
        duration: "0.5 hours",
        completed: false
      });

      // 3. Current Affairs & Course Lectures
      tasks.push({
        id: `day_${dayCounter}_ca_newspaper`,
        category: "Current Affairs",
        text: `Newspaper/CA: Read daily editorials + monthly compilation updates`,
        duration: "1.0 hour",
        completed: false
      });
      tasks.push({
        id: `day_${dayCounter}_pyq_course`,
        category: "Video Course",
        text: `PYQ Course: Attend 1 video lecture explaining core answer structures`,
        duration: "1.0 hour",
        completed: false
      });

      // 4. Daily Answer Writing (3 GS Answers + 3 PSIR Answers)
      // Retrieve questions from RealPYQsBank or QuestionBank
      const gsQuestions = getGSQuestionsForTopic(gsTopicObj.id) || [];
      const psirQuestions = window.RealPYQsBank[getQuestionBankKey(psirTopicObj.id)] || QuestionBank[getQuestionBankKey(psirTopicObj.id)] || [];

      // 3 GS Questions (dynamic selection from recent PYQs)
      let gsSelected = [];
      for (let i = 0; i < 3; i++) {
        let index = (dayCounter * 3 + i) % Math.max(gsQuestions.length, 1);
        let qText = gsQuestions[gsQuestions.length - 1 - index];
        if (!qText || gsSelected.includes(qText)) {
            qText = `GS Q${i+1}: Critical analysis on ${gsTopicObj.title}`;
        }
        gsSelected.push(qText);

        answers.push({
          id: `day_${dayCounter}_aw_gs${i+1}`,
          category: "GS Static",
          question: qText,
          writtenAnswer: "",
          rating: 0,
          completed: false
        });
      }

      // 3 PSIR Questions (dynamic selection from recent PYQs)
      let psirSelected = [];
      for (let i = 0; i < 3; i++) {
        let index = (dayCounter * 3 + i) % Math.max(psirQuestions.length, 1);
        let qText = psirQuestions[psirQuestions.length - 1 - index];
        if (!qText || psirSelected.includes(qText)) {
            qText = `PSIR Q${i+1}: Critical analysis on ${psirTopicObj.title}`;
        }
        psirSelected.push(qText);

        answers.push({
          id: `day_${dayCounter}_aw_psir${i+1}`,
          category: "PSIR Optional",
          question: qText,
          writtenAnswer: "",
          rating: 0,
          completed: false
        });
      }

      // Add Answer Writing summary checkbox
      tasks.push({
        id: `day_${dayCounter}_aw_task`,
        category: "Answer Writing",
        text: `Answer Writing: Completed 3 GS and 3 PSIR answers on paper`,
        duration: "1.0 hour",
        completed: false
      });

    } else {
      // PHASES 2 - 5 STUDY DAYS (FAST REVISION & TEST BLOCKS)
      // CA Slot
      const caTheme = CurrentAffairsThemes[dayCounter % CurrentAffairsThemes.length];
      tasks.push({
        id: `day_${dayCounter}_ca_newspaper`,
        category: "Current Affairs",
        text: `Newspaper/CA Update: Read editorials. Theme: ${caTheme}`,
        duration: "1.0 hour",
        completed: false
      });

      // GS Slot
      tasks.push({
        id: `day_${dayCounter}_gs`,
        category: "General Studies",
        text: `GS Revision: Study weak parts of "${gsTopicObj.title}"`,
        books: gsTopicObj.books || "Standard books",
        duration: phaseNum >= 4 ? "4.0 hours" : "3.0 hours",
        priority: gsTopicObj.priority || "Medium",
        completed: false
      });


      // PSIR Slot
      if (phaseNum <= 4) {
        tasks.push({
          id: `day_${dayCounter}_psir`,
          category: "PSIR Optional",
          text: `PSIR Revision: Revise notes & thinkers on "${psirTopicObj.title}"`,
          books: psirTopicObj.books || "Standard Optional books",
          duration: phaseNum === 4 ? "1.0 hour" : "2.0 hours",
          completed: false
        });
      }

      // CSAT slot
      if (phaseNum >= 4) {
        let csatTopic = "Quants: Number System & Percentages";
        if (dayCounter % 3 === 0) csatTopic = "CSAT reading comprehension practice";
        else if (dayCounter % 3 === 1) csatTopic = "CSAT puzzles & logical reasoning";
        
        tasks.push({
          id: `day_${dayCounter}_csat`,
          category: "CSAT",
          text: `CSAT: practice ${csatTopic}`,
          duration: "1.0 hour",
          completed: false
        });
      }

      // Essay slot (Saturdays in Phase 2 & 3)
      if (dayOfWeek === 6 && (phaseNum === 2 || phaseNum === 3)) {
        const essayTopic = EssayThemes[dayCounter % EssayThemes.length];
        tasks.push({
          id: `day_${dayCounter}_essay`,
          category: "Essay",
          text: `${essayTopic} - Write structured outline.`,
          duration: "1.0 hour",
          completed: false
        });
      }

      // Answers / Mocks
      if (phaseNum <= 4) {
        // Phase 2-4: Leave questions blank — user will upload their own question documents
        answers.push({
          id: `day_${dayCounter}_aw_gs1`,
          category: "GS Static",
          question: "", // Will be filled when user uploads Phase 2 question document
          writtenAnswer: "",
          rating: 0,
          completed: false
        });
        
        answers.push({
          id: `day_${dayCounter}_aw_psir1`,
          category: "PSIR Optional",
          question: "", // Will be filled when user uploads Phase 2 question document
          writtenAnswer: "",
          rating: 0,
          completed: false
        });

        tasks.push({
          id: `day_${dayCounter}_aw_task`,
          category: "Answer Writing",
          text: `Mains practice: Write 1 GS and 1 PSIR answer under timed conditions`,
          duration: "1.0 hour",
          completed: false
        });
      } else {
        // Phase 5 Prelims Mocks
        let mockType = "Sectional static mock test";
        if (dayCounter % 4 === 0) mockType = "Full Length GS Mock Test (Paper 1)";
        else if (dayCounter % 4 === 2) mockType = "Full Length CSAT Mock Test (Paper 2)";
        
        tasks.push({
          id: `day_${dayCounter}_mock_test`,
          category: "Mock Test",
          text: `Prelims Mock: ${mockType} + analyze mistakes`,
          duration: "2.5 hours",
          completed: false
        });
      }
    }

    schedule.push({
      dayIndex: dayCounter,
      date: dateString,
      dayOfWeekName: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][dayOfWeek - 1],
      phaseNum: phaseNum,
      phaseName: phaseName,
      phaseDescription: phaseDescription,
      isBuffer: false,
      weekNum: currentWeekNum,
      title: `Day ${dayCounter} Study Plan`,
      tasks: tasks,
      answers: answers
    });

    currentDate.setDate(currentDate.getDate() + 1);
    dayCounter++;
    studyDayIndex++;
  }

  return schedule;
}

// Attach to window or module export
if (typeof window !== 'undefined') {
  window.generateSchedule = generateSchedule;
}
