import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1745834959557 implements MigrationInterface {
    name = 'Migrations1745834959557'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "fcmToken" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "photoUrl" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "phoneNumber" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "phoneNumber" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "photoUrl" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "fcmToken" DROP NOT NULL`);
    }

}
