import path from 'path';

const rootPath = path.join(__dirname, '../../javascripts/client');

const entry = {
    'client-index': path.join(rootPath, 'index'),
};

export default entry;
