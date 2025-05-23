import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1750713007358 implements MigrationInterface {
    name = 'Migrations1750713007358'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_item_actions" DROP CONSTRAINT "FK_dcb5635754fc8c0fda7f5c43210"`);
        await queryRunner.query(`ALTER TABLE "order_item_actions" DROP CONSTRAINT "FK_9c52decbd93f2fd746d26e80d86"`);
        await queryRunner.query(`ALTER TABLE "order_item_actions" DROP COLUMN "orderItemId"`);
        await queryRunner.query(`ALTER TABLE "order_item_actions" DROP COLUMN "employeeId"`);
        await queryRunner.query(`ALTER TABLE "order_item_actions" ADD "order_item_id" uuid`);
        await queryRunner.query(`ALTER TABLE "order_item_actions" ADD "employee_id" uuid`);
        await queryRunner.query(`ALTER TABLE "order_item_actions" ADD "stage_id" uuid`);
        await queryRunner.query(`ALTER TABLE "order_item_actions" ADD CONSTRAINT "UQ_b72ace886fe5cbe5d74f4b676bd" UNIQUE ("stage_id")`);
        await queryRunner.query(`ALTER TABLE "order_item_actions" ADD CONSTRAINT "FK_109852d22e93ef388f1b26f1aa3" FOREIGN KEY ("order_item_id") REFERENCES "order_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_item_actions" ADD CONSTRAINT "FK_f11ecdf6ef2b3be4e17ed8edf34" FOREIGN KEY ("employee_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_item_actions" ADD CONSTRAINT "FK_b72ace886fe5cbe5d74f4b676bd" FOREIGN KEY ("stage_id") REFERENCES "stage"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_item_actions" DROP CONSTRAINT "FK_b72ace886fe5cbe5d74f4b676bd"`);
        await queryRunner.query(`ALTER TABLE "order_item_actions" DROP CONSTRAINT "FK_f11ecdf6ef2b3be4e17ed8edf34"`);
        await queryRunner.query(`ALTER TABLE "order_item_actions" DROP CONSTRAINT "FK_109852d22e93ef388f1b26f1aa3"`);
        await queryRunner.query(`ALTER TABLE "order_item_actions" DROP CONSTRAINT "UQ_b72ace886fe5cbe5d74f4b676bd"`);
        await queryRunner.query(`ALTER TABLE "order_item_actions" DROP COLUMN "stage_id"`);
        await queryRunner.query(`ALTER TABLE "order_item_actions" DROP COLUMN "employee_id"`);
        await queryRunner.query(`ALTER TABLE "order_item_actions" DROP COLUMN "order_item_id"`);
        await queryRunner.query(`ALTER TABLE "order_item_actions" ADD "employeeId" uuid`);
        await queryRunner.query(`ALTER TABLE "order_item_actions" ADD "orderItemId" uuid`);
        await queryRunner.query(`ALTER TABLE "order_item_actions" ADD CONSTRAINT "FK_9c52decbd93f2fd746d26e80d86" FOREIGN KEY ("employeeId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_item_actions" ADD CONSTRAINT "FK_dcb5635754fc8c0fda7f5c43210" FOREIGN KEY ("orderItemId") REFERENCES "order_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
