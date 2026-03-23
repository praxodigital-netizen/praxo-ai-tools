import { Hono } from "hono";
import type { Client } from "@sdk/server-types";
import { tables } from "./__generated__";
import { eq } from "drizzle-orm";
import OpenAI from "openai";
import Razorpay from 'razorpay';


export async function createApp(
  edgespark: Client<typeof tables>
): Promise<Hono> {
  const app = new Hono();

  // Helper to check and update usage
  async function checkUsage(browserId: string) {
    if (!browserId) {
      return { allowed: false, error: "Browser ID required" };
    }

    let usage = await edgespark.db
      .select()
      .from(tables.usageTracking)
      .where(eq(tables.usageTracking.browserId, browserId))
      .get();

    const today = new Date().toISOString().split("T")[0];

    if (!usage) {
      // First time user
      await edgespark.db
        .insert(tables.usageTracking)
        .values({
          browserId,
          generationsCount: 1,
          lastGenerationDate: today,
          isPro: 0,
        })
        .run();
      return { allowed: true, isPro: false };
    }

    if (usage.isPro === 1) {
      return { allowed: true, isPro: true }; // Pro users have unlimited
    }

    if (usage.lastGenerationDate !== today) {
      // Reset count for new day
      await edgespark.db
        .update(tables.usageTracking)
        .set({
          generationsCount: 1,
          lastGenerationDate: today,
        })
        .where(eq(tables.usageTracking.browserId, browserId))
        .run();
      return { allowed: true, isPro: false };
    }

    const currentCount = usage.generationsCount || 0;

    if (currentCount >= 10) {
      return { allowed: false, error: "You've reached your daily limit. Upgrade to Pro to continue." };
    }

    // Increment count
    await edgespark.db
      .update(tables.usageTracking)
      .set({
        generationsCount: currentCount + 1,
      })
      .where(eq(tables.usageTracking.browserId, browserId))
      .run();

    return { allowed: true, isPro: false };
  }

  // Get usage status
  app.get("/api/public/usage/:browserId", async (c) => {
    const browserId = c.req.param("browserId");
    const usage = await edgespark.db
      .select()
      .from(tables.usageTracking)
      .where(eq(tables.usageTracking.browserId, browserId))
      .get();

    const today = new Date().toISOString().split("T")[0];
    
    if (!usage) {
      return c.json({ count: 0, limit: 10, isPro: false });
    }

    if (usage.lastGenerationDate !== today) {
      return c.json({ count: 0, limit: 10, isPro: usage.isPro === 1 });
    }

    return c.json({ 
      count: usage.generationsCount || 0, 
      limit: 10, 
      isPro: usage.isPro === 1 
    });
  });

  // Generate Viral Hooks
  app.post("/api/public/generate/hooks", async (c) => {
    const { topic, tone, language, browserId } = await c.req.json();
    
    const usageCheck = await checkUsage(browserId);
    if (!usageCheck.allowed) {
      return c.json({ error: usageCheck.error }, 403);
    }

    const apiKey = edgespark.secret.get("OPENAI_API_KEY");
    if (!apiKey) return c.json({ error: "OpenAI not configured" }, 500);

    const openai = new OpenAI({ apiKey });
    const numOutputs = usageCheck.isPro ? 5 : 3;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are an expert social media copywriter. Generate ${numOutputs} highly engaging, viral hooks for the given topic. The tone should be ${tone}. The output MUST be in ${language} language. Return ONLY a JSON array of strings, nothing else.`
          },
          {
            role: "user",
            content: `Topic: ${topic}`
          }
        ],
        response_format: { type: "json_object" }
      });

      const content = response.choices[0].message.content;
      const hooks = JSON.parse(content || '{"hooks": []}');
      
      // Handle different possible JSON structures from the model
      const result = Array.isArray(hooks) ? hooks : (hooks.hooks || Object.values(hooks)[0] || []);

      return c.json({ result: result.slice(0, numOutputs) });
    } catch (error: any) {
      return c.json({ error: error.message }, 500);
    }
  });

  // Generate Captions
  app.post("/api/public/generate/captions", async (c) => {
    const { topic, mood, language, browserId } = await c.req.json();
    
    const usageCheck = await checkUsage(browserId);
    if (!usageCheck.allowed) {
      return c.json({ error: usageCheck.error }, 403);
    }

    const apiKey = edgespark.secret.get("OPENAI_API_KEY");
    if (!apiKey) return c.json({ error: "OpenAI not configured" }, 500);

    const openai = new OpenAI({ apiKey });
    const numOutputs = usageCheck.isPro ? 5 : 3;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are an expert social media manager. Generate ${numOutputs} engaging captions with relevant hashtags for the given topic. The tone should be ${mood}. The output MUST be in ${language} language. Return ONLY a JSON array of strings, nothing else.`
          },
          {
            role: "user",
            content: `Topic: ${topic}`
          }
        ],
        response_format: { type: "json_object" }
      });

      const content = response.choices[0].message.content;
      const captions = JSON.parse(content || '{"captions": []}');
      
      const result = Array.isArray(captions) ? captions : (captions.captions || Object.values(captions)[0] || []);

      return c.json({ result: result.slice(0, numOutputs) });
    } catch (error: any) {
      return c.json({ error: error.message }, 500);
    }
  });

  // Generate AI Prompts
  app.post("/api/public/generate/prompts", async (c) => {
    const { topic, type, language, browserId } = await c.req.json();
    
    const usageCheck = await checkUsage(browserId);
    if (!usageCheck.allowed) {
      return c.json({ error: usageCheck.error }, 403);
    }

    const apiKey = edgespark.secret.get("OPENAI_API_KEY");
    if (!apiKey) return c.json({ error: "OpenAI not configured" }, 500);

    const openai = new OpenAI({ apiKey });

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are an expert prompt engineer. Generate 1 highly detailed, structured, and effective AI prompt for the given topic. The tone should be ${type}. The output MUST be in ${language} language. Return ONLY a JSON object with a 'prompt' string field.`
          },
          {
            role: "user",
            content: `Topic: ${topic}`
          }
        ],
        response_format: { type: "json_object" }
      });

      const content = response.choices[0].message.content;
      const parsed = JSON.parse(content || '{"prompt": ""}');

      return c.json({ result: parsed.prompt || Object.values(parsed)[0] || "" });
    } catch (error: any) {
      return c.json({ error: error.message }, 500);
    }
  });


  
