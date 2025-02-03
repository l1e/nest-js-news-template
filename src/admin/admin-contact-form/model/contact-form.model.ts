import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table
export class ContactForm extends Model<ContactForm> {
    @Column({
        type: DataType.STRING(191),
        allowNull: false,
        // unique: true,
    })
    firstName: string;

    @Column({
        type: DataType.STRING(191),
        allowNull: true,
    })
    lastName: string;

    @Column({
        type: DataType.STRING(191),
        allowNull: false,
    })
    email: string;

    @Column({
        type: DataType.STRING(191),
        allowNull: true,
    })
    subject: string;

    @Column({
        type: DataType.STRING(1000),
        allowNull: true,
    })
    message: string;

}
