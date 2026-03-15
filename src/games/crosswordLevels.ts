// 100 Crossword Levels - Progressive difficulty
export const CROSSWORD_LEVELS = [
  // Level 1-10: 3-letter words, simple clues
  {
    level: 1,
    words: [
      { word: 'CAT', clue: 'Pet that meows', row: 0, col: 0, direction: 'across' },
      { word: 'CAR', clue: 'Has four wheels', row: 0, col: 0, direction: 'down' },
      { word: 'BAT', clue: 'Flies at night', row: 0, col: 2, direction: 'down' }
    ]
  },
  {
    level: 2,
    words: [
      { word: 'DOG', clue: 'Loyal pet', row: 0, col: 0, direction: 'across' },
      { word: 'DOT', clue: 'Small round mark', row: 0, col: 0, direction: 'down' },
      { word: 'GOT', clue: 'Past tense of get', row: 0, col: 2, direction: 'down' }
    ]
  },
  {
    level: 3,
    words: [
      { word: 'SUN', clue: 'Gives light and warmth', row: 0, col: 0, direction: 'across' },
      { word: 'SKY', clue: 'Blue above us', row: 0, col: 0, direction: 'down' },
      { word: 'BOY', clue: 'Male child', row: 0, col: 2, direction: 'down' }
    ]
  },
  {
    level: 4,
    words: [
      { word: 'HAT', clue: 'Worn on head', row: 0, col: 0, direction: 'across' },
      { word: 'HAM', clue: 'Pork meat', row: 0, col: 0, direction: 'down' },
      { word: 'MAT', clue: 'Welcome at door', row: 0, col: 2, direction: 'down' }
    ]
  },
  {
    level: 5,
    words: [
      { word: 'BEE', clue: 'Makes honey', row: 0, col: 0, direction: 'across' },
      { word: 'BED', clue: 'Sleep here', row: 0, col: 0, direction: 'down' },
      { word: 'EGG', clue: 'Laid by birds', row: 0, col: 2, direction: 'down' }
    ]
  },
  {
    level: 6,
    words: [
      { word: 'RED', clue: 'Color of fire truck', row: 0, col: 0, direction: 'across' },
      { word: 'RAT', clue: 'Small rodent', row: 0, col: 0, direction: 'down' },
      { word: 'BEE', clue: 'Buzzing insect', row: 0, col: 2, direction: 'down' }
    ]
  },
  {
    level: 7,
    words: [
      { word: 'COW', clue: 'Gives us milk', row: 0, col: 0, direction: 'across' },
      { word: 'CUP', clue: 'Drink from it', row: 0, col: 0, direction: 'down' },
      { word: 'OWL', clue: 'Wise bird', row: 0, col: 2, direction: 'down' }
    ]
  },
  {
    level: 8,
    words: [
      { word: 'PEN', clue: 'Writes with ink', row: 0, col: 0, direction: 'across' },
      { word: 'PIE', clue: 'Apple dessert', row: 0, col: 0, direction: 'down' },
      { word: 'NET', clue: 'Fishing tool', row: 0, col: 2, direction: 'down' }
    ]
  },
  {
    level: 9,
    words: [
      { word: 'BUS', clue: 'School transport', row: 0, col: 0, direction: 'across' },
      { word: 'BAT', clue: 'Baseball tool', row: 0, col: 0, direction: 'down' },
      { word: 'USE', clue: 'To utilize', row: 0, col: 2, direction: 'down' }
    ]
  },
  {
    level: 10,
    words: [
      { word: 'TOY', clue: 'Child plays with it', row: 0, col: 0, direction: 'across' },
      { word: 'TOP', clue: 'Spins around', row: 0, col: 0, direction: 'down' },
      { word: 'YAM', clue: 'Sweet potato', row: 0, col: 2, direction: 'down' }
    ]
  },

  // Level 11-20: 4-letter words
  {
    level: 11,
    words: [
      { word: 'BOOK', clue: 'You read this', row: 0, col: 0, direction: 'across' },
      { word: 'BALL', clue: 'Round toy', row: 0, col: 0, direction: 'down' },
      { word: 'LOOK', clue: 'To see', row: 0, col: 1, direction: 'down' },
      { word: 'KITE', clue: 'Flies in sky', row: 3, col: 0, direction: 'across' }
    ]
  },
  {
    level: 12,
    words: [
      { word: 'TREE', clue: 'Has leaves', row: 0, col: 0, direction: 'across' },
      { word: 'TOYS', clue: 'Children play', row: 0, col: 0, direction: 'down' },
      { word: 'REST', clue: 'Take a break', row: 0, col: 3, direction: 'down' },
      { word: 'EYES', clue: 'You see with these', row: 3, col: 0, direction: 'across' }
    ]
  },
  {
    level: 13,
    words: [
      { word: 'FISH', clue: 'Swims in water', row: 0, col: 0, direction: 'across' },
      { word: 'FOOD', clue: 'You eat this', row: 0, col: 0, direction: 'down' },
      { word: 'SHOE', clue: 'Worn on foot', row: 0, col: 3, direction: 'down' },
      { word: 'HAND', clue: 'Has five fingers', row: 3, col: 0, direction: 'across' }
    ]
  },
  {
    level: 14,
    words: [
      { word: 'BIRD', clue: 'Has feathers', row: 0, col: 0, direction: 'across' },
      { word: 'BOAT', clue: 'Floats on water', row: 0, col: 0, direction: 'down' },
      { word: 'RIDE', clue: 'Sit on and move', row: 0, col: 3, direction: 'down' },
      { word: 'DEER', clue: 'Has antlers', row: 3, col: 0, direction: 'across' }
    ]
  },
  {
    level: 15,
    words: [
      { word: 'MILK', clue: 'White drink', row: 0, col: 0, direction: 'across' },
      { word: 'MOON', clue: 'In the night sky', row: 0, col: 0, direction: 'down' },
      { word: 'LOCK', clue: 'Needs a key', row: 0, col: 3, direction: 'down' },
      { word: 'NEST', clue: 'Birds home', row: 3, col: 0, direction: 'across' }
    ]
  },
  {
    level: 16,
    words: [
      { word: 'CAKE', clue: 'Birthday dessert', row: 0, col: 0, direction: 'across' },
      { word: 'CARS', clue: 'Driven on roads', row: 0, col: 0, direction: 'down' },
      { word: 'KEPT', clue: 'Held on to', row: 0, col: 2, direction: 'down' },
      { word: 'EAST', clue: 'Direction', row: 3, col: 0, direction: 'across' }
    ]
  },
  {
    level: 17,
    words: [
      { word: 'SHOE', clue: 'Footwear', row: 0, col: 0, direction: 'across' },
      { word: 'SHIP', clue: 'Sails on sea', row: 0, col: 0, direction: 'down' },
      { word: 'OPEN', clue: 'Not closed', row: 0, col: 3, direction: 'down' },
      { word: 'PEEL', clue: 'Outer skin of fruit', row: 3, col: 0, direction: 'across' }
    ]
  },
  {
    level: 18,
    words: [
      { word: 'RAIN', clue: 'Falls from clouds', row: 0, col: 0, direction: 'across' },
      { word: 'ROAD', clue: 'Cars drive here', row: 0, col: 0, direction: 'down' },
      { word: 'INFO', clue: 'Information', row: 0, col: 3, direction: 'down' },
      { word: 'NOSE', clue: 'Smell with it', row: 3, col: 0, direction: 'across' }
    ]
  },
  {
    level: 19,
    words: [
      { word: 'FROG', clue: 'Green jumper', row: 0, col: 0, direction: 'across' },
      { word: 'FLAG', clue: 'Waves in wind', row: 0, col: 0, direction: 'down' },
      { word: 'GIFT', clue: 'Present', row: 0, col: 3, direction: 'down' },
      { word: 'GOAT', clue: 'Has horns and beard', row: 3, col: 0, direction: 'across' }
    ]
  },
  {
    level: 20,
    words: [
      { word: 'DUCK', clue: 'Quacking bird', row: 0, col: 0, direction: 'across' },
      { word: 'DOLL', clue: 'Girls toy', row: 0, col: 0, direction: 'down' },
      { word: 'CLUB', clue: 'Group or bat', row: 0, col: 3, direction: 'down' },
      { word: 'LOCK', clue: 'Keeps door shut', row: 3, col: 0, direction: 'across' }
    ]
  },

  // Level 21-30: 5-letter words
  {
    level: 21,
    words: [
      { word: 'APPLE', clue: 'Red or green fruit', row: 0, col: 0, direction: 'across' },
      { word: 'AGENT', clue: 'Secret spy', row: 0, col: 0, direction: 'down' },
      { word: 'PEACH', clue: 'Fuzzy fruit', row: 2, col: 0, direction: 'across' },
      { word: 'ONION', clue: 'Makes you cry', row: 0, col: 4, direction: 'down' }
    ]
  },
  {
    level: 22,
    words: [
      { word: 'TABLE', clue: 'Eat dinner here', row: 0, col: 0, direction: 'across' },
      { word: 'TIGER', clue: 'Striped cat', row: 0, col: 0, direction: 'down' },
      { word: 'LEMON', clue: 'Sour yellow fruit', row: 2, col: 0, direction: 'across' },
      { word: 'RIVER', clue: 'Flowing water', row: 0, col: 4, direction: 'down' }
    ]
  },
  {
    level: 23,
    words: [
      { word: 'CHAIR', clue: 'Sit on it', row: 0, col: 0, direction: 'across' },
      { word: 'CHESS', clue: 'Board game', row: 0, col: 0, direction: 'down' },
      { word: 'ALERT', clue: 'Pay attention', row: 2, col: 0, direction: 'across' },
      { word: 'SNAIL', clue: 'Slow and slimy', row: 0, col: 4, direction: 'down' }
    ]
  },
  {
    level: 24,
    words: [
      { word: 'GRAPE', clue: 'Purple or green fruit', row: 0, col: 0, direction: 'across' },
      { word: 'GLOBE', clue: 'World map ball', row: 0, col: 0, direction: 'down' },
      { word: 'OCEAN', clue: 'Big body of water', row: 2, col: 0, direction: 'across' },
      { word: 'NERVE', clue: 'Courage', row: 0, col: 4, direction: 'down' }
    ]
  },
  {
    level: 25,
    words: [
      { word: 'MOUSE', clue: 'Small rodent', row: 0, col: 0, direction: 'across' },
      { word: 'MANGO', clue: 'Tropical fruit', row: 0, col: 0, direction: 'down' },
      { word: 'ONION', clue: 'Ring vegetable', row: 2, col: 0, direction: 'across' },
      { word: 'EAGLE', clue: 'Majestic bird', row: 0, col: 4, direction: 'down' }
    ]
  },
  {
    level: 26,
    words: [
      { word: 'SHEEP', clue: 'Woolly animal', row: 0, col: 0, direction: 'across' },
      { word: 'SHARK', clue: 'Ocean predator', row: 0, col: 0, direction: 'down' },
      { word: 'HELLO', clue: 'Friendly greeting', row: 2, col: 0, direction: 'across' },
      { word: 'KNIFE', clue: 'Cutting tool', row: 0, col: 4, direction: 'down' }
    ]
  },
  {
    level: 27,
    words: [
      { word: 'CLOUD', clue: 'In the sky', row: 0, col: 0, direction: 'across' },
      { word: 'CRANE', clue: 'Bird or machine', row: 0, col: 0, direction: 'down' },
      { word: 'OASIS', clue: 'Desert water', row: 2, col: 0, direction: 'across' },
      { word: 'DANCE', clue: 'Move to music', row: 0, col: 4, direction: 'down' }
    ]
  },
  {
    level: 28,
    words: [
      { word: 'PLANT', clue: 'Grows in soil', row: 0, col: 0, direction: 'across' },
      { word: 'PIZZA', clue: 'Italian food', row: 0, col: 0, direction: 'down' },
      { word: 'LEAFY', clue: 'Like lettuce', row: 2, col: 0, direction: 'across' },
      { word: 'TIGER', clue: 'Big striped cat', row: 0, col: 4, direction: 'down' }
    ]
  },
  {
    level: 29,
    words: [
      { word: 'WATER', clue: 'Drink this daily', row: 0, col: 0, direction: 'across' },
      { word: 'WHALE', clue: 'Giant sea mammal', row: 0, col: 0, direction: 'down' },
      { word: 'TOWER', clue: 'Tall structure', row: 2, col: 0, direction: 'across' },
      { word: 'RIVER', clue: 'Water flows here', row: 0, col: 4, direction: 'down' }
    ]
  },
  {
    level: 30,
    words: [
      { word: 'BREAD', clue: 'Baked food', row: 0, col: 0, direction: 'across' },
      { word: 'BEACH', clue: 'Sand and waves', row: 0, col: 0, direction: 'down' },
      { word: 'EARTH', clue: 'Our planet', row: 2, col: 0, direction: 'across' },
      { word: 'CHAIR', clue: 'Sit here', row: 0, col: 4, direction: 'down' }
    ]
  },

  // Level 31-40: 6-7 letter words
  {
    level: 31,
    words: [
      { word: 'BANANA', clue: 'Yellow curved fruit', row: 0, col: 0, direction: 'across' },
      { word: 'BOTTLE', clue: 'Holds liquid', row: 0, col: 0, direction: 'down' },
      { word: 'NATURE', clue: 'The outdoors', row: 2, col: 0, direction: 'across' },
      { word: 'TURTLE', clue: 'Has a shell', row: 0, col: 5, direction: 'down' }
    ]
  },
  {
    level: 32,
    words: [
      { word: 'GARDEN', clue: 'Plants grow here', row: 0, col: 0, direction: 'across' },
      { word: 'GUITAR', clue: 'Six strings', row: 0, col: 0, direction: 'down' },
      { word: 'DONKEY', clue: 'Braying animal', row: 2, col: 0, direction: 'across' },
      { word: 'NURSE', clue: 'Helps sick people', row: 0, col: 5, direction: 'down' }
    ]
  },
  {
    level: 33,
    words: [
      { word: 'RABBIT', clue: 'Hops and eats carrots', row: 0, col: 0, direction: 'across' },
      { word: 'ROCKET', clue: 'Goes to space', row: 0, col: 0, direction: 'down' },
      { word: 'BUTTER', clue: 'Yellow spread', row: 2, col: 0, direction: 'across' },
      { word: 'TENNIS', clue: 'Racket sport', row: 0, col: 5, direction: 'down' }
    ]
  },
  {
    level: 34,
    words: [
      { word: 'CIRCLE', clue: 'Round shape', row: 0, col: 0, direction: 'across' },
      { word: 'CASTLE', clue: 'Kings live here', row: 0, col: 0, direction: 'down' },
      { word: 'INSECT', clue: 'Bug with six legs', row: 2, col: 0, direction: 'across' },
      { word: 'ELEVEN', clue: 'After ten', row: 0, col: 5, direction: 'down' }
    ]
  },
  {
    level: 35,
    words: [
      { word: 'SUMMER', clue: 'Hot season', row: 0, col: 0, direction: 'across' },
      { word: 'SINGER', clue: 'Songs performer', row: 0, col: 0, direction: 'down' },
      { word: 'MARKER', clue: 'Drawing tool', row: 2, col: 0, direction: 'across' },
      { word: 'ENERGY', clue: 'Power to do work', row: 0, col: 5, direction: 'down' }
    ]
  },
  {
    level: 36,
    words: [
      { word: 'WINTER', clue: 'Cold season', row: 0, col: 0, direction: 'across' },
      { word: 'WONDER', clue: 'Amazing thing', row: 0, col: 0, direction: 'down' },
      { word: 'NECTAR', clue: 'Flower juice', row: 2, col: 0, direction: 'across' },
      { word: 'REWARD', clue: 'Prize', row: 0, col: 5, direction: 'down' }
    ]
  },
  {
    level: 37,
    words: [
      { word: 'FAMILY', clue: 'Mom dad kids', row: 0, col: 0, direction: 'across' },
      { word: 'FOREST', clue: 'Many trees', row: 0, col: 0, direction: 'down' },
      { word: 'INSIDE', clue: 'Not outside', row: 2, col: 0, direction: 'across' },
      { word: 'YELLOW', clue: 'Color of sun', row: 0, col: 5, direction: 'down' }
    ]
  },
  {
    level: 38,
    words: [
      { word: 'SCHOOL', clue: 'Learn here', row: 0, col: 0, direction: 'across' },
      { word: 'SISTER', clue: 'Female sibling', row: 0, col: 0, direction: 'down' },
      { word: 'COFFEE', clue: 'Morning drink', row: 2, col: 0, direction: 'across' },
      { word: 'ORANGE', clue: 'Color and fruit', row: 0, col: 5, direction: 'down' }
    ]
  },
  {
    level: 39,
    words: [
      { word: 'DOCTOR', clue: 'Heals sick people', row: 0, col: 0, direction: 'across' },
      { word: 'DESERT', clue: 'Sandy and dry', row: 0, col: 0, direction: 'down' },
      { word: 'TOFFEE', clue: 'Chewy candy', row: 2, col: 0, direction: 'across' },
      { word: 'ROCKET', clue: 'Blasts to space', row: 0, col: 5, direction: 'down' }
    ]
  },
  {
    level: 40,
    words: [
      { word: 'PICNIC', clue: 'Eat outdoors', row: 0, col: 0, direction: 'across' },
      { word: 'POLICE', clue: 'Keep us safe', row: 0, col: 0, direction: 'down' },
      { word: 'NICKEL', clue: 'Five cents', row: 2, col: 0, direction: 'across' },
      { word: 'CANDLE', clue: 'Gives light', row: 0, col: 5, direction: 'down' }
    ]
  },

  // Level 41-50: Challenge levels with longer words
  {
    level: 41,
    words: [
      { word: 'GIRAFFE', clue: 'Tall spotted animal', row: 0, col: 0, direction: 'across' },
      { word: 'GALAXY', clue: 'Star system', row: 0, col: 0, direction: 'down' },
      { word: 'AFRICA', clue: 'Continent', row: 2, col: 0, direction: 'across' },
      { word: 'FEATHER', clue: 'Birds have these', row: 0, col: 6, direction: 'down' }
    ]
  },
  {
    level: 42,
    words: [
      { word: 'PENGUIN', clue: 'Ice bird', row: 0, col: 0, direction: 'across' },
      { word: 'PLANETS', clue: 'Orbit the sun', row: 0, col: 0, direction: 'down' },
      { word: 'NATURE', clue: 'Outdoors', row: 2, col: 0, direction: 'across' },
      { word: 'TROPIC', clue: 'Hot region', row: 0, col: 6, direction: 'down' }
    ]
  },
  {
    level: 43,
    words: [
      { word: 'OCTOPUS', clue: 'Eight arms', row: 0, col: 0, direction: 'across' },
      { word: 'OXYGEN', clue: 'We breathe it', row: 0, col: 0, direction: 'down' },
      { word: 'TURTLE', clue: 'Slow shell animal', row: 2, col: 0, direction: 'across' },
      { word: 'SPRING', clue: 'Flower season', row: 0, col: 6, direction: 'down' }
    ]
  },
  {
    level: 44,
    words: [
      { word: 'DOLPHIN', clue: 'Smart sea mammal', row: 0, col: 0, direction: 'across' },
      { word: 'DIAMOND', clue: 'Sparkly gem', row: 0, col: 0, direction: 'down' },
      { word: 'LAUGHTER', clue: 'Happy sound', row: 2, col: 0, direction: 'across' },
      { word: 'NEST', clue: 'Birds home', row: 0, col: 7, direction: 'down' }
    ]
  },
  {
    level: 45,
    words: [
      { word: 'BUTTERFLY', clue: 'Colorful insect', row: 0, col: 0, direction: 'across' },
      { word: 'BALLOON', clue: 'Floats with air', row: 0, col: 0, direction: 'down' },
      { word: 'TEACHER', clue: 'Helps you learn', row: 2, col: 0, direction: 'across' },
      { word: 'FLY', clue: 'In the air', row: 0, col: 8, direction: 'down' }
    ]
  },
  {
    level: 46,
    words: [
      { word: 'ELEPHANT', clue: 'Big trunk animal', row: 0, col: 0, direction: 'across' },
      { word: 'ECLIPSE', clue: 'Sun or moon covered', row: 0, col: 0, direction: 'down' },
      { word: 'ANT', clue: 'Tiny insect', row: 2, col: 0, direction: 'across' },
      { word: 'TIGER', clue: 'Striped cat', row: 0, col: 7, direction: 'down' }
    ]
  },
  {
    level: 47,
    words: [
      { word: 'FESTIVAL', clue: 'Big celebration', row: 0, col: 0, direction: 'across' },
      { word: 'FLOWER', clue: 'Pretty plant', row: 0, col: 0, direction: 'down' },
      { word: 'SWIMMING', clue: 'In the pool', row: 2, col: 0, direction: 'across' },
      { word: 'LION', clue: 'King of jungle', row: 0, col: 7, direction: 'down' }
    ]
  },
  {
    level: 48,
    words: [
      { word: 'CHAMPION', clue: 'The winner', row: 0, col: 0, direction: 'across' },
      { word: 'CHEETAH', clue: 'Fastest animal', row: 0, col: 0, direction: 'down' },
      { word: 'MONKEY', clue: 'Likes bananas', row: 2, col: 0, direction: 'across' },
      { word: 'ONION', clue: 'Makes you cry', row: 0, col: 7, direction: 'down' }
    ]
  },
  {
    level: 49,
    words: [
      { word: 'ADVENTURE', clue: 'Exciting journey', row: 0, col: 0, direction: 'across' },
      { word: 'AQUARIUM', clue: 'Fish tank', row: 0, col: 0, direction: 'down' },
      { word: 'VOLCANO', clue: 'Erupts lava', row: 2, col: 0, direction: 'across' },
      { word: 'RAINBOW', clue: 'Colors in sky', row: 0, col: 8, direction: 'down' }
    ]
  },
  {
    level: 50,
    words: [
      { word: 'KANGAROO', clue: 'Hops with pouch', row: 0, col: 0, direction: 'across' },
      { word: 'KINGDOM', clue: 'Royal land', row: 0, col: 0, direction: 'down' },
      { word: 'UNIVERSE', clue: 'Everything', row: 2, col: 0, direction: 'across' },
      { word: 'ORBIT', clue: 'Circle around', row: 0, col: 7, direction: 'down' }
    ]
  },

  // Level 51-60: Advanced vocabulary
  {
    level: 51,
    words: [
      { word: 'RAINBOW', clue: 'Colors after rain', row: 0, col: 0, direction: 'across' },
      { word: 'RABBIT', clue: 'Hops with long ears', row: 0, col: 0, direction: 'down' },
      { word: 'ISLAND', clue: 'Surrounded by water', row: 2, col: 0, direction: 'across' },
      { word: 'NIGHT', clue: 'When stars appear', row: 0, col: 5, direction: 'down' }
    ]
  },
  {
    level: 52,
    words: [
      { word: 'SCULPTOR', clue: 'Makes statues', row: 0, col: 0, direction: 'across' },
      { word: 'SCISSORS', clue: 'Cutting tool', row: 0, col: 0, direction: 'down' },
      { word: 'LEOPARD', clue: 'Spotted big cat', row: 2, col: 0, direction: 'across' },
      { word: 'ORANGE', clue: 'Color and fruit', row: 0, col: 7, direction: 'down' }
    ]
  },
  {
    level: 53,
    words: [
      { word: 'TELESCOPE', clue: 'Sees far stars', row: 0, col: 0, direction: 'across' },
      { word: 'TREASURE', clue: 'Pirate gold', row: 0, col: 0, direction: 'down' },
      { word: 'LEAF', clue: 'On trees', row: 2, col: 0, direction: 'across' },
      { word: 'EAGLE', clue: 'Majestic bird', row: 0, col: 8, direction: 'down' }
    ]
  },
  {
    level: 54,
    words: [
      { word: 'AIRPLANE', clue: 'Flies in sky', row: 0, col: 0, direction: 'across' },
      { word: 'ASTRONAUT', clue: 'Space traveler', row: 0, col: 0, direction: 'down' },
      { word: 'RADIO', clue: 'Plays music', row: 2, col: 0, direction: 'across' },
      { word: 'NEST', clue: 'Bird home', row: 0, col: 7, direction: 'down' }
    ]
  },
  {
    level: 55,
    words: [
      { word: 'COMPUTER', clue: 'Electronic brain', row: 0, col: 0, direction: 'across' },
      { word: 'CACTUS', clue: 'Desert plant', row: 0, col: 0, direction: 'down' },
      { word: 'OTTER', clue: 'Playful water animal', row: 2, col: 0, direction: 'across' },
      { word: 'RAIN', clue: 'Falls from clouds', row: 0, col: 7, direction: 'down' }
    ]
  },
  {
    level: 56,
    words: [
      { word: 'PINEAPPLE', clue: 'Spiky fruit', row: 0, col: 0, direction: 'across' },
      { word: 'PAINTER', clue: 'Uses brush', row: 0, col: 0, direction: 'down' },
      { word: 'NEEDLE', clue: 'Sews fabric', row: 2, col: 0, direction: 'across' },
      { word: 'EARTH', clue: 'Our planet', row: 0, col: 8, direction: 'down' }
    ]
  },
  {
    level: 57,
    words: [
      { word: 'DINOSAUR', clue: 'Ancient reptile', row: 0, col: 0, direction: 'across' },
      { word: 'DESERT', clue: 'Hot and sandy', row: 0, col: 0, direction: 'down' },
      { word: 'OCEAN', clue: 'Big water', row: 2, col: 0, direction: 'across' },
      { word: 'RIVER', clue: 'Flowing water', row: 0, col: 6, direction: 'down' }
    ]
  },
  {
    level: 58,
    words: [
      { word: 'BALLOON', clue: 'Filled with air', row: 0, col: 0, direction: 'across' },
      { word: 'BICYCLE', clue: 'Two wheels', row: 0, col: 0, direction: 'down' },
      { word: 'LOOM', clue: 'Weaving tool', row: 2, col: 0, direction: 'across' },
      { word: 'OWL', clue: 'Night bird', row: 0, col: 6, direction: 'down' }
    ]
  },
  {
    level: 59,
    words: [
      { word: 'SCIENTIST', clue: 'Studies nature', row: 0, col: 0, direction: 'across' },
      { word: 'SKYSCRAPER', clue: 'Tall building', row: 0, col: 0, direction: 'down' },
      { word: 'ECLIPSE', clue: 'Covers sun', row: 2, col: 0, direction: 'across' },
      { word: 'NEPTUNE', clue: 'Blue planet', row: 0, col: 8, direction: 'down' }
    ]
  },
  {
    level: 60,
    words: [
      { word: 'HAMBURGER', clue: 'Beef sandwich', row: 0, col: 0, direction: 'across' },
      { word: 'HONEY', clue: 'Bee product', row: 0, col: 0, direction: 'down' },
      { word: 'MUSEUM', clue: 'Art building', row: 2, col: 0, direction: 'across' },
      { word: 'ROBIN', clue: 'Red breast bird', row: 0, col: 8, direction: 'down' }
    ]
  },

  // Level 61-70: Science and geography
  {
    level: 61,
    words: [
      { word: 'EQUATOR', clue: 'Middle of Earth', row: 0, col: 0, direction: 'across' },
      { word: 'EARTH', clue: 'Blue planet', row: 0, col: 0, direction: 'down' },
      { word: 'AURORA', clue: 'Northern lights', row: 2, col: 0, direction: 'across' },
      { word: 'ORBIT', clue: 'Circle path', row: 0, col: 5, direction: 'down' }
    ]
  },
  {
    level: 62,
    words: [
      { word: 'PYRAMID', clue: 'Egyptian tomb', row: 0, col: 0, direction: 'across' },
      { word: 'PLANET', clue: 'Orbits sun', row: 0, col: 0, direction: 'down' },
      { word: 'YACHT', clue: 'Sailing boat', row: 2, col: 0, direction: 'across' },
      { word: 'TOWER', clue: 'Tall structure', row: 0, col: 6, direction: 'down' }
    ]
  },
  {
    level: 63,
    words: [
      { word: 'JUNGLE', clue: 'Thick forest', row: 0, col: 0, direction: 'across' },
      { word: 'JUPITER', clue: 'Biggest planet', row: 0, col: 0, direction: 'down' },
      { word: 'GIRAFFE', clue: 'Long neck', row: 2, col: 0, direction: 'across' },
      { word: 'EARTH', clue: 'Home planet', row: 0, col: 6, direction: 'down' }
    ]
  },
  {
    level: 64,
    words: [
      { word: 'CANYON', clue: 'Deep valley', row: 0, col: 0, direction: 'across' },
      { word: 'COMET', clue: 'Space rock', row: 0, col: 0, direction: 'down' },
      { word: 'OASIS', clue: 'Desert water', row: 2, col: 0, direction: 'across' },
      { word: 'SNAKE', clue: 'No legs', row: 0, col: 5, direction: 'down' }
    ]
  },
  {
    level: 65,
    words: [
      { word: 'VOLCANO', clue: 'Erupts fire', row: 0, col: 0, direction: 'across' },
      { word: 'VIOLET', clue: 'Purple flower', row: 0, col: 0, direction: 'down' },
      { word: 'CAMEL', clue: 'Desert animal', row: 2, col: 0, direction: 'across' },
      { word: 'OCEAN', clue: 'Big water', row: 0, col: 6, direction: 'down' }
    ]
  },
  {
    level: 66,
    words: [
      { word: ' tsUNAMI', clue: 'Giant wave', row: 0, col: 0, direction: 'across' },
      { word: 'TIGER', clue: 'Striped cat', row: 0, col: 0, direction: 'down' },
      { word: 'NEBULA', clue: 'Space cloud', row: 2, col: 0, direction: 'across' },
      { word: 'ALIEN', clue: 'From space', row: 0, col: 5, direction: 'down' }
    ]
  },
  {
    level: 67,
    words: [
      { word: 'GLACIER', clue: 'Frozen river', row: 0, col: 0, direction: 'across' },
      { word: 'GALAXY', clue: 'Star group', row: 0, col: 0, direction: 'down' },
      { word: 'ICEBERG', clue: 'Frozen mountain', row: 2, col: 0, direction: 'across' },
      { word: 'EARTH', clue: 'Home', row: 0, col: 6, direction: 'down' }
    ]
  },
  {
    level: 68,
    words: [
      { word: 'TORNADO', clue: 'Spinning wind', row: 0, col: 0, direction: 'across' },
      { word: 'TURTLE', clue: 'Slow shell', row: 0, col: 0, direction: 'down' },
      { word: 'ROCKET', clue: 'Goes to space', row: 2, col: 0, direction: 'across' },
      { word: 'EAGLE', clue: 'Majestic bird', row: 0, col: 6, direction: 'down' }
    ]
  },
  {
    level: 69,
    words: [
      { word: 'AVALANCHE', clue: 'Falling snow', row: 0, col: 0, direction: 'across' },
      { word: 'ASTEROID', clue: 'Space rock', row: 0, col: 0, direction: 'down' },
      { word: 'LAVA', clue: 'Hot magma', row: 2, col: 0, direction: 'across' },
      { word: 'EARTH', clue: 'Blue planet', row: 0, col: 8, direction: 'down' }
    ]
  },
  {
    level: 70,
    words: [
      { word: 'EARTHQUAKE', clue: 'Ground shakes', row: 0, col: 0, direction: 'across' },
      { word: 'ECLIPSE', clue: 'Darkens sun', row: 0, col: 0, direction: 'down' },
      { word: 'QUAKE', clue: 'Shake', row: 2, col: 0, direction: 'across' },
      { word: 'EAGLE', clue: 'Bird of prey', row: 0, col: 8, direction: 'down' }
    ]
  },

  // Level 71-80: Animals and nature
  {
    level: 71,
    words: [
      { word: 'FLAMINGO', clue: 'Pink bird', row: 0, col: 0, direction: 'across' },
      { word: 'FOREST', clue: 'Many trees', row: 0, col: 0, direction: 'down' },
      { word: 'LLAMA', clue: 'Furry animal', row: 2, col: 0, direction: 'across' },
      { word: 'IGLOO', clue: 'Ice house', row: 0, col: 7, direction: 'down' }
    ]
  },
  {
    level: 72,
    words: [
      { word: 'PEACOCK', clue: 'Colorful tail', row: 0, col: 0, direction: 'across' },
      { word: 'PARROT', clue: 'Talks', row: 0, col: 0, direction: 'down' },
      { word: 'OCTOPUS', clue: 'Eight arms', row: 2, col: 0, direction: 'across' },
      { word: 'KITE', clue: 'Flies high', row: 0, col: 7, direction: 'down' }
    ]
  },
  {
    level: 73,
    words: [
      { word: 'RHINOCEROS', clue: 'Horn on nose', row: 0, col: 0, direction: 'across' },
      { word: 'RACCOON', clue: 'Masked face', row: 0, col: 0, direction: 'down' },
      { word: 'SWAN', clue: 'Graceful bird', row: 2, col: 0, direction: 'across' },
      { word: 'NEST', clue: 'Bird home', row: 0, col: 8, direction: 'down' }
    ]
  },
  {
    level: 74,
    words: [
      { word: 'HIPPOPOTAMUS', clue: 'River horse', row: 0, col: 0, direction: 'across' },
      { word: 'HEDGEHOG', clue: 'Spiky animal', row: 0, col: 0, direction: 'down' },
      { word: 'PANDA', clue: 'Bamboo eater', row: 2, col: 0, direction: 'across' },
      { word: 'AQUA', clue: 'Blue water', row: 0, col: 10, direction: 'down' }
    ]
  },
  {
    level: 75,
    words: [
      { word: 'CHIMPANZEE', clue: 'Smart ape', row: 0, col: 0, direction: 'across' },
      { word: 'CHEETAH', clue: 'Fastest runner', row: 0, col: 0, direction: 'down' },
      { word: 'ZEBRA', clue: 'Stripes', row: 2, col: 0, direction: 'across' },
      { word: 'EAGLE', clue: 'Soaring bird', row: 0, col: 9, direction: 'down' }
    ]
  },
  {
    level: 76,
    words: [
      { word: 'CROCODILE', clue: 'Big reptile', row: 0, col: 0, direction: 'across' },
      { word: 'CANARY', clue: 'Yellow bird', row: 0, col: 0, direction: 'down' },
      { word: 'LEOPARD', clue: 'Spotted cat', row: 2, col: 0, direction: 'across' },
      { word: 'DOLPHIN', clue: 'Smart swimmer', row: 0, col: 8, direction: 'down' }
    ]
  },
  {
    level: 77,
    words: [
      { word: 'BUTTERFLY', clue: 'Pretty insect', row: 0, col: 0, direction: 'across' },
      { word: 'BEAVER', clue: 'Builds dams', row: 0, col: 0, direction: 'down' },
      { word: 'YAK', clue: 'Mountain cow', row: 2, col: 0, direction: 'across' },
      { word: 'FLY', clue: 'Buzzes', row: 0, col: 8, direction: 'down' }
    ]
  },
  {
    level: 78,
    words: [
      { word: 'HUMMINGBIRD', clue: 'Tiny flyer', row: 0, col: 0, direction: 'across' },
      { word: 'HORSE', clue: 'Rides fast', row: 0, col: 0, direction: 'down' },
      { word: 'DINGO', clue: 'Wild dog', row: 2, col: 0, direction: 'across' },
      { word: 'ORCA', clue: 'Killer whale', row: 0, col: 10, direction: 'down' }
    ]
  },
  {
    level: 79,
    words: [
      { word: 'SEAHORSE', clue: 'Ocean pony', row: 0, col: 0, direction: 'across' },
      { word: 'SHARK', clue: 'Fin in water', row: 0, col: 0, direction: 'down' },
      { word: 'ALPACA', clue: 'Fluffy llama', row: 2, col: 0, direction: 'across' },
      { word: 'EAGLE', clue: 'Sharp eyes', row: 0, col: 7, direction: 'down' }
    ]
  },
  {
    level: 80,
    words: [
      { word: 'PENGUIN', clue: 'Ice bird', row: 0, col: 0, direction: 'across' },
      { word: 'POLAR', clue: 'Cold bear', row: 0, col: 0, direction: 'down' },
      { word: 'NEWT', clue: 'Water lizard', row: 2, col: 0, direction: 'across' },
      { word: 'RAVEN', clue: 'Black bird', row: 0, col: 6, direction: 'down' }
    ]
  },

  // Level 81-90: Food and cooking
  {
    level: 81,
    words: [
      { word: 'SPAGHETTI', clue: 'Long pasta', row: 0, col: 0, direction: 'across' },
      { word: 'SPINACH', clue: 'Green leaf', row: 0, col: 0, direction: 'down' },
      { word: 'GNOCCHI', clue: 'Potato pasta', row: 2, col: 0, direction: 'across' },
      { word: 'HONEY', clue: 'Bee food', row: 0, col: 8, direction: 'down' }
    ]
  },
  {
    level: 82,
    words: [
      { word: 'PANCAKE', clue: 'Breakfast cake', row: 0, col: 0, direction: 'across' },
      { word: 'PASTA', clue: 'Italian food', row: 0, col: 0, direction: 'down' },
      { word: 'NOODLE', clue: 'Asian pasta', row: 2, col: 0, direction: 'across' },
      { word: 'EAGLE', clue: 'Bird', row: 0, col: 6, direction: 'down' }
    ]
  },
  {
    level: 83,
    words: [
      { word: 'CHOCOLATE', clue: 'Sweet treat', row: 0, col: 0, direction: 'across' },
      { word: 'CHEESE', clue: 'Made from milk', row: 0, col: 0, direction: 'down' },
      { word: 'LASAGNA', clue: 'Layered pasta', row: 2, col: 0, direction: 'across' },
      { word: 'EAGLE', clue: 'Flying bird', row: 0, col: 8, direction: 'down' }
    ]
  },
  {
    level: 84,
    words: [
      { word: 'CROISSANT', clue: 'French pastry', row: 0, col: 0, direction: 'across' },
      { word: 'COOKIE', clue: 'Sweet biscuit', row: 0, col: 0, direction: 'down' },
      { word: 'SALAD', clue: 'Greens dish', row: 2, col: 0, direction: 'across' },
      { word: 'DONUT', clue: 'Ring cake', row: 0, col: 8, direction: 'down' }
    ]
  },
  {
    level: 85,
    words: [
      { word: 'SANDWICH', clue: 'Between bread', row: 0, col: 0, direction: 'across' },
      { word: 'SALSA', clue: 'Spicy dip', row: 0, col: 0, direction: 'down' },
      { word: 'WAFFLE', clue: 'Grid cake', row: 2, col: 0, direction: 'across' },
      { word: 'HONEY', clue: 'Bee sweet', row: 0, col: 7, direction: 'down' }
    ]
  },
  {
    level: 86,
    words: [
      { word: 'AVOCADO', clue: 'Green fruit', row: 0, col: 0, direction: 'across' },
      { word: 'APPLE', clue: 'Red fruit', row: 0, col: 0, direction: 'down' },
      { word: 'DOUGHNUT', clue: 'Fried ring', row: 2, col: 0, direction: 'across' },
      { word: 'TACO', clue: 'Mexican food', row: 0, col: 7, direction: 'down' }
    ]
  },
  {
    level: 87,
    words: [
      { word: 'CUCUMBER', clue: 'Green veggie', row: 0, col: 0, direction: 'across' },
      { word: 'CEREAL', clue: 'Breakfast bowl', row: 0, col: 0, direction: 'down' },
      { word: 'BREAD', clue: 'Baked loaf', row: 2, col: 0, direction: 'across' },
      { word: 'RADISH', clue: 'Red root', row: 0, col: 7, direction: 'down' }
    ]
  },
  {
    level: 88,
    words: [
      { word: 'POPCORN', clue: 'Movie snack', row: 0, col: 0, direction: 'across' },
      { word: 'PIZZA', clue: 'Cheesy pie', row: 0, col: 0, direction: 'down' },
      { word: 'NACHOS', clue: 'Chips with cheese', row: 2, col: 0, direction: 'across' },
      { word: 'NUTS', clue: 'Crunchy snack', row: 0, col: 6, direction: 'down' }
    ]
  },
  {
    level: 89,
    words: [
      { word: 'BURRITO', clue: 'Wrapped food', row: 0, col: 0, direction: 'across' },
      { word: 'BANANA', clue: 'Yellow fruit', row: 0, col: 0, direction: 'down' },
      { word: 'RITZ', clue: 'Cracker brand', row: 2, col: 0, direction: 'across' },
      { word: 'TACO', clue: 'Hard shell', row: 0, col: 6, direction: 'down' }
    ]
  },
  {
    level: 90,
    words: [
      { word: 'STRAWBERRY', clue: 'Red berry', row: 0, col: 0, direction: 'across' },
      { word: 'SOUP', clue: 'Hot liquid', row: 0, col: 0, direction: 'down' },
      { word: 'WAFFLE', clue: 'Breakfast grid', row: 2, col: 0, direction: 'across' },
      { word: 'EAGLE', clue: 'Majestic bird', row: 0, col: 9, direction: 'down' }
    ]
  },

  // Level 91-100: Master challenge
  {
    level: 91,
    words: [
      { word: 'ARCHITECT', clue: 'Building designer', row: 0, col: 0, direction: 'across' },
      { word: 'ASTRONOMY', clue: 'Study of stars', row: 0, col: 0, direction: 'down' },
      { word: 'CHIMNEY', clue: 'Smoke exit', row: 2, col: 0, direction: 'across' },
      { word: 'TOWER', clue: 'Tall building', row: 0, col: 8, direction: 'down' }
    ]
  },
  {
    level: 92,
    words: [
      { word: 'MICROSCOPE', clue: 'Sees tiny things', row: 0, col: 0, direction: 'across' },
      { word: 'MOUNTAIN', clue: 'High land', row: 0, col: 0, direction: 'down' },
      { word: 'OSCARS', clue: 'Movie awards', row: 2, col: 0, direction: 'across' },
      { word: 'PEAK', clue: 'Mountain top', row: 0, col: 8, direction: 'down' }
    ]
  },
  {
    level: 93,
    words: [
      { word: 'SUBMARINE', clue: 'Underwater boat', row: 0, col: 0, direction: 'across' },
      { word: 'SATELLITE', clue: 'Orbits Earth', row: 0, col: 0, direction: 'down' },
      { word: 'BALLOON', clue: 'Floats up', row: 2, col: 0, direction: 'across' },
      { word: 'NEST', clue: 'Bird home', row: 0, col: 8, direction: 'down' }
    ]
  },
  {
    level: 94,
    words: [
      { word: 'HElicopter', clue: 'Flying blades', row: 0, col: 0, direction: 'across' },
      { word: 'HURRICANE', clue: 'Big storm', row: 0, col: 0, direction: 'down' },
      { word: 'ICEBERG', clue: 'Frozen mountain', row: 2, col: 0, direction: 'across' },
      { word: 'TIGER', clue: 'Big cat', row: 0, col: 8, direction: 'down' }
    ]
  },
  {
    level: 95,
    words: [
      { word: 'RAINFOREST', clue: 'Wet jungle', row: 0, col: 0, direction: 'across' },
      { word: 'RAILROAD', clue: 'Train track', row: 0, col: 0, direction: 'down' },
      { word: 'IGLOO', clue: 'Ice house', row: 2, col: 0, direction: 'across' },
      { word: 'EAGLE', clue: 'Majestic bird', row: 0, col: 9, direction: 'down' }
    ]
  },
  {
    level: 96,
    words: [
      { word: 'TRAMPOLINE', clue: 'Bouncing mat', row: 0, col: 0, direction: 'across' },
      { word: 'TELESCOPE', clue: 'Sees stars', row: 0, col: 0, direction: 'down' },
      { word: 'OPOSSUM', clue: 'Night marsupial', row: 2, col: 0, direction: 'across' },
      { word: 'EAGLE', clue: 'Soaring bird', row: 0, col: 9, direction: 'down' }
    ]
  },
  {
    level: 97,
    words: [
      { word: 'LABORATORY', clue: 'Science room', row: 0, col: 0, direction: 'across' },
      { word: 'LIGHTHOUSE', clue: 'Guides ships', row: 0, col: 0, direction: 'down' },
      { word: 'YACHT', clue: 'Fancy boat', row: 2, col: 0, direction: 'across' },
      { word: 'EAGLE', clue: 'Sharp eyes', row: 0, col: 9, direction: 'down' }
    ]
  },
  {
    level: 98,
    words: [
      { word: 'OBSERVATORY', clue: 'Star gazing place', row: 0, col: 0, direction: 'across' },
      { word: 'OCTOPUS', clue: 'Eight arms', row: 0, col: 0, direction: 'down' },
      { word: 'RAVEN', clue: 'Black bird', row: 2, col: 0, direction: 'across' },
      { word: 'YOYO', clue: 'Up and down toy', row: 0, col: 10, direction: 'down' }
    ]
  },
  {
    level: 99,
    words: [
      { word: 'PYRAMID', clue: 'Egypt tomb', row: 0, col: 0, direction: 'across' },
      { word: 'PLANET', clue: 'Orbits sun', row: 0, col: 0, direction: 'down' },
      { word: 'YACHT', clue: 'Sailing boat', row: 2, col: 0, direction: 'across' },
      { word: 'TOWER', clue: 'Tall building', row: 0, col: 6, direction: 'down' }
    ]
  },
  {
    level: 100,
    words: [
      { word: 'CHAMPION', clue: 'The winner', row: 0, col: 0, direction: 'across' },
      { word: 'CELEBRATE', clue: 'Have a party', row: 0, col: 0, direction: 'down' },
      { word: 'VICTORY', clue: 'Winning', row: 2, col: 0, direction: 'across' },
      { word: 'YAY', clue: 'Hooray', row: 0, col: 8, direction: 'down' }
    ]
  }
]
