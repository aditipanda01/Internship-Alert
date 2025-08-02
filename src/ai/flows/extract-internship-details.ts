'use server';
/**
 * @fileOverview This file defines a Genkit flow for extracting internship details from various platforms.
 *
 * It includes:
 * - `extractInternshipDetails`: A function to extract internship details.
 * - `ExtractInternshipDetailsInput`: The input type for the `extractInternshipDetails` function.
 * - `ExtractInternshipDetailsOutput`: The output type for the `extractInternshipDetails` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractInternshipDetailsInputSchema = z.object({
  platformSource: z
    .string()
    .describe('The platform where the internship posting was found (e.g., YouTube, LinkedIn, Telegram, Instagram).'),
  postContent: z
    .string()
    .describe('The content of the internship posting (e.g., video description, LinkedIn post text, Telegram message).'),
});
export type ExtractInternshipDetailsInput = z.infer<typeof ExtractInternshipDetailsInputSchema>;

const ExtractInternshipDetailsOutputSchema = z.object({
  title: z.string().describe('The title of the internship.'),
  company: z.string().describe('The name of the company offering the internship.'),
  deadline: z.string().describe('The application deadline for the internship.'),
  requirements: z.string().describe('The requirements for the internship.'),
});
export type ExtractInternshipDetailsOutput = z.infer<typeof ExtractInternshipDetailsOutputSchema>;

export async function extractInternshipDetails(
  input: ExtractInternshipDetailsInput
): Promise<ExtractInternshipDetailsOutput> {
  return extractInternshipDetailsFlow(input);
}

const extractInternshipDetailsPrompt = ai.definePrompt({
  name: 'extractInternshipDetailsPrompt',
  input: {schema: ExtractInternshipDetailsInputSchema},
  output: {schema: ExtractInternshipDetailsOutputSchema},
  prompt: `You are an AI assistant designed to extract internship details from online postings.

  Given the platform source and the content of the internship posting, extract the following information:

  - Title: The title of the internship.
  - Company: The name of the company offering the internship.
  - Deadline: The application deadline for the internship.
  - Requirements: The requirements for the internship.

  Platform Source: {{{platformSource}}}
  Post Content: {{{postContent}}}

  Please provide the extracted information in a structured format.
  `,
});

const extractInternshipDetailsFlow = ai.defineFlow(
  {
    name: 'extractInternshipDetailsFlow',
    inputSchema: ExtractInternshipDetailsInputSchema,
    outputSchema: ExtractInternshipDetailsOutputSchema,
  },
  async input => {
    const {output} = await extractInternshipDetailsPrompt(input);
    return output!;
  }
);
