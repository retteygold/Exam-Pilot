// 50 Crossword Levels - Progressive difficulty
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
  }
]
