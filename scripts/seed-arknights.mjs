// One-off seed script: populates a handful of arknights_operators roster rows plus a
// few owned arknights_collection entries, so the workspace has real data to develop
// and verify against. Not part of the app build. Safe to re-run (skips names that
// already exist). Requires PocketBase running and a "users" record matching
// OWNER_EMAIL/OWNER_PASSWORD env vars (required, no fallback -- don't hardcode credentials here).
import PocketBase from 'pocketbase'

const URL = process.env.PB_URL ?? 'http://127.0.0.1:8090'
const OWNER_EMAIL = process.env.OWNER_EMAIL
const OWNER_PASSWORD = process.env.OWNER_PASSWORD
if (!OWNER_EMAIL || !OWNER_PASSWORD) {
  throw new Error('Set OWNER_EMAIL and OWNER_PASSWORD env vars before running this script.')
}

const pb = new PocketBase(URL)
await pb.collection('users').authWithPassword(OWNER_EMAIL, OWNER_PASSWORD)

const existingGame = await pb
  .collection('games')
  .getFirstListItem(pb.filter('slug = {:slug}', { slug: 'arknights' }))
  .catch(() => null)
if (existingGame) {
  console.log('skip  game:arknights')
} else {
  await pb.collection('games').create({
    slug: 'arknights',
    name: 'Arknights',
    tagline: 'Tower-defense gacha RPG by Hypergryph.',
    order: 1,
    status: 'active',
  })
  console.log('create game:arknights')
}

const OPERATORS = [
  { name: 'Amiya', rarity: 5, profession: 'Caster', subProfession: 'Core Caster', position: 'Ranged' },
  { name: 'SilverAsh', rarity: 6, profession: 'Guard', subProfession: 'Instructor', position: 'Melee' },
  { name: 'Exusiai', rarity: 6, profession: 'Sniper', subProfession: 'Fast Shot', position: 'Ranged' },
  { name: 'Eyjafjalla', rarity: 6, profession: 'Caster', subProfession: 'Phalanx Caster', position: 'Ranged' },
  { name: 'Texas', rarity: 5, profession: 'Vanguard', subProfession: 'Agent', position: 'Melee' },
  { name: 'Croissant', rarity: 3, profession: 'Defender', subProfession: 'Protector', position: 'Melee' },
  { name: 'Kroos', rarity: 3, profession: 'Sniper', subProfession: 'Aircraft Sniper', position: 'Ranged' },
  { name: 'Nightingale', rarity: 6, profession: 'Medic', subProfession: 'Incantation Medic', position: 'Ranged' },
]

const operatorIds = {}
for (const op of OPERATORS) {
  const existing = await pb
    .collection('arknights_operators')
    .getFirstListItem(pb.filter('name = {:name}', { name: op.name }))
    .catch(() => null)
  const record = existing ?? (await pb.collection('arknights_operators').create(op))
  operatorIds[op.name] = record.id
  console.log(existing ? `skip  ${op.name}` : `create ${op.name}`)
}

const OWNED = [
  {
    name: 'Amiya',
    elite: 2,
    level: 80,
    potential: 3,
    trust: 200,
    skill1Level: 7,
    skill1Mastery: 3,
    skill2Level: 7,
    skill2Mastery: 2,
    module1Tier: 2,
    favorite: true,
  },
  {
    name: 'SilverAsh',
    elite: 2,
    level: 90,
    potential: 6,
    trust: 200,
    skill1Level: 7,
    skill1Mastery: 3,
    skill2Level: 7,
    skill2Mastery: 3,
    skill3Level: 7,
    skill3Mastery: 3,
    module1Tier: 3,
    favorite: true,
  },
  {
    name: 'Texas',
    elite: 2,
    level: 70,
    potential: 1,
    trust: 180,
    skill1Level: 7,
    skill2Level: 7,
    skill2Mastery: 1,
    module1Tier: 1,
  },
  {
    name: 'Kroos',
    elite: 1,
    level: 45,
    potential: 2,
    trust: 120,
    skill1Level: 7,
  },
]

for (const entry of OWNED) {
  const { name, ...rest } = entry
  const operator = operatorIds[name]
  const existing = await pb
    .collection('arknights_collection')
    .getFirstListItem(pb.filter('operator = {:operator}', { operator }))
    .catch(() => null)
  if (existing) {
    console.log(`skip  owned:${name}`)
    continue
  }
  await pb.collection('arknights_collection').create({ operator, ...rest })
  console.log(`create owned:${name}`)
}

console.log('done')
