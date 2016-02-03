var dbName = 'dbskyapp';

module.exports = {
  'port': process.env.PORT || 8080,
  'dbName': dbName,
  'database': 'localhost:27017/' + dbName,
  'secret': 'thereisnospoon'
};