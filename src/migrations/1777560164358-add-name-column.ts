import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNameColumn1777560164358 implements MigrationInterface {
    name = 'AddNameColumn1777560164358'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "name" character varying(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "name"`);
    }

}
