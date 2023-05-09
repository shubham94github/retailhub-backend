'use strict';
module.exports = (sequelize, DataTypes) => {
    const Verification = sequelize.define("Verification", {
        email_type: {
            type: DataTypes.STRING
        },
        subject: {
            type: DataTypes.STRING
        },
        user_id: {
            type: DataTypes.INTEGER
        },
        account_verification_code: {
            type: DataTypes.STRING,
            allowNull: false
        },
        link_expiry_time: {
            type: DataTypes.DATE,
        },
        verification_link: {
            type: DataTypes.STRING,
            allowNull: false
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    })
    return Verification;
}