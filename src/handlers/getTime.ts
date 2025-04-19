import { z } from 'zod';

export const schema = z.object({
  timezone: z.string().optional(),
});

export type Params = z.infer<typeof schema>;

export const handler = async (params: Params): Promise<{ time: string }> => {
  const now = new Date();
  
  if (params.timezone) {
    return {
      time: now.toLocaleString('en-US', { timeZone: params.timezone })
    };
  }

  return {
    time: now.toISOString()
  };
}; 