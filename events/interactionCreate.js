const { createTicket, closeTicket } = require('../utils/ticketManager');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (command) await command.execute(interaction);
    }

    if (interaction.isButton()) {
      if (interaction.customId === 'create_ticket') await createTicket(interaction);
      if (interaction.customId === 'close_ticket') await closeTicket(interaction);
    }
  },
};