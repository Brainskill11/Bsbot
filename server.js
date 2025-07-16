require('dotenv').config();
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');

// --- 1. LÓGICA DO BOT (Polling) ---

// Obtenha o token do bot a partir das variáveis de ambiente.
const token = process.env.TELEGRAM_BOT_TOKEN;

// Verificação de segurança para garantir que o token foi carregado.
if (!token) {
    console.error("Erro: A variável de ambiente TELEGRAM_BOT_TOKEN não está definida. O bot não pode iniciar.");
    process.exit(1); // Encerra a aplicação se o token estiver em falta.
}

// Inicializa o bot para verificar constantemente por novas mensagens.
const bot = new TelegramBot(token, { polling: true });

// Define os comandos que aparecerão no menu do Telegram.
bot.setMyCommands([
    { command: 'start', description: '🚀 Iniciar o bot e ver o menu principal' },
    { command: 'ajuda', description: '📞 Obter ajuda e links de suporte' },
    { command: 'regras', description: '📜 Ver como jogar e políticas' },
    { command: 'webapp', description: '🎮 Abrir a plataforma BrainSkill' }
]);

const welcomeMessage = `
Olá! 👋 Bem-vindo ao Bot de Suporte do **BrainSkill**.

Use os botões abaixo para navegar rapidamente ou use o **Menu de Comandos** para aceder às funções.

Estou aqui para ajudar!
`;

const webAppUrl = 'https://brainskill.site';

// Teclado principal com todos os botões.
const mainKeyboard = {
    inline_keyboard: [
        [
            { text: '🎮 Abrir a Plataforma BrainSkill', web_app: { url: webAppUrl } }
        ],
        [
            { text: '📞 Ajuda & Suporte', url: 'https://brainskill.site/support' }
        ],
        [
            { text: '♟️ Como Jogar', url: 'https://brainskill.site/how-to-play' }
        ],
        [
            { text: '📜 Termos e Condições', url: 'https://brainskill.site/terms' },
            { text: '🔒 Privacidade', url: 'https://brainskill.site/privacy' }
        ],
        [
            { text: '❤️ Jogo Responsável', url: 'https://brainskill.site/responsible-gaming' }
        ]
    ]
};

// Listener para o comando /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, welcomeMessage, {
        parse_mode: 'Markdown',
        reply_markup: mainKeyboard
    });
});

// Listener para o comando /ajuda
bot.onText(/\/ajuda/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Precisa de ajuda? Clique no botão abaixo para ir para a nossa página de suporte.', {
        reply_markup: {
            inline_keyboard: [
                [{ text: '📞 Ajuda & Suporte', url: 'https://brainskill.site/support' }]
            ]
        }
    });
});

// Listener para o comando /regras
bot.onText(/\/regras/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Consulte as nossas regras e políticas nos links abaixo:', {
        reply_markup: {
            inline_keyboard: [
                [{ text: '♟️ Como Jogar', url: 'https://brainskill.site/how-to-play' }],
                [
                    { text: '📜 Termos e Condições', url: 'https://brainskill.site/terms' },
                    { text: '🔒 Privacidade', url: 'https://brainskill.site/privacy' }
                ]
            ]
        }
    });
});

// Listener para o comando /webapp
bot.onText(/\/webapp/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Clique no botão abaixo para abrir a plataforma BrainSkill diretamente no Telegram!', {
        reply_markup: {
            inline_keyboard: [
                [{ text: '🎮 Abrir a Plataforma BrainSkill', web_app: { url: webAppUrl } }]
            ]
        }
    });
});

console.log('🤖 Bot do BrainSkill iniciado com sucesso em modo Polling...');
bot.on('polling_error', (error) => {
    console.error(`[Erro de Polling do Bot]: ${error.message}`);
});


// --- 2. LÓGICA DO SERVIDOR WEB (Ping) ---
const app = express();

// O Render fornece a porta correta na variável de ambiente PORT.
// Usamos 3001 como um padrão para testes locais.
const PORT = process.env.PORT || 3001; 

// Este endpoint responde aos pings dos serviços de monitorização (ex: cron-job.org).
app.get('/', (req, res) => {
  res.status(200).send('Bot está ativo e a funcionar.');
});

// Inicia o servidor web, o que satisfaz o requisito do Render de ter uma porta aberta.
app.listen(PORT, () => {
  console.log(`Servidor de Ping para manter o bot ativo a ouvir na porta ${PORT}`);
});