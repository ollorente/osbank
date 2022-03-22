// @ts-check
const router = require('express').Router()

const { Create, Get, List, Remove, Update } = require('../controllers')

router
  .route('/')
  .post(Create)
  .get(List)

router
  .route('/:id')
  .get(Get)
  .put(Update)
  .delete(Remove)

module.exports = router