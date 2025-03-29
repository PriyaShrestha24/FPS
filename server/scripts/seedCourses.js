// scripts/seedCourses.js
import mongoose from 'mongoose';
import Course from '../models/Course.js';
import connecttoDatabase from '../db/db.js';

const seedCourses = async () => {
  await connecttoDatabase();

  const courses = [
    {
      name: 'BSc Computing',
      code: 'BSC-COMP',
      duration: 4,
      yearlyFees: {
        '1st Year': 120000,
        '2nd Year': 115000,
        '3rd Year': 110000,
        '4th Year': 105000,
      },
    },
    {
      name: 'BBA',
      code: 'BBA',
      duration: 4,
      yearlyFees: {
        '1st Year': 100000,
        '2nd Year': 95000,
        '3rd Year': 90000,
        '4th Year': 85000,
      },
    },
  ];

  await Course.insertMany(courses);
  console.log('Courses seeded');
  process.exit();
};

seedCourses();
