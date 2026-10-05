/* =============================================================================================
   TYPEBITE SETTINGS  -  the ONE file where the whole game is tuned
   ---------------------------------------------------------------------------------------------
   Change a number, save the file, reload the game. Nothing has to be built.

   * On the website: open this file on GitHub (site/config.js), click the pencil, change a number,
     press "Commit changes". About a minute later typebite.io uses the new numbers.
   * On your own PC: put your edited copy of config.js next to index.html.
   * Everybody in one multiplayer game must have the same settings. If they differ, joining says
     "different game settings".
   * A mistake shows up as an orange bar at the top of the game (and the built-in value is used
     for that one setting). Keep the commas at the end of the lines and do not delete the brackets.
   * Lists with four numbers like [75, 19.5, 5, 0.5] are weights for Common, Rare, Epic and
     Legendary. They do not have to add up to 100, the game works out the percentages itself.
   * The game ships with a copy of these numbers inside index.html. This file only overrides it.
   * Explanations in German: docs/konfiguration.md
   ============================================================================================= */
window.TYPEBITE_CONFIG = {


/* =============================================================================================
   1. THE MAP
   ============================================================================================= */
world: {
  size: 10000,           // width and height of the map in game units. A player walks about 175 units per second.
  scaleCounts: true,     // true: all counts in "world" and "spawn" are written for a 13600 map and get multiplied by (size/13600)^2,
                         //       so a smaller map keeps the same density. false: the counts are used exactly as written.
  regions: 36,           // how many biome patches (meadow, forest, desert, snow, ...) a 13600 map has. Fewer = bigger patches.
  buildings: {           // how many of each building. The map has room for about (size/1236)^2 buildings.
    home: 26, diner: 6, bakery: 6, gym: 6, shed: 5, arcade: 6, barn: 6, library: 5,
    greenhouse: 5, cafe: 5, pizzeria: 4, school: 3, clinic: 3, cinema: 3, workshop: 3, icecream: 3,
  },
  scenes: {              // little decorated places (they only add walls to bump into and things to look at)
    camps: 20, markets: 14, ponds: 28, fields: 14, parks: 18, wells: 32, signs: 24, ruins: 10, graveyards: 7, plazas: 9,
  },
  nature: { trees: 1700, rocks: 560, bushes: 1800, decor: 1120 },   // plants and small decoration
},


/* =============================================================================================
   2. PLAYERS AND BOTS
   ============================================================================================= */
players: {
  bots: 100,                         // the most computer players there can be. More bots = busier map (and a slower game on weak PCs)
  botRespawn: 1,                     // eaten bots are replaced at about this many per second. Bots eat each other, so the map is never completely full:
                                     // 0.8 = about 115 bots around, 2 = about 165, 4 = about 220 (with bots: 240)
  botLevels: [[70, 1, 5], [23, 5, 12], [7, 12, 22]],   // level of a new bot: [chance in %, lowest level, highest level]
  botSkill: [-8, 14],                // typing speed of bots: this many words per minute more or less than the base (see duel.botWpm)
  botAggression: [0.25, 0.9],        // each bot gets a random value in this range: how often it hunts someone weaker
  botBravery: [0, 1],                // each bot gets a random value: above 0.75 it never runs away
  botItems: 1,                       // how many items a bot can carry at the same time
  maxPerGame: 12,                    // human players in one game that a browser hosts
  gamesPerRoom: 8,                   // games with the same room name that can run at the same time
  spawnProtection: 3,                // seconds nobody can duel a new player or bot
  onlineSpawnProtection: 4,          // the same for human players in a multiplayer game
},


/* =============================================================================================
   3. HOW MUCH LIES AROUND (spawn rates)
   ============================================================================================= */
spawn: {
  snacksOutside: 4000,       // snacks lying outside when the game starts (and the number the game tries to keep)
  snacksInside: 1100,        // snacks inside buildings
  snackRefillOutside: 16,    // new snacks per second while there are fewer than the number above.
  snackRefillInside: 4,      // With many bots they eat faster than this, so these two numbers decide how many snacks lie around
  boxesOutside: 170,         // gift boxes (items) lying outside
  boxesInside: 120,          // gift boxes inside buildings
  boxesUnderwater: 36,       // boxes at the bottom of ponds. You have to swim for them, and they hold better items
  boxRefillOutside: 0.5,     // new boxes per second
  boxRefillInside: 0.5,
  boxRefillUnderwater: 0.1,
  homeBiomeBoost: 5,         // a snack is this much more likely in the biome it comes from (0 = no preference)
  homeShopBoost: 7,          // ... and inside the shops it comes from
},


/* =============================================================================================
   4. RARITY  -  how often the good stuff shows up   (Common, Rare, Epic, Legendary)
   ============================================================================================= */
rarity: {
  giftBox: [75, 19.5, 5, 0.5],          // which item a normal gift box holds
  underwaterBox: [42, 38, 16.5, 3.5],   // boxes from the bottom of a pond
  perkCards: [62, 26, 9, 3],            // rarity of the three perk cards you pick from at a level-up
  snacks: [86.5, 11, 2.3, 0.2],         // which snack spawns on the ground
},


/* =============================================================================================
   5. LEVELS AND XP
   ============================================================================================= */
levels: {
  costBase: 5,               // level L costs   costBase * (1 + costGrowth * (L-1))   xp. Level 1 = 5, level 50 = 41, level 100 = 79
  costGrowth: 0.15,
  snackValue: 1.7,           // an average snack gives this much xp (so eating pays off)
  eatTime: 0.6,              // seconds it takes to eat an average snack (you are slow and easy to catch while eating)
  firstPerkLevel: 2,         // the first perk pick
  perkEvery: 4,              // then one pick every this many levels
  capstoneNeedsPoints: 4,    // legendary perks appear only after this many perk points in their tree
  itemSlotLevels: [0, 0, 0, 12, 30, 60, 100],   // the level you need for item slot 1, 2, 3, ... (keys Q W E R T Z U). 7 slots at most
  kingMinLevel: 8,           // the highest level becomes King (and everybody hunts them) only from this level on
},


/* =============================================================================================
   6. MOVEMENT
   ============================================================================================= */
movement: {
  speed: 175,                // walking speed in units per second
  sprintBoost: 1.55,         // sprinting is this many times faster
  staminaMax: 100,
  sprintDrain: 38,           // stamina used per second of sprinting
  regenResting: 30,          // stamina back per second when standing still
  regenMoving: 18,           // ... when walking
  dashCooldown: 2.2,         // seconds until the next dash charge
  dashSpeed: 780,            // speed during a dash
  dashTime: 0.17,            // how long the dash lasts
  slideTime: 0.6,            // slide after a dash
  swimSpeed: 0.55,           // speed factor in water
  eatingSpeed: 0.35,         // speed factor while eating
  slowdownPerLevel: 0.001,   // high levels are a little slower: this much per level ...
  slowdownMax: 0.15,         // ... but never more than this
},


/* =============================================================================================
   7. DUELS (typing fights)
   ============================================================================================= */
duel: {
  countdown: 5.6,            // seconds from the first touch until you can type
  // how many words each side starts with:  baseWords + (level A + level B)/levelSumDivisor + level gap/gapDivisor
  baseWords: 3, levelSumDivisor: 24, gapDivisor: 10, minWords: 3, maxWords: 20,
  // the LOWER level player types fewer words: one word per gapLevelsPerWord levels of difference, from a gap of gapFrom
  gapFrom: 4, gapLevelsPerWord: 9, gapMaxShare: 0.3,
  caughtWords: 2,            // words fewer for the one who caught somebody running away
  keyboardWords: 1,          // Pro Keyboard: words fewer
  shortestPhrase: 2, longestPhrase: 26,   // after everything is added up
  // what the winner gets from the loser
  winnerShare: 0.5,          // share of everything the loser collected
  weakVictimFloor: 0.4,      // beating someone much weaker pays at least this share of the above (0.4 = 40%)
  winCap: 15,                // one win never gives more than this many of the winner's own levels
  minWinXp: 4,               // even a beginner is worth this much xp
  orbShare: 0.2,             // share of the loser's xp that drops as orbs for everybody
  kingBonusShare: 0.2,       // extra for beating the King
  orbLife: 35,               // seconds an orb stays on the ground
  winnerProtection: 2.5,     // seconds the winner cannot be dueled
  fleeMemory: 3,             // seconds somebody counts as "caught running" after running away
  touchDistance: 34,         // how close two players must be for a duel
  timeout: 90,               // a duel nobody finishes ends after this many seconds
  // typing speed of a bot in a duel with you:  botWpm + skill + level * botWpmPerLevel (at most +botWpmMaxLevelBonus)
  botWpm: 32, botWpmPerLevel: 0.1, botWpmMaxLevelBonus: 14, botWpmMin: 18, botWpmMax: 100,
  botVsBot: [1.8, 3],        // how long a duel between two bots lasts (seconds)
  botVsBotLevelEdge: 0.006,  // win chance per level of difference ...
  botVsBotMaxEdge: 0.2,      // ... but never more than this
  caughtEdge: 0.12,          // win chance bonus for catching somebody
  keyboardEdge: 0.1,         // win chance bonus for a keyboard item
},


/* =============================================================================================
   8. QUESTS (time-limited jobs, they pay bonus levels)
   ============================================================================================= */
quests: {
  firstDelay: [90, 150],     // seconds until the first quest [lowest, highest]
  nextDelay: [150, 210],     // seconds until the next quest
  snackChance: 0.55,         // chance that a quest is "eat N snacks of one kind"
  boxChance: 0.30,           // chance for "open N gift boxes". What is left over is "find a box underwater"
  snack: { count: [3, 5], time: [80, 110], rewardBase: 1.2, rewardPerItem: 0.2 },    // reward = this many times the cost of your current level
  box:   { count: [2, 3], time: [100, 130], rewardBase: 1.6, rewardPerItem: 0.4 },
  water: { time: [110, 140], reward: 3 },
},


/* =============================================================================================
   9. CAMERA
   ============================================================================================= */
camera: {
  startZoom: 1.5,            // 1.5 = 150% (the biggest view-in at the start)
  maxZoom: 2.5,              // how far you can zoom in
  minZoomLowLevel: 1.5,      // how far you can zoom out at level 1 ...
  minZoomHighLevel: 0.8,     // ... and at the level below. Zooming out unlocks step by step with your level
  highLevel: 60,
},


/* =============================================================================================
   10. NETWORK (multiplayer)
   ============================================================================================= */
network: {
  viewRadius: 1250,          // players further away than this (in units) are not sent to you
  dataRadius: 1150,          // snacks, boxes and orbs further away than this are not sent
  updatesPerSecond: 20,      // how often the host sends the world (the game itself runs at 60). Lower = less data
  hostSilence: 1.2,          // seconds without any word from the host before the next player takes over (lower = faster change, but a short hiccup of the host can trigger it)
  handover: { enabled: true, minScoreGap: 60, minHostScore: 100, sustainSeconds: 15, cooldownSeconds: 180 },   // the host gives the game to a player with a much better connection: when its own score (median delay + 2 x jitter + 4 x lost % + 60 for a weak PC) is at least minHostScore and at least minScoreGap worse than the best player's, for sustainSeconds in a row; at most one change per cooldownSeconds
  checkpointsPerSecond: 2,   // how often the host hands the next host a copy of the game (about 90 KB each with 12 players). With more than 6 players every other time
},

// Automatic frame rate limit, once per browser: after afterSeconds of play, a PC whose average is above minAvg but below maxAvg (and not already
// in step with its screen) gets the limit setTo. Not when the player picked a limit or V-Sync himself. enabled: false turns it off.
autoFps: { enabled: true, afterSeconds: 60, minAvg: 60, maxAvg: 240, setTo: 120 },


/* =============================================================================================
   11. ITEMS (gift box items)
       tier:       0 Common, 1 Rare, 2 Epic, 3 Legendary (moves the item to another rarity)
       weight:     how likely it is among the items of its rarity. 1 = normal, 2 = twice as likely, 0 = never
       duration:   seconds the effect lasts
       stack:      what happens when you use it again while it still runs:
                   'strength' = the effect gets stronger (2 Sugar Rushes = double Sugar Rush), every use has its own timer
                   'time'     = the time is added on top
       maxStacks:  the most copies that stack: for a 'strength' item that many effects run together,
                   for a 'time' item the time can grow to this many times the duration
   ============================================================================================= */
items: {
  stacking: true,            // false: using an item again just restarts its timer, nothing stacks
  list: {
    magnet:    { tier: 0, weight: 1, duration: 7,  stack: 'strength', maxStacks: 4, radius: 420, speed: 540, boxRadius: 280, boxSpeed: 420 },   // pulls snacks (radius) and boxes/orbs (boxRadius)
    turbo:     { tier: 0, weight: 1, duration: 7,  stack: 'strength', maxStacks: 3, speedBonus: 0.4 },                                          // +40% speed per stack, endless stamina
    rush:      { tier: 1, weight: 1, duration: 10, stack: 'strength', maxStacks: 5, eatTime: 0.35, xpBonus: 0.5 },                              // per stack: eating 1/eatTime times faster, +50% xp from snacks
    smoke:     { tier: 0, weight: 1, duration: 4,  stack: 'time', maxStacks: 3 },                                                               // bots lose sight of you
    bomb:      { tier: 0, weight: 1, snacks: 16, minRadius: 70, maxRadius: 170 },                                                               // a ring of snacks
    energy:    { tier: 0, weight: 1 },                                                                                                          // refills stamina and dash
    apple:     { tier: 0, weight: 1, xp: 4 },                                                                                                   // instant xp (in snacks)
    shield:    { tier: 1, weight: 1, duration: 6,  stack: 'time', maxStacks: 3 },                                                               // nobody can duel you
    radar:     { tier: 0, weight: 1, duration: 12, stack: 'time', maxStacks: 3 },                                                               // everybody on the minimap
    shock:     { tier: 1, weight: 1, radius: 400, force: 950 },                                                                                 // blasts everybody away
    ticket:    { tier: 1, weight: 1, xp: 10 },                                                                                                  // instant xp (in snacks)
    clover:    { tier: 1, weight: 1, boxes: 3, extraRolls: 2 },                                                                                 // the next boxes roll rarer items: this many boxes, this many extra rolls each (adds up)
    rubber:    { tier: 1, weight: 1, duration: 6,  stack: 'time', maxStacks: 3 },                                                               // dash without cooldown
    freeze:    { tier: 2, weight: 1, duration: 2.5, stack: 'time', maxStacks: 3, radius: 340 },                                                 // freezes everybody close
    keys:      { tier: 2, weight: 1, words: 1 },                                                                                                // next duel: this many words fewer (automatic)
    sticky:    { tier: 2, weight: 1, radius: 420 },                                                                                             // steals an item
    teleport:  { tier: 2, weight: 1, minDistance: 1600 },                                                                                       // jump at least this far
    rocket:    { tier: 2, weight: 1, duration: 6,  stack: 'strength', maxStacks: 3, dashBoost: 0.35 },                                          // +35% dash speed per stack, dash without limit
    warp:      { tier: 2, weight: 1, duration: 4,  stack: 'time', maxStacks: 3, slowdown: 0.45 },                                               // everybody else moves at this speed factor
    angel:     { tier: 3, weight: 1, keepShare: 0.5 },                                                                                          // survive a lost duel with this share of your levels (automatic)
    gkeys:     { tier: 3, weight: 1, share: 0.3 },                                                                                              // next duel: this share fewer words (automatic)
    nova:      { tier: 3, weight: 1, duration: 2.5, radius: 520, force: 1100, shieldTime: 4 },                                                  // blast + freeze (duration) + shield for you
    crystal:   { tier: 3, weight: 1, levels: 3 },                                                                                               // instant levels
    blackhole: { tier: 3, weight: 1, duration: 6,  stack: 'strength', maxStacks: 2, radius: 1000, speed: 900, boxRadius: 800, boxSpeed: 800 },  // sucks in everything
  },
},


/* =============================================================================================
   12. PERKS (picked at level-ups)
       tier:      0 Common, 1 Rare, 2 Epic, 3 Legendary (legendary perks need 'capstoneNeedsPoints' points in their tree)
       weight:    how likely it is among the perks of its rarity and tree (0 = never offered)
       max:       how many times you can pick it (ranks)
       perRank:   what ONE rank gives (the meaning is in the comment of each line)
   ============================================================================================= */
perks: {
  list: {
    // --- Feast ---
    gourmet:     { tier: 0, weight: 1, max: 5, perRank: 0.20 },                       // +20% level from snacks per rank
    quickbite:   { tier: 1, weight: 1, max: 3, perRank: 0.20, floor: 0.35 },          // eating 20% faster per rank (never below 35% of the normal time)
    vacuum:      { tier: 1, weight: 1, max: 3, perRank: 70, speed: 400 },             // snacks within 70 units fly to you
    jackpot:     { tier: 1, weight: 1, max: 3, perRank: 0.08, multiplier: 3 },        // 8% of snacks give triple per rank
    combo:       { tier: 1, weight: 1, max: 3, perRank: 0.10, window: 4, maxChain: 5 },// snacks within 4 s stack +10% per rank (up to a chain of 5)
    orbhunter:   { tier: 0, weight: 1, max: 3, perRank: 0.30 },                       // orbs worth 30% more per rank
    cozy:        { tier: 0, weight: 1, max: 3, perRank: 0.25 },                       // +25% level for snacks eaten inside buildings
    nose:        { tier: 3, weight: 1, max: 1, radius: 380, speed: 420 },             // gift boxes and orbs fly to you from this far
    // --- Sprint ---
    swift:       { tier: 0, weight: 1, max: 5, perRank: 0.06 },                       // +6% speed
    dashcd:      { tier: 1, weight: 1, max: 3, perRank: 0.15, floor: 0.4 },           // dash recharges 15% faster (never below 40% of the time)
    lungs:       { tier: 0, weight: 1, max: 3, perRank: 0.30 },                       // +30% stamina
    slide:       { tier: 1, weight: 1, max: 3, perRank: 0.40 },                       // slide lasts 40% longer
    sprintboost: { tier: 0, weight: 1, max: 3, perRank: 0.08 },                       // sprint 0.08 faster (added to movement.sprintBoost)
    longdash:    { tier: 1, weight: 1, max: 3, perRank: 0.12 },                       // dash goes 12% farther
    regen:       { tier: 0, weight: 1, max: 3, perRank: 0.40 },                       // stamina refills 40% faster
    adrenaline:  { tier: 2, weight: 1, max: 2, turbo: 3 },                            // after a duel win: dash + stamina refill; at rank 2 also this many seconds of turbo
    phase:       { tier: 3, weight: 1, max: 1 },                                      // nobody can duel you while you dash
    double:      { tier: 3, weight: 1, max: 1, charges: 2 },                          // dash charges
    // --- Typist ---
    short:       { tier: 2, weight: 0.5, max: 1, perRank: 1 },                          // your phrase is 1 word shorter
    forgive:     { tier: 2, weight: 0.7, max: 2, perRank: 1 },                          // first typos per duel are ignored
    head:        { tier: 2, weight: 0.6, max: 2, perRank: 0.5 },                        // opponent starts 0.5 s late
    plunder:     { tier: 2, weight: 0.8, max: 3, perRank: 0.15 },                       // +15% levels from duel wins
    curse:       { tier: 3, weight: 1, max: 1, perRank: 1 },                          // opponent's phrase is 1 word longer
    underdog:    { tier: 2, weight: 0.5, max: 1, perRank: 1 },                          // against a higher level: phrase 1 word shorter
    bounty:      { tier: 0, weight: 1, max: 2, perRank: 0.5 },                        // +50% bounty for beating the King
    warm:        { tier: 2, weight: 0.5, max: 1, perRank: 1 },                          // first word(s) already typed
    flow:        { tier: 3, weight: 1, max: 1, streak: 20, slowdown: 0.7 },           // after 20 correct letters in a row the opponent types at 70% speed
    // --- Guard ---
    afterwin:    { tier: 0, weight: 1, max: 3, perRank: 1.5 },                        // seconds of protection after a win
    slippery:    { tier: 0, weight: 1, max: 2, perRank: 1 },                          // being caught running helps them 1 word less
    laststand:   { tier: 1, weight: 1, max: 3, perRank: 0.15 },                       // keep 15% of your levels when eaten
    snackguard:  { tier: 0, weight: 1, max: 2, perRank: 0.5 },                        // seconds of protection when you start eating
    bubble:      { tier: 3, weight: 1, max: 1, every: 45 },                           // a free Bubble Shield every 45 s
    // --- Trick ---
    itemdur:     { tier: 0, weight: 1, max: 3, perRank: 0.25 },                       // item effects last 25% longer
    recycle:     { tier: 1, weight: 1, max: 3, perRank: 0.20 },                       // chance an item is not used up
    boxbonus:    { tier: 0, weight: 1, max: 3, perRank: 2 },                          // gift boxes also give this many snacks worth of level
    thief:       { tier: 1, weight: 1, max: 2, perRank: 0.5 },                        // chance to steal the item of someone you beat
    fortune:     { tier: 1, weight: 1, max: 2, perRank: 1 },                          // extra rolls for gift boxes (the best one counts)
    fairy:       { tier: 3, weight: 1, max: 1, every: 60 },                           // a free random item every 60 s
  },
},


/* =============================================================================================
   13. SNACKS (the food on the ground). 57 kinds.
       tier:     0 Common, 1 Rare, 2 Epic, 3 Legendary
       weight:   how likely among the snacks of its rarity (0 = never spawns)
       xp:       how many average snacks it is worth (the game balances all values so that the AVERAGE snack stays 1.0)
       time:     eating time compared to an average snack (bigger food takes longer, and you are easy prey while you chew)
       biomes:   where it grows more often. Letters: m meadow, f forest, d desert, s snow, a autumn, w swamp, j jungle, v volcano, c candy
       shops:    which buildings it appears in more often
       effect:   bonus when eaten, separated by commas:  sta (refill stamina), dash (recharge dash), item (a gift),
                 rush:5 / turbo:6 / shield:5 / magnet:8 / radar:10  (effect for this many seconds)
   ============================================================================================= */
snacks: {
  list: {
    // --- Common ---
    burger:     { tier: 0, weight: 1, xp: 0.95, time: 1.0,  biomes: '',   shops: 'diner arcade',        effect: '' },
    apple:      { tier: 0, weight: 1, xp: 0.7,  time: 0.8,  biomes: 'ma', shops: 'barn greenhouse',     effect: '' },
    soda:       { tier: 0, weight: 1, xp: 0.8,  time: 0.8,  biomes: '',   shops: 'diner arcade cinema', effect: '' },
    pizza:      { tier: 0, weight: 1, xp: 1.05, time: 1.0,  biomes: '',   shops: 'pizzeria diner',      effect: '' },
    donut:      { tier: 0, weight: 1, xp: 0.85, time: 0.9,  biomes: 'c',  shops: 'bakery',              effect: '' },
    fries:      { tier: 0, weight: 1, xp: 0.75, time: 0.85, biomes: '',   shops: 'diner arcade cinema', effect: '' },
    hotdog:     { tier: 0, weight: 1, xp: 0.95, time: 1.0,  biomes: 'a',  shops: 'diner cinema',        effect: '' },
    cookie:     { tier: 0, weight: 1, xp: 0.6,  time: 0.7,  biomes: 'c',  shops: 'bakery cafe',         effect: '' },
    banana:     { tier: 0, weight: 1, xp: 0.7,  time: 0.8,  biomes: 'j',  shops: '',                    effect: '' },
    cupcake:    { tier: 0, weight: 1, xp: 0.85, time: 0.9,  biomes: 'c',  shops: 'bakery cafe',         effect: '' },
    taco:       { tier: 0, weight: 1, xp: 1.0,  time: 1.0,  biomes: 'd',  shops: '',                    effect: '' },
    popcorn:    { tier: 0, weight: 1, xp: 0.55, time: 0.8,  biomes: '',   shops: 'cinema arcade',       effect: '' },
    pretzel:    { tier: 0, weight: 1, xp: 0.7,  time: 0.85, biomes: 'a',  shops: 'bakery cafe',         effect: '' },
    watermelon: { tier: 0, weight: 1, xp: 0.8,  time: 0.9,  biomes: 'd',  shops: '',                    effect: '' },
    carrot:     { tier: 0, weight: 1, xp: 0.5,  time: 0.7,  biomes: 'm',  shops: 'barn greenhouse',     effect: '' },
    cheese:     { tier: 0, weight: 1, xp: 0.65, time: 0.8,  biomes: 'm',  shops: 'barn',                effect: '' },
    egg:        { tier: 0, weight: 1, xp: 0.75, time: 0.85, biomes: 'mw', shops: 'barn diner cafe',     effect: '' },
    toast:      { tier: 0, weight: 1, xp: 0.6,  time: 0.8,  biomes: '',   shops: 'cafe home bakery',    effect: '' },
    icecream:   { tier: 0, weight: 1, xp: 0.8,  time: 0.9,  biomes: 'sc', shops: 'icecream',            effect: '' },
    grapes:     { tier: 0, weight: 1, xp: 0.65, time: 0.8,  biomes: 'a',  shops: 'greenhouse',          effect: '' },
    cherries:   { tier: 0, weight: 1, xp: 0.55, time: 0.7,  biomes: 'm',  shops: '',                    effect: '' },
    corn:       { tier: 0, weight: 1, xp: 0.7,  time: 0.9,  biomes: 'ma', shops: 'barn greenhouse',     effect: '' },
    milk:       { tier: 0, weight: 1, xp: 0.55, time: 0.7,  biomes: 'm',  shops: 'barn cafe',           effect: '' },
    lollipop:   { tier: 0, weight: 1, xp: 0.6,  time: 0.8,  biomes: 'c',  shops: 'icecream',            effect: '' },
    sushi:      { tier: 0, weight: 1, xp: 1.1,  time: 1.0,  biomes: 'w',  shops: '',                    effect: '' },
    pancakes:   { tier: 0, weight: 1, xp: 0.95, time: 1.1,  biomes: 'a',  shops: 'cafe diner',          effect: '' },
    bagel:      { tier: 0, weight: 1, xp: 0.75, time: 0.9,  biomes: '',   shops: 'bakery cafe',         effect: '' },
    orange:     { tier: 0, weight: 1, xp: 0.65, time: 0.8,  biomes: 'dj', shops: 'greenhouse',          effect: '' },
    // --- Rare ---
    cake:       { tier: 1, weight: 1, xp: 1.7,  time: 1.2,  biomes: 'c',  shops: 'bakery cafe',         effect: '' },
    ramen:      { tier: 1, weight: 1, xp: 2.1,  time: 1.35, biomes: 's',  shops: 'cafe',                effect: '' },
    steak:      { tier: 1, weight: 1, xp: 2.5,  time: 1.4,  biomes: 'v',  shops: 'diner',               effect: '' },
    croissant:  { tier: 1, weight: 1, xp: 1.5,  time: 1.1,  biomes: 'm',  shops: 'bakery cafe',         effect: '' },
    pineapple:  { tier: 1, weight: 1, xp: 1.9,  time: 1.25, biomes: 'j',  shops: '',                    effect: '' },
    avocado:    { tier: 1, weight: 1, xp: 1.6,  time: 1.1,  biomes: 'j',  shops: 'greenhouse',          effect: '' },
    chocolate:  { tier: 1, weight: 1, xp: 1.7,  time: 1.1,  biomes: 'c',  shops: 'cafe arcade',         effect: '' },
    honey:      { tier: 1, weight: 1, xp: 2.0,  time: 1.2,  biomes: 'f',  shops: '',                    effect: '' },
    bubbletea:  { tier: 1, weight: 1, xp: 1.8,  time: 1.1,  biomes: 'c',  shops: 'cafe icecream',       effect: '' },
    curry:      { tier: 1, weight: 1, xp: 2.3,  time: 1.35, biomes: 'dv', shops: 'diner',               effect: '' },
    dumplings:  { tier: 1, weight: 1, xp: 2.0,  time: 1.2,  biomes: 's',  shops: 'cafe',                effect: '' },
    waffle:     { tier: 1, weight: 1, xp: 1.8,  time: 1.2,  biomes: 'a',  shops: 'cafe diner',          effect: '' },
    coconut:    { tier: 1, weight: 1, xp: 1.9,  time: 1.2,  biomes: 'jd', shops: 'icecream',            effect: '' },
    mango:      { tier: 1, weight: 1, xp: 1.8,  time: 1.15, biomes: 'j',  shops: 'greenhouse',          effect: '' },
    lobster:    { tier: 1, weight: 1, xp: 2.8,  time: 1.45, biomes: 'w',  shops: '',                    effect: '' },
    // --- Epic ---
    bdaycake:   { tier: 2, weight: 1, xp: 3.8,  time: 1.5,  biomes: 'c',  shops: 'bakery',              effect: 'rush:5' },
    bento:      { tier: 2, weight: 1, xp: 4.4,  time: 1.6,  biomes: 'sw', shops: 'cafe',                effect: 'sta' },
    chicken:    { tier: 2, weight: 1, xp: 4.0,  time: 1.5,  biomes: 'v',  shops: 'diner',               effect: 'turbo:6' },
    shavedice:  { tier: 2, weight: 1, xp: 3.4,  time: 1.3,  biomes: 's',  shops: 'icecream',            effect: 'dash' },
    truffle:    { tier: 2, weight: 1, xp: 4.8,  time: 1.4,  biomes: 'f',  shops: '',                    effect: 'item' },
    dragonfruit:{ tier: 2, weight: 1, xp: 3.9,  time: 1.4,  biomes: 'j',  shops: 'greenhouse',          effect: 'magnet:8' },
    fondue:     { tier: 2, weight: 1, xp: 4.2,  time: 1.6,  biomes: 's',  shops: 'diner',               effect: 'shield:5' },
    dango:      { tier: 2, weight: 1, xp: 3.5,  time: 1.3,  biomes: 'c',  shops: 'icecream',            effect: 'sta,dash' },
    juice:      { tier: 2, weight: 1, xp: 3.3,  time: 1.0,  biomes: '',   shops: 'cafe cinema',         effect: 'radar:10' },
    // --- Legendary ---
    goldburger:   { tier: 3, weight: 1, xp: 11, time: 1.8, biomes: 'v', shops: 'diner',   effect: 'rush:10' },
    diamonddonut: { tier: 3, weight: 1, xp: 13, time: 1.7, biomes: 'c', shops: 'bakery',  effect: 'shield:6,dash' },
    rainbowcake:  { tier: 3, weight: 1, xp: 15, time: 1.9, biomes: 'c', shops: 'bakery',  effect: 'turbo:8,sta' },
    phoenixegg:   { tier: 3, weight: 1, xp: 18, time: 2.0, biomes: 'v', shops: '',        effect: 'rush:8,sta,dash' },
    mooncake:     { tier: 3, weight: 1, xp: 22, time: 2.2, biomes: '',  shops: 'cafe',    effect: 'magnet:10,radar:10,shield:5' },
  },
},

};
