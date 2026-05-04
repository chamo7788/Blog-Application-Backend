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
    const { search, categoryId } = req.query;
    
    const where: any = {};
    
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { content: { contains: search as string, mode: 'insensitive' } },
      ];
    }
    
    if (categoryId) {
      where.categoryId = categoryId as string;
    }

    const posts = await prisma.post.findMany({
      where,
      include: { 
        author: { select: { name: true, email: true } }, 
        category: true 
      },
      orderBy: { createdAt: 'desc' }
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
export const deletePost = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const id = req.params.id as string;
    
    const post = await prisma.post.findUnique({ where: { id } });
    
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    if (post.authorId !== req.user.id) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    await prisma.post.delete({ where: { id } });

    res.json({ message: 'Post deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
