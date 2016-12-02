import path from 'path';

const rootPath = path.join(__dirname, '../../javascripts/client');

const entry = {
    'client-chatroom': path.join(rootPath, 'chatroom'),
};

export default entry;
