import express  from 'express';
import bodyParser from 'body-parser';
import { engine } from 'express-handlebars';

import indexRoute from './routes/index.js';
import pollRoute from './routes/poll.js';

import debug from "./modules/debug.js";

const app = express();

app.use(express.static('public'));

app.use(bodyParser.urlencoded({
  extended: true,
  limit: '500mb',
  parameterLimit: 1000000
}));

app.use(bodyParser.json());

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use('/', indexRoute);
app.use('/poll', pollRoute);

export default app;
