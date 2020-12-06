const app = require('../app');
const { expect } = require('chai');
const request = require('supertest');
const {
  createTables,
  dropTables,
  createUser,
  createListing
} = require('./testHelpers');
