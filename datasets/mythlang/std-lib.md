# MythLang Standard Library

The standard library includes several core modules:

- **Energy**
  - `mana()` → returns the current mana level.
  - `recharge(amount: Int)` → restores mana.

- **Creatures**
  - `summon(name: String)` → summons a magical creature.
  - `banish(creature: Creature)` → removes a creature from the realm.

- **Spells**
  - `cast(spell: Spell)` → performs a spell.
  - `enchant(item: Item, effect: String)` → applies enchantment to an item.
