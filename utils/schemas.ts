import { z } from 'zod';

export const PostSchema = z.object({
  userId: z.number().int().positive(),
  id:     z.number().int().positive(),
  title:  z.string().min(1),
  body:   z.string().min(1),
});

export const CommentSchema = z.object({
  postId: z.number().int().positive(),
  id:     z.number().int().positive(),
  name:   z.string().min(1),
  email:  z.string().email(),
  body:   z.string().min(1),
});

export const UserSchema = z.object({
  id:       z.number().int().positive(),
  name:     z.string().min(1),
  username: z.string().min(1),
  email:    z.string().email(),
  address:  z.object({
    street:  z.string(),
    suite:   z.string(),
    city:    z.string(),
    zipcode: z.string(),
    geo:     z.object({ lat: z.string(), lng: z.string() }),
  }),
  phone:   z.string(),
  website: z.string(),
  company: z.object({ name: z.string(), catchPhrase: z.string(), bs: z.string() }),
});

export const TodoSchema = z.object({
  userId:    z.number().int().positive(),
  id:        z.number().int().positive(),
  title:     z.string().min(1),
  completed: z.boolean(),
});

export type Post    = z.infer<typeof PostSchema>;
export type Comment = z.infer<typeof CommentSchema>;
export type User    = z.infer<typeof UserSchema>;
export type Todo    = z.infer<typeof TodoSchema>;
