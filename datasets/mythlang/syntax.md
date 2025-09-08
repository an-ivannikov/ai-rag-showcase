# MythLang Syntax

- Variables are declared using the `let` keyword:
  ```myth
  let fireball = Spell("Fireball", power: 10)
  ```

- Functions are declared using the `ritual` keyword:
  ```myth
  ritual summonPhoenix(times: Int) -> Creature {
      // summoning code here
  }
  ```

- Conditional casting:
  ```myth
  if mana > 50 {
      cast(fireball)
  } else {
      whisper("Not enough mana.")
  }
  ```
