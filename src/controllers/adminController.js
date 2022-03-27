const connection = require('../database/connection');

module.exports = {
    async index(request, response){
        const {email, senha} = request.body;

        const admin = await connection('admin')
            .where({
                "email" : email,
                "senha" : senha
            })
            .select('id')

        return response.json(admin);
        
    }
}