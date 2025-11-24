'use strict';

/**
 * Test Migration: Add MFA fields to users table
 * 
 * This is a test migration to verify Sequelize is working correctly.
 * Adds three MFA-related fields to the users table:
 * - mfa_enabled: Boolean indicating if user has MFA enabled
 * - mfa_factor_id: String storing the Supabase MFA factor ID
 * - mfa_required: Boolean indicating if MFA is mandatory for this user
 */

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'mfa_enabled', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });

    await queryInterface.addColumn('users', 'mfa_factor_id', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('users', 'mfa_required', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'mfa_enabled');
    await queryInterface.removeColumn('users', 'mfa_factor_id');
    await queryInterface.removeColumn('users', 'mfa_required');
  }
};
