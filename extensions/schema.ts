// Expand the schema of how responses should look.
import { z } from "zod";

export const JobPostingsSchema = z.object({titles: z.array(z.string().describe('Job title"'))});
export type JobPostings = z.infer<typeof JobPostingsSchema>;