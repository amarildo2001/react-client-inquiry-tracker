import { database } from "@/db";
import { failure,reply } from "@/lib/inquiry-api";
export async function GET(){try{await database().prepare("SELECT 1 AS ok").first();return reply({status:"ok",database:"connected",application:"Client Inquiry Tracker"});}catch(error){return failure(error);}}
