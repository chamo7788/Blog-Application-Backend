import { Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

export const getComments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const postId = req.params.postId as string;
    const comments = await prisma.comment.findMany({
      where: { postId },
      include: { author: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(comments);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createComment = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const postId = req.params.postId as string;
    const { content } = req.body;

    if (typeof content !== 'string' || !content.trim()) {
      res.status(400).json({ error: 'Comment content is required' });
      return;
    }

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }
    
    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        postId,
        authorId: req.user.id,
      },
      include: { author: { select: { id: true, name: true, email: true } } },
    });
    res.status(201).json(comment);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
