import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const genrateDescription = async (req,res) => {
  console.log("🔥 generateDescription controller was called");
  console.log("📦 Request body:", req.body);
  try{
    const { title , category , location , date , duration , price} = req.body;
    if(!title?.trim()){
        return res.status(400).json({
            message: "Event title required to generate description"
        });
    }
  
    const priceText = 
    price === 0 || price === "0" || !price
    ? "Free entry"
    : `${price} per ticket`;

    const messages = [
      {
        role: 'system',
        content: "You are an event description writer for an Indian event platform called Eventify. " +
          "You write short, engaging, and professional event descriptions in simple English. " +
          "Always write exactly one plain paragraph — no bullet points, no headings, no markdown. " +
          "Keep it between 60 to 80 words. End with a call to action like 'Book your tickets now!'",
      },
      {
        role: "user",
        content: `Write an event description for the following event:\n\n` +
          `Title: ${title}\n` +
          `Category: ${category || "General"}\n` +
          `Location: ${location || "To be announced"}\n` +
          `Date: ${date || "Coming soon"}\n` +
          `Duration: ${duration || "To be announced"}\n` +
          `Price: ${priceText}\n\n` +
          `Write only the description, nothing else.`,
      },
    ];

    console.log("🚀 Sending request to Groq...");

    const response = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: messages,
      temperature: 0.7,
      max_completion_tokens: 500,
      reasoning_effort: "low",
      include_reasoning: false,
    });

    console.log("✅ Groq responded successfully");
    console.log("📦 Full Groq response:", response);
  
  let description = response.choices[0]?.message?.content || "";
  console.log("🤖 Description:", description);

  description = description
  .trim()
  .replace(/\*\*/g, "")
  .replace(/\*/g, "")
  .replace(/#+\s/g, "")
  .replace(/\n+/g, "")
  .trim()

  if(!description || description.length < 20){
    return res.status(500).json({
      message: "could not generate description. please try again ",
    });
  }
    
  res.json({description})
  }catch(err){
    console.error("Groq AI error:", err.message);
 
    if (err.status === 401) {
      return res.status(401).json({
        message: "Invalid Groq API key. Check GROQ_API_KEY in .env",
      });
    }
    if (err.status === 429) {
      return res.status(429).json({
        message: "Too many requests. Please wait a moment and try again.",
      });
    }
 
    res.status(500).json({ message: "AI generation failed. Please try again." });
  }
};