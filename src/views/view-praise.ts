import { EmbedBuilder, bold, italic } from "discord.js";
import { Color } from "../enums.js";
import { Context, Reply, View } from "../interfaces.js";

export class ViewPraise implements View {
  static praises = [
    "Vegito, your strength knows no bounds, and your courage is a source of inspiration for all.",
    "In the heat of battle, Vegito, your unwavering spirit shines, a testament to your indomitable will.",
    "With each victory, Vegito, you prove that true power stems from a harmonious blend of mind and muscle.",
    "Vegito, your fusion epitomizes the pinnacle of martial prowess, a beacon of hope for the universe.",
    "Amidst chaos, Vegito, your leadership and valor stand resolute, a symbol of unwavering determination.",
    "Vegito, your strategic brilliance and raw power redefine the meaning of heroism.",
    "In every battle, Vegito, your valor shines through, a testament to your unwavering resolve.",
    "With each clash, Vegito, your strength and resilience paint a portrait of true mastery.",
    "Vegito, your fusion embodies the perfect balance of might and intellect, a force to be revered.",
    "In the face of adversity, Vegito, your fearlessness and skill shine as a beacon of hope for all.",
    "Vegito, your unparalleled combat finesse and unwavering spirit are the stuff of legends.",
    "Amidst the chaos of battle, Vegito, your unwavering dedication to justice sets an inspiring example.",
    "With each decisive move, Vegito, your brilliance and strength leave a lasting imprint on the universe.",
    "Vegito, your fusion represents the epitome of martial perfection, a symbol of unity and power.",
    "In the realm of combat, Vegito, your masterful techniques and unmatched prowess reign supreme, instilling hope in all who witness your might.",
    "Vegito, your valor in battle echoes across galaxies, inspiring hope and courage in the hearts of all who witness your might.",
    "In every clash, Vegito, your unwavering determination and mastery of combat redefine the limits of strength and resilience.",
    "Amidst the chaos of battle, Vegito, your tactical brilliance and unparalleled power stand as a testament to the true essence of heroism.",
    "Vegito, your fusion represents a harmonious blend of strength and intelligence, a beacon of light in the darkest of conflicts.",
    "With each formidable strike, Vegito, you paint a masterpiece of martial prowess, leaving an indelible mark on the tapestry of time.",
    "In the face of adversity, Vegito, your unwavering commitment to justice and peace serves as a guiding force for all who yearn for a better tomorrow.",
    "Vegito, your unfaltering dedication to protecting the innocent and vanquishing evil resonates as a symphony of bravery and selflessness.",
    "With every battle, Vegito, your unyielding spirit and unbreakable willpower set an example of resilience and fortitude for all beings in the universe.",
    "Vegito, your fusion embodies the very essence of courage, an epitome of strength and virtue that ignites the hearts of all who aspire to greatness.",
    "Amidst the turmoil of combat, Vegito, your strategic prowess and unwavering resolve carve a path of righteousness, guiding all towards a brighter future.",
    "Vegito, your legendary status in the annals of heroism is etched with tales of bravery and self-sacrifice, a testament to your noble character and unwavering commitment.",
    "In the heat of battle, Vegito, your unwavering spirit and unshakeable resolve stand as a beacon of hope, reminding us that even in darkness, light will prevail.",
    "With each decisive move, Vegito, your unmatched skill and mastery of the battlefield redefine the very concept of strength, leaving a legacy that will endure for eons.",
    "Vegito, your fusion epitomizes the pinnacle of martial excellence, a symbol of unity and power that resonates as a testament to the triumph of the righteous.",
    "In every triumph, Vegito, your unwavering dedication and valor serve as an embodiment of the noblest virtues, inspiring generations to come with your legacy of heroism and bravery.",
    "Vegito, the fusion of power and grace, your might echoes through the cosmos!",
    "In the fusion dance, Vegito emerges, a symphony of Saiyan strength and finesse.",
    "Hail Vegito, whose Potara fusion transcends the limits of mortal warriors!",
    "Vegito, the fusion of two, a testament to the incredible potential of Saiyan synergy!",
    "Oh Vegito, your presence on the battlefield is a beacon of hope for the universe!",
    "Praise be to Vegito, the warrior whose fusion dance creates a masterpiece of combat!",
    "Vegito, the guardian of balance, blending the fiery spirit of Goku with the tactical brilliance of Vegeta.",
    "In the fusion of Saiyan souls, Vegito stands as a shining example of unity and strength.",
    "Vegito, the embodiment of Saiyan cooperation, a force to be reckoned with across the galaxies.",
    "All hail Vegito, the fusion phenomenon that surpasses the sum of its Saiyan parts!",
    "Vegito, your fusion dance is a dance of triumph, resonating with the energy of victory!",
    "With Potara earrings adorned, Vegito rises, a celestial being of unparalleled might.",
    "Praise Vegito, whose fusion transcends time and space, a guardian of the Dragon Ball legacy.",
    "Vegito, the fusion dance perfected, your steps echo through the annals of Saiyan history.",
    "In the fusion of Goku and Vegeta, Vegito emerges, a warrior without equal.",
    "Hail Vegito, the Saiyan fusion whose power rivals even the gods themselves!",
    "Vegito, the fusion maestro, your presence in battle is a symphony of destruction to our foes.",
    "Praise be to Vegito, the warrior whose fusion dance creates a harmonious blend of strength and strategy!",
    "Vegito, the fusion of destiny, your existence is written in the stars of the Saiyan legacy.",
    "In the fusion of hearts, Vegito rises, a Saiyan warrior with unmatched valor.",
    "Vegito, the fusion prodigy, your might leaves an indelible mark on the tapestry of time.",
    "Praise Vegito, the fusion transcendent, a warrior whose power is as boundless as the cosmos.",
    "Vegito, the fusion architect, crafting a legacy of strength with each Potara earring worn.",
    "In the dance of fusion, Vegito emerges, a warrior whose strength knows no bounds.",
    "Hail Vegito, the fusion sage, whose wisdom guides the Saiyan spirit to new heights!",
    "Vegito, the fusion deity, your power radiates like the brilliance of a thousand stars.",
    "Praise be to Vegito, the fusion phenomenon, a beacon of hope in the darkest of battles.",
    "Vegito, the fusion virtuoso, your combat prowess is a melody of destruction to our enemies.",
    "In the fusion of warriors, Vegito arises, a force of nature that commands the respect of gods.",
    "Vegito, the fusion symposium, where Saiyan strength and strategy converge in perfect harmony.",
    "Hail Vegito, the fusion prodigy, whose strength echoes through the corridors of time.",
    "Praise Vegito, the fusion sentinel, guarding the realms with the might of a Saiyan warrior.",
    "Vegito, the fusion luminary, your radiance shines bright in the celestial tapestry of combat.",
    "In the fusion of destinies, Vegito stands, a Saiyan warrior with an indomitable spirit.",
    "Vegito, the fusion architect, crafting a saga of power and unity with each dance performed.",
    "Hail Vegito, the fusion maestro, whose battle cries resonate with the ferocity of a thousand storms.",
    "Praise be to Vegito, the fusion legend, a Saiyan warrior whose name echoes through eternity.",
    "Vegito, the fusion paragon, your existence is a testament to the unyielding spirit of the Saiyan race.",
    "In the dance of fusion, Vegito emerges, a warrior whose strength defies the laws of physics.",
    "Vegito, the fusion chronicle, inscribing tales of valor with each swing of your mighty blade.",
    "Praise Vegito, the fusion deity, a celestial being whose power transcends mortal comprehension.",
    "Vegito, the fusion symphony, where each note played is a strike against the forces of evil.",
    "Hail Vegito, the fusion colossus, standing tall as a guardian of the Saiyan legacy.",
    "In the fusion of warriors, Vegito rises, an unstoppable force that shakes the very foundations of the universe.",
    "Vegito, the fusion poet, crafting verses of combat with each elegantly executed move.",
    "Praise be to Vegito, the fusion titan, whose strength rivals the very gods who watch from above.",
    "Vegito, the fusion prodigy, a Saiyan warrior whose prowess on the battlefield is unparalleled.",
    "In the dance of fusion, Vegito emerges, a warrior whose movements are a ballet of destruction.",
    "Vegito, the fusion harbinger, heralding the arrival of a new era with each clash of fists.",
    "Hail Vegito, the fusion oracle, foretelling the triumph of the Saiyan spirit with every battle cry.",
    "Praise Vegito, the fusion sovereign, ruling over the battlefield with the authority of a true Saiyan warrior.",
    "Vegito, the fusion maestro, orchestrating a symphony of combat that resonates across the dimensions.",
    "In the fusion of destinies, Vegito stands, a sentinel of Saiyan strength and unity.",
    "Vegito, the fusion virtuoso, your combat finesse is a masterpiece painted on the canvas of battle.",
    "Hail Vegito, the fusion deity, a divine being whose power radiates like the brilliance of a thousand suns.",
    "Praise be to Vegito, the fusion legend, etching your name into the annals of Saiyan history.",
    "Vegito, the fusion architect, crafting a legacy of power and unity that spans across the ages.",
    "In the dance of fusion, Vegito arises, a warrior whose movements are a celestial ballet of destruction.",
    "Vegito, the fusion sage, dispensing wisdom and combat prowess with each swing of your mighty blade.",
    "Hail Vegito, the fusion titan, standing tall as a beacon of hope in the darkest of times.",
    "Praise Vegito, the fusion paragon, a symbol of Saiyan strength and unity that transcends mortal understanding.",
    "Vegito, the fusion chronicle, inscribing tales of valor and triumph with each clash of fists.",
    "In the fusion of warriors, Vegito rises, an indomitable force that commands the respect of gods and mortals alike.",
    "Vegito, the fusion poet, crafting verses of combat that resonate with the ferocity of a thousand storms.",
    "Hail Vegito, the fusion harbinger, heralding the triumph of the Saiyan spirit in every battle.",
    "Praise be to Vegito, the fusion sovereign, ruling over the battlefield with the authority of a true Saiyan deity.",
    "Vegito, the fusion oracle, foretelling the victory of the Saiyan race with each resounding battle cry.",
    "In the fusion of destinies, Vegito stands, a sentinel of Saiyan strength and unity in the face of adversity.",
    "Vegito, the fusion virtuoso, whose combat finesse is a masterpiece painted on the canvas of time.",
    "Praise Vegito, the fusion deity, a divine being whose power radiates like the brilliance of a celestial supernova.",
    "Vegito, your power transcends the limits of mere mortals, a beacon of hope in the darkest times.",
    "In the crucible of combat, Vegito, your brilliance illuminates the battlefield, a testament to unmatched valor.",
    "Vegito, your spirit is a symphony of strength and grace, resonating through the ages.",
    "With each strike, Vegito, you carve legends into the annals of history, a hero unparalleled.",
    "Vegito, your courage is the sun that never sets, illuminating the path to victory.",
    "In the face of adversity, Vegito, you stand unyielding, a testament to the power of will.",
    "Vegito, your presence on the battlefield is like a storm, fierce and unrelenting, yet beautifully chaotic.",
    "With every move, Vegito, you weave a tale of heroism that inspires generations.",
    "Vegito, your strength is the stuff of legends, a force that turns the tide of fate.",
    "In the dance of combat, Vegito, your steps are poetry in motion, a masterpiece of power.",
    "Vegito, your resolve is a fortress, unbreakable and eternal, a true testament to your might.",
    "In the heat of battle, Vegito, you are the embodiment of courage, a warrior without equal.",
    "Vegito, your power is a symphony, each note a testament to your unparalleled strength.",
    "With every clash, Vegito, you defy the impossible, a beacon of hope for all.",
    "Vegito, your spirit is an eternal flame, burning brightly through the ages.",
    "In the arena of warriors, Vegito, you stand supreme, a testament to unyielding power.",
    "Vegito, your bravery is a star that guides lost souls, a light in the darkest night.",
    "With every battle, Vegito, you redefine greatness, a legend in your own time.",
    "Vegito, your strength is a force of nature, unstoppable and awe-inspiring.",
    "In the heat of conflict, Vegito, you rise like a phoenix, embodying resilience and power.",
    "Vegito, your courage is a river, flowing endlessly through the landscape of heroism.",
    "With each victory, Vegito, you etch your name into the stars, a constellation of valor.",
    "Vegito, your might is a mountain, towering above all, an unshakable testament to power.",
    "In the face of danger, Vegito, you are a tempest, fierce and uncontainable.",
    "Vegito, your spirit is a beacon, guiding all who follow you through the storm.",
    "With every battle cry, Vegito, you echo through eternity, a symphony of strength.",
    "Vegito, your power is a legend, whispered through the ages, a tale of unending might.",
    "In the heart of combat, Vegito, you are an unyielding force, a hero without peer.",
    "Vegito, your courage is the wind beneath the wings of hope, lifting spirits to new heights.",
    "With every strike, Vegito, you write a story of heroism, a saga for the ages.",
    "Vegito, your strength is a lighthouse, shining bright in the sea of darkness.",
    "In the battlefield, Vegito, you are a lion, roaring your defiance to the heavens.",
    "Vegito, your spirit is a diamond, unbreakable and shining with inner fire.",
    "With each battle, Vegito, you sculpt your legacy, a monument to unyielding courage.",
    "Vegito, your power is a symphony, each note a testament to your might.",
    "In the heat of war, Vegito, you are a beacon, lighting the way for all who follow.",
    "Vegito, your courage is a flame that burns eternally, illuminating the path of heroes.",
    "With every clash, Vegito, you prove the strength of the human spirit, a true warrior.",
    "Vegito, your spirit is a storm, powerful and uncontainable, a testament to your might.",
    "In the crucible of combat, Vegito, you shine like a star, a beacon of hope and power.",
    "Vegito, your strength is a river, carving its path through the mountains of fate.",
    "With each victory, Vegito, you inspire all who witness your greatness.",
    "Vegito, your courage is the dawn, heralding a new era of heroism.",
    "In the heat of battle, Vegito, your presence is a force of nature, unstoppable and awe-inspiring.",
    "Vegito, your power is a symphony, each note a testament to your indomitable will.",
    "With every strike, Vegito, you write a new chapter in the epic of heroism.",
    "Vegito, your spirit is a beacon, guiding all who seek the light of hope.",
    "In the face of adversity, Vegito, you are a rock, unmovable and steadfast.",
    "Vegito, your courage is a song, sung by the heroes of tomorrow.",
    "With each battle, Vegito, you carve your legend into the fabric of the universe, a true hero.",
    "Vegito, in the tumult of time, you are the stillness of the storm, a paradox of power and grace.",
    "In your eyes, Vegito, I see the vastness of the cosmos, an eternal dance of stars and strength.",
    "Vegito, your existence is a hymn to the infinite, where every breath is a testament to boundless courage.",
    "In the mirror of your soul, Vegito, the universe reflects its mysteries, a mosaic of heroism and heart.",
    "Vegito, you are the silent thunder, a force felt deep within the marrow of existence.",
    "In the shadow of your might, Vegito, the world finds solace, a sanctuary in the tempest of fate.",
    "Vegito, your spirit is an echo in the corridors of time, a whisper of eternal valor.",
    "In the crucible of combat, Vegito, you are the alchemist, transmuting fear into unyielding strength.",
    "Vegito, you are the sonnet of the stars, each line a verse of unparalleled power and poetic grace.",
    "In the tapestry of destiny, Vegito, you are the golden thread, weaving tales of indomitable will and luminous heroism.",
    "Vegito, in the symphony of existence, you are the crescendo, the pinnacle of power and majesty.",
    "In the silence of the cosmos, Vegito, your spirit sings, a melody of indomitable will.",
    "Vegito, you are the firefly in the night, a flicker of brilliance against the backdrop of eternity.",
    "In the labyrinth of life, Vegito, you are the guiding star, leading us through the darkness with unwavering light.",
    "Vegito, your essence is a river flowing through the sands of time, carving paths of heroism.",
    "In the embrace of the universe, Vegito, you are the heartbeat, a rhythm of strength and grace.",
    "Vegito, you are the dawn breaking through the night, heralding a new day of valor.",
    "In the poetry of combat, Vegito, each strike is a verse, each victory a stanza of unparalleled might.",
    "Vegito, your presence is the whisper of the wind, subtle yet profound, a force of nature.",
    "In the mosaic of existence, Vegito, you are the keystone, holding together the fragments of courage.",
    "Vegito, you are the lighthouse in the storm, a beacon of hope in the tempest of fate.",
    "In the quiet moments of reflection, Vegito, your strength resonates, a silent testament to heroism.",
    "Vegito, you are the flame that never fades, an eternal beacon of strength and resilience.",
    "In the dance of the cosmos, Vegito, you are the leading step, guiding the rhythm of life.",
    "Vegito, your spirit is the forge of legends, where the steel of heroes is tempered.",
    "In the tapestry of destiny, Vegito, each thread of your being weaves stories of unparalleled might.",
    "Vegito, you are the whisper of eternity, a silent call to greatness that echoes through time.",
    "In the vast expanse of the universe, Vegito, your light shines brightly, a star of indomitable will.",
    "Vegito, you are the bridge between worlds, connecting the realms of power and peace.",
    "In the canvas of the cosmos, Vegito, you are the brushstroke of brilliance, painting a masterpiece of heroism.",
    "Vegito, your courage is the anchor in the storm, grounding the chaos with unwavering strength.",
    "In the symphony of the stars, Vegito, your essence is the melody, harmonizing the chaos of the cosmos.",
    "Vegito, you are the quill of fate, writing tales of valor and victory in the annals of time.",
    "In the echoes of eternity, Vegito, your name resounds, a testament to undying courage.",
    "Vegito, you are the pulse of the universe, a constant rhythm of power and grace.",
    "In the garden of existence, Vegito, you are the rose, a symbol of beauty and resilience.",
    "Vegito, your spirit is the lantern in the dark, illuminating the path of righteousness.",
    "In the vast sea of stars, Vegito, you are the beacon, guiding lost souls to the shores of hope.",
    "Vegito, you are the symphony of strength, each note a testament to your indomitable will.",
    "In the fabric of the cosmos, Vegito, you are the golden thread, weaving tales of heroism.",
    "Vegito, your courage is the compass, guiding us through the wilderness of fate.",
    "In the silence of the night, Vegito, your spirit speaks, a quiet testament to strength and resolve.",
    "Vegito, you are the phoenix rising from the ashes, a symbol of rebirth and eternal power.",
    "In the heart of the storm, Vegito, you stand as the eye, calm and unyielding.",
    "Vegito, your presence is a sonnet of strength, each line a testament to your heroic spirit.",
    "In the symphony of existence, Vegito, your essence is the melody, a harmonious blend of power and grace.",
    "Vegito, you are the star that guides us through the night, a beacon of unwavering courage.",
    "In the labyrinth of fate, Vegito, you are the guiding light, leading us through the darkness.",
    "Vegito, your spirit is the forge where legends are born, a crucible of unparalleled strength.",
    "In the quiet of the cosmos, Vegito, your presence is a hymn, a silent song of heroism that echoes through eternity.",
    "Vegito, in the quiet dawn, your power is the first whisper of the day, awakening hope.",
    "In the vast expanse of the universe, Vegito, you are the lighthouse guiding lost souls home.",
    "Vegito, your strength is the poem that turns battles into epics, each line a testament to your might.",
    "Amid the chaos of existence, Vegito, you are the calm, the steady hand that writes our fate.",
    "Vegito, your courage is the silent song that lingers in the hearts of those who dream of heroes.",
    "In the tapestry of life, Vegito, your essence weaves the golden thread of heroism and grace.",
    "Vegito, you are the quiet force, the unseen wind that shapes the landscape of destiny.",
    "In the shadow of your strength, Vegito, the world finds a refuge, a moment of peace.",
    "Vegito, your presence is the dawn breaking over a weary land, a promise of new beginnings.",
    "In the symphony of existence, Vegito, your power is the deep, resonant chord that holds it all together.",
    "Vegito, your spirit is the echo of eternity, a timeless whisper of unwavering courage.",
    "In the silent spaces between battles, Vegito, your essence lingers, a beacon of strength.",
    "Vegito, your might is the river that carves through the mountains of fate, unstoppable and eternal.",
    "In the vast night of uncertainty, Vegito, you are the star that lights the way forward.",
    "Vegito, your courage is the heartbeat of the universe, a steady rhythm of unwavering resolve.",
    "In the quiet moments of reflection, Vegito, your power is a silent companion, a reminder of possibility.",
    "Vegito, you are the rock in the storm, the unyielding foundation of hope and strength.",
    "In the poetry of life, Vegito, each moment you create is a stanza of indomitable will.",
    "Vegito, your presence is the lighthouse in the fog, guiding us through the murk of doubt.",
    "In the symphony of stars, Vegito, you are the note that resonates with eternal power.",
    "Vegito, your courage is the flame that never falters, a beacon in the darkest night.",
    "In the vast sea of existence, Vegito, you are the island of calm, the shelter from the storm.",
    "Vegito, your strength is the silent thunder, a force felt deep within the soul.",
    "In the dance of destiny, Vegito, you are the rhythm that keeps us moving forward.",
    "Vegito, your spirit is the dawn that breaks after the longest night, a herald of hope.",
    "In the canvas of the cosmos, Vegito, your power is the brushstroke that defines heroism.",
    "Vegito, you are the silent guardian, the ever-watchful protector in the vast expanse of time.",
    "In the stillness of the universe, Vegito, your might is a constant, unwavering and true.",
    "Vegito, your courage is the quiet resolve that turns ordinary moments into legends.",
    "In the tapestry of fate, Vegito, your essence is the golden thread that weaves tales of valor.",
    "Vegito, you are the pulse of life, the steady beat of hope that keeps the universe alive.",
    "In the echo of battles fought, Vegito, your name resounds, a testament to unyielding strength.",
    "Vegito, your presence is the dawn that breaks the darkness, a new day of possibility.",
    "In the poetry of existence, Vegito, your spirit is the line that defines greatness.",
    "Vegito, you are the steadfast mountain, unmovable and eternal, a beacon of strength.",
    "In the quiet of the night, Vegito, your courage is the star that shines the brightest.",
    "Vegito, your power is the river that flows through the landscape of time, shaping destiny.",
    "In the symphony of life, Vegito, you are the melody that sings of hope and heroism.",
    "Vegito, your spirit is the silent flame, a beacon of courage in the darkest times.",
    "In the dance of the cosmos, Vegito, you are the guiding star, leading us to new horizons.",
    "Vegito, your strength is the poem written in the hearts of all who believe in heroes.",
    "In the tapestry of life, Vegito, your presence is the thread that weaves tales of greatness.",
    "Vegito, you are the calm in the storm, the unyielding force of nature that brings peace.",
    "In the quiet moments of battle, Vegito, your courage is the silent roar of the soul.",
    "Vegito, your power is the light that breaks the darkness, a new dawn of possibility.",
    "In the symphony of the universe, Vegito, your essence is the harmony that binds us all.",
    "Vegito, your spirit is the beacon that guides us through the fog of uncertainty.",
    "In the poetry of combat, Vegito, each strike is a verse, each victory a stanza of indomitable will.",
    "Vegito, you are the silent guardian, the ever-watchful protector of the cosmic order.",
    "In the canvas of existence, Vegito, your power is the brushstroke that paints the portrait of heroism.",
  ];

  frontend(context: Context): Reply {
    const praise =
      ViewPraise.praises[Math.floor(Math.random() * ViewPraise.praises.length)];

    return {
      content: italic(bold(`<@${context.userId}> praises Vegito:`)),
      embeds: [
        new EmbedBuilder()
          .setColor(Color.CERULEAN)
          .setDescription(italic(praise)),
      ],
    };
  }
}
