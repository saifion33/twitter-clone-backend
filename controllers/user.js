import User from '../models/user.js'

// ** 1. ************************************ GET USER BY EMAIL ************************************

export const getUserByEmail = async (req, res) => {
    const email = req.params.email;
    const id = req.userId
    try {
        const user = await User.findOne({ email });
        if (id != user.id) {
            return res.status(401).json({ message: 'Unauthorized', data: null })
        }
        if (!user) {
            return res.status(404).json({ message: 'User not found', data: null })
        }
        res.status(200).json({ message: 'User Found', data: user })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal server Error', data: null })
    }
}

// ** 2. ************************************* UPDATE USER ********************************

export const updateUser = async (req, res) => {
    const email = req.params.email
    const { update } = req.body;
    try {
        if (update.userName) {
            const user = await User.findOne({ userName: update.userName })
            if (user) {
                return res.status(409).json({ message: 'User Name already exists', data: null });
            }
        }
        const user = await User.findOne({ email });
        if (user.id === req.userId) {
            Object.assign(user, update)
            await user.save()
            if (user) {
                return res.status(200).json({ message: 'User updated successfully', data: user })
            }
        }
        else {
            res.status(401).json({ message: `User don't have permission.`, data: null })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal Server Error', data: null })
    }
}

