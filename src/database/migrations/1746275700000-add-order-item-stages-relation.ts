import { MigrationInterface, QueryRunner, Table, Index } from "typeorm";

export class AddOrderItemStagesRelation1746275700000 implements MigrationInterface {
    name = 'AddOrderItemStagesRelation1746275700000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create the junction table for order_item_stages
        await queryRunner.createTable(new Table({
            name: "order_item_stages",
            columns: [
                {
                    name: "order_item_id",
                    type: "uuid",
                    isPrimary: true,
                },
                {
                    name: "stage_id", 
                    type: "uuid",
                    isPrimary: true,
                }
            ],
            foreignKeys: [
                {
                    columnNames: ["order_item_id"],
                    referencedTableName: "order_items",
                    referencedColumnNames: ["id"],
                    onDelete: "CASCADE"
                },
                {
                    columnNames: ["stage_id"],
                    referencedTableName: "stage",
                    referencedColumnNames: ["id"],
                    onDelete: "CASCADE"
                }
            ],
            indices: [
                {
                    name: "IDX_ORDER_ITEM_STAGES_ORDER_ITEM_ID",
                    columnNames: ["order_item_id"]
                },
                {
                    name: "IDX_ORDER_ITEM_STAGES_STAGE_ID", 
                    columnNames: ["stage_id"]
                }
            ]
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("order_item_stages");
    }
}
