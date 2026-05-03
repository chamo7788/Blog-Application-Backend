import { Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

export const createPost = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const { title, content, categoryId, published } = req.body;
    const post = await prisma.post.create({
      data: {
        title,
        content,
        categoryId: categoryId || null,
        published: published || false,
        authorId: req.user.id,
      },
    });
    res.status(201).json(post);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getPosts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const posts = await prisma.post.findMany({
      include: { author: { select: { name: true, email: true } }, category: true },
    });
    res.json(posts);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getPostById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const post = await prisma.post.findUnique({
      where: { id },
      include: { author: { select: { name: true, email: true } }, category: true },
    });
    
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }
    res.json(post);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updatePost = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const id = req.params.id as string;
    const { title, content, categoryId, published } = req.body;
    
    const existingPost = await prisma.post.findUnique({ where: { id } });
    if (!existingPost) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    if (existingPost.authorId !== req.user.id) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        title,
        content,
        categoryId: categoryId !== undefined ? categoryId : existingPost.categoryId,
        published: published !== undefined ? published : existingPost.published,
      },
    });

    res.json(updatedPost);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
