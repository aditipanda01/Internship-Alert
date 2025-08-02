'use server';

/**
 * @fileOverview Summarizes internship information from various platforms.
 *
 * - summarizeInternshipInfo - A function that summarizes internship details.
 * - SummarizeInternshipInfoInput - The input type for the summarizeInternshipInfo function.
 * - SummarizeInternshipInfoOutput - The return type for the summarizeInternshipInfo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeInternshipInfoInputSchema = z.object({
  content: z.string().describe('The internship information content from various platforms (YouTube, LinkedIn, Telegram, Instagram).'),
});
export type SummarizeInternshipInfoInput = z.infer<typeof SummarizeInternshipInfoInputSchema>;

const SummarizeInternshipInfoOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the internship details.'),
});
export type SummarizeInternshipInfoOutput = z.infer<typeof SummarizeInternshipInfoOutputSchema>;

export async function summarizeInternshipInfo(input: SummarizeInternshipInfoInput): Promise<SummarizeInternshipInfoOutput> {
  return summarizeInternshipInfoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeInternshipInfoPrompt',
  input: {schema: SummarizeInternshipInfoInputSchema},
  output: {schema: SummarizeInternshipInfoOutputSchema},
  prompt: `You are an expert at summarizing internship details.

  Please provide a concise summary of the following internship information, extracting key details such as title, company, platform source, and deadline.

  Content: {{{content}}} `,
});

const summarizeInternshipInfoFlow = ai.defineFlow(
  {
    name: 'summarizeInternshipInfoFlow',
    inputSchema: SummarizeInternshipInfoInputSchema,
    outputSchema: SummarizeInternshipInfoOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
