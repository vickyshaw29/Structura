/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import OpenAI from "openai";
import { Hono } from "hono";
import { cors } from "hono/cors";

type Bindings = {
	OPEN_AI_KEY:string;
	AI:Ai;
}

const app = new Hono<{Bindings:Bindings}>();

app.use(
	'/*',
	cors({
	  origin: '*',  //Allow request from your nextjs app
	  allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests', 'Content-Type'],
	  allowMethods: ['POST', 'GET', 'OPTIONS', 'PUT'],
	  exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
	  maxAge: 600,
	  credentials: true,
	})
  )

  app.post('/translateDocument', async (c) => {
	try {
	  const { documentData, target_lang } = await c.req.json();
  
	  if (!documentData || !target_lang) {
		return c.json({ error: 'Missing required fields.' }, 400);
	  }
  
	  const summaryResponse = await c.env.AI.run('@cf/facebook/bart-large-cnn', {
		input_text: documentData,
		max_length: 1000,
	  });
  
	  const summary = summaryResponse.summary;
  
	  const translation = await c.env.AI.run('@cf/meta/m2m100-1.2b', {
		text: summary,
		source_lang: 'english',
		target_lang,
	  });
  
	  return new Response(JSON.stringify(translation), {
		headers: {
		  'Content-Type': 'application/json',
		},
	  });
	} catch (err) {
	  console.error("Translation Error:", err);
	  return c.json({ error: 'Internal Server Error' }, 500);
	}
  });
  

  app.post('/chatToDocument', async (c) => {
	try {
		const openai = new OpenAI({
			apiKey: c.env.OPEN_AI_KEY
		});

		const { documentData, question } = await c.req.json();

		if (!documentData || !question) {
			return c.json({ error: 'Missing documentData or question.' }, 400);
		}

		const chatCompletion = await openai.chat.completions.create({
			messages: [
				{
					role: 'system',
					content: `You are an assistant helping the user understand a document. The document content in markdown JSON format is provided below. Use it to answer the user's question as clearly as possible:\n\n${JSON.stringify(documentData)}`
				},
				{
					role: 'user',
					content: `My question is: ${question}`
				}
			],
			model: 'gpt-3.5-turbo',
			temperature: 0.5
		});

		const response = chatCompletion.choices[0]?.message?.content;

		return c.json({ message: response }, 200);
	} catch (error) {
		console.error('ChatToDocument Error:', error);
		return c.json({ error: 'Internal Server Error' }, 500);
	}
});

  

export default app;