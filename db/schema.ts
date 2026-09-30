import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
export const workspaces = sqliteTable("workspaces", {id:text("id").primaryKey(),createdAt:text("created_at").notNull()});
export const inquiries = sqliteTable("inquiries", {
 id:text("id").primaryKey(),workspaceId:text("workspace_id").notNull().references(()=>workspaces.id),
 name:text("name").notNull(),email:text("email").notNull(),service:text("service").notNull(),budget:integer("budget").notNull(),message:text("message").notNull(),
 status:text("status",{enum:["New","Contacted","Won"]}).notNull(),createdAt:text("created_at").notNull()
},table=>[index("idx_inquiries_workspace_created").on(table.workspaceId,table.createdAt)]);
