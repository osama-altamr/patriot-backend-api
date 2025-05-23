import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1750530121365 implements MigrationInterface {
    name = 'Migrations1750530121365'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "complaint" ADD "type" character varying`);
        await queryRunner.query(`ALTER TABLE "complaint" ADD "location" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "complaint" DROP COLUMN "location"`);
        await queryRunner.query(`ALTER TABLE "complaint" DROP COLUMN "type"`);
    }

}
