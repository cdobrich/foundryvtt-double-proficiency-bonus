/*
Explanation:
1. Checking for Expertise:
	skill.proficient === 2: In Foundry VTT, a proficiency level of 2 typically indicates Expertise (meaning the proficiency bonus is doubled).
2. Modifying the Roll Formula:
	When Expertise is detected, the script modifies the roll formula to apply the proficiency bonus twice, effectively doubling it. The 4*@prof replaces the normal @prof to account for Expertise being applied twice.
3. Flavor Text:
	The roll flavor text is updated to reflect that the Expertise bonus has been applied twice.
*/ 
Hooks.once('init', () => {
  console.log('Double Expertise Bonus Module Loaded');

  // Function to modify the skill roll
  function modifySkillRoll(actor, roll, skillId) {
    const skill = actor.data.data.skills[skillId];
    const proficiencyBonus = actor.data.data.attributes.prof;

    // Check if the skill has Expertise
    if (skill.proficient === 2) {
      roll.terms[0].options.flavor += ` + Expertise Bonus Applied Twice`;
      roll.terms[0].formula = roll.terms[0].formula.replace(/@prof/g, `{d20, 5}kh + @mod + @abilityCheckBonus + 2 + @bonus`);
    }
  }

  // Hook into the skill roll workflow
  Hooks.on('preRollSkill', (actor, skillId, roll) => {
    modifySkillRoll(actor, roll, skillId);
  });
});

