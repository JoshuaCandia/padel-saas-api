"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
async function main() {
    const prisma = new client_1.PrismaClient();
    const email = 'joshuacandia99@gmail.com';
    const passwordPlain = '94140462321456';
    const phone = '1141739482';
    const name = 'Joshua';
    const surname = 'Candia';
    const adminExists = await prisma.user.findUnique({ where: { email } });
    if (adminExists) {
        console.log('Admin user already exists.');
        await prisma.$disconnect();
        return;
    }
    const hashedPassword = await bcrypt.hash(passwordPlain, 10);
    await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            phone,
            name,
            surname,
            role: 'ADMIN',
        },
    });
    console.log('Admin user created successfully!');
    await prisma.$disconnect();
}
main().catch(async (e) => {
    console.error(e);
    process.exit(1);
});
//# sourceMappingURL=create-admin.js.map