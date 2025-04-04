//@ts-nocheck
const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const cors = require("cors");

const token = "7682276859:AAHom8nyI6I_8VMseaed9jUdbvdhOYlYRCg";
const bot = new TelegramBot(token);
const app = express();
app.use(express.json());
app.use(cors());
// const { MongoClient, ServerApiVersion } = require("mongodb");
// const uri =
//   "mongodb+srv://admin:admin@cluster0.o8mhp4z.mongodb.net/?appName=Cluster0";
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });
// async function run() {
//   try {
//     await client.connect();
//     await client.db("admin").command({ ping: 1 });
//     console.log(
//       "Pinged your deployment. You successfully connected to MongoDB!"
//     );
//   } finally {
//     await client.close();
//   }
// }
// run().catch(console.dir);

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text?.toLowerCase();

  if (text === "/start") {
    await bot.sendMessage(chatId, "Products", {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Products",
              web_app: {
                url: "https://startling-pithivier-f2c1ff.netlify.app/",
              },
            },
          ],
        ],
      },
    });
    await bot.sendMessage(chatId, "Enter data", {
      reply_markup: {
        keyboard: [
          [
            {
              text: "Enter Data",
              web_app: {
                url: "https://startling-pithivier-f2c1ff.netlify.app/form",
              },
            },
          ],
        ],
      },
    });
  }
  if (msg?.web_app_data?.data) {
    try {
      const data = JSON.parse(msg?.web_app_data?.data);
      await bot.sendMessage(chatId, "Recived your data: ");
      await bot.sendMessage(chatId, `Country: ${data.country}`);
      await bot.sendMessage(chatId, `Address: ${data.address}`);
      await bot.sendMessage(chatId, `Delivery: ${data.delivery}`);
    } catch (error) {
      console.log(error);
    }
  }
});

app.post("/web-data", async (req, res) => {
  const { queryId, products, totalPrice } = req.body;
  try {
    await bot.answerWebAppQuery(queryId, {
      type: "article",
      id: String(queryId),
      title: "Purchased",
      input_message_content: {
        message_text: `You purchased: ${products} for ${totalPrice}`,
      },
    });
    return res.status(200).json({});
  } catch (error) {
    await bot.answerWebAppQuery(queryId, {
      type: "article",
      id: queryId,
      title: "Error",
      input_message_content: {
        message_text: `Error`,
      },
    });
    return res.status(500).json({});
  }
});

const PORT = "https://test-of-tg-app-server.onrender.com";
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
