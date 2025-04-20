// This file was scaffolded by Firebase Studio.
'use server';
/**
 * @fileOverview Generates an ER diagram from project requirements.
 *
 * - generateErDiagram - A function that handles the ER diagram generation process.
 * - GenerateErDiagramInput - The input type for the generateErDiagram function.
 * - GenerateErDiagramOutput - The return type for the generateErDiagram function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateErDiagramInputSchema = z.object({
  projectRequirements: z
    .string()
    .describe('The plain-text project requirements for the database.'),
});
export type GenerateErDiagramInput = z.infer<typeof GenerateErDiagramInputSchema>;

const GenerateErDiagramOutputSchema = z.object({
  erDiagram: z.string().describe('The generated ER diagram in a suitable format (e.g., Mermaid syntax).'),
});
export type GenerateErDiagramOutput = z.infer<typeof GenerateErDiagramOutputSchema>;

export async function generateErDiagram(input: GenerateErDiagramInput): Promise<GenerateErDiagramOutput> {
  return generateErDiagramFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateErDiagramPrompt',
  input: {
    schema: z.object({
      projectRequirements: z
        .string()
        .describe('The plain-text project requirements for the database.'),
    }),
  },
  output: {
    schema: z.object({
      erDiagram: z
        .string()
        .describe('The generated ER diagram in a suitable format (e.g., Mermaid syntax).'),
    }),
  },
  prompt: `You are a database architect expert. You will receive project requirements and generate an ER diagram based on them using Mermaid syntax.\n\nProject Requirements: {{{projectRequirements}}}\n\nER Diagram in Mermaid syntax:`,
});

const generateErDiagramFlow = ai.defineFlow<
  typeof GenerateErDiagramInputSchema,
  typeof GenerateErDiagramOutputSchema
>(
  {
    name: 'generateErDiagramFlow',
    inputSchema: GenerateErDiagramInputSchema,
    outputSchema: GenerateErDiagramOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
