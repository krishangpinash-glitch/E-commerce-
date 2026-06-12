import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Helper for lazy loading Gemini API safely
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// Compact string of products to give full catalog intuition to Gemini
const catalogContext = `
Available Products in SmartCommerce:
1. SmartCommerce Pro Phone (Electronics) - $999 (10% off). Flagship, AMOLED, 200MP bio-sensor camera, 12GB RAM, 256GB storage. (ID: ele-1)
2. SmartCommerce ANC Earbuds (Electronics) - $149 (15% off). 48dB active noise cancelling, titanium composite drivers. (ID: ele-2)
3. AeroStreets Premium Hoodie (Fashion) - $80 (20% off). GOTS organic cotton loopback, vegetable bark indigo. (ID: fas-1)
4. Metropolitan Tech Windbreaker (Fashion) - $130 (10% off). Recycled ocean bottles waterproof shell. (ID: fas-2)
5. Ecosystem Athletic Trainers (Footwear) - $120 (15% off). Breathable knit post-consumer yarn, bio-algae soles. (ID: foo-1)
6. Cork Solace Slides (Footwear) - $55. 100% natural cork bed, tree rubber sole. (ID: foo-2)
7. SmartCommerce Solar Smartwatch (Accessories) - $249 (10% off). Unlimited solar extension charging crystal, health metrics. (ID: acc-1)
8. Minimalist Utility Backpack (Accessories) - $85 (5% off). Padded sleeve for 16" laptops, waterproof ballistic materials. (ID: acc-2)
9. SmartBrew Eco Induction Oven (Home Appliances) - $299 (10% off). High frequency energy star cooktop, smart app control. (ID: app-1)
10. Barista Smart Espresso Machine (Home Appliances) - $599 (15% off). 19-Bar extraction pump, smart grinding. (ID: app-2)

Active Promo Coupons:
- SMART20: 20% discount on entire cart subtotal (special student presentation code).
- SAVEGREEN25: 25% discount for organic sustainable picks.
- WELCOME10: 10% discount on initial purchases.
`;

// AI Assistant Endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    
    if (!message) {
      res.status(400).json({ error: "Missing message parameter" });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Robust Mock AI response if API key is not configured yet
      const text = getMockAIResponse(message);
      res.json({ text, isMock: true });
      return;
    }

    // Call real Gemini
    const systemInstruction = `You are a helpful, professional, and friendly virtual shopping assistant named "Sora" built into our SmartCommerce Ecosystem.
    You help users search products, answer inventory details, look up coupons, recommend items, and guide orders.
    Use the following exact stock details for accurate answers. If the user asks about something not in list, try to guide them to similar listings:
    ${catalogContext}
    Keep responses concise, pleasant, and styled with rich markdown grids or bullet points. Recommend product IDs where helpful.`;

    // Process history into correct format for Chat API if provided
    let aiResponse;
    if (history && Array.isArray(history) && history.length > 0) {
      const formattedHistory = history.map((h: any) => `${h.role === "user" ? "Client" : "Assistant"}: ${h.text}`).join("\n");
      const fullPrompt = `${formattedHistory}\nClient: ${message}\nAssistant:`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: fullPrompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });
      aiResponse = response.text;
    } else {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: message,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });
      aiResponse = response.text;
    }

    res.json({ text: aiResponse, isMock: false });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.json({ 
      text: "I experienced a minor connection glitch, but don't worry! I can still verify that our premium **SmartCommerce Pro Phone** ($999, 10% off) and code **SMART20** (20% off) are fully operational. Feel free to ask about electronics or tracking!", 
      error: error.message || "Unknown error",
      isMock: true 
    });
  }
});

