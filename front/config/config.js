const backUrl = process.env.NODE_ENV === 'production' ? 'http://api.jw910911.online' : 'http://localhost:3065';
const frontUrl = process.env.NODE_ENV === 'production' ? 'http://jw910911.online' : 'http://localhost:3060';

export { backUrl, frontUrl };
