import { database } from "@/db";
import { inquiryInput,statusInput } from "./inquiry-types";
export { inquiryInput,statusInput } from "./inquiry-types";
const cookieName="inquiry_demo_session";
export const columns="id, name, email, service, budget, message, status, created_at AS createdAt";
async function hash(value:string){const bytes=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(value));return Array.from(new Uint8Array(bytes),b=>b.toString(16).padStart(2,"0")).join("");}
export async function workspace(request:Request){
 const token=request.headers.get("cookie")?.split(";").map(x=>x.trim()).find(x=>x.startsWith(cookieName+"="))?.slice(cookieName.length+1);const db=database();
 if(token&&/^[a-f0-9]{64}$/.test(token)){const id=await hash(token);if(await db.prepare("SELECT id FROM workspaces WHERE id = ?").bind(id).first())return {id,cookie:null};}
 const fresh=Array.from(crypto.getRandomValues(new Uint8Array(32)),b=>b.toString(16).padStart(2,"0")).join("");const id=await hash(fresh);const now=new Date().toISOString();
 const samples=[
 {name:"Maya Bennett",email:"maya@example.com",service:"Website development",budget:2400,message:"A five-page website for a local studio. We'd like to launch next month.",status:"New"},
 {name:"Daniel Brooks",email:"daniel@example.com",service:"WordPress",budget:1200,message:"Refresh our WordPress homepage and improve the mobile layout.",status:"Contacted"},
 {name:"Sofia Reed",email:"sofia@example.com",service:"SEO & marketing",budget:850,message:"An SEO audit and improvements to our service pages.",status:"Won"},
 {name:"Liam Carter",email:"liam@example.com",service:"Website development",budget:3200,message:"A product catalog with a simple quote request form.",status:"New"}];
 await db.batch([db.prepare("INSERT INTO workspaces (id,created_at) VALUES (?,?)").bind(id,now),...samples.map((s,i)=>db.prepare("INSERT INTO inquiries (id,workspace_id,name,email,service,budget,message,status,created_at) VALUES (?,?,?,?,?,?,?,?,?)").bind(crypto.randomUUID(),id,s.name,s.email,s.service,s.budget,s.message,s.status,new Date(Date.now()-i*86400000).toISOString()))]);
 return {id,cookie:`${cookieName}=${fresh}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000${new URL(request.url).protocol==="https:"?"; Secure":""}`};
}
export function reply(data:unknown,status=200,cookie:string|null=null){const headers:Record<string,string>={"Cache-Control":"no-store"};if(cookie)headers["Set-Cookie"]=cookie;return Response.json(data,{status,headers});}
export function mutationGuard(request:Request){const origin=request.headers.get("origin");if((origin&&origin!==new URL(request.url).origin)||request.headers.get("sec-fetch-site")==="cross-site")return reply({error:"Cross-origin writes are not allowed."},403);return null;}
export async function readJson(request:Request){if(!request.headers.get("content-type")?.includes("application/json"))throw new TypeError("Use application/json.");const text=await request.text();if(text.length>5000)throw new TypeError("Request body is too large.");try{return JSON.parse(text);}catch{throw new TypeError("Invalid JSON body.");}}
export function failure(error:unknown){if(error instanceof TypeError)return reply({error:error.message},400);console.error("Inquiry API failed",error);return reply({error:"The inquiry service is unavailable. Please try again."},503);}
