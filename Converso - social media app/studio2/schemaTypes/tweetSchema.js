export const tweetSchema = {
    name: 'tweets',
    type: 'document',
    title: 'Tweets',
    fields: [
      {
        name: 'tweet',
        type: 'string',
        title: 'Tweet',
      },
      {
        name: 'timestamp',
        type: 'datetime',
        title: 'Timestamp',
      },
      {
        name: 'fileUrl',
        type: 'string',
        title: 'File Url',
      },
      {
        name: 'author',
        title: 'Author',
        type: 'reference',
        to: [{ type: 'users' }],
      },
    ],
  }