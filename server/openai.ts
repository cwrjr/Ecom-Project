import OpenAI from "openai";

// Using gpt-4o as the primary model for chat completions
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Generate embeddings for product text
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error("Error generating embedding:", error);
    throw new Error("Failed to generate embedding");
  }
}

// Compute cosine similarity between two vectors
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

// Generate SEO meta tags using GPT
export async function generateSEOMeta(productName: string, productDescription: string): Promise<{
  metaTitle: string;
  metaDescription: string;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an SEO expert. Generate compelling meta title and description for e-commerce products. The meta title should be under 60 characters, and the meta description should be under 155 characters. Respond with JSON in this format: { 'metaTitle': string, 'metaDescription': string }",
        },
        {
          role: "user",
          content: `Generate SEO meta tags for this product:\nName: ${productName}\nDescription: ${productDescription}`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return {
      metaTitle: result.metaTitle || productName,
      metaDescription: result.metaDescription || productDescription.substring(0, 155),
    };
  } catch (error) {
    console.error("Error generating SEO meta:", error);
    return {
      metaTitle: productName,
      metaDescription: productDescription.substring(0, 155),
    };
  }
}

// AI chat for customer support
export async function chatWithAI(
  messages: Array<{ role: 'user' | 'assistant' | 'system', content: string }>,
  knowledgeBase: string
): Promise<string> {
  try {
    const systemPrompt = `You are a helpful customer support assistant for Trellis, an e-commerce store. 
Use the following knowledge base to answer customer questions:

${knowledgeBase}

Be friendly, professional, and helpful. If you don't know something, suggest contacting support directly.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
      max_tokens: 500,
    });

    return response.choices[0].message.content || "I'm sorry, I couldn't process that request.";
  } catch (error) {
    console.error("Error in AI chat:", error);
    throw new Error("Failed to process chat request");
  }
}

// AI product comparison
export async function compareProducts(products: Array<{
  name: string;
  description: string;
  price: number;
  category: string;
}>): Promise<string> {
  try {
    const productsText = products.map((p, i) => 
      `Product ${i + 1}: ${p.name}\nPrice: $${p.price}\nCategory: ${p.category}\nDescription: ${p.description}`
    ).join("\n\n");

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a product comparison expert. Compare products and summarize their key differences, pros/cons, and best use cases. Format your response in a clear, readable way.",
        },
        {
          role: "user",
          content: `Compare these products and help me understand which one might be best for different use cases:\n\n${productsText}`,
        },
      ],
      max_tokens: 800,
    });

    return response.choices[0].message.content || "Unable to compare products at this time.";
  } catch (error) {
    console.error("Error comparing products:", error);
    throw new Error("Failed to compare products");
  }
}

// Semantic search - filter products by natural language query
export async function semanticSearch(
  query: string,
  productEmbeddings: Array<{ productId: number; embedding: number[] }>,
  threshold: number = 0.5
): Promise<Array<{ productId: number; similarity: number }>> {
  try {
    const queryEmbedding = await generateEmbedding(query);
    
    const results = productEmbeddings.map(pe => ({
      productId: pe.productId,
      similarity: cosineSimilarity(queryEmbedding, pe.embedding),
    }));

    return results
      .filter(r => r.similarity >= threshold)
      .sort((a, b) => b.similarity - a.similarity);
  } catch (error) {
    console.error("Error in semantic search:", error);
    throw new Error("Failed to perform semantic search");
  }
}
