import express from 'express';
import helmet from 'helmet';
import bodyParser from 'body-parser';

const app = express();

app.use(helmet({
  frameguard: {
    action: 'deny'
  },
  hidePoweredBy: {
    setTo: 'PHP 7.0.21'
  },
  xssFilter: {
    setOnOldIE: true
  },
  ieNoOpen: true,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"]
    }
  }
}));

app.set('views', __dirname + '/views')
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

import mainRoutes from './routes';
app.use('/api', mainRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}.`)
});
