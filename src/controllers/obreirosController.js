const connection = require('../database/connection')

module.exports = {
    async index(request, response) {

        const cargos = await connection('functions')
            .distinct('funcao')
            .orderBy('funcao', 'asc')

        return response.json(cargos)
    },

    async getUsers(request, response) {
        const { cargo } = request.params;

        const users = await connection('functions')
            .innerJoin('users', 'functions.user_id', 'users.id')
            .innerJoin('informations', 'users.id', 'informations.user_id')
            .innerJoin('adresses', 'users.id', 'adresses.user_id')
            .innerJoin('churches', 'users.id', 'churches.user_id')
            .innerJoin('images', 'users.id', 'images.user_id')
            .innerJoin('nascimento', 'users.id', 'nascimento.user_id')
            .innerJoin('batismo', 'users.id', 'batismo.user_id')
            .where({
                'functions.funcao': cargo,
                'users.status': true
            })
            .select(
                'users.*',
                'images.key',
                'images.size',
                'images.created_at',
                'images.url',
                'adresses.*',
                'churches.*',
                'informations.*',
                'functions.*',
                'nascimento.*',
                'batismo.*',
            )
            .orderBy('users.nome', 'churches.congregacao', 'asc')

            return response.json(users)
    }
}