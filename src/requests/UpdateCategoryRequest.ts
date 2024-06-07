import { Request } from 'express';

interface UpdateCategoryRequest extends Request {
    body: {
      name: string;
      description: string;
    },
}

export default UpdateCategoryRequest;
