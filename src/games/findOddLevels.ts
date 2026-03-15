// 50 Find Odd One Out Levels
export const FIND_ODD_LEVELS = [
  // Level 1-10: Colors and shapes (Easy)
  { level: 1, items: ['🔴', '🔴', '🔴', '🔵'], odd: 3, hint: 'Find the different color!' },
  { level: 2, items: ['🟢', '🟢', '🟢', '🟢', '🟡'], odd: 4, hint: 'Look for the different color!' },
  { level: 3, items: ['⭕', '⭕', '⭕', '🔺'], odd: 3, hint: 'Find the different shape!' },
  { level: 4, items: ['🟦', '🟦', '🟦', '🟦', '🟥'], odd: 4, hint: 'One square is different!' },
  { level: 5, items: ['⚫', '⚫', '⚫', '⚫', '⚫', '⚪'], odd: 5, hint: 'Find the odd circle!' },
  { level: 6, items: ['⭐', '⭐', '⭐', '🌟'], odd: 3, hint: 'Look closely at the stars!' },
  { level: 7, items: ['🔶', '🔶', '🔶', '🔷'], odd: 3, hint: 'Find the different diamond!' },
  { level: 8, items: ['🎨', '🎨', '🎨', '🎨', '🖌️'], odd: 4, hint: 'One is not a palette!' },
  { level: 9, items: ['🌈', '🌈', '🌈', '☁️'], odd: 3, hint: 'Find the different weather!' },
  { level: 10, items: ['💙', '💙', '💙', '💙', '💚'], odd: 4, hint: 'One heart is different!' },

  // Level 11-20: Animals (Easy-Medium)
  { level: 11, items: ['🐶', '🐶', '🐶', '🐱'], odd: 3, hint: 'One animal is different!' },
  { level: 12, items: ['🐱', '🐱', '🐱', '🐱', '🐶'], odd: 4, hint: 'Find the different pet!' },
  { level: 13, items: ['🐟', '🐟', '🐟', '🐠'], odd: 3, hint: 'Look at the fish!' },
  { level: 14, items: ['🐦', '🐦', '🐦', '🐦', '🐤'], odd: 4, hint: 'One bird is different!' },
  { level: 15, items: ['🐰', '🐰', '🐰', '🐇'], odd: 3, hint: 'Find the different bunny!' },
  { level: 16, items: ['🐴', '🐴', '🐴', '🐴', '🦄'], odd: 4, hint: 'One is magical!' },
  { level: 17, items: ['🐮', '🐮', '🐮', '🐷'], odd: 3, hint: 'Find the farm animal!' },
  { level: 18, items: ['🐸', '🐸', '🐸', '🐊'], odd: 3, hint: 'One is not a frog!' },
  { level: 19, items: ['🐼', '🐼', '🐼', '🐼', '🐨'], odd: 4, hint: 'Find the different bear!' },
  { level: 20, items: ['🐵', '🐵', '🐵', '🙈'], odd: 3, hint: 'One monkey covers eyes!' },

  // Level 21-30: Food (Medium)
  { level: 21, items: ['🍎', '🍎', '🍎', '🍏'], odd: 3, hint: 'Find the different apple!' },
  { level: 22, items: ['🍊', '🍊', '🍊', '🍊', '🍋'], odd: 4, hint: 'One citrus is different!' },
  { level: 23, items: ['🍇', '🍇', '🍇', '🍓'], odd: 3, hint: 'Find the berry!' },
  { level: 24, items: ['🥕', '🥕', '🥕', '🥕', '🌽'], odd: 4, hint: 'One is not orange!' },
  { level: 25, items: ['🍕', '🍕', '🍕', '🍔'], odd: 3, hint: 'Find the different food!' },
  { level: 26, items: ['🍦', '🍦', '🍦', '🍦', '🍧'], odd: 4, hint: 'One treat is different!' },
  { level: 27, items: ['🍪', '🍪', '🍪', '🍩'], odd: 3, hint: 'Find the different dessert!' },
  { level: 28, items: ['🥚', '🥚', '🥚', '🥚', '🍳'], odd: 4, hint: 'One egg is cooked!' },
  { level: 29, items: ['🥛', '🥛', '🥛', '🧃'], odd: 3, hint: 'Find the different drink!' },
  { level: 30, items: ['🍫', '🍫', '🍫', '🍬'], odd: 3, hint: 'Find the different candy!' },

  // Level 31-40: Objects (Medium-Hard)
  { level: 31, items: ['🚗', '🚗', '🚗', '🚕'], odd: 3, hint: 'Find the different car!' },
  { level: 32, items: ['🚲', '🚲', '🚲', '🚲', '🛴'], odd: 4, hint: 'One has no pedals!' },
  { level: 33, items: ['✏️', '✏️', '✏️', '🖊️'], odd: 3, hint: 'Find the different writing tool!' },
  { level: 34, items: ['📕', '📕', '📕', '📕', '📗'], odd: 4, hint: 'One book is different!' },
  { level: 35, items: ['🎸', '🎸', '🎸', '🎻'], odd: 3, hint: 'Find the string instrument!' },
  { level: 36, items: ['⚽', '⚽', '⚽', '⚽', '🏀'], odd: 4, hint: 'Find the different ball!' },
  { level: 37, items: ['📱', '📱', '📱', '☎️'], odd: 3, hint: 'One phone is old style!' },
  { level: 38, items: ['💻', '💻', '💻', '💻', '🖥️'], odd: 4, hint: 'One computer is different!' },
  { level: 39, items: ['⏰', '⏰', '⏰', '🧭'], odd: 3, hint: 'Find the different time tool!' },
  { level: 40, items: ['🔑', '🔑', '🔑', '🔑', '🗝️'], odd: 4, hint: 'One key is old fashioned!' },

  // Level 41-50: Mixed challenging (Hard)
  { level: 41, items: ['🌸', '🌸', '🌸', '🌺'], odd: 3, hint: 'Find the different flower!' },
  { level: 42, items: ['🌲', '🌲', '🌲', '🌲', '🌴'], odd: 4, hint: 'One tree is tropical!' },
  { level: 43, items: ['☀️', '☀️', '☀️', '🌙'], odd: 3, hint: 'Find the night object!' },
  { level: 44, items: ['⛅', '⛅', '⛅', '⛅', '☁️'], odd: 4, hint: 'One cloud has no sun!' },
  { level: 45, items: ['🔥', '🔥', '🔥', '💧'], odd: 3, hint: 'Find the opposite of fire!' },
  { level: 46, items: ['⚡', '⚡', '⚡', '⚡', '❄️'], odd: 4, hint: 'One is cold not electric!' },
  { level: 47, items: ['🎵', '🎵', '🎵', '🎶'], odd: 3, hint: 'Find the different note!' },
  { level: 48, items: ['🎨', '🎨', '🎨', '🎨', '🎭'], odd: 4, hint: 'One is for acting not painting!' },
  { level: 49, items: ['🏆', '🏆', '🏆', '🏅'], odd: 3, hint: 'Find the different prize!' },
  { level: 50, items: ['🎯', '🎯', '🎯', '🎯', '🎲'], odd: 4, hint: 'One is not a target!' }
]
