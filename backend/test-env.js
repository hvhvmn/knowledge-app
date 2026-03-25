import dotenv from 'dotenv'; dotenv.config(); console.log('PINECONE_KEY:', process.env.PINECONE_KEY ? 'present' : 'missing');
