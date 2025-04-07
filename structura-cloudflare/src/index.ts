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
  
  

export default app;