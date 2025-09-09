# MythLang Examples

Basic spell casting:
```myth
let frostbolt = Spell("Frostbolt", power: 7);
cast(frostbolt);
```

Summoning and banishing:
```myth
let phoenix = summon("Phoenix");
banish(phoenix);
```

Ritual with conditional:
```myth
ritual heal(target: Creature) {
  if mana() > 20 {
    cast(Spell("Heal", power: 5));
  } else {
    whisper("Not enough mana to heal.");
  }
}
```
