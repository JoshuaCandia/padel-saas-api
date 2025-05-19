// src/admin/services/admin-validator.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateAdminDto } from '@/modules/admin/dto/create-admin.dto';
import * as validator from 'validator';

@Injectable()
export class AdminValidatorService {
  validateCreateAdmin(dto: CreateAdminDto) {
    const errors: string[] = [];

    // Email
    if (!dto.email || !validator.isEmail(dto.email)) {
      errors.push('Email inválido o ausente.');
    }

    if (!dto.password) {
      errors.push('La contraseña es requerida.');
    } else if (
      dto.password.length < 8 ||
      !/[A-Z]/.test(dto.password) ||
      !/[a-z]/.test(dto.password) ||
      !/[0-9]/.test(dto.password) ||
      !/[!@#$%^&*(),.?":{}|<>]/.test(dto.password)
    ) {
      errors.push(
        'La contraseña debe tener ≥8 caracteres, incluir mayúscula, minúscula, número y símbolo.',
      );
    }

    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/;
    if (!dto.name || !nameRegex.test(dto.name)) {
      errors.push(
        'Nombre inválido. Solo letras, espacios, guiones o apóstrofes.',
      );
    }
    if (!dto.surname || !nameRegex.test(dto.surname)) {
      errors.push(
        'Apellido inválido. Solo letras, espacios, guiones o apóstrofes.',
      );
    }

    if (
      !dto.phone ||
      !validator.isMobilePhone(dto.phone, 'any', { strictMode: false })
    ) {
      errors.push('Teléfono inválido.');
    }

    if (errors.length > 0) {
      throw new BadRequestException(errors.join(' '));
    }
  }
}
