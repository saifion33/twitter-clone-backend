import User from '../models/user.js'

// ** 1. ************************************ GET USER BY EMAIL ************************************

export const getUserById = async (req, res) => {
    const userId = req.params.userId;
    try {
        const user = await User.findOne({ id: userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found', data: null })
        }
        res.status(200).json({ message: 'User Found', data: user })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: 'Internal server Error', data: null })
    }
}

// ** 2. ************************************* UPDATE USER ********************************

export const updateUser = async (req, res) => {
    const email = req.params.email
    const { updates } = req.body;
    try {
        if (updates.userName) {
            const user = await User.findOne({ userName: updates.userName })
            if (user) {
                return res.status(409).json({ message: 'User Name already exists', data: null });
            }
        }
        const user = await User.findOne({ email });
        if (user.id === req.userId) {
            Object.assign(user, updates)
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

