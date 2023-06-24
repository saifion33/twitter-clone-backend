/* eslint-disable no-undef */
import jwt from 'jsonwebtoken'

const auth = (req, res, next) => {

    try {
        if (!req.headers.authorization) {
            return res.status(403).json({ status: 403, message: 'provide auth header', data: null });
        }
        const token = req.headers.authorization.split(' ')[2];
        if (!token) {
            return res.status(403).json({ status: 403, message: 'provide auth token', data: null });
        }
        const decodeData = jwt.verify(token, process.env.JWT_SECRET);
        if (!decodeData) {
            return res.status(401).json({ status: 401, message: 'invalid auth token', data: null });
        }
        req.userId = decodeData?.id
        next();
    } catch (error) {
        if (error.message === 'jwt expired') {
            return res.status(401).send('User token has expired.')
        }
        res.status(500).json({ message: 'Internal Server Error', data: null })
    }
}
export default auth