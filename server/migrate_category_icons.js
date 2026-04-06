const mongoose = require('mongoose');
const Category = require('./models/Category');
const dotenv = require('dotenv');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/dailyfix';

// Keyword-to-icon mapping (case-insensitive)
const ICON_RULES = [
    { keywords: ['clean', 'maid', 'sweep', 'house', 'office clean'],   icon: 'FaBroom' },
    { keywords: ['electric', 'wiring', 'light', 'switch', 'fan', 'power'], icon: 'FaBolt' },
    { keywords: ['plumb', 'pipe', 'drain', 'tap', 'water'],             icon: 'FaWrench' },
    { keywords: ['carpen', 'wood', 'furniture', 'door', 'window', 'shelf'], icon: 'FaHammer' },
    { keywords: ['ac', 'air con', 'cooling', 'refriger', 'appliance'],  icon: 'FaSnowflake' },
    { keywords: ['paint', 'colour', 'color', 'wall'],                   icon: 'FaPaintRoller' },
    { keywords: ['salon', 'beauty', 'hair', 'cut', 'spa', 'makeup', 'mehndi', 'mehandi', 'henna'], icon: 'FaCut' },
    { keywords: ['garden', 'lawn', 'plant', 'tree', 'grass'],           icon: 'FaTree' },
    { keywords: ['car', 'vehicle', 'auto', 'bike', 'motor'],            icon: 'FaCar' },
    { keywords: ['pet', 'dog', 'cat', 'animal'],                        icon: 'FaDog' },
    { keywords: ['home repair', 'general', 'fix'],                      icon: 'FaHome' },
    { keywords: ['bathroom', 'shower', 'toilet', 'bath'],               icon: 'FaShower' },
    { keywords: ['sofa', 'couch', 'interior', 'decor'],                 icon: 'FaCouch' },
    { keywords: ['tool', 'handyman', 'mainten'],                        icon: 'FaToolbox' },
    { keywords: ['mov', 'packer', 'shift', 'truck', 'transport', 'deliver'], icon: 'FaTruck' },
    { keywords: ['fire', 'safe', 'extinguish', 'security'],             icon: 'FaFireExtinguisher' },
    { keywords: ['plug', 'socket', 'charger'],                          icon: 'FaPlug' },
    { keywords: ['eco', 'green', 'leaf', 'organic'],                    icon: 'FaLeaf' },
    { keywords: ['lock', 'key', 'door open'],                           icon: 'FaKey' },
    { keywords: ['cctv', 'camera', 'surveillance', 'photo'],            icon: 'FaCamera' },
    { keywords: ['chef', 'cook', 'food', 'kitchen', 'meal'],            icon: 'FaToolbox' }, // no food icon, fallback
];

function guessIcon(name) {
    const lower = name.toLowerCase();
    for (const rule of ICON_RULES) {
        if (rule.keywords.some(kw => lower.includes(kw))) {
            return rule.icon;
        }
    }
    return 'FaWrench'; // default
}

async function migrate() {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const categories = await Category.find();
    console.log(`Found ${categories.length} categories to check...`);

    let updated = 0;
    for (const cat of categories) {
        const guessed = guessIcon(cat.name);
        if (!cat.icon || cat.icon === 'FaWrench') {
            // Only update if no icon set or default wrench (to allow manual overrides)
            cat.icon = guessed;
            await cat.save();
            console.log(`  ✅  ${cat.name} → ${guessed}`);
            updated++;
        } else {
            console.log(`  ⏭️  ${cat.name} already has icon: ${cat.icon}`);
        }
    }

    console.log(`\nDone! Updated ${updated} categories.`);
    await mongoose.connection.close();
}

migrate().catch(err => {
    console.error(err);
    process.exit(1);
});
