import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response, NextFunction } from 'express';

export function validateDto(dtoClass: any, source: 'body' | 'params' | 'query' = 'body') {
    return async (req: Request, res: Response, next: NextFunction) => {
        const dtoObject = plainToInstance(dtoClass, req[source]);
        const errors = await validate(dtoObject, { whitelist: true, forbidNonWhitelisted: true });

        if (errors.length > 0) {
            res.status(400).json({
                message: 'Validation failed',
                errors: errors.map(err => ({
                    property: err.property,
                    constraints: err.constraints,
                })),
            });
            return;
        }

        req[source] = dtoObject;
        next();
    };
}
