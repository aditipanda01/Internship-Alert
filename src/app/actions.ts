'use server';

import { z } from 'zod';
import { extractInternshipDetails } from '@/ai/flows/extract-internship-details';
import type { Internship } from '@/lib/types';

const addInternshipSchema = z.object({
  platform: z.enum(['YouTube', 'LinkedIn', 'Telegram', 'Instagram']),
  postContent: z.string().min(20, 'Post content must be at least 20 characters to extract details.'),
});

export async function addInternshipAction(
  prevState: any,
  formData: FormData
): Promise<{ message: string; internship?: Internship; error?: string }> {
  const validatedFields = addInternshipSchema.safeParse({
    platform: formData.get('platform'),
    postContent: formData.get('postContent'),
  });

  if (!validatedFields.success) {
    const error = validatedFields.error.flatten().fieldErrors;
    return {
      message: 'Validation failed.',
      error: error.platform?.[0] || error.postContent?.[0],
    };
  }
  
  const { platform, postContent } = validatedFields.data;

  try {
    const extractedDetails = await extractInternshipDetails({
      platformSource: platform,
      postContent: postContent,
    });

    const newInternship: Internship = {
      id: crypto.randomUUID(),
      ...extractedDetails,
      platform,
      postContent,
      isSaved: false,
      createdAt: new Date(),
    };

    return { message: 'Internship added successfully.', internship: newInternship };
  } catch (e) {
    console.error(e);
    return { message: 'Failed to extract internship details.', error: 'AI processing failed. Please check the post content or try again later.' };
  }
}
