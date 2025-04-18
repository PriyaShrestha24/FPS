// scripts/seedCourses.js
import mongoose from 'mongoose';
import Course from '../models/Course.js';
import University from '../models/University.js';
import connecttoDatabase from '../db/db.js';

const seedData = async () => {
  try {
    await connecttoDatabase();
    console.log("Connected to database");

    // Seed Universities
    const universities = [
      { name: 'Tribhuvan University', code: 'TU', location: 'Kathmandu, Nepal' },
      { name: 'Kathmandu University', code: 'KU', location: 'Dhulikhel, Nepal' },
    ];

    await University.deleteMany({}); // Clear existing universities (optional)
    const insertedUniversities = await University.insertMany(universities);
    console.log("Inserted Universities:", insertedUniversities);

    const tuId = insertedUniversities[0]._id;
    const kuId = insertedUniversities[1]._id;

    // Seed Courses
    const courses = [
      {
        name: 'BSc Computing',
        code: 'BSC-COMP',
        duration: 4,
        yearlyFees: { '1st Year': 120, '2nd Year': 115, '3rd Year': 110, '4th Year': 105},
        university: tuId,
      },
      {
        name: 'BBA',
        code: 'BBA',
        duration: 4,
        yearlyFees: { '1st Year': 100, '2nd Year': 950, '3rd Year': 90, '4th Year': 850},
        university: kuId,
      },
    ];

    await Course.deleteMany({}); // Clear existing courses (optional)
    const insertedCourses = await Course.insertMany(courses);
    console.log("Inserted Courses:", insertedCourses);

    console.log('Universities and Courses seeded successfully');
  } catch (error) {
    console.error('Seeding Error:', error);
  } finally {
    mongoose.connection.close(); // Close connection after seeding
    process.exit();
  }
};

seedData();