import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.BAD_REQUEST;
    let message = 'Error en la base de datos';

    switch (exception.code) {
      case 'P2002':
        message = 'Ya existe un registro con ese valor único.';
        status = HttpStatus.CONFLICT;
        break;
      case 'P2025':
        message = 'El recurso solicitado no existe.';
        status = HttpStatus.NOT_FOUND;
        break;
      case 'P2021':
        message = 'El modelo o la tabla no existen en la base de datos.';
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        break;
      case 'P2003':
        message =
          'Referencia inválida: el valor no coincide con ningún registro existente.';
        status = HttpStatus.BAD_REQUEST;
        break;
      default:
        message = exception.message;
    }

    response.status(status).json({
      statusCode: status,
      message,
      code: exception.code,
    });
  }
}
