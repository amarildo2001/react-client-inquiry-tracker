import { z } from "zod";
export const services=["Website development","WordPress","SEO & marketing","Other"] as const;
export const statuses=["New","Contacted","Won"] as const;
export const inquiryInput=z.object({name:z.string().trim().min(2).max(80),email:z.string().trim().email().max(160),service:z.enum(services),budget:z.number().int().min(0).max(1000000),message:z.string().trim().max(1000).default("")}).strict();
export const statusInput=z.object({status:z.enum(statuses)}).strict();
export type Inquiry=z.infer<typeof inquiryInput>&{id:string;status:typeof statuses[number];createdAt:string};