// Fallback rule-based recommendation generator
function getMockAIResponse(prompt: string): string {
  const norm = prompt.toLowerCase();
  
  if (norm.includes("coupon") || norm.includes("code") || norm.includes("discount") || norm.includes("offer") || norm.includes("promo")) {
    return "🎟️ **SmartCommerce Active Coupons**:\n\n- **SMART20**: Apply this code at checkout to save a spectacular **20% OFF** on your entire merchandise total!\n- **SAVEGREEN25**: Get **25% OFF** for sustainable products.\n- **WELCOME10**: Save **10% OFF** on your first checkout.\n\nYou can enter **SMART20** in your shopping cart coupon discount section!";
  }
  
  if (norm.includes("track") || norm.includes("order") || norm.includes("status") || norm.includes("ship")) {
    return "📦 **Order Tracking Advisor**:\n\nTo track your order, please:\n1. Place an order inside the **ECO-Store** mobile simulator app.\n2. Note your auto-generated Invoice ID (e.g. `INV-XXXXXX`).\n3. Select **Track Order** inside the customer profile, or check status on the **Admin Portal** order logs!\n\nYou can monitor real-time order progression (Placed ➡️ Packed ➡️ Shipped ➡️ Shipped out ➡️ Delivered) instantly.";
  }
  
  if (norm.includes("electronic") || norm.includes("gadget") || norm.includes("phone") || norm.includes("earbud") || norm.includes("watch") || norm.includes("headphone")) {
    return "📱 **SmartCommerce Electronics Portfolio**:\n\n1. **SmartCommerce Pro Phone** ($999 | 10% Off)\n   - *Specs*: 6.8\" AMOLED screen, 12GB RAM, 256GB storage, and 200MP bio-sensor camera.\n2. **SmartCommerce ANC Earbuds** ($149 | 15% Off)\n   - *Specs*: Ultra high-performance 48dB Active Noise Cancellation.\n3. **Solar Smartwatch** ($249 | 10% Off)\n   - *Specs*: Infinite standby charge using indoor and outdoor solar light cells.\n\nWould you like me to tell you more about any of these gadgets?";
  }
  
  if (norm.includes("recommend") || norm.includes("suggest") || norm.includes("best") || norm.includes("popular")) {
    return "🌟 **SmartCommerce Highly Recommended Picks**:\n\n- **Premium Tech**: *SmartCommerce Pro Phone* ($999 | 10% off) for stunning AMOLED screen and professional camera.\n- **Eco-Scent**: *AeroStreets Premium Hoodie* ($80 | 20% off) sewn from 100% GOTS certified organic Terry cotton loopback.\n- **Modern Comfort**: *Ecosystem Athletic Trainers* ($120 | 15% off) with flexible bio-algae responsive cushion soles.\n\nUse coupon code **SMART20** during checkout to save an extra 20%!";
  }
  
  if (norm.includes("fashion") || norm.includes("cloth") || norm.includes("hoodie") || norm.includes("wear")) {
    return "👕 **SmartCommerce Fashion Lineup**:\n\n- **AeroStreets Premium Hoodie** ($80 | 20% Off): heavy loopback organic cotton pullover dyed using charcoal bark dye.\n- **Metropolitan Tech Windbreaker** ($130 | 10% Off): fully waterproof active shell spun from recycled ocean bottles.\n\nBoth items support premium sustainable manufacturing. Ready to level up your style?";
  }

  if (norm.includes("footwear") || norm.includes("shoe") || norm.includes("sole") || norm.includes("slide") || norm.includes("trainer")) {
    return "👟 **SmartCommerce Premium Footwear**:\n\n- **Ecosystem Athletic Trainers** ($120 | 15% Off): high elasticity carbon-neutral algae foam running trainers.\n- **Cork Solace Slides** ($55 | New Arrival): self-shaping orthotic support on 100% natural cork bark.\n\nPerfect lightweight pairs for active use.";
  }

  if (norm.includes("appliance") || norm.includes("oven") || norm.includes("espresso") || norm.includes("kitchen")) {
    return "🍳 **SmartCommerce Kitchen & Appliances**:\n\n- **SmartBrew Eco Induction Oven** ($299 | 10% Off): reduces energy loss by 40% using precise induction lines.\n- **Barista Smart Espresso Machine** ($599 | 15% Off): built-in burr grinder with custom volumetric extraction settings.\n\nThese appliances use smart IoT bindings to keep energy and quality optimized.";
  }

  if (norm.includes("accessories") || norm.includes("backpack") || norm.includes("gear")) {
    return "🎒 **SmartCommerce Accessories**:\n\n- **SmartCommerce Solar Smartwatch** ($249): Aerospace Grade titanium shell with health metrics and GPS tracking.\n- **Minimalist Utility Backpack** ($85): Mil-spec ballistic fiber shell with protective slots for 16\" laptops.\n\nPerfect companions for metropolitan lifestyles.";
  }

  if (norm.includes("hello") || norm.includes("hi") || norm.includes("hey") || norm.includes("greetings") || norm.includes("who are you")) {
    return "👋 Welcome to **SmartCommerce**! I'm **Sora**, your personalized, AI-powered Smart Shopping Assistant.\n\nFeel free to ask me:\n- *'Do you have electronics?'* 📱\n- *'Are there active coupons?'* 🎟️\n- *'Track my order.'* 📦\n- *'Recommend products.'* 🌟\n\nI can assist you with specs, compare prices, or fetch active coupons instantly!";
  }

  return "🤖 I'm here to support your SmartCommerce experience! I have access to our catalog spanning **Electronics, Fashion, Footwear, Accessories, and Home Appliances**.\n\nFor example, ask me to *'Recommend products'*, *'Check active coupons'*, or search for *'electronics'*, and I will fetch instant, premium answers right away!";
}

async function startServer() {
  // Vite Dev routing or static production assets
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Starting server in development mode with active Vite middlewares.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving pre-compiled production file build out of /dist.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`E-commerce Phone OS Server is actively listening on Port ${PORT}`);
  });
}

startServer();
