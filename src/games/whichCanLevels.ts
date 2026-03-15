// 100 Which One Can Levels
export const WHICH_CAN_LEVELS = [
  // Level 1-10: Physical properties
  {
    level: 1,
    question: 'Which one can BOUNCE?',
    items: [
      { emoji: '🏀', can: true, name: 'Ball' },
      { emoji: '☂️', can: false, name: 'Umbrella' },
      { emoji: '🪣', can: false, name: 'Bucket' }
    ],
    explanation: 'A ball is bouncy! It springs back when you drop it.'
  },
  {
    level: 2,
    question: 'Which one can FLOAT on water?',
    items: [
      { emoji: '🪨', can: false, name: 'Rock' },
      { emoji: '🪵', can: true, name: 'Wood' },
      { emoji: '🔩', can: false, name: 'Bolt' }
    ],
    explanation: 'Wood floats because it is less dense than water!'
  },
  {
    level: 3,
    question: 'Which one can FLY?',
    items: [
      { emoji: '🦅', can: true, name: 'Eagle' },
      { emoji: '🐕', can: false, name: 'Dog' },
      { emoji: '🐟', can: false, name: 'Fish' }
    ],
    explanation: 'Eagles have wings and can soar through the sky!'
  },
  {
    level: 4,
    question: 'Which one can MELT?',
    items: [
      { emoji: '🧊', can: true, name: 'Ice' },
      { emoji: '🪨', can: false, name: 'Stone' },
      { emoji: '🧱', can: false, name: 'Brick' }
    ],
    explanation: 'Ice melts into water when it gets warm!'
  },
  {
    level: 5,
    question: 'Which one can GROW?',
    items: [
      { emoji: '🌱', can: true, name: 'Plant' },
      { emoji: '🪑', can: false, name: 'Chair' },
      { emoji: '📱', can: false, name: 'Phone' }
    ],
    explanation: 'Plants grow bigger with sunlight and water!'
  },
  {
    level: 6,
    question: 'Which one can ROLL?',
    items: [
      { emoji: '📦', can: false, name: 'Box' },
      { emoji: '🛞', can: true, name: 'Wheel' },
      { emoji: '🧊', can: false, name: 'Cube' }
    ],
    explanation: 'Wheels are round and can roll smoothly!'
  },
  {
    level: 7,
    question: 'Which one can SING?',
    items: [
      { emoji: '🐦', can: true, name: 'Bird' },
      { emoji: '🌷', can: false, name: 'Flower' },
      { emoji: '🚗', can: false, name: 'Car' }
    ],
    explanation: 'Birds love to sing beautiful songs!'
  },
  {
    level: 8,
    question: 'Which one can BREAK easily?',
    items: [
      { emoji: '🥚', can: true, name: 'Egg' },
      { emoji: '⚽', can: false, name: 'Ball' },
      { emoji: '🧽', can: false, name: 'Sponge' }
    ],
    explanation: 'Eggs have fragile shells that can crack easily!'
  },
  {
    level: 9,
    question: 'Which one can SWIM?',
    items: [
      { emoji: '🐠', can: true, name: 'Fish' },
      { emoji: '🦁', can: false, name: 'Lion' },
      { emoji: '🦅', can: false, name: 'Eagle' }
    ],
    explanation: 'Fish have fins and can swim in water!'
  },
  {
    level: 10,
    question: 'Which one can SPARKLE?',
    items: [
      { emoji: '💎', can: true, name: 'Diamond' },
      { emoji: '🧱', can: false, name: 'Brick' },
      { emoji: '🧽', can: false, name: 'Sponge' }
    ],
    explanation: 'Diamonds are precious gems that sparkle in light!'
  },

  // Level 11-20: More physical properties
  {
    level: 11,
    question: 'Which one can STRETCH?',
    items: [
      { emoji: '🧵', can: false, name: 'String' },
      { emoji: '🧽', can: true, name: 'Sponge' },
      { emoji: '🪙', can: false, name: 'Coin' }
    ],
    explanation: 'Sponges can be squeezed and stretched!'
  },
  {
    level: 12,
    question: 'Which one can HATCH?',
    items: [
      { emoji: '🥚', can: true, name: 'Egg' },
      { emoji: '🍎', can: false, name: 'Apple' },
      { emoji: '🧸', can: false, name: 'Teddy' }
    ],
    explanation: 'Eggs can hatch into baby birds or chicks!'
  },
  {
    level: 13,
    question: 'Which one can ROTATE?',
    items: [
      { emoji: '🧱', can: false, name: 'Brick' },
      { emoji: '🌪️', can: true, name: 'Fan' },
      { emoji: '🪨', can: false, name: 'Rock' }
    ],
    explanation: 'Fans spin around and rotate!'
  },
  {
    level: 14,
    question: 'Which one can SHINE?',
    items: [
      { emoji: '🌟', can: true, name: 'Star' },
      { emoji: '🪨', can: false, name: 'Rock' },
      { emoji: '🧱', can: false, name: 'Brick' }
    ],
    explanation: 'Stars shine brightly in the night sky!'
  },
  {
    level: 15,
    question: 'Which one can SINK?',
    items: [
      { emoji: '🎈', can: false, name: 'Balloon' },
      { emoji: '🪨', can: true, name: 'Rock' },
      { emoji: '🪵', can: false, name: 'Wood' }
    ],
    explanation: 'Rocks are heavy and sink in water!'
  },
  {
    level: 16,
    question: 'Which one can RUST?',
    items: [
      { emoji: '🧊', can: false, name: 'Ice' },
      { emoji: '🔩', can: true, name: 'Nail' },
      { emoji: '🪵', can: false, name: 'Wood' }
    ],
    explanation: 'Iron nails can rust when wet!'
  },
  {
    level: 17,
    question: 'Which one can EVAPORATE?',
    items: [
      { emoji: '💧', can: true, name: 'Water' },
      { emoji: '🪨', can: false, name: 'Stone' },
      { emoji: '🪙', can: false, name: 'Coin' }
    ],
    explanation: 'Water evaporates and becomes steam!'
  },
  {
    level: 18,
    question: 'Which one can FREEZE?',
    items: [
      { emoji: '🧃', can: true, name: 'Juice' },
      { emoji: '🔑', can: false, name: 'Key' },
      { emoji: '📎', can: false, name: 'Paperclip' }
    ],
    explanation: 'Juice can freeze into ice pops!'
  },
  {
    level: 19,
    question: 'Which one can ABSORB?',
    items: [
      { emoji: '🪙', can: false, name: 'Coin' },
      { emoji: '🧽', can: true, name: 'Sponge' },
      { emoji: '🔩', can: false, name: 'Screw' }
    ],
    explanation: 'Sponges absorb water and spills!'
  },
  {
    level: 20,
    question: 'Which one can REFLECT?',
    items: [
      { emoji: '🪞', can: true, name: 'Mirror' },
      { emoji: '🧱', can: false, name: 'Wall' },
      { emoji: '🪨', can: false, name: 'Rock' }
    ],
    explanation: 'Mirrors reflect light and show your image!'
  },

  // Level 21-30: Animals and abilities
  {
    level: 21,
    question: 'Which one can CLIMB trees?',
    items: [
      { emoji: '🐒', can: true, name: 'Monkey' },
      { emoji: '🐘', can: false, name: 'Elephant' },
      { emoji: '🐳', can: false, name: 'Whale' }
    ],
    explanation: 'Monkeys are great at climbing trees!'
  },
  {
    level: 22,
    question: 'Which one can SPIN a web?',
    items: [
      { emoji: '🦋', can: false, name: 'Butterfly' },
      { emoji: '🕷️', can: true, name: 'Spider' },
      { emoji: '🐞', can: false, name: 'Ladybug' }
    ],
    explanation: 'Spiders spin webs to catch flies!'
  },
  {
    level: 23,
    question: 'Which one can CARRY heavy things?',
    items: [
      { emoji: '🐜', can: false, name: 'Ant' },
      { emoji: '🐘', can: true, name: 'Elephant' },
      { emoji: '🦋', can: false, name: 'Butterfly' }
    ],
    explanation: 'Elephants are super strong!'
  },
  {
    level: 24,
    question: 'Which one can CAMOUFLAGE?',
    items: [
      { emoji: '🦓', can: false, name: 'Zebra' },
      { emoji: '🐙', can: true, name: 'Octopus' },
      { emoji: '🦒', can: false, name: 'Giraffe' }
    ],
    explanation: 'Octopuses can change color to hide!'
  },
  {
    level: 25,
    question: 'Which one can HIBERNATE?',
    items: [
      { emoji: '🐕', can: false, name: 'Dog' },
      { emoji: '🐻', can: true, name: 'Bear' },
      { emoji: '🐈', can: false, name: 'Cat' }
    ],
    explanation: 'Bears sleep through winter in caves!'
  },
  {
    level: 26,
    question: 'Which one can REGROW limbs?',
    items: [
      { emoji: '🐍', can: false, name: 'Snake' },
      { emoji: '🦎', can: true, name: 'Lizard' },
      { emoji: '🐢', can: false, name: 'Turtle' }
    ],
    explanation: 'Some lizards can regrow their tails!'
  },
  {
    level: 27,
    question: 'Which one can LIVE without water longest?',
    items: [
      { emoji: '🐟', can: false, name: 'Fish' },
      { emoji: '🐪', can: true, name: 'Camel' },
      { emoji: '🐸', can: false, name: 'Frog' }
    ],
    explanation: 'Camels store water and live in deserts!'
  },
  {
    level: 28,
    question: 'Which one can POISON?',
    items: [
      { emoji: '🐰', can: false, name: 'Bunny' },
      { emoji: '🐍', can: true, name: 'Snake' },
      { emoji: '🐑', can: false, name: 'Sheep' }
    ],
    explanation: 'Some snakes have venom in their bite!'
  },
  {
    level: 29,
    question: 'Which one can MAIM prey with claws?',
    items: [
      { emoji: '🦆', can: false, name: 'Duck' },
      { emoji: '🦁', can: true, name: 'Lion' },
      { emoji: '🦌', can: false, name: 'Deer' }
    ],
    explanation: 'Lions have sharp claws for hunting!'
  },
  {
    level: 30,
    question: 'Which one can SQUIRT ink?',
    items: [
      { emoji: '🦈', can: false, name: 'Shark' },
      { emoji: '🦑', can: true, name: 'Squid' },
      { emoji: '🐬', can: false, name: 'Dolphin' }
    ],
    explanation: 'Squids squirt ink to hide from danger!'
  },

  // Level 31-40: Technology and inventions
  {
    level: 31,
    question: 'Which one can CONNECT to internet?',
    items: [
      { emoji: '📺', can: false, name: 'TV (old)' },
      { emoji: '📱', can: true, name: 'Smartphone' },
      { emoji: '📻', can: false, name: 'Radio' }
    ],
    explanation: 'Smartphones can browse the internet!'
  },
  {
    level: 32,
    question: 'Which one can PRINT paper?',
    items: [
      { emoji: '🖱️', can: false, name: 'Mouse' },
      { emoji: '🖨️', can: true, name: 'Printer' },
      { emoji: '⌨️', can: false, name: 'Keyboard' }
    ],
    explanation: 'Printers put ink on paper!'
  },
  {
    level: 33,
    question: 'Which one can TAKE photos?',
    items: [
      { emoji: '📺', can: false, name: 'TV' },
      { emoji: '📷', can: true, name: 'Camera' },
      { emoji: '🎙️', can: false, name: 'Microphone' }
    ],
    explanation: 'Cameras capture photos!'
  },
  {
    level: 34,
    question: 'Which one can AMPLIFY sound?',
    items: [
      { emoji: '📱', can: false, name: 'Phone' },
      { emoji: '🔊', can: true, name: 'Speaker' },
      { emoji: '💻', can: false, name: 'Laptop' }
    ],
    explanation: 'Speakers make sound louder!'
  },
  {
    level: 35,
    question: 'Which one can CUT paper?',
    items: [
      { emoji: '✏️', can: false, name: 'Pencil' },
      { emoji: '✂️', can: true, name: 'Scissors' },
      { emoji: '🖍️', can: false, name: 'Crayon' }
    ],
    explanation: 'Scissors cut paper easily!'
  },
  {
    level: 36,
    question: 'Which one can MEASURE temperature?',
    items: [
      { emoji: '📏', can: false, name: 'Ruler' },
      { emoji: '🌡️', can: true, name: 'Thermometer' },
      { emoji: '⚖️', can: false, name: 'Scale' }
    ],
    explanation: 'Thermometers tell us how hot or cold!'
  },
  {
    level: 37,
    question: 'Which one can TELL time?',
    items: [
      { emoji: '📅', can: false, name: 'Calendar' },
      { emoji: '⌚', can: true, name: 'Watch' },
      { emoji: '🗺️', can: false, name: 'Map' }
    ],
    explanation: 'Watches show the current time!'
  },
  {
    level: 38,
    question: 'Which one can STORE electricity?',
    items: [
      { emoji: '💡', can: false, name: 'Bulb' },
      { emoji: '🔋', can: true, name: 'Battery' },
      { emoji: '🔌', can: false, name: 'Plug' }
    ],
    explanation: 'Batteries store power for later!'
  },
  {
    level: 39,
    question: 'Which one can PROJECT images?',
    items: [
      { emoji: '📺', can: false, name: 'TV' },
      { emoji: '📽️', can: true, name: 'Projector' },
      { emoji: '📻', can: false, name: 'Radio' }
    ],
    explanation: 'Projectors show movies on walls!'
  },
  {
    level: 40,
    question: 'Which one can SEND messages?',
    items: [
      { emoji: '📖', can: false, name: 'Book' },
      { emoji: '📱', can: true, name: 'Phone' },
      { emoji: '🎨', can: false, name: 'Paint' }
    ],
    explanation: 'Phones send texts and calls!'
  },

  // Level 41-50: Nature and science
  {
    level: 41,
    question: 'Which one can CONDUCT electricity?',
    items: [
      { emoji: '🪵', can: false, name: 'Wood' },
      { emoji: '🔌', can: true, name: 'Copper Wire' },
      { emoji: '🧱', can: false, name: 'Rubber' }
    ],
    explanation: 'Metal wires conduct electricity!'
  },
  {
    level: 42,
    question: 'Which one can PRODUCE oxygen?',
    items: [
      { emoji: '🚗', can: false, name: 'Car' },
      { emoji: '🌲', can: true, name: 'Tree' },
      { emoji: '🏭', can: false, name: 'Factory' }
    ],
    explanation: 'Trees make oxygen for us to breathe!'
  },
  {
    level: 43,
    question: 'Which one can ATTRACT magnets?',
    items: [
      { emoji: '🪵', can: false, name: 'Wood' },
      { emoji: '🔩', can: true, name: 'Iron' },
      { emoji: '🧱', can: false, name: 'Plastic' }
    ],
    explanation: 'Iron sticks to magnets!'
  },
  {
    level: 44,
    question: 'Which one can DISSOLVE in water?',
    items: [
      { emoji: '🪨', can: false, name: 'Rock' },
      { emoji: '🧂', can: true, name: 'Salt' },
      { emoji: '🪵', can: false, name: 'Wood' }
    ],
    explanation: 'Salt disappears when stirred in water!'
  },
  {
    level: 45,
    question: 'Which one can BLOCK light?',
    items: [
      { emoji: '💧', can: false, name: 'Water' },
      { emoji: '🧱', can: true, name: 'Wall' },
      { emoji: '💨', can: false, name: 'Air' }
    ],
    explanation: 'Walls stop light and make shadows!'
  },
  {
    level: 46,
    question: 'Which one can CREATE a rainbow?',
    items: [
      { emoji: '🔦', can: false, name: 'Flashlight' },
      { emoji: '💎', can: true, name: 'Prism' },
      { emoji: '🕯️', can: false, name: 'Candle' }
    ],
    explanation: 'Prisms split light into colors!'
  },
  {
    level: 47,
    question: 'Which one can GENERATE heat?',
    items: [
      { emoji: '❄️', can: false, name: 'Ice' },
      { emoji: '🔥', can: true, name: 'Fire' },
      { emoji: '💧', can: false, name: 'Water' }
    ],
    explanation: 'Fire produces heat and warmth!'
  },
  {
    level: 48,
    question: 'Which one can CREATE sound?',
    items: [
      { emoji: '🪨', can: false, name: 'Rock' },
      { emoji: '🥁', can: true, name: 'Drum' },
      { emoji: '🧱', can: false, name: 'Brick' }
    ],
    explanation: 'Drums make noise when hit!'
  },
  {
    level: 49,
    question: 'Which one can TRANSFORM energy?',
    items: [
      { emoji: '🪨', can: false, name: 'Rock' },
      { emoji: '⚡', can: true, name: 'Motor' },
      { emoji: '🧱', can: false, name: 'Wall' }
    ],
    explanation: 'Motors turn electricity into motion!'
  },
  {
    level: 50,
    question: 'Which one can PROTECT from rain?',
    items: [
      { emoji: '🪵', can: false, name: 'Paper' },
      { emoji: '☂️', can: true, name: 'Umbrella' },
      { emoji: '🧽', can: false, name: 'Sponge' }
    ],
    explanation: 'Umbrellas keep us dry in rain!'
  },

  // Level 51-60: Human body and health
  {
    level: 51,
    question: 'Which one can PUMP blood?',
    items: [
      { emoji: '🫁', can: false, name: 'Lungs' },
      { emoji: '🫀', can: true, name: 'Heart' },
      { emoji: '🧠', can: false, name: 'Brain' }
    ],
    explanation: 'The heart pumps blood through the body!'
  },
  {
    level: 52,
    question: 'Which one can DIGEST food?',
    items: [
      { emoji: '👁️', can: false, name: 'Eye' },
      { emoji: '🫃', can: true, name: 'Stomach' },
      { emoji: '👂', can: false, name: 'Ear' }
    ],
    explanation: 'The stomach breaks down food!'
  },
  {
    level: 53,
    question: 'Which one can DETECT smells?',
    items: [
      { emoji: '👅', can: false, name: 'Tongue' },
      { emoji: '👃', can: true, name: 'Nose' },
      { emoji: '👁️', can: false, name: 'Eye' }
    ],
    explanation: 'The nose can smell different scents!'
  },
  {
    level: 54,
    question: 'Which one can HELP you breathe?',
    items: [
      { emoji: '🫀', can: false, name: 'Heart' },
      { emoji: '🫁', can: true, name: 'Lungs' },
      { emoji: '🧠', can: false, name: 'Brain' }
    ],
    explanation: 'Lungs help us breathe air!'
  },
  {
    level: 55,
    question: 'Which one can CLEAN teeth?',
    items: [
      { emoji: '🧦', can: false, name: 'Sock' },
      { emoji: '🪥', can: true, name: 'Toothbrush' },
      { emoji: '🧽', can: false, name: 'Sponge' }
    ],
    explanation: 'Toothbrushes clean our teeth!'
  },
  {
    level: 56,
    question: 'Which one can KILL germs?',
    items: [
      { emoji: '💧', can: false, name: 'Water' },
      { emoji: '🧴', can: true, name: 'Soap' },
      { emoji: '🧃', can: false, name: 'Juice' }
    ],
    explanation: 'Soap kills germs and keeps us clean!'
  },
  {
    level: 57,
    question: 'Which one can MEASURE fever?',
    items: [
      { emoji: '🥄', can: false, name: 'Spoon' },
      { emoji: '🌡️', can: true, name: 'Thermometer' },
      { emoji: '🍴', can: false, name: 'Fork' }
    ],
    explanation: 'Thermometers check body temperature!'
  },
  {
    level: 58,
    question: 'Which one can FIX a cut?',
    items: [
      { emoji: '🧻', can: false, name: 'Paper' },
      { emoji: '🩹', can: true, name: 'Bandage' },
      { emoji: '🧽', can: false, name: 'Sponge' }
    ],
    explanation: 'Bandages cover and protect cuts!'
  },
  {
    level: 59,
    question: 'Which one can HELP you see?',
    items: [
      { emoji: '👓', can: true, name: 'Glasses' },
      { emoji: '👒', can: false, name: 'Hat' },
      { emoji: '🧤', can: false, name: 'Gloves' }
    ],
    explanation: 'Glasses help people see better!'
  },
  {
    level: 60,
    question: 'Which one can HEAR sounds?',
    items: [
      { emoji: '👂', can: true, name: 'Ear' },
      { emoji: '👃', can: false, name: 'Nose' },
      { emoji: '👁️', can: false, name: 'Eye' }
    ],
    explanation: 'Ears detect sounds!'
  },

  // Level 61-70: Vehicles and transport
  {
    level: 61,
    question: 'Which one can FLY in air?',
    items: [
      { emoji: '🚗', can: false, name: 'Car' },
      { emoji: '✈️', can: true, name: 'Airplane' },
      { emoji: '🚢', can: false, name: 'Ship' }
    ],
    explanation: 'Airplanes fly through the sky!'
  },
  {
    level: 62,
    question: 'Which one can SAIL on water?',
    items: [
      { emoji: '🚲', can: false, name: 'Bicycle' },
      { emoji: '⛵', can: true, name: 'Sailboat' },
      { emoji: '🛹', can: false, name: 'Skateboard' }
    ],
    explanation: 'Sailboats glide on water!'
  },
  {
    level: 63,
    question: 'Which one can GO to space?',
    items: [
      { emoji: '🚁', can: false, name: 'Helicopter' },
      { emoji: '🚀', can: true, name: 'Rocket' },
      { emoji: '🛶', can: false, name: 'Canoe' }
    ],
    explanation: 'Rockets blast off into space!'
  },
  {
    level: 64,
    question: 'Which one can DRIVE on road?',
    items: [
      { emoji: '🚤', can: false, name: 'Speedboat' },
      { emoji: '🚕', can: true, name: 'Taxi' },
      { emoji: '✈️', can: false, name: 'Plane' }
    ],
    explanation: 'Taxis drive on roads!'
  },
  {
    level: 65,
    question: 'Which one can RIDE on tracks?',
    items: [
      { emoji: '🚌', can: false, name: 'Bus' },
      { emoji: '🚆', can: true, name: 'Train' },
      { emoji: '🚕', can: false, name: 'Taxi' }
    ],
    explanation: 'Trains run on train tracks!'
  },
  {
    level: 66,
    question: 'Which one can HOVER above ground?',
    items: [
      { emoji: '🚗', can: false, name: 'Car' },
      { emoji: '🚁', can: true, name: 'Helicopter' },
      { emoji: '🚲', can: false, name: 'Bike' }
    ],
    explanation: 'Helicopters hover in the air!'
  },
  {
    level: 67,
    question: 'Which one can FLOAT on water?',
    items: [
      { emoji: '🚗', can: false, name: 'Car' },
      { emoji: '🚢', can: true, name: 'Ship' },
      { emoji: '🚲', can: false, name: 'Bike' }
    ],
    explanation: 'Ships float on water!'
  },
  {
    level: 68,
    question: 'Which one can STOP quickly?',
    items: [
      { emoji: '🛹', can: false, name: 'Skateboard' },
      { emoji: '🚃', can: true, name: 'Train' },
      { emoji: '🛴', can: false, name: 'Scooter' }
    ],
    explanation: 'Trains can brake and stop fast!'
  },
  {
    level: 69,
    question: 'Which one can RESCUE people?',
    items: [
      { emoji: '🚜', can: false, name: 'Tractor' },
      { emoji: '🚑', can: true, name: 'Ambulance' },
      { emoji: '🚛', can: false, name: 'Truck' }
    ],
    explanation: 'Ambulances rescue sick people!'
  },
  {
    level: 70,
    question: 'Which one can PUT OUT fires?',
    items: [
      { emoji: '🚌', can: false, name: 'Bus' },
      { emoji: '🚒', can: true, name: 'Fire Truck' },
      { emoji: '🚕', can: false, name: 'Taxi' }
    ],
    explanation: 'Fire trucks carry water to stop fires!'
  },

  // Level 71-80: Jobs and tools
  {
    level: 71,
    question: 'Which one can CURE sick people?',
    items: [
      { emoji: '👨‍🍳', can: false, name: 'Chef' },
      { emoji: '👨‍⚕️', can: true, name: 'Doctor' },
      { emoji: '👨‍🌾', can: false, name: 'Farmer' }
    ],
    explanation: 'Doctors help sick people get better!'
  },
  {
    level: 72,
    question: 'Which one can TEACH kids?',
    items: [
      { emoji: '👮', can: false, name: 'Police' },
      { emoji: '👨‍🏫', can: true, name: 'Teacher' },
      { emoji: '👷', can: false, name: 'Builder' }
    ],
    explanation: 'Teachers help children learn!'
  },
  {
    level: 73,
    question: 'Which one can COOK food?',
    items: [
      { emoji: '👩‍🚒', can: false, name: 'Firefighter' },
      { emoji: '👨‍🍳', can: true, name: 'Chef' },
      { emoji: '👩‍⚕️', can: false, name: 'Nurse' }
    ],
    explanation: 'Chefs cook delicious meals!'
  },
  {
    level: 74,
    question: 'Which one can BUILD houses?',
    items: [
      { emoji: '🧑‍⚖️', can: false, name: 'Judge' },
      { emoji: '👷', can: true, name: 'Builder' },
      { emoji: '👨‍🎤', can: false, name: 'Singer' }
    ],
    explanation: 'Builders construct buildings!'
  },
  {
    level: 75,
    question: 'Which one can PROTECT people?',
    items: [
      { emoji: '🧑‍🎨', can: false, name: 'Artist' },
      { emoji: '👮', can: true, name: 'Police' },
      { emoji: '👨‍🚀', can: false, name: 'Astronaut' }
    ],
    explanation: 'Police keep us safe!'
  },
  {
    level: 76,
    question: 'Which one can GROW food?',
    items: [
      { emoji: '👨‍🔬', can: false, name: 'Scientist' },
      { emoji: '👨‍🌾', can: true, name: 'Farmer' },
      { emoji: '👨‍💻', can: false, name: 'Programmer' }
    ],
    explanation: 'Farmers grow crops and raise animals!'
  },
  {
    level: 77,
    question: 'Which one can FIX cars?',
    items: [
      { emoji: '👨‍🎨', can: false, name: 'Painter' },
      { emoji: '👨‍🔧', can: true, name: 'Mechanic' },
      { emoji: '👨‍🎤', can: false, name: 'Singer' }
    ],
    explanation: 'Mechanics repair vehicles!'
  },
  {
    level: 78,
    question: 'Which one can HELP in court?',
    items: [
      { emoji: '👨‍🍳', can: false, name: 'Chef' },
      { emoji: '👨‍⚖️', can: true, name: 'Judge' },
      { emoji: '👨‍🌾', can: false, name: 'Farmer' }
    ],
    explanation: 'Judges work in courtrooms!'
  },
  {
    level: 79,
    question: 'Which one can PAINT pictures?',
    items: [
      { emoji: '👨‍🔬', can: false, name: 'Scientist' },
      { emoji: '👨‍🎨', can: true, name: 'Artist' },
      { emoji: '👨‍💼', can: false, name: 'Businessman' }
    ],
    explanation: 'Artists create beautiful paintings!'
  },
  {
    level: 80,
    question: 'Which one can STUDY stars?',
    items: [
      { emoji: '👨‍🌾', can: false, name: 'Farmer' },
      { emoji: '👨‍🔬', can: true, name: 'Scientist' },
      { emoji: '👨‍🍳', can: false, name: 'Chef' }
    ],
    explanation: 'Scientists study the universe!'
  },

  // Level 81-90: Space and planets
  {
    level: 81,
    question: 'Which one can SHINE at night?',
    items: [
      { emoji: '🌍', can: false, name: 'Earth' },
      { emoji: '🌟', can: true, name: 'Star' },
      { emoji: '🌑', can: false, name: 'Moon (new)' }
    ],
    explanation: 'Stars shine brightly in the night!'
  },
  {
    level: 82,
    question: 'Which one can ORBIT Earth?',
    items: [
      { emoji: '☀️', can: false, name: 'Sun' },
      { emoji: '🌙', can: true, name: 'Moon' },
      { emoji: '⭐', can: false, name: 'Star' }
    ],
    explanation: 'The Moon orbits around Earth!'
  },
  {
    level: 83,
    question: 'Which one can SUPPORT life?',
    items: [
      { emoji: '☀️', can: false, name: 'Sun' },
      { emoji: '🌍', can: true, name: 'Earth' },
      { emoji: '🪐', can: false, name: 'Saturn' }
    ],
    explanation: 'Earth has water and air for living things!'
  },
  {
    level: 84,
    question: 'Which one can BURN hot?',
    items: [
      { emoji: '🌙', can: false, name: 'Moon' },
      { emoji: '☀️', can: true, name: 'Sun' },
      { emoji: '🌍', can: false, name: 'Earth' }
    ],
    explanation: 'The Sun is very hot and fiery!'
  },
  {
    level: 85,
    question: 'Which one can HAVE rings?',
    items: [
      { emoji: '🌍', can: false, name: 'Earth' },
      { emoji: '🪐', can: true, name: 'Saturn' },
      { emoji: '☀️', can: false, name: 'Sun' }
    ],
    explanation: 'Saturn has beautiful rings!'
  },
  {
    level: 86,
    question: 'Which one can BE a red planet?',
    items: [
      { emoji: '🌍', can: false, name: 'Earth' },
      { emoji: '🔴', can: true, name: 'Mars' },
      { emoji: '🌙', can: false, name: 'Moon' }
    ],
    explanation: 'Mars is called the red planet!'
  },
  {
    level: 87,
    question: 'Which one can HAVE Great Spot?',
    items: [
      { emoji: '🌍', can: false, name: 'Earth' },
      { emoji: '🟠', can: true, name: 'Jupiter' },
      { emoji: '🪐', can: false, name: 'Saturn' }
    ],
    explanation: 'Jupiter has a Great Red Spot storm!'
  },
  {
    level: 88,
    question: 'Which one can BE smallest planet?',
    items: [
      { emoji: '🟠', can: false, name: 'Jupiter' },
      { emoji: '⚫', can: true, name: 'Mercury' },
      { emoji: '🔵', can: false, name: 'Neptune' }
    ],
    explanation: 'Mercury is the smallest planet!'
  },
  {
    level: 89,
    question: 'Which one can BE icy planet?',
    items: [
      { emoji: '☀️', can: false, name: 'Sun' },
      { emoji: '🔵', can: true, name: 'Neptune' },
      { emoji: '🔴', can: false, name: 'Mars' }
    ],
    explanation: 'Neptune is an icy blue planet!'
  },
  {
    level: 90,
    question: 'Which one can BE a dwarf planet?',
    items: [
      { emoji: '🌍', can: false, name: 'Earth' },
      { emoji: '🟤', can: true, name: 'Pluto' },
      { emoji: '☀️', can: false, name: 'Sun' }
    ],
    explanation: 'Pluto is a dwarf planet!'
  },

  // Level 91-100: Master challenge
  {
    level: 91,
    question: 'Which one can TRANSLATE languages?',
    items: [
      { emoji: '📖', can: false, name: 'Book' },
      { emoji: '🤖', can: true, name: 'AI' },
      { emoji: '✏️', can: false, name: 'Pencil' }
    ],
    explanation: 'Artificial Intelligence can translate languages!'
  },
  {
    level: 92,
    question: 'Which one can PREDICT weather?',
    items: [
      { emoji: '🎲', can: false, name: 'Dice' },
      { emoji: '💻', can: true, name: 'Supercomputer' },
      { emoji: '🎯', can: false, name: 'Dartboard' }
    ],
    explanation: 'Computers predict weather patterns!'
  },
  {
    level: 93,
    question: 'Which one can CURE diseases?',
    items: [
      { emoji: '🧸', can: false, name: 'Teddy Bear' },
      { emoji: '💊', can: true, name: 'Medicine' },
      { emoji: '🧃', can: false, name: 'Juice' }
    ],
    explanation: 'Medicine helps cure sickness!'
  },
  {
    level: 94,
    question: 'Which one can POWER cities?',
    items: [
      { emoji: '🔦', can: false, name: 'Flashlight' },
      { emoji: '🏭', can: true, name: 'Power Plant' },
      { emoji: '🕯️', can: false, name: 'Candle' }
    ],
    explanation: 'Power plants generate electricity for cities!'
  },
  {
    level: 95,
    question: 'Which one can STORE information?',
    items: [
      { emoji: '🪨', can: false, name: 'Rock' },
      { emoji: '💾', can: true, name: 'Computer' },
      { emoji: '🍂', can: false, name: 'Leaf' }
    ],
    explanation: 'Computers store data and information!'
  },
  {
    level: 96,
    question: 'Which one can COMMUNICATE worldwide?',
    items: [
      { emoji: '📻', can: false, name: 'Radio' },
      { emoji: '📡', can: true, name: 'Satellite' },
      { emoji: '📯', can: false, name: 'Horn' }
    ],
    explanation: 'Satellites connect the world!'
  },
  {
    level: 97,
    question: 'Which one can MOVE mountains?',
    items: [
      { emoji: '🔨', can: false, name: 'Hammer' },
      { emoji: '🧨', can: true, name: 'Dynamite' },
      { emoji: '🔧', can: false, name: 'Wrench' }
    ],
    explanation: 'Explosives can move mountains!'
  },
  {
    level: 98,
    question: 'Which one can SEE through walls?',
    items: [
      { emoji: '👁️', can: false, name: 'Eye' },
      { emoji: '📡', can: true, name: 'Radar' },
      { emoji: '🔭', can: false, name: 'Telescope' }
    ],
    explanation: 'Radar can detect through walls!'
  },
  {
    level: 99,
    question: 'Which one can LIVE forever?',
    items: [
      { emoji: '🐘', can: false, name: 'Elephant' },
      { emoji: '🧬', can: true, name: 'DNA' },
      { emoji: '🌳', can: false, name: 'Tree' }
    ],
    explanation: 'DNA carries life information forward!'
  },
  {
    level: 100,
    question: 'Which one can MAKE you a champion?',
    items: [
      { emoji: '📱', can: false, name: 'Phone' },
      { emoji: '🧠', can: true, name: 'Knowledge' },
      { emoji: '🎮', can: false, name: 'Game' }
    ],
    explanation: 'Knowledge and learning make you a true champion!'
  }
]
