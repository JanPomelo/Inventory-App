import { Request } from 'express';

interface UpdateItemRequest extends Request {
  body: {
    img_id: string;
    id: string;
  },
}

export default UpdateItemRequest;
