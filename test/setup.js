console.log('Setting up test env...')

const supertest = require('supertest');
const { expect } = require('chai');

global.supertest = supertest;
global.expect = expect;