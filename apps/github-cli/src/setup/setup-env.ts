import * as dotenv from 'dotenv';

const NODE_ENV = process.env['NODE_ENV'];

if (NODE_ENV === undefined || NODE_ENV === 'development') {
  dotenv.config({ path: '.env.local' });
}
