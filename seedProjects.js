require('dotenv').config();
const mongoose = require('mongoose');
const Project = require('./models/Project'); // Ensure this path matches your model location

const sampleProjects = [
    {
        title: "EduPortal Pro",
        category: "school",
        description: "Complete school management system with CBT exam navigation, results, and fee tracking.",
        techStack: ["Node.js", "Express", "MongoDB"],
        liveLink: "https://github.com/destisibor",
        imageUrl: ""
    },
    {
        title: "Company Website",
        category: "company",
        description: "Responsive, mobile-first corporate website designed for a tech enterprise.",
        techStack: ["HTML5", "CSS3", "Vanilla JS"],
        liveLink: "https://github.com/destisibor",
        imageUrl: ""
    },
    {
        title: "SwiftTrack Courier System",
        category: "business",
        description: "Automated logistics and package tracking platform with live status updates.",
        techStack: ["Node.js", "Express", "MongoDB", "JavaScript"],
        liveLink: "https://github.com/destisibor/swifttrack-courier-system",
        imageUrl: ""
    },
    {
        title: "Android Service App",
        category: "mobile",
        description: "Native mobile application featuring custom layout XML design and activity event handling.",
        techStack: ["Java", "Android Studio", "XML"],
        liveLink: "https://github.com/destisibor",
        imageUrl: ""
    },
    {
        title: "Investment Dashboard",
        category: "web",
        description: "Backend web application managing user withdrawal rules, dispute handling, and cron jobs.",
        techStack: ["Node.js", "Express", "Mongoose"],
        liveLink: "https://github.com/destisibor",
        imageUrl: ""
    },
    {
        title: "E-Commerce Store",
        category: "ecommerce",
        description: "Fully functional online store featuring custom administrative interfaces and database validation.",
        techStack: ["Node.js", "Express", "MongoDB", "CSS"],
        liveLink: "https://github.com/destisibor",
        imageUrl: ""
    },
    {
        title: "WebUni",
        category: "school",
        description: "Modern educational platform featuring course pages, dynamic navigation, and responsive layouts.",
        techStack: ["React", "Vite", "JavaScript", "CSS"],
        liveLink: "https://webuni.onrender.com",
        imageUrl: ""
    }
];

const seedDB = async () => {
    try {
        const dbUri = process.env.MONGO_URI || process.env.MONGODB_URI;
        if (!dbUri) {
            console.error('Error: MongoDB URI is missing from your .env file.');
            process.exit(1);
        }

        console.log('Connecting to database...');
        await mongoose.connect(dbUri);

        console.log('Clearing existing projects...');
        await Project.deleteMany({});

        console.log('Inserting new portfolio projects...');
        const inserted = await Project.insertMany(sampleProjects);

        console.log(`Projects successfully seeded to database! (${inserted.length} projects)`);
        process.exit();
    } catch (error) {
        console.error('Error seeding projects:', error);
        process.exit(1);
    }
};

seedDB();