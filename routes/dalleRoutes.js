
import express from 'express';
import {Leap} from '@leap-ai/sdk'
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();


const leap = new Leap(process.env.TRY_LEAP_API_KEY)

router.route('/').get((req, res) => {
  res.status(200).json({ message: 'Hello from DALL-E!' });
});

router.route('/').post(async (req, res) => {
 
	const { prompt } = req.body;
	try {

		leap.usePublicModel("sd-1.5");

		const response = await leap.generate.generateImage({
			prompt: prompt,
			n: 1,
			size: '1024x1024',

		});
		console.log("response" , response);
		const image = response.data.images[0].uri;

		console.log('image' , image);
		res.status(200).json({
			success: true,
			photo: image
		});

	} catch (error) {
		console.log(error)
		res.status(400).json({
			success: false,
			error: 'The image could not be generated'
		});
	}
});



export default router;

