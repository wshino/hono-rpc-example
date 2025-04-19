import { z } from 'zod';

export const schema = z.object({
  name: z.string().min(1),
});

export type Params = z.infer<typeof schema>;

export const handler = async (params: Params): Promise<string> => {
  return `Hello, ${params.name}!`;
}; 