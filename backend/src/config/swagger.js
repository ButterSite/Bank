
import fs from 'fs';
import yaml from 'js-yaml';


const swaggerDocument = yaml.load(
  fs.readFileSync(new URL('./swagger.yaml', import.meta.url), 'utf8')
);



export default swaggerDocument;