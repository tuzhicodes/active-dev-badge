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
            📚 [Our website](https://roxy-selfbot.vercel.app/)
            💡 [Support Server](https://discord.gg/hZf4j8GzzK)
            `, 
            inline: true 
          },
          { 
            name: '🎯 Badge Benefits', 
            value: `
            ✨ Exclusive profile badge
            🎖️ Community status
            🚀 flex maybe
            `, 
            inline: true 
          }
        )
        .setColor('#00D4AA')
        .setThumbnail('https://cdn.discordapp.com/attachments/1395245783808348331/1398868945682956288/anime_girl__136_by_djtheng_dk3v5i9-fullview.jpg?ex=6886edba&is=68859c3a&hm=d7309e9e1739903a1691531b2038a6b47411392d05716d5bd8cde80d7dd86ec2&') 
        .setFooter({ 
          text: '🔥 Active Developer Badge bot | Made with ❤️ by Manish',
          iconURL: 'https://cdn.discordapp.com/emojis/1384777634726285373.webp?size=160' 
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
        ephemeral: false 
      });
    });

    client.login(TOKEN);

  } catch (err) {
    console.error(err);
  }
})();
