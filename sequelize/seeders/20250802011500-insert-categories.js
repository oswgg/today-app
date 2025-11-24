'use strict';

/**
 * Seeder: Insert Categories
 * 
 * Migrated from Prisma seeder: 20250802011500.insert-categories.seed.ts
 * 
 * Inserts 10 predefined categories for event classification.
 */

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('categories', [
      {
        id: 1,
        name: 'Música y Conciertos',
        description: 'Tocadas, presentaciones acústicas, bandas locales y música en vivo en restaurantes, bares y plazas.',
        created_at: new Date(),
      },
      {
        id: 2,
        name: 'Comida y Bebida',
        description: 'Ofertas especiales del día, happy hours, degustaciones, menús exclusivos, noches temáticas, promociones en restaurantes y bares.',
        created_at: new Date(),
      },
      {
        id: 3,
        name: 'Deportes y Fitness',
        description: 'Partidos, clases abiertas, entrenamientos grupales, clubes de running, clases de ejercicio y eventos deportivos.',
        created_at: new Date(),
      },
      {
        id: 4,
        name: 'Arte y Cultura',
        description: 'Exposiciones de arte, inauguraciones de galerías, obras de teatro, shows de comedia y/o encuentros culturales.',
        created_at: new Date(),
      },
      {
        id: 5,
        name: 'Vida Nocturna y Fiestas',
        description: 'Promociones en antros, fiestas temáticas, eventos en bares y reuniones nocturnas.',
        created_at: new Date(),
      },
      {
        id: 6,
        name: 'Talleres y Clases',
        description: 'Sesiones para aprender nuevas habilidades, cursos educativos, talleres de manualidades y clases creativas.',
        created_at: new Date(),
      },
      {
        id: 7,
        name: 'Familia e Infantil',
        description: 'Actividades para toda la familia, espectáculos infantiles, festivales familiares y juegos interactivos.',
        created_at: new Date(),
      },
      {
        id: 8,
        name: 'Networking y Encuentros',
        description: 'Reuniones profesionales, eventos sociales, meetups temáticos y convenciones de diferentes temas.',
        created_at: new Date(),
      },
      {
        id: 9,
        name: 'Ferias, Mercados y Exposiciones',
        description: 'Mercados locales, ferias de productores, bazares, pop-ups de marcas o comida, ventas especiales de un solo día.',
        created_at: new Date(),
      },
      {
        id: 10,
        name: 'Otros/Sorpresa',
        description: 'Eventos inesperados, experiencias extraordinarias o cualquier actividad interesante que surge.',
        created_at: new Date(),
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('categories', null, {});
  }
};
