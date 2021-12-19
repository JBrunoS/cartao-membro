const  express = require('express');
const multer = require('multer')
const multerConfig = require('./config/multer')

const routes = express.Router()

const userController = require('./controllers/usersController')

routes.get('/user', userController.index);
routes.get('/user/specific/:cpf', userController.selectSpecificUser);
routes.get('/user/:cpf', userController.getUserAll);
routes.get('/user/id/:id', userController.selectUserById);
routes.post('/user', userController.create);
routes.post('/user/:id', multer(multerConfig).single("file"), userController.createImage);
routes.delete('/user/:id/:key', userController.deleteUser);
routes.put('/user/:id/:key', userController.editUser);

module.exports = routes 