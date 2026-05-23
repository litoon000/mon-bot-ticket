const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { createTicket, closeTicket, setupTicketPanel } = require('../utils/ticketManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Gestion des tickets')
    .addSubcommand(sub =>
      sub.setName('setup')
        .setDescription('Envoie le panel de création de ticket'))
    .addSubcommand(sub =>
      sub.setName('close')
        .setDescription('Ferme le ticket actuel'))
    .addSubcommand(sub =>
      sub.setName('add')
        .setDescription('Ajoute un utilisateur au ticket')
        .addUserOption(opt =>
          opt.setName('utilisateur').setDescription('Utilisateur à ajouter').setRequired(true)))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    if (sub === 'setup') await setupTicketPanel(interaction);
    if (sub === 'close') await closeTicket(interaction);
    if (sub === 'add') {
      const user = interaction.options.getUser('utilisateur');
      await interaction.channel.permissionOverwrites.edit(user.id, { ViewChannel: true, SendMessages: true });
      await interaction.reply({ content: `✅ ${user} a été ajouté au ticket.`, ephemeral: true });
    }
  },
};