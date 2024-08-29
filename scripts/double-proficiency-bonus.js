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

  // Override the default rollSkill method in the dnd5e system
  libWrapper.register('double-expertise-bonus', 'CONFIG.Actor.documentClass.prototype.rollSkill', function (wrapped, skillId, options={}) {
    const skill = this.data.data.skills[skillId];
    const proficiencyBonus = this.data.data.attributes.prof;

    // Check if the skill has proficiency level greater than 1 (Expertise or higher)
    console.log('DoubleExpertiseBonus Detecting...');

    if (skill.proficient > 1) {
      const multiplier = 2 * skill.proficient;
      // roll.terms[0].formula = roll.terms[0].formula.replace(/@prof/g, `{d20, 5}kh + @mod + @abilityCheckBonus + 2 + @bonus`);
      
      // Modify the roll formula to apply the expertise multiplier
      const rollData = this.getRollData();
      const formula = `${multiplier}*${proficiencyBonus} + @mod`;

      // Perform the roll
      const roll = new Roll(formula, rollData).roll({ async: false });

      // Send the roll to chat
      roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: this }),
        flavor: `${CONFIG.DND5E.skills[skillId]} Check (Expertise Bonus Applied ${skill.proficient} Times)`
      });
      console.log('DoubleExpertiseBonus modified and FIRED.');
      return roll;
    } else {
      // If no expertise, use the default rollSkill method
      console.log('DoubleExpertiseBonus LEFT unloved.');
      return wrapped(skillId, options);
    }
  }, 'MIXED');
});

