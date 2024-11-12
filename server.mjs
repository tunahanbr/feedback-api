import PocketBase from 'pocketbase';
import Fastify from 'fastify';
import { formatUTCDate } from './utils.js';
import dotenv from 'dotenv'
import fastifyRateLimit from 'fastify-rate-limit';
import fastifyCors from 'fastify-cors'; // Import the CORS plugin



dotenv.config()

const fastify = Fastify({ logger: true });

const pb = new PocketBase(process.env.PB_HOST);

// API Endpoints
fastify.post('/send-feedback', {
    schema: {
        body: {
            type: 'object',
            required: ['project','feedback','rating'],
            properties: {
                project: {type: 'string', minLength: 3},
                feedback: {type: 'string', minLength: 10},
                timestamp: {
                    type: 'string',
                    format: 'date-time'
                  },
                rating: { 
                    type: 'number', 
                    minimum: 1, 
                    maximum: 5 
                  }
            }
        }
    }

},async (request, response) => {
    const {project, feedback, rating}  = request.body;
    const authData = await pb.admins.authWithPassword(process.env.PB_EMAIL, process.env.PB_PASSWORD);

    //Here i can process the data from the post, for now, only a console log
    let receivedFeedback = {
      project: project,
      feedback: feedback,
      rating: rating,
      timestamp: formatUTCDate()
    }
    
    const record = await pb.collection('feedback').create(receivedFeedback);
    response.send({message: 'Data received at ' + record.timestamp});

    pb.authStore.clear();
})

fastify.get('/get-feedbacks',async (request, response) => {
  const authData = await pb.admins.authWithPassword(process.env.PB_EMAIL, process.env.PB_PASSWORD);

  const records = await pb.collection('feedback').getFullList();

  response.send(records)

  pb.authStore.clear();
})

fastify.get('/get-feedbacks/:project', async (request, response) => {
  const authData = await pb.admins.authWithPassword(process.env.PB_EMAIL, process.env.PB_PASSWORD);

    const records = await pb.collection('feedback').getFullList({
      filter: `project="${request.params.project}"` 
  });

  response.send(records)

  pb.authStore.clear();
})

fastify.delete('/delete-feedback/:id',async (request, response) => {
  const authData = await pb.admins.authWithPassword(process.env.PB_EMAIL, process.env.PB_PASSWORD);
  await pb.collection('feedback').delete(request.params.id);
  response.send(request.params.id + " deleted successfully!");
  pb.authStore.clear();
})

// Start the server
fastify.listen({ port: 3002 }, (err, address) => {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
    fastify.log.info(`Server listening at ${address}`);
  });

// ratelimiting for fastify server
fastify.register(fastifyRateLimit, {
  max: 100,
  timeWindow: '1 minute'
});

// Register the CORS plugin
fastify.register(fastifyCors, {
  // Optional configuration, see below for common options
  origin: "*", // Allow all origins, or specify your own (e.g., "http://localhost:3001")
  methods: ["GET", "POST", "PUT", "DELETE"], // Allow these HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Specify allowed headers
  credentials: true, // Allow cookies or authorization headers with credentials
});