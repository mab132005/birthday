import { NextResponse } from "next/server";
import { birthdayConfig } from "@/config/birthday";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, answers, message, herName } = body;

    const botToken =
      process.env.TELEGRAM_BOT_TOKEN || birthdayConfig.telegramBotToken;
    const chatId =
      process.env.TELEGRAM_CHAT_ID || birthdayConfig.telegramChatId;

    let textToSend = "";

    if (type === "heart-answers") {
      textToSend = `💌 **إجابات جديدة من ${herName || birthdayConfig.herName}:**\n\n`;
      if (Array.isArray(answers)) {
        answers.forEach((item: { question: string; answer: string }, idx: number) => {
          textToSend += `*${idx + 1}. ${item.question}*\n👈 ${item.answer || "بدون إجابة"}\n\n`;
        });
      }
    } else if (type === "final-reply") {
      textToSend = `❤️ **رسالة ورد جديد من ${herName || birthdayConfig.herName}:**\n\n"${message}"`;
    } else {
      textToSend = `📌 **تحديث إجابات من ${herName || birthdayConfig.herName}:**\n${JSON.stringify(body, null, 2)}`;
    }

    if (botToken && chatId) {
      const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
      await fetch(telegramUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: textToSend,
          parse_mode: "Markdown",
        }),
      });
    }

    return NextResponse.json({ success: true, message: "Answers received" });
  } catch (error) {
    console.error("Error sending answers API route:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send answers" },
      { status: 500 }
    );
  }
}
