const { Command } = require('discord.js-commando');
const rules = require('../../rules');
const diceAPI = require('../../diceAPI');
const winston = require('winston');

module.exports = class UserListCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'user-list',
			group: 'dev',
			memberName: 'user-list',
			description: `List all users of <@${rules.houseID}>`,
			details: 'Only the bot owner(s) may use this command.',
			aliases: ['list-users'],
			examples: ['user-list'],
			throttling: {
				usages: 2,
				duration: 30,
			},
			ownerOnly: true,
		});
	}

	async run(msg) {
		const database = await diceAPI.allUsers();
		const botClient = this.client;
		const userList = [];

		async function userTagFromID(arrayPlace) {
			const targetID = database[arrayPlace].id;
			winston.debug(`[${this.memberName}] Checking user tag from array index ${arrayPlace}`);
			if (botClient.users.get(targetID)) {
				return botClient.users.get(targetID).tag;
			} else {
				return botClient.users.fetch(targetID).tag;
			}
		}

		for (let index = 0; index < 50; index++) {
			userList.push(`${await userTagFromID(index)} (\`${database[index].id}\`)`);
		}

		winston.debug(`[${this.memberName}] First item in userList: ${userList[0]}`);
		msg.say(userList.join('\n'));

		return msg.reply(`👤 ${await diceAPI.totalUsers()} users in total. Only 50 users were listed.`);
	}
};
