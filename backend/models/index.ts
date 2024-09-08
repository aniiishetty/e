import { College } from './College';
import { Registration } from './Registration';

// Import and initialize Sequelize instance
import sequelize from '../config/database';

const models = { College, Registration };

// Set up associations
Object.values(models).forEach((model: any) => {
  if (typeof model.associate === 'function') {
    model.associate(models);
  }
});

export default sequelize;
export { College, Registration };
