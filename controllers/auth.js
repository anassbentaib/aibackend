import bcrypt from 'bcrypt';
import authModel from '../mongodb/models/auth.js';
import jwt from 'jsonwebtoken';


export const signup = async (req, res) => {

  const { username, email, password } = req.body;

  try {
    const user = await authModel.findOne({ email });

    if (user) return res.status(200).send({ message: 'Your account already exists' });

    const hashedPassword = await bcrypt.hash(password, 16);

    const result = await authModel.create({ username, email, password: hashedPassword });

    // 
    const token = jwt.sign({ email: result.email, id: result._id }, process.env.SECKRET_KEY, { expiresIn: '1h' });

    res.status(201).send({ token , result});

  } catch (error) {

    console.log(error);
    
    res.status(500).send({ message: 'signup error server side' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const findUser = await authModel.findOne({ email });

    if (!findUser) return res.status(400).json({ message: 'User not found' });


    const isPassword = await bcrypt.compare(password, findUser.password);

    if (!isPassword)  return res.status(400).json({ message: 'Invalid password' });

    const token = jwt.sign({ email: findUser.email, id: findUser._id }, process.env.SECKRET_KEY, { expiresIn: '1h' });

    res.status(200).json({ result: findUser, token });

  } catch (error) {

    console.log(error);

    res.status(500).json({ message: 'Server error' });
    
  }
};





export const googleLogin = async(res , req) => {
  const { name, email, token } = res.body;
  try {
    
    const existingUser = await authModel.findOne({ email });

    if (existingUser) {
      existingUser.username = name;
      await existingUser.save();

      return req.status(200).json({ message: 'User updated successfully' });

    }
    const newUser = new authModel({
      username: name,
      token,
      email,
    });

    await newUser.save();
    req.status(201).send({ token , email , name});


  } catch (error) {
    console.error('Error with Google login:', error);
  }
};


