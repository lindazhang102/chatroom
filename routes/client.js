import { Router as route } from 'express';
const router = route();

router.get('/', (req, res) => {
    res.render('client/index');
});

export default router;
