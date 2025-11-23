import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { getRandomInterviewCover } from "@/lib/utils";
import { db } from "@/firebaseConfig/admin";

export async function GET() {
  return Response.json({ success: true, data: "THANK YOU!" }, { status: 200 });
}

export async function POST(request: Request) {

  const body = await request.json();
  let { type, role, level, techstack, amount, userid, interviewStyle } = body;

  // If userid is not provided, get current logged in user
  if (!userid) {
    try {
      const { getCurrentUser } = await import("@/lib/services/auth.action");
      const user = await getCurrentUser();
      userid = user?.id;
      console.log('🔑 Used logged-in user id:', userid);
    } catch (err) {
      console.error('Could not get current user:', err);
    }
  }

  // If interviewStyle is not provided, pick a random one
  if (!interviewStyle) {
    const styles = ["FAST", "DETAILED", "FRIENDLY"];
    interviewStyle = styles[Math.floor(Math.random() * styles.length)];
    console.log('🎲 Picked random interviewStyle:', interviewStyle);
  }

  console.log('📥 RECEIVED REQUEST:', {
    type,
    role,
    level,
    techstack,
    amount,
    userid,
    interviewStyle,
  });

  try {
    const { text: questionsRaw } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `
You are an AI interview generator with agent-like behavior.

### USER SETTINGS
Interview style: **${interviewStyle}**
Role: **${role}**
Level: **${level}**
Tech Stack: **${techstack}**
Question count: **${amount}**

### RULES FOR QUESTION GENERATION
1. Tailor questions to the user's role, level, and tech stack.
2. Modify your tone based on interviewStyle:
   - FAST → concise, direct questions. No extra chatter.
   - DETAILED → deeper multi-layered questions & follow-up hints.
   - FRIENDLY → conversational, supportive tone.
3. Do NOT add any explanation text.
4. Return ONLY a clean JSON list, like this:
[
  "Question 1...",
  "Question 2...",
  "Question 3..."
]

Now generate exactly **${amount}** interview questions.
      `,
    });

    // ---------- CLEAN THE MODEL OUTPUT ----------
    // 1) remove ```json and ``` if present
    let cleaned = questionsRaw.replace(/```json/gi, "").replace(/```/g, "").trim();

    // 2) keep only the JSON array part (from first '[' to last ']')
    const start = cleaned.indexOf("[");
    const end = cleaned.lastIndexOf("]") + 1;

    if (start === -1 || end === 0) {
      throw new Error("Model did not return a JSON array of questions.");
    }

    cleaned = cleaned.slice(start, end);

    // 3) finally parse
    const questions = JSON.parse(cleaned) as string[];

    const interview = {
      role,
      type,
      level,
      techstack: techstack.split(",").map((stack: string) => stack.trim()),
      questions,
      ...(interviewStyle && { interviewStyle }), // Only include if defined
      ...(userid && { userID: userid }), // Only include if defined
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };

    console.log('✅ INTERVIEW DATA TO SAVE:', JSON.stringify(interview, null, 2));

    await db.collection("interviews").add(interview);

    console.log('💾 Interview saved successfully!');

    return Response.json({ success: true, status: 200 });
  } catch (error) {
    // Type-safe logging
    if (error instanceof Error) {
      console.error("🔥 INTERVIEW GENERATE ERROR:", error.message, error.stack);
      return Response.json(
        { success: false, error: error.message },
        { status: 500 },
      );
    }

    console.error("🔥 UNKNOWN ERROR:", error);
    return Response.json(
      { success: false, error: "Unknown server error" },
      { status: 500 },
    );
  }
}
