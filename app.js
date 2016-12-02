import express from 'express';

import { configure } from './_bay/helpers';

import clientRouters from './routes/client';

const app = express();
const env = app.get('env');
const config = require(`./configs/server/config.${env}.js`);

configure(app, config);

app.use('/chatroom', clientRouters);
app.use('^/$', (req, res) => res.redirect('/chatroom'));

app.listen(config.PORT);
