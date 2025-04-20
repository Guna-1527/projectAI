'use server';
/**
 * @fileOverview A SQL code generation AI agent.
 *
 * - generateSql - A function that handles the SQL generation process.
 * - GenerateSqlInput - The input type for the generateSql function.
 * - GenerateSqlOutput - The return type for the generateSql function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateSqlInputSchema = z.object({
  projectRequirements: z.string().describe('The plain-text project requirements.'),
});
export type GenerateSqlInput = z.infer<typeof GenerateSqlInputSchema>;

const GenerateSqlOutputSchema = z.object({
  sqlCode: z.string().describe('The generated SQL code.'),
});
export type GenerateSqlOutput = z.infer<typeof GenerateSqlOutputSchema>;

export async function generateSql(input: GenerateSqlInput): Promise<GenerateSqlOutput> {
  return generateSqlFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSqlPrompt',
  input: {
    schema: z.object({
      projectRequirements: z.string().describe('The plain-text project requirements.'),
    }),
  },
  output: {
    schema: z.object({
      sqlCode: z.string().describe('The generated SQL code.'),
    }),
  },
  prompt: `You are an expert SQL developer.  Given the following project requirements, generate SQL code to create a database schema.  Return only the SQL code.

Project Requirements: {{{projectRequirements}}}`, // Ensure it's projectRequirements
});

const generateSqlFlow = ai.defineFlow<
  typeof GenerateSqlInputSchema,
  typeof GenerateSqlOutputSchema
>(
  {
    name: 'generateSqlFlow',
    inputSchema: GenerateSqlInputSchema,
    outputSchema: GenerateSqlOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
