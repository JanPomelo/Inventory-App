import { Request } from 'express';

interface UpdateItemRequest extends Request {
  body: {
    id: string;
  },
}

export default UpdateItemRequest;
