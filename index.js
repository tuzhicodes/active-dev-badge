const { Client, GatewayIntentBits, SlashCommandBuilder, REST, Routes, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events } = require('discord.js');
require('dotenv').config();

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

const commands = [
  new SlashCommandBuilder()
    .setName('active-dev-badge')
    .setDescription('Start your 24hr Active Developer Badge timer!'),
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  try {
    console.log('Registering PUBLIC slash command...');
    await rest.put(
      Routes.applicationCommands(CLIENT_ID),
      { body: commands }
    );
    console.log('✅ Public slash command registered');

    client.once('ready', () => {
      console.log(`Logged in as ${client.user.tag}`);
    });

    // Welcome message on guild join removed as requested

    client.on(Events.InteractionCreate, async interaction => {
      if (!interaction.isChatInputCommand()) return;
      if (interaction.commandName !== 'active-dev-badge') return;

      const now = Date.now();
      const future = now + 24 * 60 * 60 * 1000;
      const timeLeft = `<t:${Math.floor(future / 1000)}:R>`;

      const embed = new EmbedBuilder()
        .setTitle('🚀 Active Developer Badge Timer')
        .setDescription(`
        **Congratulations!** Your 24-hour timer has been activated.
        
        ⏰ **Timer Ends:** ${timeLeft}
        
        Once the timer completes, click the button below to claim your **Active Developer Badge**!
        `)
        .addFields(
          { 
            name: '📋 Instructions', 
            value: `
            • Wait for the full 24 hours to pass
            • Click the "Claim Badge" button below
            • Complete the verification process
            • Enjoy your new badge! 🎉
            `, 
            inline: false 
          },
          { 
            name: '⚡ Quick Links', 
            value: `
            🔗 [Developer Portal](https://discord.com/developers/applications)
            📚 [Documentation](https://discord.js.org/)
            💡 [Support Server](https://discord.gg/discord-developers)
            `, 
            inline: true 
          },
          { 
            name: '🎯 Badge Benefits', 
            value: `
            ✨ Exclusive profile badge
            🎖️ Developer recognition
            🚀 Community status
            `, 
            inline: true 
          }
        )
        .setColor('#00D4AA') // Discord's brand green color
        .setThumbnail('https://cdn.discordapp.com/attachments/1234567890/1234567890/badge-icon.png') // Optional: Add badge icon
        .setFooter({ 
          text: '🔥 Active Developer Badge System | Made with ❤️ by Manish',
          iconURL: 'https://cdn.discordapp.com/emojis/1234567890.png' // Optional: Add your icon
        })
        .setTimestamp();

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel('🏆 Claim Your Badge')
          .setStyle(ButtonStyle.Link)
          .setURL('https://discord.com/developers/active-developer')
      );

      await interaction.reply({ 
        embeds: [embed], 
        components: [row],
        ephemeral: false // kisi ko dikega nahi 
      });
    });

    client.login(TOKEN);

  } catch (err) {
    console.error(err);
  }
})();
