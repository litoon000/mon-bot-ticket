const {
  ActionRowBuilder, ButtonBuilder, ButtonStyle,
  EmbedBuilder, ChannelType, PermissionFlagsBits
} = require('discord.js');

async function setupTicketPanel(interaction) {
  const embed = new EmbedBuilder()
    .setTitle('🎫 Ticket Midle Man')
    .setDescription('Clique sur le bouton ci-dessous pour ouvrir un ticket.')
    .setColor(0x5865F2);

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('create_ticket')
      .setLabel('Ouvrir un ticket')
      .setStyle(ButtonStyle.Primary)
      .setEmoji('🎫')
  );

  await interaction.reply({ embeds: [embed], components: [row] });
}

async function createTicket(interaction) {
  const guild = interaction.guild;
  const user = interaction.user;

  const existing = guild.channels.cache.find(c => c.name === `ticket-${user.username.toLowerCase()}`);
  if (existing) {
    return interaction.reply({ content: `❌ Tu as déjà un ticket ouvert : ${existing}`, ephemeral: true });
  }

  const channel = await guild.channels.create({
    name: `ticket-${user.username}`,
    type: ChannelType.GuildText,
    parent: process.env.TICKET_CATEGORY_ID,
    permissionOverwrites: [
      { id: guild.id, deny: [PermissionFlagsBits.ViewChannel] },
      { id: user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
      { id: process.env.SUPPORT_ROLE_ID, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
    ],
  });

  const embed = new EmbedBuilder()
    .setTitle(`Ticket de ${user.username}`)
    .setDescription('Décris ton problème, notre équipe va te répondre rapidement.')
    .setColor(0x57F287)
    .setTimestamp();

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('close_ticket')
      .setLabel('Fermer le ticket')
      .setStyle(ButtonStyle.Danger)
      .setEmoji('🔒')
  );

  await channel.send({ content: `${user} | <@&${process.env.SUPPORT_ROLE_ID}>`, embeds: [embed], components: [row] });
  await interaction.reply({ content: `✅ Ton ticket a été créé : ${channel}`, ephemeral: true });
}

async function closeTicket(interaction) {
  const channel = interaction.channel;
  if (!channel.name.startsWith('ticket-')) {
    return interaction.reply({ content: '❌ Cette commande ne fonctionne que dans un ticket.', ephemeral: true });
  }

  await interaction.reply('🔒 Fermeture du ticket dans 5 secondes...');
  setTimeout(() => channel.delete().catch(console.error), 5000);
}

module.exports = { setupTicketPanel, createTicket, closeTicket };