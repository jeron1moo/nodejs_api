export const swGetApiInfo = {
  summary: 'show info aobut api',
  tags: ['api'],
  parameters: [
    {
      name: 'api',
      in: 'header',
      schema: {
        type: 'string',
      },
      required: true,
    },
  ],
  requestBody: {
    content: {
      'application/json': {
        schema: {},
      },
    },
  },
  responses: {
    '200': {
      description: 'Done',
    },
    default: {
      description: 'Error message',
    },
  },
};
