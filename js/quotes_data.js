// UPSC CSE 2027 Daily Motivational Quotes & Ethics/Essay Examples
const DailyQuotesData = [
  {
    quote: "Arise, awake, and stop not till the goal is reached.",
    author: "Swami Vivekananda",
    example: " Vivekananda's concept of 'Practical Vedanta'—applying spiritual principles to active social service. Use this in GS4 to illustrate 'Dedication to Public Service' and 'Selfless Duty'."
  },
  {
    quote: "The best way to find yourself is to lose yourself in the service of others.",
    author: "Mahatma Gandhi",
    example: "Gandhiji's 'Talisman'—always recalling the face of the poorest person before deciding on policies. Use this in GS4 for 'Compassion towards weaker sections' and ethical policymaking."
  },
  {
    quote: "Injustice anywhere is a threat to justice everywhere.",
    author: "Martin Luther King Jr.",
    example: "Nelson Mandela's 27-year imprisonment on Robben Island to dismantle Apartheid. Use this as a prime example of 'Moral Courage', 'Perseverance', and 'Equality' in Essays."
  },
  {
    quote: "I count him braver who overcomes his desires than him who conquers his enemies; for the hardest victory is over self.",
    author: "Aristotle",
    example: "Dr. APJ Abdul Kalam, who owned minimal personal property (a few books and clothes) despite holding the highest constitutional office. Perfect for 'Probity in Governance' and 'Self-Regulation'."
  },
  {
    quote: "To hide checkmarks of corruption is to participate in it.",
    author: "Socrates",
    example: "Satyendra Dubey, the NHAI Project Director who sacrificed his life exposure of corruption in the Golden Quadrilateral project. Use as a core case study on 'Whistleblowing' and 'Personal Integrity'."
  },
  {
    quote: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    author: "Aristotle",
    example: "E. Sreedharan (Metro Man of India), who maintained a strict non-compromise work culture, zero corruption, and finished the Delhi Metro projects ahead of schedule. Quote for 'Work Culture' and 'Professional Ethics'."
  },
  {
    quote: "The true measure of any society is how it treats its most vulnerable members.",
    author: "Mahatma Gandhi",
    example: "Baba Amte setting up Anandwan, a rehabilitation community for leprosy survivors, dismantling deep-rooted social taboos. Ideal example for 'Empathy' and 'Social Reform' in GS4 and Essays."
  },
  {
    quote: "We cannot solve our problems with the same thinking we used when we created them.",
    author: "Albert Einstein",
    example: "Armstrong Pame (IAS officer), known as the 'Miracle Man' who crowd-sourced funds and labor to build a 100km road connecting tri-junction states without government budget. Use for 'Innovation' and 'Public Participation'."
  },
  {
    quote: "Education is the most powerful weapon which you can use to change the world.",
    author: "Nelson Mandela",
    example: "Savitribai and Jyotirao Phule establishing India's first school for girls in Pune (1848) despite facing extreme societal backlash. Quote in Essays on gender justice and educational reforms."
  },
  {
    quote: "The only thing necessary for the triumph of evil is for good men to do nothing.",
    author: "Edmund Burke",
    example: "Harsh Mander (ex-IAS), who resigned from the civil services following the 2002 Gujarat riots to work directly for communal harmony. Use to illustrate 'Conscience as a source of ethical guidance'."
  },
  {
    quote: "Strength does not come from physical capacity. It comes from an indomitable will.",
    author: "Mahatma Gandhi",
    example: "Sudha Murty and the Infosys Foundation's philanthropy towards devadasis, flood relief, and rural schools. Use for 'Altruism' and 'Corporate Social Responsibility'."
  },
  {
    quote: "The national progress of a country depends upon the educational advancement of its women.",
    author: "Sir Syed Ahmed Khan",
    example: "Raja Ram Mohan Roy fighting for the abolition of Sati and advocating for women's inheritance rights. Use in Essays on social justice and historical reforms."
  },
  {
    quote: "We must become the change we want to see.",
    author: "Mahatma Gandhi",
    example: "Rajendra Singh (Waterman of India) reviving 5 dried rivers in Rajasthan through check-dams (johads). Use for 'Environmental Ethics' and 'Traditional Ecological Knowledge'."
  },
  {
    quote: "A man is but the product of his thoughts. What he thinks, he becomes.",
    author: "Mahatma Gandhi",
    example: "The Kalinga War transforming Emperor Ashoka from 'Chandashoka' (cruel) to 'Dharmashoka' (righteous). Use for 'Attitude Change' and 'Moral Rehabilitation'."
  },
  {
    quote: "Right is right even if no one is doing it; wrong is wrong even if everyone is doing it.",
    author: "Augustine of Hippo",
    example: "T.N. Seshan (former CEC) enforcing the Model Code of Conduct, disqualifying politicians, and cleaning up electoral malpractice in India. Use for 'Impartiality' and 'Fortitude'."
  },
  {
    quote: "Happiness is when what you think, what you say, and what you do are in harmony.",
    author: "Mahatma Gandhi",
    example: "Lal Bahadur Shastri resigning as Railway Minister in 1956 taking moral responsibility for the Ariyalur train accident. Perfect example of 'Political Accountability' and 'Inward Integrity'."
  },
  {
    quote: "Poverty is the parent of revolution and crime.",
    author: "Aristotle",
    example: "The implementation of the direct benefit transfer (DBT) scheme via Jan Dhan-Aadhaar-Mobile (JAM) trinity reducing leakage and empowering poor. Use in Essay on economic development."
  },
  {
    quote: "The earth provides enough to satisfy every man's needs, but not every man's greed.",
    author: "Mahatma Gandhi",
    example: "Chipko Movement led by Gaura Devi and Sunderlal Bahuguna, where villagers hugged trees to prevent logging. Use in GS3 Environment and GS4 Environmental Ethics."
  },
  {
    quote: "To cast off your troubles, you must first cast off your ego.",
    author: "Socrates",
    example: "Guru Nanak introducing 'Langar' (community kitchen) where all eat together regardless of caste, status, or religion. Quote for 'Equality' and 'Social Integration'."
  },
  {
    quote: "Ask not what your country can do for you – ask what you can do for your country.",
    author: "John F. Kennedy",
    example: "Sonam Wangchuk building Ice Stupas in Ladakh to solve winter water crises. Shows 'Local Innovation' and 'Duty-centric citizenship' for Essays."
  },
  {
    quote: "An eye for an eye only ends up making the whole world blind.",
    author: "Mahatma Gandhi",
    example: "India's policy of 'No First Use' in its Nuclear Doctrine. Perfect example of 'Strategic Restraint' and 'Global Peace Ethics' in Essays or GS2."
  },
  {
    quote: "I do not want my house to be walled in on all sides and my windows to be stuffed. I want the cultures of all lands to be blown about my house as freely as possible. But I refuse to be blown off my feet by any.",
    author: "Mahatma Gandhi",
    example: "India's pluralistic fabric, accommodating Jews, Parsis, Tibetans throughout history while retaining its cultural identity. Perfect for Essay on 'Unity in Diversity' or 'Globalization'."
  },
  {
    quote: "In a gentle way, you can shake the world.",
    author: "Mahatma Gandhi",
    example: "Rosa Parks refusing to give up her seat on a Montgomery bus, sparking the US Civil Rights Movement. Use for 'Non-violent Resistance' and 'Individual agency'."
  },
  {
    quote: "Compassion is the basis of morality.",
    author: "Arthur Schopenhauer",
    example: "Mother Teresa establishing Nirmal Hriday for the destitute and dying. Use as a peak example of 'Empathy' and 'Service to the marginalized' in GS4."
  },
  {
    quote: "Truth stands even if there be no public support. It is self-sustained.",
    author: "Mahatma Gandhi",
    example: "Galileo Galilei defending heliocentrism against the Inquisition, demonstrating commitment to empirical truth over dogma. Use for 'Scientific Temper' and 'Intellectual Integrity'."
  },
  {
    quote: "The highest education is that which does not merely give us information but makes our life in harmony with all existence.",
    author: "Rabindranath Tagore",
    example: "Tagore establishing Shantiniketan, an open-air school integrated with nature, breaking rigid classroom walls. Ideal for Essay on 'Education' or 'Nature-society connection'."
  },
  {
    quote: "Integrity is doing the right thing, even when no one is watching.",
    author: "C.S. Lewis",
    example: "Kiran Bedi (former IPS) reforming Tihar Jail by introducing vipassana meditation, vocational education, and prisoner self-governance. Use for 'Administrative Reform' and 'Compassionate Correction'."
  },
  {
    quote: "The week of work cannot progress without the discipline of daily targets.",
    author: "UPSC Topper Proverb",
    example: "Toppers who studied exactly 6-7 hours daily, relying on consistency over sporadic 14-hour bursts. Shows the importance of 'Sustainability' and 'Process-orientation' in life."
  },
  {
    quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
    example: "Abraham Lincoln losing multiple senate elections and business ventures before becoming President and preserving the Union. Use for 'Resilience' and 'Overcoming failure' in Essays."
  },
  {
    quote: "The administration of justice is the firmest pillar of government.",
    author: "George Washington",
    example: "Justice H.R. Khanna's famous lone dissenting judgment in the ADM Jabalpur case (1976), defending citizens' right to life and liberty during Emergency. A classic example of 'Judicial Integrity' and 'Constitutional Morality' (GS2/GS4)."
  }
];

// Export to window
if (typeof window !== 'undefined') {
  window.DailyQuotesData = DailyQuotesData;
}
