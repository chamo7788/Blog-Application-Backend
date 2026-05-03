import { Router } from 'express';
import { createPost, getPosts, getPostById, updatePost } from '../controllers/posts.controller';
import { getComments, createComment } from '../controllers/comments.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getPosts);
router.post('/', authenticateToken, createPost);
router.get('/:id', getPostById);
router.put('/:id', authenticateToken, updatePost);

router.get('/:postId/comments', getComments);
router.post('/:postId/comments', authenticateToken, createComment);

export default router;
