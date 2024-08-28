/*
Explanation:
1. Hooks.once('init', ...): This ensures that the module is initialized when Foundry VTT starts.
2. modifySkillRoll: This function checks if the actor has proficiency in the skill being rolled. If so, it modifies the roll formula to add the proficiency bonus twice.
3. Hooks.on('preRollSkill', ...): This hook is used to intercept the skill roll before it happens and apply the modification.
*/ 
Hooks.once('init', () => {
  console.log('Double Proficiency Bonus Module Loaded');

  // Function to modify the skill roll
  function modifySkillRoll(actor, roll, skillId) {
    const skill = actor.data.data.skills[skillId];
    if (skill.proficient > 0) {
      const proficiencyBonus = actor.data.data.attributes.prof;
      roll.terms[0].options.flavor += ` + Double Proficiency Bonus`;
      roll.terms[0].formula = roll.terms[0].formula.replace(/@prof/g, `2*@prof`);
    }
  }

  // Hook into the skill roll workflow
  Hooks.on('preRollSkill', (actor, skillId, roll) => {
    modifySkillRoll(actor, roll, skillId);
  });
});
