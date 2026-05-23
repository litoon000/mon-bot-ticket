require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('fs');

const commands = fs.readdirSync('./commands')
  .filter(f => f.endsWith('.js'))
  .map(f => require(`./commands/${f}`).data.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  console.log('Déploiement des commandes...');
  await rest.put(
    Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
    { body: commands }
  );
  console.log('✅ Commandes enregistrées !');
})();